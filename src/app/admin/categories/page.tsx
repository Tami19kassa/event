import { fetchAdminCategories } from "@/lib/categories-admin";
import { CategoriesWorkspace } from "@/components/admin/categories/CategoriesWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const initialCategories = await fetchAdminCategories().catch(() => []);

  return <CategoriesWorkspace initialCategories={initialCategories} />;
}
