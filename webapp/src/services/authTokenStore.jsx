import { supabase } from "./supabaseService";

let token = null;

let resolveReady;
const ready = new Promise((r) => (resolveReady = r));

export async function initAuthTokenStore() {
  const { data: { session } } = await supabase.auth.getSession();
  token = session?.access_token ?? null;
  resolveReady();

  supabase.auth.onAuthStateChange((_event, newSession) => {
    token = newSession?.access_token ?? null;
  });
}

export async function getAuthToken() {
  await ready;
  return token;
}
