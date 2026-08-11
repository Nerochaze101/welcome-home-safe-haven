// Client-safe head builders shared by content routes.
import type { CodeStepContent, PageContentMap } from "./cms-defaults";

function seoMeta(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  };
}

export function buildCodeStepHead(c: CodeStepContent | undefined) {
  return seoMeta(c?.seoTitle ?? "Nero", c?.seoDescription ?? "Nero secure sign in.");
}

export function buildSimpleHead<
  K extends keyof PageContentMap,
  T extends { seoTitle: string; seoDescription: string },
>(c: T | undefined, fallbackTitle: string, fallbackDescription: string, _k?: K) {
  return seoMeta(c?.seoTitle ?? fallbackTitle, c?.seoDescription ?? fallbackDescription);
}