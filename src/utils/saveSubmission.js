import { supabase, isSupabaseConfigured } from "./supabase";

function generateSubmissionId() {
  return (
    "VQ-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export function createSubmissionId() {
  return generateSubmissionId();
}

function formatSupabaseError(error) {
  if (error.code === "PGRST202") {
    return (
      "Database setup incomplete. Ask your admin to run supabase/setup_complete.sql in the Supabase SQL Editor."
    );
  }
  return [error.message, error.details, error.hint].filter(Boolean).join(" — ");
}

function buildPayload(submissionId, answers, extra = {}) {
  const payload = {
    submission_id: submissionId,
    part_a: answers.a ?? "",
    part_b: answers.b ?? "",
    part_c1: answers.c1 ?? "",
    part_c2: answers.c2 ?? "",
    part_c3: answers.c3 ?? "",
    part_d1: answers.d1 ?? "",
    part_d2: answers.d2 ?? "",
    part_e: answers.e ?? "",
  };

  if (extra.name) payload.name = extra.name;
  if (extra.email) payload.email = extra.email;
  if (extra.phone) payload.phone = extra.phone;
  if (extra.status) payload.status = extra.status;
  if (extra.submittedAt) payload.submitted_at = extra.submittedAt;
  if (extra.timeUsed) payload.time_used = extra.timeUsed;
  if (extra.startedAt) payload.started_at = extra.startedAt;

  return payload;
}

async function persist(payload) {
  const { error } = await supabase.rpc("save_qualifier_answers", { payload });
  if (error) throw new Error(formatSupabaseError(error));
}

export async function startSubmission({ submissionId, name, email, phone }) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  await persist({
    submission_id: submissionId,
    name,
    email,
    phone,
    status: "in_progress",
    started_at: new Date().toISOString(),
    part_a: "",
    part_b: "",
    part_c1: "",
    part_c2: "",
    part_c3: "",
    part_d1: "",
    part_d2: "",
    part_e: "",
  });

  return { submission_id: submissionId };
}

export async function saveAnswers(submissionId, answers) {
  if (!isSupabaseConfigured || !submissionId) return;
  await persist(buildPayload(submissionId, answers));
}

export async function submitSubmission(submissionId, payload) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  if (!submissionId) {
    throw new Error("Missing submission ID. Please refresh and start the task again.");
  }

  await persist(
    buildPayload(
      submissionId,
      {
        a: payload.partA,
        b: payload.partB,
        c1: payload.partC1,
        c2: payload.partC2,
        c3: payload.partC3,
        d1: payload.partD1,
        d2: payload.partD2,
        e: payload.partE,
      },
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        status: "submitted",
        submittedAt: payload.submittedAt,
        timeUsed: payload.timeUsed,
      }
    )
  );

  return { submission_id: submissionId };
}
