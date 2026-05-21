import fs from "fs";
import path from "path";

/**
 * Service to load pre-extracted university guidelines markdown cache.
 * 
 * Why: Reading pre-compiled markdown summaries avoids heavy runtime PDF parsing overhead
 * (which takes >5s for large files like POSTECH's 17MB PDF) and fits comfortably inside LLM context window.
 */
export class GuidelineLoaderService {
  private static cache: Record<string, string> = {};

  /**
   * Retrieves the markdown guideline text for a specific university.
   * 
   * Why: Instantaneous local disk read (sub-millisecond) provides the RAG grounding context
   * for LLM streaming completions, preventing timeouts and enhancing chat responsiveness.
   * 
   * @param slug - The normalized slug of the university (e.g., 'snu', 'yonsei', 'postech')
   * @returns The guideline text if cached, or null if no guideline is found.
   */
  static getGuidelines(slug: string): string | null {
    const normalizedSlug = slug.toLowerCase().trim();
    if (this.cache[normalizedSlug]) {
      return this.cache[normalizedSlug];
    }

    // Try multiple possible paths to remain resilient between dev environments
    const pathsToTry = [
      path.join(process.cwd(), "guidelines", "cache", `${normalizedSlug}.md`),
      path.join(process.cwd(), "..", "guidelines", "cache", `${normalizedSlug}.md`),
      path.join("C:/Users/wonse/withusAdmission/guidelines/cache", `${normalizedSlug}.md`)
    ];

    for (const cachePath of pathsToTry) {
      if (fs.existsSync(cachePath)) {
        try {
          const content = fs.readFileSync(cachePath, "utf-8");
          this.cache[normalizedSlug] = content;
          return content;
        } catch (err) {
          // Fallback to next path in loop
          console.error(`[WARN] Failed to read cache at ${cachePath}`, err);
        }
      }
    }

    return null;
  }
}
