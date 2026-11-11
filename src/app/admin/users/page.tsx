import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchAdminUsersSnapshot } from "@/lib/users-admin";
import { UsersWorkspace } from "@/components/admin/users/UsersWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const snapshot = await fetchAdminUsersSnapshot();

  return (
    <UsersWorkspace
      initialUsers={snapshot.users}
      initialSummary={snapshot.summary}
      currentAdminId={session.id}
    />
  );
}
