"use client";

import { useState, useCallback } from "react";

export function useOpenAIInsight() {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = useCallback(async (context: string, prompt: string) => {
    setLoading(true);
    setError(null);
    setInsight(null);
    try {
      const res = await fetch("/api/openai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, prompt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to get insight");
        return null;
      }
      const text = typeof data.content === "string" ? data.content : null;
      setInsight(text);
      return text;
    } catch (e) {
      const err = e instanceof Error ? e.message : "Failed to get insight";
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { insight, loading, error, fetchInsight };
}
