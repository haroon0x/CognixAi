import { useState } from "react";

export function usePlanAgent() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (text: string) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const response = await fetch("/api/plan-from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setPlan(data.plan);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { generatePlan, loading, plan, error };
} 