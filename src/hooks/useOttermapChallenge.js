import { useState, useEffect, useRef, useCallback } from "react";
import { canStartTask, isValidPhone } from "../utils/validation";
import {
  createOttermapSubmissionId,
  emptyDeliverables,
  deliverablesFromArray,
  deliverablesToArray,
  fetchOttermapChallengeState,
  saveOttermapProgress,
  startOttermapChallenge,
  submitOttermapChallenge,
  TIMELINE_MS,
} from "../utils/saveOttermapChallenge";

const STORAGE = {
  submissionId: "ottermap_submission_id",
  name: "ottermap_name",
  email: "ottermap_email",
  phone: "ottermap_phone",
  start: "ottermap_start",
  step: "ottermap_step",
  deliverables: "ottermap_deliverables",
  notes: "ottermap_notes",
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatRemaining(ms) {
  if (ms <= 0) return { h: "00", m: "00", s: "00", expired: true };
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return { h: pad(h), m: pad(m), s: pad(s), expired: false };
}

function persistLocal({
  submissionId,
  name,
  email,
  phone,
  startTime,
  step,
  deliverables,
  notes,
}) {
  if (submissionId) localStorage.setItem(STORAGE.submissionId, submissionId);
  if (name) localStorage.setItem(STORAGE.name, name);
  if (email) localStorage.setItem(STORAGE.email, email);
  if (phone) localStorage.setItem(STORAGE.phone, phone);
  if (startTime) localStorage.setItem(STORAGE.start, String(startTime));
  if (step) localStorage.setItem(STORAGE.step, step);
  localStorage.setItem(STORAGE.deliverables, JSON.stringify(deliverables));
  localStorage.setItem(STORAGE.notes, notes ?? "");
}

function clearLocal() {
  Object.values(STORAGE).forEach((key) => localStorage.removeItem(key));
}

export function useOttermapChallenge() {
  const [step, setStep] = useState("register");
  const [applicant, setApplicant] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [submissionId, setSubmissionId] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [deliverables, setDeliverables] = useState(emptyDeliverables);
  const [submitNote, setSubmitNote] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [toast, setToast] = useState(null);
  const [scanY, setScanY] = useState(0);

  const tickRef = useRef(null);
  const saveDebounceRef = useRef(null);
  const expiredHandledRef = useRef(false);
  const redirectTimeoutRef = useRef(null);

  const showToast = useCallback((message, type = "error") => {
    setToast({ message, type });
  }, []);

  const resetToRegister = useCallback(
    (message) => {
      clearLocal();
      setSubmissionId("");
      setStartTime(null);
      setRemaining(null);
      setApplicant({ name: "", email: "", phone: "" });
      setDeliverables(emptyDeliverables());
      setSubmitNote("");
      setStep("register");
      expiredHandledRef.current = false;

      if (message) {
        showToast(message);
        if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = setTimeout(() => setToast(null), 4000);
      }
    },
    [showToast]
  );

  const handleExpired = useCallback(
    (message = "Your 72-hour window has ended. Please contact support if you need assistance.") => {
      if (expiredHandledRef.current) return;
      expiredHandledRef.current = true;
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      resetToRegister(message);
    },
    [resetToRegister]
  );

  const syncProgress = useCallback(
    async (nextStep, nextDeliverables, nextNotes, subId = submissionId) => {
      if (!subId || nextStep === "register" || nextStep === "done") return;
      await saveOttermapProgress({
        submissionId: subId,
        step: nextStep,
        deliverables: nextDeliverables,
        notes: nextNotes,
      });
    },
    [submissionId]
  );

  const debouncedSync = useCallback(
    (nextStep, nextDeliverables, nextNotes, subId = submissionId) => {
      if (!subId) return;
      if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
      saveDebounceRef.current = setTimeout(() => {
        syncProgress(nextStep, nextDeliverables, nextNotes, subId).catch(() => {});
      }, 600);
    },
    [submissionId, syncProgress]
  );

  const applySession = useCallback(
    (state) => {
      const deliverableState = state.deliverables ?? emptyDeliverables();
      const activeStep =
        state.status === "submitted"
          ? "done"
          : state.step === "register" && state.status === "in_progress"
            ? "challenge"
            : state.step;

      setSubmissionId(state.submissionId);
      setApplicant({ name: state.name, email: state.email, phone: state.phone });
      setStartTime(state.startedAt);
      setDeliverables(deliverableState);
      setSubmitNote(state.notes ?? "");
      setStep(activeStep);

      persistLocal({
        submissionId: state.submissionId,
        name: state.name,
        email: state.email,
        phone: state.phone,
        startTime: state.startedAt,
        step: activeStep,
        deliverables: deliverableState,
        notes: state.notes ?? "",
      });
    },
    []
  );

  useEffect(() => {
    const id = setInterval(() => setScanY((y) => (y + 0.4) % 100), 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const savedId = localStorage.getItem(STORAGE.submissionId);
      if (!savedId) {
        setIsRestoring(false);
        return;
      }

      try {
        const state = await fetchOttermapChallengeState(savedId);
        if (cancelled) return;

        if (state.status === "submitted") {
          applySession(state);
          setIsRestoring(false);
          return;
        }

        if (state.isExpired || state.status === "expired" || !state.canSubmit) {
          handleExpired("Your 72-hour window has ended. You cannot continue or submit this challenge.");
          setIsRestoring(false);
          return;
        }

        applySession(state);
      } catch {
        if (!cancelled) {
          resetToRegister("Your saved session could not be restored. Please register again.");
        }
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, [applySession, handleExpired, resetToRegister]);

  useEffect(() => {
    if (!startTime || step === "register" || step === "done") return;

    const tick = () => {
      const ms = startTime + TIMELINE_MS - Date.now();
      const next = formatRemaining(ms);
      setRemaining(next);
      if (next.expired) handleExpired();
    };

    tick();
    tickRef.current = setInterval(tick, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [startTime, step, handleExpired]);

  useEffect(
    () => () => {
      if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    },
    []
  );

  function validateRegister() {
    const e = {};
    if (!applicant.name.trim()) e.name = "Name is required";
    if (!applicant.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.email.trim())) {
      e.email = "Enter a valid email";
    }
    if (!applicant.phone.trim()) e.phone = "Phone number is required";
    else if (!isValidPhone(applicant.phone)) e.phone = "Enter a valid phone number (10–15 digits)";
    return e;
  }

  async function handleRegister() {
    const e = validateRegister();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    if (isStarting || !canStartTask({ name: applicant.name, email: applicant.email, phone: applicant.phone })) return;
    setIsStarting(true);
    setErrors({});

    const name = applicant.name.trim();
    const email = applicant.email.trim();
    const phone = applicant.phone.trim();
    const subId = createOttermapSubmissionId();

    try {
      const started = await startOttermapChallenge({ submissionId: subId, name, email, phone });
      const startedAt = new Date(started.started_at).getTime();

      setSubmissionId(subId);
      setStartTime(startedAt);
      setStep("challenge");

      persistLocal({
        submissionId: subId,
        name,
        email,
        phone,
        startTime: startedAt,
        step: "challenge",
        deliverables,
        notes: submitNote,
      });
    } catch (err) {
      showToast(err.message || "Registration failed. Please contact support.");
    } finally {
      setIsStarting(false);
    }
  }

  function goToStep(nextStep) {
    if (remaining?.expired) {
      handleExpired();
      return;
    }

    setStep(nextStep);
    persistLocal({
      submissionId,
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      startTime,
      step: nextStep,
      deliverables,
      notes: submitNote,
    });
    debouncedSync(nextStep, deliverables, submitNote);
  }

  function updateDeliverable(index, value) {
    const nextArray = deliverablesToArray(deliverables);
    nextArray[index] = value;
    const nextDeliverables = deliverablesFromArray(nextArray);
    setDeliverables(nextDeliverables);
    debouncedSync(step, nextDeliverables, submitNote);
    persistLocal({
      submissionId,
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      startTime,
      step,
      deliverables: nextDeliverables,
      notes: submitNote,
    });
  }

  function updateSubmitNote(value) {
    setSubmitNote(value);
    debouncedSync(step, deliverables, value);
    persistLocal({
      submissionId,
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      startTime,
      step,
      deliverables,
      notes: value,
    });
  }

  async function handleSubmit() {
    if (isSubmitting || remaining?.expired) {
      handleExpired();
      return;
    }

    const missing = deliverablesToArray(deliverables).some((value) => !value.trim());
    if (missing) {
      setErrors({ submit: "All deliverable links are required." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const state = await fetchOttermapChallengeState(submissionId);
      if (!state.canSubmit || state.isExpired) {
        handleExpired("Your 72-hour window has ended. Submission is no longer allowed.");
        return;
      }

      const elapsedMs = Date.now() - state.startedAt;
      const hours = Math.floor(elapsedMs / (3600 * 1000));
      const minutes = Math.floor((elapsedMs % (3600 * 1000)) / (60 * 1000));

      await submitOttermapChallenge({
        submissionId,
        deliverables,
        notes: submitNote,
        submittedAt: new Date().toISOString(),
        timeUsed: `${hours}h ${minutes}m`,
      });

      setStep("done");
      persistLocal({
        submissionId,
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone,
        startTime: state.startedAt,
        step: "done",
        deliverables,
        notes: submitNote,
      });
    } catch (err) {
      if ((err.message || "").includes("72-hour") || (err.message || "").includes("ended")) {
        handleExpired(err.message);
      } else {
        showToast(err.message || "Submission failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const time = remaining || { h: "72", m: "00", s: "00", expired: false };
  const elapsed = startTime ? Math.min(1, (Date.now() - startTime) / TIMELINE_MS) : 0;
  const urgentTime = remaining && parseInt(remaining.h, 10) < 6 && !remaining.expired;
  const deliverableValues = deliverablesToArray(deliverables);

  return {
    step,
    applicant,
    setApplicant,
    errors,
    submissionId,
    startTime,
    remaining,
    time,
    elapsed,
    urgentTime,
    deliverables: deliverableValues,
    submitNote,
    isStarting,
    isSubmitting,
    isRestoring,
    toast,
    scanY,
    handleRegister,
    handleSubmit,
    goToStep,
    updateDeliverable,
    updateSubmitNote,
    setToast,
  };
}
