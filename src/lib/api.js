import { supabase } from "./supabase";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = "https://collaboration-henderson-treatments-asking.trycloudflare.com"

export async function apiFetch(endpoint, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    console.log("Backend error:", data);

    throw new Error(data.detail || `API error: ${response.statusText}`);
  }

  return response.json();
}