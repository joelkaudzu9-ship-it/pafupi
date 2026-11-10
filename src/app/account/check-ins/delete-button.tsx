"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";

export function DeleteCheckInButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("mood_checkins")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "error",
        title: "Couldn't delete",
        description: error.message,
      });
      setDeleting(false);
      setConfirming(false);
      return;
    }

    toast({
      variant: "success",
      title: "Check-in deleted",
    });
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        type="button"
        className="checkins-delete"
        onClick={() => setConfirming(true)}
        aria-label="Delete this check-in"
        title="Delete"
      >
        ×
      </button>
    );
  }

  return (
    <div className="checkins-delete-confirm">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="checkins-delete-yes"
      >
        {deleting ? "…" : "Delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={deleting}
        className="checkins-delete-no"
      >
        Cancel
      </button>
    </div>
  );
}