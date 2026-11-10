"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { user, supabase };
}

export async function createGoal(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const targetDate = formData.get("target_date")?.toString() || null;

  if (!title) throw new Error("Title is required");

  const { user, supabase } = await requireUser();

  const { error } = await supabase.from("recovery_goals").insert({
    user_id: user.id,
    title,
    description,
    target_date: targetDate,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/account/recovery");
  revalidatePath("/account");
}

export async function toggleGoal(formData: FormData) {
  const id = formData.get("id")?.toString();
  const completed = formData.get("completed") === "true";

  if (!id) throw new Error("Missing goal id");

  const { user, supabase } = await requireUser();

  const { error } = await supabase
    .from("recovery_goals")
    .update({ completed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/account/recovery");
  revalidatePath("/account");
}

export async function deleteGoal(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing goal id");

  const { user, supabase } = await requireUser();

  const { error } = await supabase
    .from("recovery_goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/account/recovery");
  revalidatePath("/account");
}