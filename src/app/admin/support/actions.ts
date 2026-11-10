"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

function parseLanguages(raw: string | null | undefined): string[] {
  if (!raw) return ["en"];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createSupportService(formData: FormData) {
  const check = await requireAdmin();
  if (!check.ok) throw new Error("Not authorised");

  const name = formData.get("name")?.toString().trim();
  const service_type = formData.get("service_type")?.toString().trim();
  if (!name || !service_type) {
    throw new Error("Name and service type are required");
  }

  const { data, error } = await check.supabase
    .from("support_resources")
    .insert({
      name,
      service_type,
      description: formData.get("description")?.toString().trim() || null,
      phone: formData.get("phone")?.toString().trim() || null,
      email: formData.get("email")?.toString().trim() || null,
      website: formData.get("website")?.toString().trim() || null,
      address: formData.get("address")?.toString().trim() || null,
      region: formData.get("region")?.toString().trim() || null,
      hours: formData.get("hours")?.toString().trim() || null,
      languages: parseLanguages(formData.get("languages")?.toString()),
      verified: false,
      active: false,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/support");
  revalidatePath("/mental-wellbeing/support");
  redirect(`/admin/support/${data.id}`);
}

export async function updateSupportService(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing service id");

  const check = await requireAdmin();
  if (!check.ok) throw new Error("Not authorised");

  const name = formData.get("name")?.toString().trim();
  const service_type = formData.get("service_type")?.toString().trim();
  if (!name || !service_type) {
    throw new Error("Name and service type are required");
  }

  const { error } = await check.supabase
    .from("support_resources")
    .update({
      name,
      service_type,
      description: formData.get("description")?.toString().trim() || null,
      phone: formData.get("phone")?.toString().trim() || null,
      email: formData.get("email")?.toString().trim() || null,
      website: formData.get("website")?.toString().trim() || null,
      address: formData.get("address")?.toString().trim() || null,
      region: formData.get("region")?.toString().trim() || null,
      hours: formData.get("hours")?.toString().trim() || null,
      languages: parseLanguages(formData.get("languages")?.toString()),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
  revalidatePath("/mental-wellbeing/support");
}

export async function toggleVerify(formData: FormData) {
  const id = formData.get("id")?.toString();
  const next = formData.get("next") === "true";
  if (!id) throw new Error("Missing service id");

  const check = await requireAdmin();
  if (!check.ok) throw new Error("Not authorised");

  const { error } = await check.supabase
    .from("support_resources")
    .update({ verified: next, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
  revalidatePath("/mental-wellbeing/support");
}

export async function toggleActive(formData: FormData) {
  const id = formData.get("id")?.toString();
  const next = formData.get("next") === "true";
  if (!id) throw new Error("Missing service id");

  const check = await requireAdmin();
  if (!check.ok) throw new Error("Not authorised");

  const { error } = await check.supabase
    .from("support_resources")
    .update({ active: next, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
  revalidatePath("/mental-wellbeing/support");
}

export async function deleteSupportService(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing service id");

  const check = await requireAdmin();
  if (!check.ok) throw new Error("Not authorised");

  const { error } = await check.supabase
    .from("support_resources")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/support");
  revalidatePath("/mental-wellbeing/support");
  redirect("/admin/support");
}