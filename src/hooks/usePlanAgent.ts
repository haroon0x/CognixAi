import { useState, useEffect } from "react";
import { ActionPlan } from "../types";

const AGENT_NAME = "planner_agent"; // Change to your actual agent folder name
const USER_ID = "u_123";
const SESSION_ID = "s_" + USER_ID; // Or generate a unique session per user
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "";

export function usePlanAgent() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState<any>(null);

  const generatePlan = async (goals: string[]) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setRawOutput(null);
    try {
      const response = await fetch(`/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: goals.join("\n") })
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setRawOutput(data);
      if (data && !data.error) {
        setPlan(data);
      } else {
        setError(data.error || "No plan returned from agent.");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { generatePlan, loading, plan, error, rawOutput };
} 