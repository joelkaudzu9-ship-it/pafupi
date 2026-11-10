"use client";

import { Suspense } from "react";
import { useToastFlash } from "@/lib/toast-flash";

function Inner() {
  useToastFlash();
  return null;
}

export default function ToastFlash() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}