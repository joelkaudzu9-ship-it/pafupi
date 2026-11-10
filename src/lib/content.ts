export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ArticleContent = {
  introduction: string;
  sections: ArticleSection[];
  closing_note?: string;
  reviewed_by_clinician?: boolean;
};

export type WellbeingArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  language: string;
  content: ArticleContent;
};

export function isArticleContent(value: unknown): value is ArticleContent {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.introduction === "string" &&
    Array.isArray(candidate.sections) &&
    candidate.sections.every((section) => {
      if (!section || typeof section !== "object") return false;
      const item = section as Record<string, unknown>;
      return (
        typeof item.heading === "string" &&
        Array.isArray(item.paragraphs) &&
        item.paragraphs.every((paragraph) => typeof paragraph === "string")
      );
    })
  );
}
