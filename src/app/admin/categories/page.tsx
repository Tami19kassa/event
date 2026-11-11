import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchAdminCategories } from "@/lib/categories-admin";
import { CategoriesWorkspace } from "@/components/admin/categories/CategoriesWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN") {
    redirect(session.role === "ORGANIZER" ? "/admin/dashboard" : "/");
  }

  const initialCategories = await fetchAdminCategories().catch(() => []);

  return <CategoriesWorkspace initialCategories={initialCategories} />;
}
