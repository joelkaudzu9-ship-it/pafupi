"use client";

import { useEffect, useState } from "react";
import { subscribe, dismissToast, type Toast } from "@/lib/toast";
import "./toaster.css";

const ICONS: Record<Toast["variant"], string> = {
  success: "✓",
  error: "!",
  info: "i",
  warning: "▲",
};

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => subscribe(setToasts), []);

  if (toasts.length === 0) return null;

  return (
    <div className="toaster" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.variant}`}
          role="status"
          aria-live="polite"
        >
          <div className="toast-icon">{ICONS[t.variant]}</div>
          <div className="toast-content">
            <div className="toast-title">{t.title}</div>
            {t.description && (
              <div className="toast-description">{t.description}</div>
            )}
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}