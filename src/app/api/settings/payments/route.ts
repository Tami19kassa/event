import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPaymentSettings, savePaymentSettings } from "@/lib/payment-verification";
import { getSession } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";

export async function GET() {
  const settings = await getPaymentSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid payment settings payload." }, { status: 400 });
    }

    const requiredFields: Array<[keyof typeof body, string]> = [
      ["cbeAccount", "CBE Account Number"],
      ["cbeAccountName", "CBE Account Holder Name"],
      ["telebirrNumber", "Telebirr Number"],
      ["telebirrAccountName", "Telebirr Registered Name"],
    ];
    for (const [key, label] of requiredFields) {
      if (key in body && (typeof body[key] !== "string" || !body[key].trim())) {
        return NextResponse.json({ error: `${label} cannot be empty.` }, { status: 400 });
      }
    }
    if ("currency" in body) {
      const code = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : "";
      if (!/^[A-Z]{3,5}$/.test(code)) {
        return NextResponse.json(
          { error: "Currency code must be 3 to 5 uppercase letters (e.g. ETB, USD)." },
          { status: 400 }
        );
      }
    }
    if ("promoDiscountPercent" in body && body.promoDiscountPercent !== "" && body.promoDiscountPercent !== null) {
      const num = Number(body.promoDiscountPercent);
      if (Number.isNaN(num) || num < 0 || num > 100) {
        return NextResponse.json(
          { error: "Promotional discount must be a percentage between 0 and 100." },
          { status: 400 }
        );
      }
    }

    const updated = await savePaymentSettings(body);
    revalidateCacheTags(CACHE_TAGS.payments);
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings/payments");
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Save payment settings error:", err);
    return NextResponse.json({ error: "Failed to update payment settings" }, { status: 500 });
  }
}
