"use client";

import { useEffect, useState } from "react";

const KEY_PREFIX = "antoniomanno-it-home";
const SESSION_KEY = "antoniomanno_home_visit";
const API_BASE = "https://countapi.mileshilliard.com/api/v1";

function todayKey() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${KEY_PREFIX}-${d.getFullYear()}-${month}-${day}`;
}

function formatCount(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Home-only visit counter: today + total, one increment per browser session, free public API. */
export function VisitCounter() {
  const [text, setText] = useState("Oggi: … · Totali: …");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY);
    const action = alreadyCounted ? "get" : "hit";

    const fetchCount = (key: string) =>
      fetch(`${API_BASE}/${action}/${key}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error || typeof data.value !== "number") {
            throw new Error("Risposta contatore non valida");
          }
          return data.value as number;
        });

    Promise.all([fetchCount(`${KEY_PREFIX}-total`), fetchCount(todayKey())])
      .then(([total, today]) => {
        setText(`Oggi: ${formatCount(today)} · Totali: ${formatCount(total)}`);
        if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, "1");
      })
      .catch(() => setHidden(true));
  }, []);

  if (hidden) return null;
  return (
    <p className="mb-2 text-xs text-white/55" aria-live="polite">
      {text}
    </p>
  );
}
