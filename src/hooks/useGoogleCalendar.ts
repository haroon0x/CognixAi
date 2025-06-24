import { useState } from 'react';

// IMPORTANT: Set REACT_APP_API_URL in your .env to your backend URL (e.g., http://localhost:8000/api)
// If using a proxy (see vite.config.ts), '/api' will be proxied to the backend.
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || '/api';

export function useGoogleCalendar() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const syncCalendar = async (userId: string = 'testuser') => {
    setLoading(true);
    setError(null);
    setEvents(null);
    try {
      // Warn if API_BASE_URL is not set and not using proxy
      if (!import.meta.env.REACT_APP_API_URL && window.location.port !== '5173') {
        throw new Error('API base URL is not set. Please set REACT_APP_API_URL in your .env.');
      }
      const response = await fetch(`${API_BASE_URL}/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: ['calendar'], user_id: userId })
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid or empty response from server.');
      }
      if (data.success && data.data && data.data.events) {
        setEvents(data.data.events);
      } else {
        setError(data.error || 'Failed to fetch calendar events.');
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return { syncCalendar, loading, events, error };
} 