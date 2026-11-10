import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const UserRole = {
  ATTENDEE: "ATTENDEE",
  ORGANIZER: "ORGANIZER",
  ADMIN: "ADMIN",
} as const;

const EventStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  LIVE: "LIVE",
  ENDED: "ENDED",
  CANCELLED: "CANCELLED",
} as const;

const EventFormat = {
  IN_PERSON: "IN_PERSON",
  ONLINE: "ONLINE",
  HYBRID: "HYBRID",
} as const;

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...\n");

  // ─── Admin User ───────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@eventhub.com" },
    update: {},
    create: {
      email: "admin@eventhub.com",
      name: "Platform Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });
  console.log(`✅ Admin user: ${admin.email} (password: admin123)`);

  // ─── Organizer ────────────────────────────────────────────────
  const organizer = await prisma.user.upsert({
    where: { email: "organizer@eventhub.com" },
    update: {},
    create: {
      email: "organizer@eventhub.com",
      name: "TechForward Inc.",
      passwordHash: await bcrypt.hash("organizer123", 10),
      role: UserRole.ORGANIZER,
    },
  });
  console.log(`✅ Organizer: ${organizer.email}`);

  // ─── Categories ───────────────────────────────────────────────
  const categoriesData = [
    { name: "Technology", slug: "technology", icon: "💻" },
    { name: "Music", slug: "music", icon: "🎵" },
    { name: "Business", slug: "business", icon: "💼" },
    { name: "Wellness", slug: "wellness", icon: "🧘" },
    { name: "Arts", slug: "arts", icon: "🎨" },
    { name: "Food & Drink", slug: "food-drink", icon: "🍷" },
    { name: "Sports", slug: "sports", icon: "⚽" },
    { name: "Education", slug: "education", icon: "📚" },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created.id;
  }
  console.log(`✅ ${categoriesData.length} categories`);

  // ─── Theme Settings ───────────────────────────────────────────
  await prisma.siteSetting.upsert({
    where: { key: "theme" },
    update: {},
    create: {
      key: "theme",
      value: JSON.stringify({
        siteName: "EventHub",
        logoUrl: null,
        primaryColor: "#4F46E5",
        secondaryColor: "#0D9488",
        accentColor: "#F59E0B",
        themeType: "solid",
        gradientFrom: "#4F46E5",
        gradientTo: "#7C3AED",
        gradientDirection: "to-br",
        borderRadius: "xl",
        buttonStyle: "filled",
        heroStyle: "gradient",
      }),
    },
  });
  console.log("✅ Theme settings");

  // ─── Cookie Settings ──────────────────────────────────────────
  await prisma.siteSetting.upsert({
    where: { key: "cookies" },
    update: {},
    create: {
      key: "cookies",
      value: JSON.stringify({
        enabled: true,
        title: "We value your privacy",
        description:
          "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.",
        acceptAllLabel: "Accept All",
        rejectAllLabel: "Reject Non-Essential",
        showAnalytics: true,
        showMarketing: true,
      }),
    },
  });
  console.log("✅ Cookie settings");

  // ─── Sample Events ────────────────────────────────────────────
  const events = [
    {
      slug: "tech-summit-2026",
      title: "Global Tech Summit 2026",
      shortDescription:
        "The premier gathering for innovators, founders, and technologists shaping the future.",
      description: `Join 5,000+ founders, engineers, and investors for three days of cutting-edge talks, workshops, and networking.

Discover the latest in AI, climate tech, web3, and product development. Featuring keynotes from industry leaders, hands-on workshops, and exclusive startup showcases.`,
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
      startDate: new Date("2026-11-18T09:00:00"),
      endDate: new Date("2026-11-20T18:00:00"),
      timezone: "Africa/Addis_Ababa",
      format: EventFormat.HYBRID,
      status: EventStatus.PUBLISHED,
      capacity: 5000,
      attendeesCount: 3842,
      isFeatured: true,
      locationName: "Millennium Hall",
      locationAddress: "Bole Medhanialem",
      locationCity: "Addis Ababa",
      locationCountry: "Ethiopia",
      locationLat: 8.9806,
      locationLng: 38.7578,
      categoryId: categories["technology"],
      organizerId: organizer.id,
      ticketTiers: [
        {
          name: "Early Bird",
          price: 299,
          quantity: 500,
          remaining: 47,
          earlyBird: true,
          description: "Full access + welcome kit",
        },
        {
          name: "Standard",
          price: 449,
          quantity: 2000,
          remaining: 1240,
          description: "Full conference access",
        },
        {
          name: "VIP",
          price: 899,
          quantity: 200,
          remaining: 38,
          description: "VIP lounge, speaker dinner, priority seating",
        },
      ],
      speakers: [
        {
          name: "Dr. Maya Chen",
          title: "Chief AI Scientist",
          company: "Neural Dynamics",
          bio: "Leading researcher in multimodal AI systems with 15+ years experience.",
          imageUrl:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
        },
        {
          name: "James Okonkwo",
          title: "Founder & CEO",
          company: "Horizon Labs",
          bio: "Serial entrepreneur. Previously founded two successful SaaS companies.",
          imageUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        },
      ],
      agendaItems: [
        { time: "09:00", title: "Registration & Welcome Coffee", sortOrder: 0 },
        {
          time: "10:00",
          title: "Opening Keynote: The Next Decade of AI",
          sortOrder: 1,
        },
        {
          time: "11:30",
          title: "Panel: Building Resilient Startups",
          sortOrder: 2,
        },
      ],
    },
    {
      slug: "sunset-jazz-festival",
      title: "Sunset Jazz Festival",
      shortDescription:
        "An unforgettable evening of world-class jazz under the open sky.",
      description:
        "Experience the magic of live jazz as the sun sets over the waterfront. Featuring international artists, local talent, food trucks, and craft cocktails.",
      imageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=600&fit=crop",
      startDate: new Date("2026-11-15T17:00:00"),
      endDate: new Date("2026-11-15T23:00:00"),
      timezone: "Africa/Addis_Ababa",
      format: EventFormat.IN_PERSON,
      status: EventStatus.PUBLISHED,
      capacity: 2200,
      attendeesCount: 1870,
      isFeatured: true,
      locationName: "Friendship Park",
      locationCity: "Addis Ababa",
      locationCountry: "Ethiopia",
      categoryId: categories["music"],
      organizerId: organizer.id,
      ticketTiers: [
        {
          name: "General Admission",
          price: 65,
          quantity: 2000,
          remaining: 312,
        },
        {
          name: "VIP Lounge",
          price: 150,
          quantity: 200,
          remaining: 18,
          description: "Reserved seating + complimentary drinks",
        },
      ],
      speakers: [],
      agendaItems: [],
    },
    {
      slug: "product-leadership-workshop",
      title: "Product Leadership Intensive",
      shortDescription:
        "A hands-on workshop for product managers and founders who want to level up.",
      description:
        "Two full days of frameworks, case studies, and peer learning focused on product strategy, team leadership, and shipping impactful products.",
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
      startDate: new Date("2026-11-22T09:00:00"),
      endDate: new Date("2026-11-23T17:00:00"),
      timezone: "Africa/Addis_Ababa",
      format: EventFormat.HYBRID,
      status: EventStatus.PUBLISHED,
      capacity: 560,
      attendeesCount: 338,
      isFeatured: false,
      locationName: "Ethiopian Skylight Hotel",
      locationCity: "Addis Ababa",
      locationCountry: "Ethiopia",
      categoryId: categories["business"],
      organizerId: organizer.id,
      ticketTiers: [
        {
          name: "Online Access",
          price: 199,
          quantity: 500,
          remaining: 210,
        },
        {
          name: "In-Person",
          price: 499,
          quantity: 60,
          remaining: 12,
        },
      ],
      speakers: [
        {
          name: "Elena Voss",
          title: "VP of Product",
          company: "ScaleAI",
          bio: "Former PM at Google and Stripe. Author of 'Shipping Product'.",
          imageUrl:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
        },
      ],
      agendaItems: [],
    },
    {
      slug: "mindful-morning-retreat",
      title: "Mindful Morning Retreat",
      shortDescription:
        "Reset your week with guided meditation, breathwork, and community.",
      description:
        "A gentle 3-hour morning experience designed to help you start the week centered and energized. Suitable for all levels.",
      imageUrl:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop",
      startDate: new Date("2026-11-12T07:00:00"),
      endDate: new Date("2026-11-12T10:00:00"),
      timezone: "Africa/Addis_Ababa",
      format: EventFormat.IN_PERSON,
      status: EventStatus.PUBLISHED,
      capacity: 80,
      attendeesCount: 57,
      isFeatured: false,
      locationName: "Entoto Natural Park",
      locationCity: "Addis Ababa",
      locationCountry: "Ethiopia",
      categoryId: categories["wellness"],
      organizerId: organizer.id,
      ticketTiers: [
        {
          name: "Standard",
          price: 35,
          quantity: 80,
          remaining: 23,
        },
      ],
      speakers: [],
      agendaItems: [],
    },
    {
      slug: "startup-pitch-night",
      title: "Startup Pitch Night",
      shortDescription:
        "Watch 10 startups pitch to investors. Network with founders and VCs.",
      description:
        "An evening of high-energy pitches, honest feedback, and meaningful connections. Open to founders, investors, and operators.",
      imageUrl:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=600&fit=crop",
      startDate: new Date("2026-11-19T18:30:00"),
      endDate: new Date("2026-11-19T21:30:00"),
      timezone: "Africa/Addis_Ababa",
      format: EventFormat.IN_PERSON,
      status: EventStatus.PUBLISHED,
      capacity: 160,
      attendeesCount: 117,
      isFeatured: true,
      locationName: "Science Museum Addis",
      locationCity: "Addis Ababa",
      locationCountry: "Ethiopia",
      categoryId: categories["business"],
      organizerId: organizer.id,
      ticketTiers: [
        {
          name: "Attendee",
          price: 25,
          quantity: 150,
          remaining: 41,
        },
        {
          name: "Founder + Pitch Slot",
          price: 0,
          quantity: 10,
          remaining: 2,
          description: "Application required",
        },
      ],
      speakers: [],
      agendaItems: [],
    },
    {
      slug: "design-systems-masterclass",
      title: "Design Systems Masterclass",
      shortDescription:
        "Learn how to build and scale design systems that teams actually love.",
      description:
        "A practical deep-dive into tokens, component libraries, documentation, and governance. Includes real-world case studies and templates.",
      imageUrl:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&h=600&fit=crop",
      startDate: new Date("2026-12-03T10:00:00"),
      endDate: new Date("2026-12-03T16:00:00"),
      timezone: "Africa/Addis_Ababa",
      format: EventFormat.ONLINE,
      status: EventStatus.PUBLISHED,
      capacity: 300,
      attendeesCount: 122,
      isFeatured: false,
      locationName: "Online Stream",
      locationCity: "Addis Ababa",
      locationCountry: "Ethiopia",
      categoryId: categories["technology"],
      organizerId: organizer.id,
      ticketTiers: [
        {
          name: "Standard Ticket",
          price: 149,
          quantity: 300,
          remaining: 178,
        },
      ],
      speakers: [],
      agendaItems: [],
    },
  ];

  for (const eventData of events) {
    const { ticketTiers, speakers, agendaItems, ...eventFields } = eventData;

    const event = await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: eventFields,
      create: {
        ...eventFields,
        ticketTiers: {
          create: ticketTiers.map((t, i) => ({
            ...t,
            currency: "ETB",
            sortOrder: i,
          })),
        },
        speakers: {
          create: speakers.map((s, i) => ({
            ...s,
            sortOrder: i,
          })),
        },
        agendaItems: {
          create: agendaItems,
        },
      },
    });
    console.log(`✅ Event: ${event.title}`);
  }

  // ─── Editorial & Media Hub ────────────────────────────────────
  const firstEvent = await prisma.event.findFirst({ where: { slug: "tech-summit-2026" }, select: { id: true } });

  const mediaPostsData = [
    {
      slug: "addis-expo-pavilion-playbook-2026",
      title: "Inside Ethiopia's Flagship Trade Exhibitions: 2026 Floor Playbook",
      excerpt: "How exhibitors, procurement leads, and enterprise sponsors maximize deal flow across Addis Ababa's top convention halls.",
      content:
        "## Designing High-Converting Exhibition Spaces\n\nFlagship regional trade expos bring thousands of verified buyers and technical founders under one roof across **Millennium Hall** and **Skylight Convention Center**.\n\n- Pre-schedule 1-on-1 procurement meetings ahead of opening morning.\n- Pair product demonstrations with QR-ready specification sheets and localized ETB pricing.\n- Capture keynote highlights and booth walkthrough vlogs to extend ROI weeks after doors close.",
      kind: "ARTICLE",
      categoryTag: "Expo Insights",
      coverImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=750&fit=crop",
      isFeatured: true,
      status: "PUBLISHED",
      eventId: firstEvent?.id || null,
    },
    {
      slug: "keynote-preparation-for-summit-speakers",
      title: "Speaker & Panel Spotlight: Building Sessions That Pack the Main Stage",
      excerpt: "Key editorial takeaways from East Africa's enterprise software founders, fintech architects, and industrial manufacturers.",
      content:
        "## What Audiences Remember After the Closing Bell\n\nAcross technology summits and sector forums, sessions backed by concrete case studies and regional metrics consistently outperform generic pitch decks.\n\n- Focus talks on solved production challenges, unit economics, and customer delivery.\n- Share downloadable frameworks alongside video recaps so attendees keep referencing your brand.",
      kind: "ARTICLE",
      categoryTag: "Speaker Spotlight",
      coverImageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=750&fit=crop",
      isFeatured: false,
      status: "PUBLISHED",
      eventId: firstEvent?.id || null,
    },
    {
      slug: "addis-chamber-trade-bulletin",
      title: "Addis Ababa Trade & Commerce Exhibition Calendar Bulletin",
      excerpt: "Official regional trade chamber announcements, exporter directories, and commercial delegation schedules.",
      kind: "EXTERNAL_LINK",
      categoryTag: "Press & Chamber",
      coverImageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=750&fit=crop",
      externalUrl: "https://addischamber.com",
      externalLabel: "Visit Addis Chamber",
      isFeatured: false,
      status: "PUBLISHED",
      eventId: null,
    },
  ];

  for (const post of mediaPostsData) {
    await prisma.mediaPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`✅ ${mediaPostsData.length} editorial media stories`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n─── Login credentials ───");
  console.log("Admin:     admin@eventhub.com / admin123");
  console.log("Organizer: organizer@eventhub.com / organizer123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
