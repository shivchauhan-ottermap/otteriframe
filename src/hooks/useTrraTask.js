import { useState, useEffect, useRef, useCallback } from "react";
import { canStartTask } from "../utils/validation";
import {
  createTrraSubmissionId,
  emptyTrraAnswers,
  fetchTrraSubmissionState,
  saveTrraAnswers,
  startTrraSubmission,
  submitTrraSubmission,
  TRRA_TIMELINE_MS,
} from "../utils/saveTrraSubmission";

const STORAGE = {
  submissionId: "trra_submission_id",
  name: "trra_name",
  email: "trra_email",
  phone: "trra_phone",
  start: "trra_start",
  answers: "trra_answers",
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

function loadLocalAnswers() {
  try {
    const raw = localStorage.getItem(STORAGE.answers);
    if (!raw) return emptyTrraAnswers();
    return { ...emptyTrraAnswers(), ...JSON.parse(raw) };
  } catch {
    return emptyTrraAnswers();
  }
}

function persistLocal({ submissionId, name, email, phone, startTime, answers }) {
  if (submissionId) localStorage.setItem(STORAGE.submissionId, submissionId);
  if (name) localStorage.setItem(STORAGE.name, name);
  if (email) localStorage.setItem(STORAGE.email, email);
  if (phone) localStorage.setItem(STORAGE.phone, phone);
  if (startTime) localStorage.setItem(STORAGE.start, String(startTime));
  localStorage.setItem(STORAGE.answers, JSON.stringify(answers));
}

function clearLocal() {
  Object.values(STORAGE).forEach((key) => localStorage.removeItem(key));
}

export function useTrraTask() {
  const [screen, setScreen] = useState("register");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [answers, setAnswers] = useState(loadLocalAnswers);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [error, setError] = useState("");

  const tickRef = useRef(null);
  const saveDebounceRef = useRef(null);
  const expiredHandledRef = useRef(false);

  const handleExpired = useCallback(() => {
    if (expiredHandledRef.current) return;
    expiredHandledRef.current = true;
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setScreen("expired");
  }, []);

  const applySession = useCallback((state) => {
    setSubmissionId(state.submissionId);
    setCandidateName(state.name);
    setCandidateEmail(state.email);
    setCandidatePhone(state.phone);
    setStartTime(state.startedAt);
    setAnswers(state.answers ?? emptyTrraAnswers());

    persistLocal({
      submissionId: state.submissionId,
      name: state.name,
      email: state.email,
      phone: state.phone,
      startTime: state.startedAt,
      answers: state.answers ?? emptyTrraAnswers(),
    });
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
        const state = await fetchTrraSubmissionState(savedId);
        if (cancelled) return;

        if (state.status === "submitted") {
          applySession(state);
          setScreen("submitted");
          setIsRestoring(false);
          return;
        }

        if (state.isExpired || state.status === "expired" || !state.canSubmit) {
          applySession(state);
          handleExpired();
          setIsRestoring(false);
          return;
        }

        applySession(state);
        setScreen("active");
      } catch {
        if (!cancelled) {
          clearLocal();
          setError("Your saved session could not be restored. Please register again.");
        }
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, [applySession, handleExpired]);

  useEffect(() => {
    if (!startTime || screen !== "active") return;

    const tick = () => {
      const ms = startTime + TRRA_TIMELINE_MS - Date.now();
      const next = formatRemaining(ms);
      setRemaining(next);
      if (next.expired) handleExpired();
    };

    tick();
    tickRef.current = setInterval(tick, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [startTime, screen, handleExpired]);

  useEffect(
    () => () => {
      if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    },
    []
  );

  const debouncedSaveAnswers = useCallback((subId, nextAnswers) => {
    if (!subId) return;
    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    saveDebounceRef.current = setTimeout(() => {
      saveTrraAnswers(subId, nextAnswers).catch(() => {});
    }, 800);
  }, []);

  const updateAnswer = (key, value) => {
    if (screen !== "active" || remaining?.expired) return;

    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      debouncedSaveAnswers(submissionId, next);
      persistLocal({
        submissionId,
        name: candidateName,
        email: candidateEmail,
        phone: candidatePhone,
        startTime,
        answers: next,
      });
      return next;
    });
  };

  const startTask = async () => {
    const name = candidateName.trim();
    const email = candidateEmail.trim();
    const phone = candidatePhone.trim();

    if (!canStartTask({ name, email, phone }) || isStarting) return;

    setIsStarting(true);
    setError("");

    const subId = createTrraSubmissionId();

    try {
      const started = await startTrraSubmission({ submissionId: subId, name, email, phone });
      const startedAt = new Date(started.started_at).getTime();
      const initialAnswers = emptyTrraAnswers();

      setSubmissionId(subId);
      setStartTime(startedAt);
      setAnswers(initialAnswers);
      setScreen("active");
      expiredHandledRef.current = false;

      persistLocal({
        submissionId: subId,
        name,
        email,
        phone,
        startTime: startedAt,
        answers: initialAnswers,
      });
    } catch (err) {
      setError(err.message || "Registration failed. Email or phone may already be registered.");
    } finally {
      setIsStarting(false);
    }
  };

  const submitTask = async () => {
    if (isSubmitting || remaining?.expired || screen !== "active") {
      handleExpired();
      return;
    }

    if (!answers.github_repo?.trim()) {
      setError("GitHub repository link is required before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const state = await fetchTrraSubmissionState(submissionId);
      if (!state.canSubmit || state.isExpired) {
        handleExpired();
        return;
      }

      const elapsedMs = Date.now() - state.startedAt;
      const hours = Math.floor(elapsedMs / (3600 * 1000));
      const minutes = Math.floor((elapsedMs % (3600 * 1000)) / (60 * 1000));

      await submitTrraSubmission({
        submissionId,
        answers,
        submittedAt: new Date().toISOString(),
        timeUsed: `${hours}h ${minutes}m`,
      });

      setScreen("submitted");

      const subject = encodeURIComponent(
        `[Velocity Round 2] ${state.name} — TER-S01 + TER-S02`
      );
      const body = encodeURIComponent(
        `Submission ID: ${submissionId}\nName: ${state.name}\nEmail: ${state.email}\nGitHub: ${answers.github_repo}\n\n${answers.notes || ""}`
      );

      setTimeout(() => {
        window.location.href = `mailto:hr@ottermap.com?subject=${subject}&body=${body}`;
      }, 1200);
    } catch (err) {
      if ((err.message || "").includes("72-hour") || (err.message || "").includes("ended")) {
        handleExpired();
      } else {
        setError(err.message || "Submission failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const time = remaining || { h: "72", m: "00", s: "00", expired: false };
  const urgentTime = remaining && parseInt(remaining.h, 10) < 6 && !remaining.expired;
  const elapsed = startTime ? Math.min(1, (Date.now() - startTime) / TRRA_TIMELINE_MS) : 0;

  return {
    screen,
    candidateName,
    setCandidateName,
    candidateEmail,
    setCandidateEmail,
    candidatePhone,
    setCandidatePhone,
    canStart: canStartTask({
      name: candidateName,
      email: candidateEmail,
      phone: candidatePhone,
    }),
    isStarting,
    isSubmitting,
    isRestoring,
    submissionId,
    answers,
    updateAnswer,
    startTask,
    submitTask,
    time,
    urgentTime,
    elapsed,
    error,
    setError,
  };
}
