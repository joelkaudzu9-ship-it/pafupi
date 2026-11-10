"use client";

export type ToastVariant = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  listener([...toasts]);
  return () => {
    listeners.delete(listener);
  };
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function toast(input: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const entry: Toast = { id, duration: 4500, ...input };
  toasts = [...toasts, entry];
  notify();

  if (entry.duration && entry.duration > 0) {
    setTimeout(() => dismissToast(id), entry.duration);
  }

  return id;
}