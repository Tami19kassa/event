import { revalidateTag } from "next/cache";

export function revalidateCacheTags(...tags: string[]): void {
  for (const tag of tags) {
    try {
      revalidateTag(tag);
    } catch {
      // Ignore outside request context
    }
  }
}
