/**
 * MessageThread.tsx
 * ------------------------------------------------------------
 * Rôle : fil de discussion patient ↔ médecin (collection "messages").
 * Recevra les nouveaux messages en temps réel via WebSocket
 * (/ws/doctor/{id} ou /ws/patient/{id}).
 * ------------------------------------------------------------
 */
"use client";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function MessageThread({
  messages,
  currentUserId,
  onSend,
  placeholder = "Écrire un message…",
}: {
  messages: Message[];
  currentUserId: string;
  onSend: (text: string) => Promise<void>;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    await onSend(text.trim());
    setText("");
    setSending(false);
  };

  return (
    <div className="card flex flex-col h-[420px]">
      <div className="px-5 py-3 border-b border-slate-100">
        <p className="section-title">Messagerie</p>
        <p className="text-xs text-slate-500">Temps réel via WebSocket</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center pt-10">
            Aucun message pour l'instant.
          </p>
        )}
        {messages.map((m) => {
          const me = m.senderId === currentUserId;
          return (
            <div key={m.id} className={"flex " + (me ? "justify-end" : "justify-start")}>
              <div
                className={
                  "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm " +
                  (me
                    ? "bg-medical-500 text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-sm")
                }
              >
                <p>{m.content}</p>
                <p
                  className={
                    "mt-1 text-[10px] " + (me ? "text-medical-100" : "text-slate-500")
                  }
                >
                  {formatDateTime(m.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="border-t border-slate-100 p-3 flex gap-2">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
        <button type="submit" className="btn-primary" disabled={sending || !text.trim()}>
          <Send className="h-4 w-4" />
          Envoyer
        </button>
      </form>
    </div>
  );
}
