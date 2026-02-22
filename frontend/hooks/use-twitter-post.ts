"use client";

import { useState, useCallback } from "react";

export function useTwitterPost() {
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = useCallback(async (text: string) => {
    if (!text.trim()) return { success: false, error: "Empty message" };
    setPosting(true);
    setError(null);
    try {
      const res = await fetch("/api/twitter/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 280) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to post");
        return { success: false, error: data.error };
      }
      return { success: true, id: data.id };
    } catch (e) {
      const err = e instanceof Error ? e.message : "Failed to post";
      setError(err);
      return { success: false, error: err };
    } finally {
      setPosting(false);
    }
  }, []);

  return { post, posting, error };
}
