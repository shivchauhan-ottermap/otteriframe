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

function toDbRow(submissionId, payload, { includeStartedAt = false } = {}) {
  const row = {
    submission_id: submissionId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    part_a: payload.partA ?? "",
    part_b: payload.partB ?? "",
    part_c1: payload.partC1 ?? "",
    part_c2: payload.partC2 ?? "",
    part_c3: payload.partC3 ?? "",
    part_d1: payload.partD1 ?? "",
    part_d2: payload.partD2 ?? "",
    part_e: payload.partE ?? "",
    status: payload.status ?? "in_progress",
  };

  if (payload.submittedAt) row.submitted_at = payload.submittedAt;
  if (payload.timeUsed) row.time_used = payload.timeUsed;
  if (includeStartedAt) row.started_at = payload.startedAt ?? new Date().toISOString();

  return row;
}

function formatSupabaseError(error) {
  return [error.message, error.details, error.hint].filter(Boolean).join(" — ");
}

export async function startSubmission({ submissionId, name, email, phone }) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  const { data, error } = await supabase
    .from("qualifier_submissions")
    .insert({
      submission_id: submissionId,
      name,
      email,
      phone,
      started_at: new Date().toISOString(),
      status: "in_progress",
    })
    .select("submission_id")
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  if (!data) throw new Error("Failed to create submission record.");
  return data;
}

export async function saveAnswers(submissionId, answers) {
  if (!isSupabaseConfigured || !submissionId) return;

  const { data, error } = await supabase
    .from("qualifier_submissions")
    .update({
      part_a: answers.a ?? "",
      part_b: answers.b ?? "",
      part_c1: answers.c1 ?? "",
      part_c2: answers.c2 ?? "",
      part_c3: answers.c3 ?? "",
      part_d1: answers.d1 ?? "",
      part_d2: answers.d2 ?? "",
      part_e: answers.e ?? "",
    })
    .eq("submission_id", submissionId)
    .select("submission_id");

  if (error) throw new Error(formatSupabaseError(error));
  if (!data?.length) {
    throw new Error(`No submission found for id ${submissionId}`);
  }
}

export async function submitSubmission(submissionId, payload) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check your .env file.");
  }

  if (!submissionId) {
    throw new Error("Missing submission ID. Please refresh and start the task again.");
  }

  const row = toDbRow(submissionId, {
    ...payload,
    status: "submitted",
  });

  // Try update first (normal path after start)
  const { data: updated, error: updateError } = await supabase
    .from("qualifier_submissions")
    .update(row)
    .eq("submission_id", submissionId)
    .select("submission_id, part_a, part_e, status, submitted_at");

  if (updateError) throw new Error(formatSupabaseError(updateError));

  if (updated?.length) {
    return updated[0];
  }

  // Fallback: upsert in case the row is missing or submission_id didn't match
  const { data: upserted, error: upsertError } = await supabase
    .from("qualifier_submissions")
    .upsert(
      {
        ...row,
        started_at: payload.startedAt ?? new Date().toISOString(),
      },
      { onConflict: "submission_id" }
    )
    .select("submission_id, part_a, part_e, status, submitted_at")
    .single();

  if (upsertError) throw new Error(formatSupabaseError(upsertError));
  if (!upserted) throw new Error("Submission could not be saved.");
  return upserted;
}
