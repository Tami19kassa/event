import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getExpoSlides, saveExpoSlides, getSponsors, saveSponsors } from "@/lib/expo-settings";

export async function GET() {
  try {
    const [slides, sponsors] = await Promise.all([getExpoSlides(), getSponsors()]);
    return NextResponse.json({ slides, sponsors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch expo settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { slides, sponsors } = body;

    let updatedSlides = null;
    let updatedSponsors = null;

    if (slides && Array.isArray(slides)) {
      updatedSlides = await saveExpoSlides(slides);
    }
    if (sponsors && Array.isArray(sponsors)) {
      updatedSponsors = await saveSponsors(sponsors);
    }

    revalidatePath("/");
    revalidatePath("/admin/settings/expo");

    return NextResponse.json({
      success: true,
      slides: updatedSlides,
      sponsors: updatedSponsors,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update expo settings" }, { status: 500 });
  }
}
