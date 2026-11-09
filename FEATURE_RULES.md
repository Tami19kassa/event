# Engineering Rules & Standards for Feature Updates

This document defines the architectural conventions, file-size limits, security protocols, and operational workflows for developing new features on the **EventHub** platform.

---

## 1. Component Modularity & File Size Limit

### The 200-Line Rule
> [!IMPORTANT]
> **No single component or page file may exceed 200 lines of code.**
> Monolithic files are strictly forbidden. If a component grows near 180 lines, decompose it immediately into single-responsibility subcomponents.

### Directory Organization Standard
Group related subcomponents inside feature-specific directories:

```
src/
├── components/
│   ├── admin/
│   │   ├── events/               # Event form sub-sections (< 150 lines each)
│   │   │   ├── BasicInfoSection.tsx
│   │   │   ├── DateTimeFormatSection.tsx
│   │   │   ├── LocationSection.tsx
│   │   │   └── TicketTiersSection.tsx
│   │   ├── orders/               # Orders table sub-components
│   │   │   ├── OrdersStats.tsx
│   │   │   ├── OrdersFilterBar.tsx
│   │   │   └── OrderRow.tsx
│   │   └── settings/             # Settings cards
│   │       ├── CbeGatewayCard.tsx
│   │       ├── TelebirrGatewayCard.tsx
│   │       ├── GatePaymentCard.tsx
│   │       └── HeroMediaSection.tsx
│   ├── events/
│   │   ├── checkout/             # Checkout modal sub-components
│   │   │   ├── CheckoutModal.tsx
│   │   │   ├── PaymentMethodSelector.tsx
│   │   │   ├── TicketPassCard.tsx
│   │   │   └── CalendarSyncButtons.tsx
│   │   └── detail/               # Event detail sub-sections
│   │       ├── EventHeroBanner.tsx
│   │       └── EventDetailsContent.tsx
│   └── ui/
│       └── ImageUpload.tsx       # Reusable upload widget (< 140 lines)
```

---

## 2. Image & Media Upload Protocol

### Standard Local & Web Upload Widget
When a feature requires image upload (logos, avatars, event covers, banners), **always** use the reusable [`ImageUpload`](file:///c:/Users/enqoq/Desktop/event-platform/src/components/ui/ImageUpload.tsx) component:

```tsx
import { ImageUpload } from "@/components/ui/ImageUpload";

<ImageUpload
  label="Event Cover Image"
  value={form.imageUrl}
  onChange={(url) => update("imageUrl", url)}
  placeholder="https://..."
/>
```

### Upload Backend Guidelines ([`/api/upload`](file:///c:/Users/enqoq/Desktop/event-platform/src/app/api/upload/route.ts))
1. **MIME Whitelist:** Only accept `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `video/mp4`, and `video/webm`.
2. **File Size Limit:** Maximum 25MB per upload.
3. **Storage Path:** Saved under `public/uploads/<timestamp>-<sanitized-name>`.
4. **Access Control:** Restricted to authenticated platform administrators.

---

## 3. Hero Video Background Standards

When displaying video in hero sections:
1. **Required Attributes:** Always set `autoPlay`, `muted`, `loop`, and `playsInline`:
   ```tsx
   <video
     autoPlay
     loop
     muted
     playsInline
     poster={posterUrl}
     className="w-full h-full object-cover opacity-35"
   >
     <source src={videoUrl} type="video/mp4" />
   </video>
   ```
2. **Mandatory Fallback Poster:** Always specify a `poster` image so that users on low-bandwidth or data-saver connections do not see a blank black box.
3. **Legibility Overlay:** Never display white typography directly over dynamic video without a dark contrast overlay (`bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40`).

---

## 4. Ethiopian Localization & Financial Infrastructure

### 4.1 Currency Standard
- **Strictly ETB (Ethiopian Birr):** All ticket pricing, totals, revenue metrics, and invoice items must display in `ETB` (`ETB 300`, `ETB 1,500.00`). Never hardcode `$` in customer-facing views.
- **Default Location:** City default is **Addis Ababa**, Country is **Ethiopia**, Timezone is **Africa/Addis_Ababa** (EAT / UTC+3).

### 4.2 Multi-Tier Payment Verification Flow
Bank scraping servers (`mbreciept.cbe.com.et` and `transactioninfo.ethiotelecom.et`) occasionally experience network latency or 502 Bad Gateway responses.
- **Rule:** Never block a ticket checkout because a third-party bank server is slow.
- **Tier 1:** Live HTTP scraper attempts to read the official receipt HTML.
- **Tier 2:** If the bank server flaps, validate receipt URL syntax and regex patterns.
- **Tier 3:** Mark the order `PENDING_VERIFICATION` and notify the Admin to approve with 1 click in `/admin/orders`.

### 4.3 Pay at Gate (Venue Arrival) Standards
- When attendees choose **"Pay at Gate"**, the order is created with `status: "RESERVED_PAY_AT_GATE"` and `checkedIn: false`.
- Ticket inventory is decremented immediately to prevent overselling.
- Entrance staff mark them paid and checked in with 1 click calling `POST /api/orders/[id]/checkin`.

### 4.4 Calendar Synchronization
Every digital ticket pass must include:
1. **Google Calendar Link:** Generated using `getGoogleCalendarUrl()` from `@/lib/calendar`.
2. **Offline .ICS File Download:** Generated using `downloadIcsFile()` from `@/lib/calendar`.

---

## 5. Security & Role-Based Access Control

1. **Admin Exclusivity:** Only users with `role: "ADMIN"` can create, publish, or edit events, categories, and banking coordinates.
2. **Public Cleanliness:** The public header, discover feed, and event pages must never expose "Host Event" buttons, "Create Event" links, or organizer marketing.
3. **Route Guards:** Public routes attempting to access `/create` must redirect regular visitors to `/discover` and admins to `/admin/events/new`.

---

## 6. Step-by-Step Feature Development Checklist

Before pushing any new feature, follow this verification checklist:

- [ ] **1. Schema Change:** If modifying `prisma/schema.prisma`, run `npx prisma db push` and `npx prisma generate`.
- [ ] **2. API Route:** Implement endpoints in `src/app/api/<feature>/route.ts` with proper session checks.
- [ ] **3. Modular UI:** Keep all files under 200 lines. Extract sub-components into dedicated folders.
- [ ] **4. Build Verification:** Run `npm run build` and ensure exit code `0` with zero TypeScript or lint errors.
- [ ] **5. Dev Server Test:** Verify on `http://localhost:3000/` without runtime exceptions.
