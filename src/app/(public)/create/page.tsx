import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function CreatePage() {
  const session = await getSession();

  // If logged in as admin, send directly to the Admin Event Studio
  if (session && session.role === "ADMIN") {
    redirect("/admin/events/new");
  }

  // Otherwise, only admins can create events
  redirect("/discover");
}
