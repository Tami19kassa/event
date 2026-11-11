import { prisma, withDbRetry } from "@/lib/prisma";
import { resolveCategoryIconKey } from "@/components/ui/CategoryIcon";

export interface AdminCategoryRow {
  id: string;
  name: string;
  slug: string;
  icon: string;
  liveCount: number;
  totalCount: number;
  draftCount: number;
}

export function slugifyCategoryName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function fetchAdminCategories(): Promise<AdminCategoryRow[]> {
  const [rows, liveGroups] = await Promise.all([
    withDbRetry(() =>
      prisma.category.findMany({
        include: {
          _count: { select: { events: true } },
        },
        orderBy: { name: "asc" },
      })
    ),
    withDbRetry(() =>
      prisma.event.groupBy({
        by: ["categoryId"],
        where: {
          categoryId: { not: null },
          status: { in: ["PUBLISHED", "LIVE"] },
        },
        _count: { _all: true },
      })
    ),
  ]);

  const liveMap = new Map<string, number>();
  for (const grp of liveGroups) {
    if (grp.categoryId) liveMap.set(grp.categoryId, grp._count._all);
  }

  return rows.map((cat) => {
    const totalCount = cat._count?.events || 0;
    const liveCount = liveMap.get(cat.id) || 0;
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: resolveCategoryIconKey(cat.icon),
      liveCount,
      totalCount,
      draftCount: Math.max(0, totalCount - liveCount),
    };
  });
}
