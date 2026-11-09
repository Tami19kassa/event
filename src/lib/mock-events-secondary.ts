import { Event } from "@/types/event";

export const secondaryMockEvents: Event[] = [
  {
    id: "3",
    slug: "product-leadership-workshop",
    title: "Product Leadership Intensive",
    shortDescription:
      "A hands-on workshop for product managers and founders who want to level up.",
    description:
      "Two full days of frameworks, case studies, and peer learning focused on product strategy.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
    startDate: "2026-11-22T09:00:00",
    endDate: "2026-11-23T17:00:00",
    timezone: "Africa/Addis_Ababa",
    location: {
      name: "Hyatt Regency Addis",
      city: "Addis Ababa",
      country: "Ethiopia",
    },
    format: "hybrid",
    category: "Business",
    tags: ["Product", "Leadership", "Workshop"],
    organizer: {
      id: "org3",
      name: "ProductCraft",
      verified: true,
    },
    ticketTiers: [
      {
        id: "t1",
        name: "Standard",
        price: 199,
        currency: "ETB",
        quantity: 500,
        remaining: 210,
      },
    ],
    speakers: [],
    capacity: 560,
    attendeesCount: 338,
    status: "published",
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "4",
    slug: "mindful-morning-retreat",
    title: "Mindful Morning Retreat",
    shortDescription:
      "Reset your week with guided meditation, breathwork, and community.",
    description:
      "A gentle 3-hour morning experience designed to help you start the week centered and energized.",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop",
    startDate: "2026-11-12T07:00:00",
    endDate: "2026-11-12T10:00:00",
    timezone: "Africa/Addis_Ababa",
    location: {
      name: "Entoto Natural Park",
      city: "Addis Ababa",
      country: "Ethiopia",
    },
    format: "in-person",
    category: "Wellness",
    tags: ["Meditation", "Wellness", "Outdoor"],
    organizer: {
      id: "org4",
      name: "Still Space",
      verified: true,
    },
    ticketTiers: [
      {
        id: "t1",
        name: "Standard",
        price: 35,
        currency: "ETB",
        quantity: 80,
        remaining: 23,
      },
    ],
    speakers: [],
    capacity: 80,
    attendeesCount: 57,
    status: "published",
    createdAt: "2026-09-10T10:00:00Z",
  },
];
