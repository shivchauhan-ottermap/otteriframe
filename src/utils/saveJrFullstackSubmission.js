import { supabase, isSupabaseConfigured } from "./supabase";

export const JR_FULLSTACK_MINUTES = 45;
export const JR_FULLSTACK_SECONDS = JR_FULLSTACK_MINUTES * 60;

const ANSWER_KEYS = ["a", "b", "c1", "c2", "c3", "d1", "d2", "e"];

export function createJrFullstackSubmissionId() {
  return (
    "OTR-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export function emptyJrFullstackAnswers() {
  return Object.fromEntries(ANSWER_KEYS.map((key) => [key, ""]));
}

function formatSupabaseError(error) {
  const message = error.message || "";

  if (error.code === "PGRST202") {
    return "Database setup incomplete. Run supabase/jr_fullstack_setup.sql in the Supabase SQL Editor.";
  }
  if (message.includes("email_already_registered")) {
    return "This email is already registered for the Junior Full Stack qualifier.";
  }
  if (message.includes("phone_already_registered")) {
    return "This phone number is already registered for the Junior Full Stack qualifier.";
  }
  if (message.includes("time_expired")) {
    return "The 45-minute window has ended. Submission is no longer allowed.";
  }
  if (message.includes("submission_not_found")) {
    return "Session not found. Please start the task again.";
  }
  if (message.includes("submission_already_completed")) {
    return "This task has already been submitted.";
  }
  if (error.code === "23505") {
    return "Email or phone number is already registered for this qualifier.";
  }

  return [message, error.details, error.hint].filter(Boolean).join(" — ");
}

function answersPayload(answers = {}) {
  return Object.fromEntries(ANSWER_KEYS.map((key) => [key, answers[key] ?? ""]));
}

export async function startJrFullstackSubmission({ submissionId, name, email, phone }) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  const { data, error } = await supabase.rpc("start_jr_fullstack_submission", {
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

export async function saveJrFullstackAnswers(submissionId, answers) {
  if (!isSupabaseConfigured || !submissionId) return;

  const { error } = await supabase.rpc("save_jr_fullstack_answers", {
    payload: {
      submission_id: submissionId,
      answers: answersPayload(answers),
    },
  });

  if (error) throw new Error(formatSupabaseError(error));
}

export async function submitJrFullstackSubmission({
  submissionId,
  answers,
  submittedAt,
  timeUsed,
}) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  if (!submissionId) {
    throw new Error("Missing submission ID. Please refresh and start the task again.");
  }

  const { error } = await supabase.rpc("submit_jr_fullstack_submission", {
    payload: {
      submission_id: submissionId,
      answers: answersPayload(answers),
      submitted_at: submittedAt,
      time_used: timeUsed,
    },
  });

  if (error) throw new Error(formatSupabaseError(error));
  return { submission_id: submissionId };
}
