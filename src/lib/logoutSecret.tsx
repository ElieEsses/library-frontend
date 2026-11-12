import { useEffect } from "react";
import { supabase } from "./supabase";

export function useSecretLogout() {
  useEffect(() => {
    let previousKey = "";

    const handleKeyDown = async (event: KeyboardEvent) => {
      // Don't trigger while typing in forms
      const target = event.target as HTMLElement;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        previousKey = "";
        return;
      }

      if (previousKey === ":" && event.key === "q") {
        previousKey = "";
        await supabase.auth.signOut();
        window.location.replace("/login");
        return;
      }

      previousKey = event.key;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}