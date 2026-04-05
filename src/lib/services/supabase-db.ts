import { createClient } from "@/lib/supabase/client";

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Generic query wrapper that falls back gracefully
async function query<T>(
  fn: () => Promise<{ data: T | null; error: { message: string } | null }>
): Promise<{ data: T | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase niet geconfigureerd" };
  }
  const { data, error } = await fn();
  return { data, error: error?.message || null };
}

// ============================================
// AUTH
// ============================================

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  return { data, error: error?.message || null };
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error: error?.message || null };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

export async function getUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error: error?.message || null };
}

// ============================================
// VVE
// ============================================

export async function getVvEs() {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("vves").select("*").order("name");
  });
}

export async function getVvE(id: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("vves").select("*").eq("id", id).single();
  });
}

export async function updateVvE(id: string, updates: Record<string, unknown>) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("vves").update(updates).eq("id", id).select().single();
  });
}

// ============================================
// MEMBERS
// ============================================

export async function getMembers(vveId: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("members").select("*, units(unit_number, breukdeel_numerator, breukdeel_denominator)")
      .eq("vve_id", vveId).order("full_name");
  });
}

export async function createMember(member: {
  vve_id: string; full_name: string; email: string; phone?: string;
  role: string; unit_id?: string;
}) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("members").insert(member).select().single();
  });
}

// ============================================
// INVOICES
// ============================================

export async function getInvoices(vveId: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("invoices")
      .select("*, members(full_name, email)")
      .eq("vve_id", vveId)
      .order("created_at", { ascending: false });
  });
}

export async function createInvoice(invoice: {
  invoice_number: string; vve_id: string; member_id: string;
  items: unknown[]; subtotal: number; total: number;
  period: string; issue_date: string; due_date: string; notes?: string;
}) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("invoices").insert(invoice).select().single();
  });
}

export async function updateInvoiceStatus(
  id: string,
  status: string,
  extra?: { paid_date?: string; sent_date?: string }
) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("invoices").update({ status, ...extra }).eq("id", id).select().single();
  });
}

export async function getNextInvoiceNumber(vveId: string, year: number) {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase niet geconfigureerd" };
  const supabase = createClient();
  const { data, error } = await supabase.rpc("next_invoice_number", {
    target_vve_id: vveId,
    target_year: year,
  });
  return { data: data as string | null, error: error?.message || null };
}

// ============================================
// TRANSACTIONS
// ============================================

export async function getTransactions(vveId: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("transactions").select("*").eq("vve_id", vveId).order("date", { ascending: false });
  });
}

export async function createTransaction(tx: {
  vve_id: string; type: string; amount: number; description: string;
  category?: string; date: string; member_id?: string; invoice_id?: string;
}) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("transactions").insert(tx).select().single();
  });
}

// ============================================
// DOCUMENTS
// ============================================

export async function getDocuments(vveId: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("documents").select("*").eq("vve_id", vveId).order("uploaded_at", { ascending: false });
  });
}

export async function uploadDocument(vveId: string, file: File, type: string, title: string) {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase niet geconfigureerd" };
  const supabase = createClient();

  const filePath = `${vveId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file);
  if (uploadError) return { data: null, error: uploadError.message };

  return query(async () =>
    supabase.from("documents").insert({
      vve_id: vveId, title, type, file_path: filePath,
      file_size: file.size, mime_type: file.type,
    }).select().single()
  );
}

// ============================================
// MEETINGS
// ============================================

export async function getMeetings(vveId: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("meetings").select("*").eq("vve_id", vveId).order("date", { ascending: false });
  });
}

// ============================================
// VOTES
// ============================================

export async function getVotes(vveId: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("votes").select("*, vote_responses(*)").eq("vve_id", vveId).order("created_at", { ascending: false });
  });
}

export async function castVote(voteId: string, memberId: string, response: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("vote_responses").upsert(
      { vote_id: voteId, member_id: memberId, response },
      { onConflict: "vote_id,member_id" }
    ).select().single();
  });
}

// ============================================
// MAINTENANCE
// ============================================

export async function getMaintenanceRequests(vveId: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("maintenance_requests").select("*").eq("vve_id", vveId).order("created_at", { ascending: false });
  });
}

// ============================================
// NOTIFICATION SETTINGS
// ============================================

export async function getNotificationSettings(vveId: string) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("notification_settings").select("*").eq("vve_id", vveId).single();
  });
}

export async function updateNotificationSettings(vveId: string, settings: Record<string, unknown>) {
  return query(async () => {
    const supabase = createClient();
    return supabase.from("notification_settings")
      .upsert({ vve_id: vveId, ...settings }, { onConflict: "vve_id" })
      .select().single();
  });
}
