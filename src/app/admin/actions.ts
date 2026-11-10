"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

export async function toggleArticlePublished(formData: FormData) {
  const id = formData.get("id")?.toString();
  const next = formData.get("next") === "true";
  if (!id) throw new Error("Missing article id");

  const check = await requireAdmin();
  if (!check.ok) throw new Error("Not authorised");

  const { error } = await check.supabase
    .from("articles")
    .update({ published: next })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  revalidatePath("/mental-wellbeing");
}

export async function updateArticle(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing article id");

  const check = await requireAdmin();
  if (!check.ok) throw new Error("Not authorised");

  const title = formData.get("title")?.toString().trim();
  const summary = formData.get("summary")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const bodyJson = formData.get("body")?.toString() ?? "{}";

  if (!title || !slug || !category) {
    throw new Error("Title, slug, and category are required");
  }

  // Validate body is parseable JSON before saving
  let parsed;
  try {
    parsed = JSON.parse(bodyJson);
  } catch {
    throw new Error("Body is not valid JSON");
  }

  const { error } = await check.supabase
    .from("articles")
    .update({
      title,
      summary,
      category,
      slug,
      content: parsed,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
  revalidatePath("/mental-wellbeing");
  revalidatePath(`/mental-wellbeing/${slug}`);
}

export async function createArticle(formData: FormData) {
  const check = await requireAdmin();
  if (!check.ok) throw new Error("Not authorised");

  const title = formData.get("title")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const category = formData.get("category")?.toString().trim() || "MOOD";

  if (!title || !slug) throw new Error("Title and slug are required");

  const { data, error } = await check.supabase
    .from("articles")
    .insert({
      slug,
      title,
      summary: "",
      category,
      language: "en",
      published: false,
      content: { intro: "", sections: [] },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${data.id}`);
}