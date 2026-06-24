import { supabase, isSupabaseConfigured } from "./supabase";

export const TIMELINE_HOURS = 72;
export const TIMELINE_MS = TIMELINE_HOURS * 60 * 60 * 1000;

const DELIVERABLE_KEYS = ["repo", "weights", "summary", "samples"];

function generateSubmissionId() {
  return (
    "OM-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export function createOttermapSubmissionId() {
  return generateSubmissionId();
}

function formatSupabaseError(error) {
  const message = error.message || "";

  if (error.code === "PGRST202") {
    return "Database setup incomplete. Run supabase/ottermap_challenge_setup.sql in the Supabase SQL Editor.";
  }
  if (message.includes("email_already_registered")) {
    return "This email is already registered for the challenge.";
  }
  if (message.includes("phone_already_registered")) {
    return "This phone number is already registered for the challenge.";
  }
  if (message.includes("time_expired")) {
    return "Your 72-hour window has ended. Submission is no longer allowed.";
  }
  if (message.includes("submission_not_found")) {
    return "Session not found. Please register again.";
  }
  if (message.includes("submission_already_completed")) {
    return "This challenge has already been submitted.";
  }
  if (error.code === "23505") {
    return "Email or phone number is already registered.";
  }

  return [message, error.details, error.hint].filter(Boolean).join(" — ");
}

function deliverablesToPayload(deliverables = {}) {
  return {
    deliverable_repo: deliverables.repo ?? "",
    deliverable_weights: deliverables.weights ?? "",
    deliverable_summary: deliverables.summary ?? "",
    deliverable_samples: deliverables.samples ?? "",
  };
}

function deliverablesFromState(state) {
  return {
    repo: state.deliverable_repo ?? "",
    weights: state.deliverable_weights ?? "",
    summary: state.deliverable_summary ?? "",
    samples: state.deliverable_samples ?? "",
  };
}

export async function startOttermapChallenge({ submissionId, name, email, phone }) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  const { data, error } = await supabase.rpc("start_ottermap_challenge", {
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

export async function saveOttermapProgress({ submissionId, step, deliverables, notes }) {
  if (!isSupabaseConfigured || !submissionId) return;

  const { error } = await supabase.rpc("save_ottermap_challenge", {
    payload: {
      submission_id: submissionId,
      step,
      submit_notes: notes ?? "",
      ...deliverablesToPayload(deliverables),
    },
  });

  if (error) throw new Error(formatSupabaseError(error));
}

export async function fetchOttermapChallengeState(submissionId) {
  if (!isSupabaseConfigured || !submissionId) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  const { data, error } = await supabase.rpc("get_ottermap_challenge_state", {
    p_submission_id: submissionId,
  });

  if (error) throw new Error(formatSupabaseError(error));

  return {
    submissionId: data.submission_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    startedAt: new Date(data.started_at).getTime(),
    deadlineAt: new Date(data.deadline_at).getTime(),
    step: data.step,
    status: data.status,
    deliverables: deliverablesFromState(data),
    notes: data.submit_notes ?? "",
    submittedAt: data.submitted_at,
    timeUsed: data.time_used,
    isExpired: data.is_expired,
    canSubmit: data.can_submit,
  };
}

export async function submitOttermapChallenge({
  submissionId,
  deliverables,
  notes,
  submittedAt,
  timeUsed,
}) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  if (!submissionId) {
    throw new Error("Missing submission ID. Please refresh and register again.");
  }

  const { error } = await supabase.rpc("submit_ottermap_challenge", {
    payload: {
      submission_id: submissionId,
      submitted_at: submittedAt,
      time_used: timeUsed,
      submit_notes: notes ?? "",
      ...deliverablesToPayload(deliverables),
    },
  });

  if (error) throw new Error(formatSupabaseError(error));
  return { submission_id: submissionId };
}

export function emptyDeliverables() {
  return Object.fromEntries(DELIVERABLE_KEYS.map((key) => [key, ""]));
}

export function deliverablesFromArray(values = []) {
  return Object.fromEntries(DELIVERABLE_KEYS.map((key, i) => [key, values[i] ?? ""]));
}

export function deliverablesToArray(deliverables = {}) {
  return DELIVERABLE_KEYS.map((key) => deliverables[key] ?? "");
}
