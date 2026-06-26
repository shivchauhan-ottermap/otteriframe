import { supabase, isSupabaseConfigured } from "./supabase";

export const TRRA_TIMELINE_HOURS = 72;
export const TRRA_TIMELINE_MS = TRRA_TIMELINE_HOURS * 60 * 60 * 1000;

const ANSWER_KEYS = ["github_repo", "notes"];

function generateSubmissionId() {
  return (
    "TR-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export function createTrraSubmissionId() {
  return generateSubmissionId();
}

export function emptyTrraAnswers() {
  return Object.fromEntries(ANSWER_KEYS.map((key) => [key, ""]));
}

function formatSupabaseError(error) {
  const message = error.message || "";

  if (error.code === "PGRST202") {
    return "Database setup incomplete. Run supabase/trra_setup.sql in the Supabase SQL Editor.";
  }
  if (message.includes("email_already_registered")) {
    return "This email is already registered for Round 2.";
  }
  if (message.includes("phone_already_registered")) {
    return "This phone number is already registered for Round 2.";
  }
  if (message.includes("time_expired")) {
    return "Your 72-hour window has ended. Submission is no longer allowed.";
  }
  if (message.includes("submission_not_found")) {
    return "Session not found. Please register again.";
  }
  if (message.includes("submission_already_completed")) {
    return "This task has already been submitted.";
  }
  if (error.code === "23505") {
    return "Email or phone number is already registered.";
  }

  return [message, error.details, error.hint].filter(Boolean).join(" — ");
}

export async function startTrraSubmission({ submissionId, name, email, phone }) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  const { data, error } = await supabase.rpc("start_trra_submission", {
    payload: {
      submission_id: submissionId,
      name,
      email,
      phone,
    },
  });

  if (error) throw new Error(formatSupabaseError(error));
  return data;
}

export async function saveTrraAnswers(submissionId, answers) {
  if (!isSupabaseConfigured || !submissionId) return;

  const { error } = await supabase.rpc("save_trra_answers", {
    payload: {
      submission_id: submissionId,
      answers,
    },
  });

  if (error) throw new Error(formatSupabaseError(error));
}

export async function fetchTrraSubmissionState(submissionId) {
  if (!isSupabaseConfigured || !submissionId) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  const { data, error } = await supabase.rpc("get_trra_submission_state", {
    p_submission_id: submissionId,
  });

  if (error) throw new Error(formatSupabaseError(error));

  const answers = data.answers ?? {};

  return {
    submissionId: data.submission_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    startedAt: new Date(data.started_at).getTime(),
    deadlineAt: new Date(data.deadline_at).getTime(),
    status: data.status,
    answers: {
      github_repo: answers.github_repo ?? "",
      notes: answers.notes ?? "",
    },
    submittedAt: data.submitted_at,
    timeUsed: data.time_used,
    isExpired: data.is_expired,
    canSubmit: data.can_submit,
  };
}

export async function submitTrraSubmission({ submissionId, answers, submittedAt, timeUsed }) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  if (!submissionId) {
    throw new Error("Missing submission ID. Please refresh and register again.");
  }

  const { error } = await supabase.rpc("submit_trra_submission", {
    payload: {
      submission_id: submissionId,
      answers,
      submitted_at: submittedAt,
      time_used: timeUsed,
    },
  });

  if (error) throw new Error(formatSupabaseError(error));
  return { submission_id: submissionId };
}
