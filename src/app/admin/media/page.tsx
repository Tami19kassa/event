import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchAdminMediaSnapshot } from "@/lib/media-posts";
import { MediaWorkspace } from "@/components/admin/media/MediaWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/");
  }

  const snapshot = await fetchAdminMediaSnapshot();

  return (
    <MediaWorkspace
      initialPosts={snapshot.posts}
      initialEvents={snapshot.events}
      initialSummary={snapshot.summary}
    />
  );
}
