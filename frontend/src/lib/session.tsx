/**
 * session.tsx
 * ------------------------------------------------------------
 * Rôle : gestion ultra-simple de la session côté client (mock).
 * Stocke role + userId dans localStorage afin que les pages
 * dashboard puissent se rendre sans backend.
 * ------------------------------------------------------------
 */
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "patient" | "doctor";
type Session = { role: Role; userId: string } | null;

const Ctx = createContext<{
  session: Session;
  setSession: (s: Session) => void;
  ready: boolean;
}>({ session: null, setSession: () => {}, ready: false });

const KEY = "medisuiv.session";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSessionState(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const setSession = (s: Session) => {
    setSessionState(s);
    if (typeof window !== "undefined") {
      if (s) localStorage.setItem(KEY, JSON.stringify(s));
      else localStorage.removeItem(KEY);
    }
  };

  return <Ctx.Provider value={{ session, setSession, ready }}>{children}</Ctx.Provider>;
}

export function useSession() {
  return useContext(Ctx);
}
