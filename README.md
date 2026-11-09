# EventHub — Modern Event Organization Platform

A professional event discovery, ticketing, and management platform with a full **Admin CMS**.

## Features

### Public Site
- Homepage with hero, categories, featured events
- Discover page (search, filters, sorting)
- Rich event detail pages + interactive ticket selector
- Multi-step Create Event wizard
- Cookie consent banner

### Admin Panel (`/admin`)
- **Dashboard** — Key metrics & quick actions
- **Events** — Full event list with status, tickets sold, revenue
- **Orders** — (placeholder ready for expansion)
- **Users** — (placeholder ready for expansion)
- **Branding & Theme** — Full visual customization:
  - Site name & logo upload
  - Primary / Secondary / Accent colors
  - Theme type: **Solid** or **Gradient** (with direction)
  - Border radius, button style, hero style
  - Live preview panel
- **Cookie Settings** — Configure consent banner text, categories (Essential / Analytics / Marketing)

### Technical
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Prisma schema ready (SQLite by default)
- Site settings stored in database (`SiteSetting` model)
- Design tokens ready for dynamic theming via CSS variables

## Getting Started

```bash
cd event-platform
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Then open:
- Public site → http://localhost:3000
- Admin panel → http://localhost:3000/admin

## Theme Customization (CMS)

Admins can change from `/admin/settings`:

| Setting            | Options                          |
|--------------------|----------------------------------|
| Primary color      | Color picker                     |
| Theme type         | Solid / Gradient                 |
| Gradient colors    | From + To + Direction            |
| Border radius      | none / sm / md / lg / xl         |
| Button style       | filled / soft / outline          |
| Hero style         | gradient / solid / image         |
| Logo               | Upload                           |

## Next Recommended Steps

1. Connect Branding page to real API + apply CSS variables site-wide
2. Full Event CRUD inside admin
3. Authentication (protect `/admin`)
4. Stripe payments
5. Real orders & user management
