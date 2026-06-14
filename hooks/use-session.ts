"use client";

import { useState, useEffect } from "react";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string | null;
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setUser({
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
            });
          }
        } else {
          if (!cancelled) setUser(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSession();
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, isLoading };
}
