import { useState, useEffect, useRef, useCallback } from "react";
import { buildEmailBody } from "../utils/buildEmailBody";
import {
  createSubmissionId,
  startSubmission,
  saveAnswers,
  submitSubmission,
} from "../utils/saveSubmission";
import { canStartTask } from "../utils/validation";

export const TOTAL_SECONDS = 45 * 60;

const ANSWER_KEYS = ["a", "b", "c1", "c2", "c3", "d1", "d2", "e"];

const STORAGE_KEY = (id) => `q_ans-${id}`;

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

export function useQualifierTask() {
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
    const startTime = sessionStorage.getItem("q_start");
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
    const wasSubmitted = sessionStorage.getItem("q_submitted");
    if (wasSubmitted) {
      const data = JSON.parse(wasSubmitted);
      setSubmissionId(data.submissionId);
      setScreen("submitted");
      return;
    }

    const savedName = sessionStorage.getItem("q_name");
    const savedEmail = sessionStorage.getItem("q_email");
    const savedPhone = sessionStorage.getItem("q_phone");
    const savedSubmissionId = sessionStorage.getItem("q_submission_id");
    const savedStart = sessionStorage.getItem("q_start");

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
      saveAnswers(subId, nextAnswers).catch((err) => {
        // console.error("Auto-save failed:");
      });
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
        scrollTargetRef.current = document.getElementById(`section-${nextSection}`);
        return new Set([...u, nextSection]);
      });
    }

    if (id === "e") {
      setShowSubmit(value.trim().length >= 20);
    }

    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      const subId = sessionStorage.getItem("q_submission_id");
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

    const subId = createSubmissionId();

    try {
      await startSubmission({ submissionId: subId, name, email, phone });

      sessionStorage.setItem("q_name", name);
      sessionStorage.setItem("q_email", email);
      sessionStorage.setItem("q_phone", phone);
      sessionStorage.setItem("q_submission_id", subId);
      sessionStorage.setItem("q_start", Date.now().toString());

      setSubmissionId(subId);
      setShowTaskContent(true);
      setScreen("task");
      startTimer();
    } catch (err) {
      // console.error(err);
      alert(
        "Duplicates found! Please contact support."
      );
    } finally {
      setIsStarting(false);
    }
  };

  const submitTask = async () => {
    if (timeLeft <= 0 || disabled || isSubmitting) return;

    const subId = sessionStorage.getItem("q_submission_id") || submissionId;

    if (!subId) {
      alert("Missing submission ID. Please refresh the page and start the task again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const latestAnswers = getLatestAnswers();

      const payload = {
        submissionId: subId,
        name: sessionStorage.getItem("q_name") || candidateName,
        email: sessionStorage.getItem("q_email") || candidateEmail,
        phone: sessionStorage.getItem("q_phone") || candidatePhone,
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
          `${empty.length} section(s) appear incomplete. Are you sure you want to submit now?`
        );
        if (!confirmSubmit) {
          setIsSubmitting(false);
          return;
        }
      }

      // Single upsert call with all answers + submitted status
      await submitSubmission(subId, payload);

      clearTimer();

      sessionStorage.setItem("q_submitted", JSON.stringify(payload));

      const emailBody = buildEmailBody(payload);
      const emailSubject = encodeURIComponent(
        `[Ottermap × TerraSync Qualifier] ${payload.name} — ${subId}`
      );

      setSubmissionId(subId);
      setShowSubmit(false);
      setScreen("submitted");

      setTimeout(() => {
        window.location.href = `mailto:hiring@ottermap.com?subject=${emailSubject}&body=${encodeURIComponent(emailBody)}`;
      }, 1200);
    } catch (err) {
      // console.error(err);
      alert(
        "Submission failed!! Please contact support."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const timerDisplay = formatTime(timeLeft);
  const timerClass =
    timeLeft <= 120
      ? "text-danger animate-pulse-timer"
      : timeLeft <= 300
        ? "text-warn"
        : "text-accent";

  const progressPct = (timeLeft / TOTAL_SECONDS) * 100;
  const progressColor =
    progressPct <= 25 ? "bg-danger" : progressPct <= 50 ? "bg-warn" : "bg-accent";

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
