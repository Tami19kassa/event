import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function CreatePage() {
  const session = await getSession();

  // If logged in as admin or organizer, send directly to the Event Studio
  if (session && (session.role === "ADMIN" || session.role === "ORGANIZER")) {
    redirect("/admin/events/new");
  }

  // If not logged in as admin/organizer, guide to login with redirect back to studio
  redirect("/admin/login?redirect=/admin/events/new");
}
