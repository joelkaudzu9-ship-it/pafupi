"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "@/lib/toast";

const MESSAGES: Record<string, { title: string; description?: string }> = {
  notfound: {
    title: "Not found",
    description: "We couldn't find that item. It may have been deleted.",
  },
  saved: {
    title: "Saved",
  },
  deleted: {
    title: "Deleted",
  },
  error: {
    title: "Something went wrong",
    description: "Please try again.",
  },
  saved_responses_failed: {
    title: "Result saved, responses not stored",
    description:
      "Your score was saved, but individual responses could not be recorded.",
  },
};

export function useToastFlash() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const flash = params.get("flash");
    if (!flash) return;

    const meta = MESSAGES[flash];
    if (meta) {
      const isError =
        flash === "notfound" ||
        flash === "error" ||
        flash === "saved_responses_failed";
      toast({
        variant: isError ? "error" : "success",
        title: meta.title,
        description: meta.description,
      });
    }

    const next = new URLSearchParams(params.toString());
    next.delete("flash");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [params, pathname, router]);
}