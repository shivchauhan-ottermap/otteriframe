import { useState, useEffect, useRef, useCallback } from "react";
import { buildJrFullstackEmailBody } from "../utils/buildJrFullstackEmail";
import {
  createJrFullstackSubmissionId,
  startJrFullstackSubmission,
  saveJrFullstackAnswers,
  submitJrFullstackSubmission,
} from "../utils/saveJrFullstackSubmission";
import { canStartTask } from "../utils/validation";

export const TOTAL_SECONDS = 45 * 60;

const ANSWER_KEYS = ["a", "b", "c1", "c2", "c3", "d1", "d2", "e"];

const STORAGE_KEY = (id) => `oq_ans-${id}`;

const UNLOCK_MAP = {
  a: "b",
  b: "c",
  c1: "d",
  d1: "e",
};

function loadAnswers() {
  return Object.fromEntries(
    ANSWER_KEYS.map((id) => [id, sessionStorage.getItem(STORAGE_KEY(id)) || ""])
  );
}

function computeUnlocked(answers) {
  const unlocked = new Set(["a"]);
  Object.entries(UNLOCK_MAP).forEach(([from, to]) => {
    if ((answers[from] || "").trim().length >= 20) unlocked.add(to);
  });
  return unlocked;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function useJrFullstackTask() {
  const [screen, setScreen] = useState("landing");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [answers, setAnswers] = useState(loadAnswers);
  const [unlocked, setUnlocked] = useState(() => computeUnlocked(loadAnswers()));
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [showTaskContent, setShowTaskContent] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intervalRef = useRef(null);
  const scrollTargetRef = useRef(null);
  const saveDebounceRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const expireTask = useCallback(() => {
    clearTimer();
    setTimeLeft(0);
    setDisabled(true);
    setShowSubmit(false);
    setScreen((current) => {
      if (current === "task") setShowTaskContent(true);
      return "expired";
    });
  }, [clearTimer]);

  const startTimer = useCallback(() => {
    const startTime = sessionStorage.getItem("oq_start");
    let remaining = TOTAL_SECONDS;

    if (startTime) {
      const elapsed = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
      remaining = Math.max(0, TOTAL_SECONDS - elapsed);
    }

    setTimeLeft(remaining);

    if (remaining <= 0) {
      expireTask();
      return;
    }

    clearTimer();
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          expireTask();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, expireTask]);

  useEffect(() => {
    const wasSubmitted = sessionStorage.getItem("oq_submitted");
    if (wasSubmitted) {
      const data = JSON.parse(wasSubmitted);
      setSubmissionId(data.submissionId);
      setScreen("submitted");
      return;
    }

    const savedName = sessionStorage.getItem("oq_name");
    const savedEmail = sessionStorage.getItem("oq_email");
    const savedPhone = sessionStorage.getItem("oq_phone");
    const savedSubmissionId = sessionStorage.getItem("oq_submission_id");
    const savedStart = sessionStorage.getItem("oq_start");

    if (savedName && savedEmail && savedPhone && savedSubmissionId && savedStart) {
      const elapsed = Math.floor((Date.now() - parseInt(savedStart, 10)) / 1000);
      setCandidateName(savedName);
      setCandidateEmail(savedEmail);
      setCandidatePhone(savedPhone);
      setSubmissionId(savedSubmissionId);

      if (elapsed >= TOTAL_SECONDS) {
        setScreen("expired");
        setDisabled(true);
        setShowTaskContent(false);
        return;
      }

      const restored = loadAnswers();
      setAnswers(restored);
      setUnlocked(computeUnlocked(restored));
      setShowSubmit((restored.e || "").trim().length >= 20);
      setShowTaskContent(true);
      setScreen("task");
      startTimer();
    }
  }, [startTimer]);

  useEffect(() => () => {
    clearTimer();
    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
  }, [clearTimer]);

  useEffect(() => {
    if (scrollTargetRef.current) {
      setTimeout(() => {
        scrollTargetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        scrollTargetRef.current = null;
      }, 100);
    }
  }, [unlocked]);

  const debouncedSaveAnswers = useCallback((subId, nextAnswers) => {
    if (!subId) return;
    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    saveDebounceRef.current = setTimeout(() => {
      saveJrFullstackAnswers(subId, nextAnswers).catch(() => {});
    }, 800);
  }, []);

  const getLatestAnswers = useCallback(() => {
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
      saveDebounceRef.current = null;
    }
    return loadAnswers();
  }, []);

  const updateAnswer = (id, value) => {
    if (disabled) return;

    sessionStorage.setItem(STORAGE_KEY(id), value);

    const nextSection = UNLOCK_MAP[id];
    if (nextSection && value.trim().length >= 20) {
      setUnlocked((u) => {
        if (u.has(nextSection)) return u;
        scrollTargetRef.current = document.getElementById(`jnr-section-${nextSection}`);
        return new Set([...u, nextSection]);
      });
    }

    if (id === "e") {
      setShowSubmit(value.trim().length >= 20);
    }

    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      const subId = sessionStorage.getItem("oq_submission_id");
      debouncedSaveAnswers(subId, next);
      return next;
    });
  };

  const startTask = async () => {
    const name = candidateName.trim();
    const email = candidateEmail.trim();
    const phone = candidatePhone.trim();

    if (!canStartTask({ name, email, phone }) || isStarting) return;

    setIsStarting(true);

    const subId = createJrFullstackSubmissionId();

    try {
      await startJrFullstackSubmission({ submissionId: subId, name, email, phone });

      sessionStorage.setItem("oq_name", name);
      sessionStorage.setItem("oq_email", email);
      sessionStorage.setItem("oq_phone", phone);
      sessionStorage.setItem("oq_submission_id", subId);
      sessionStorage.setItem("oq_start", Date.now().toString());

      setSubmissionId(subId);
      setShowTaskContent(true);
      setScreen("task");
      startTimer();
    } catch (err) {
      alert(err.message || "Could not start the task. Please contact support.");
    } finally {
      setIsStarting(false);
    }
  };

  const submitTask = async () => {
    if (timeLeft <= 0 || disabled || isSubmitting) return;

    const subId = sessionStorage.getItem("oq_submission_id") || submissionId;

    if (!subId) {
      alert("Missing submission ID. Please refresh the page and start the task again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const latestAnswers = getLatestAnswers();

      const payload = {
        submissionId: subId,
        name: sessionStorage.getItem("oq_name") || candidateName,
        email: sessionStorage.getItem("oq_email") || candidateEmail,
        phone: sessionStorage.getItem("oq_phone") || candidatePhone,
        submittedAt: new Date().toISOString(),
        timeUsed: `${Math.floor((TOTAL_SECONDS - timeLeft) / 60)}m ${(TOTAL_SECONDS - timeLeft) % 60}s`,
        partA: latestAnswers.a,
        partB: latestAnswers.b,
        partC1: latestAnswers.c1,
        partC2: latestAnswers.c2,
        partC3: latestAnswers.c3,
        partD1: latestAnswers.d1,
        partD2: latestAnswers.d2,
        partE: latestAnswers.e,
      };

      const parts = ["partA", "partB", "partC1", "partC2", "partC3", "partD1", "partD2", "partE"];
      const empty = parts.filter((p) => !payload[p] || payload[p].trim().length < 10);

      if (empty.length > 0) {
        const confirmSubmit = window.confirm(
          `${empty.length} section(s) appear incomplete. Submit anyway?`
        );
        if (!confirmSubmit) {
          setIsSubmitting(false);
          return;
        }
      }

      await submitJrFullstackSubmission({
        submissionId: subId,
        answers: latestAnswers,
        submittedAt: payload.submittedAt,
        timeUsed: payload.timeUsed,
      });

      clearTimer();

      sessionStorage.setItem("oq_submitted", JSON.stringify(payload));

      const emailBody = buildJrFullstackEmailBody(payload);
      const emailSubject = encodeURIComponent(
        `[Ottermap Qualifier — Jr Full Stack] ${payload.name} — ${subId}`
      );

      setSubmissionId(subId);
      setShowSubmit(false);
      setScreen("submitted");

      setTimeout(() => {
        window.location.href = `mailto:hr@ottermap.com?subject=${emailSubject}&body=${encodeURIComponent(emailBody)}`;
      }, 1200);
    } catch (err) {
      alert(err.message || "Submission failed. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timerDisplay = formatTime(timeLeft);
  const timerClass = timeLeft <= 120 ? "danger" : timeLeft <= 300 ? "warn" : "";

  const progressPct = (timeLeft / TOTAL_SECONDS) * 100;
  const progressColor =
    progressPct <= 25 ? "var(--jnr-danger)" : progressPct <= 50 ? "var(--jnr-warn)" : "var(--jnr-accent)";

  const canStart = canStartTask({
    name: candidateName,
    email: candidateEmail,
    phone: candidatePhone,
  });

  return {
    screen,
    candidateName,
    setCandidateName,
    candidateEmail,
    setCandidateEmail,
    candidatePhone,
    setCandidatePhone,
    canStart,
    isStarting,
    isSubmitting,
    answers,
    updateAnswer,
    unlocked,
    timeLeft,
    timerDisplay,
    timerClass,
    progressPct,
    progressColor,
    showSubmit,
    submissionId,
    disabled,
    showTaskContent,
    startTask,
    submitTask,
  };
}
