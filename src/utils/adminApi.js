import { supabase } from "./supabase";

export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;

  const userEmail = data.user?.email;
  if (!userEmail) {
    await supabase.auth.signOut();
    throw new Error("Authentication failed.");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin", {
    check_email: userEmail,
  });

  if (adminError) {
    await supabase.auth.signOut();
    throw new Error(adminError.message);
  }

  if (!isAdmin) {
    await supabase.auth.signOut();
    throw new Error("You are not authorized to access the admin panel.");
  }

  return data;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchSubmissions() {
  const { data, error } = await supabase
    .from("qualifier_submissions")
    .select("*")
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function verifyAdminSession(session) {
  if (!session?.user?.email) return false;

  const { data, error } = await supabase.rpc("is_admin", {
    check_email: session.user.email,
  });

  if (error) return false;
  return Boolean(data);
}
