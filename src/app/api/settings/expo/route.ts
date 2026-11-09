import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getExpoSlides,
  saveExpoSlides,
  getSponsors,
  saveSponsors,
  getExpoScrollInterval,
  saveExpoScrollInterval,
} from "@/lib/expo-settings";

export async function GET() {
  try {
    const [slides, sponsors, scrollInterval] = await Promise.all([
      getExpoSlides(),
      getSponsors(),
      getExpoScrollInterval(),
    ]);
    return NextResponse.json({ slides, sponsors, scrollInterval });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch expo settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { slides, sponsors, scrollInterval } = body;

    let updatedSlides = null;
    let updatedSponsors = null;
    let updatedInterval = null;

    if (slides && Array.isArray(slides)) {
      updatedSlides = await saveExpoSlides(slides);
    }
    if (sponsors && Array.isArray(sponsors)) {
      updatedSponsors = await saveSponsors(sponsors);
    }
    if (scrollInterval && Number(scrollInterval) >= 3) {
      updatedInterval = await saveExpoScrollInterval(Number(scrollInterval));
    }

    revalidatePath("/");
    revalidatePath("/admin/settings/expo");

    return NextResponse.json({
      success: true,
      slides: updatedSlides,
      sponsors: updatedSponsors,
      scrollInterval: updatedInterval,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update expo settings" }, { status: 500 });
  }
}
