import { Event } from "@/types/event";

export const primaryMockEvents: Event[] = [
  {
    id: "1",
    slug: "tech-summit-2026",
    title: "Global Tech Summit 2026",
    shortDescription:
      "The premier gathering for innovators, founders, and technologists shaping the future.",
    description: `Join 5,000+ founders, engineers, and investors for three days of cutting-edge talks, workshops, and networking.`,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
    startDate: "2026-11-18T09:00:00",
    endDate: "2026-11-20T18:00:00",
    timezone: "Africa/Addis_Ababa",
    location: {
      name: "Millennium Hall",
      address: "Bole Medhanialem",
      city: "Addis Ababa",
      country: "Ethiopia",
      lat: 8.9806,
      lng: 38.7578,
    },
    format: "hybrid",
    category: "Technology",
    tags: ["AI", "Startups", "Networking", "Innovation"],
    organizer: {
      id: "org1",
      name: "TechForward Inc.",
      verified: true,
    },
    ticketTiers: [
      {
        id: "t1",
        name: "Early Bird",
        price: 299,
        currency: "ETB",
        quantity: 500,
        remaining: 47,
        earlyBird: true,
        description: "Full access + welcome kit",
      },
      {
        id: "t2",
        name: "Standard",
        price: 449,
        currency: "ETB",
        quantity: 2000,
        remaining: 1240,
        description: "Full conference access",
      },
    ],
    speakers: [
      {
        id: "s1",
        name: "Dr. Maya Chen",
        title: "Chief AI Scientist",
        company: "Neural Dynamics",
        bio: "Leading researcher in multimodal AI systems.",
        imageUrl:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      },
    ],
    agenda: [
      { time: "09:00", title: "Registration & Welcome Coffee" },
      { time: "10:00", title: "Opening Keynote: The Next Decade of AI" },
    ],
    capacity: 5000,
    attendeesCount: 3842,
    isFeatured: true,
    status: "published",
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "2",
    slug: "sunset-jazz-festival",
    title: "Sunset Jazz Festival",
    shortDescription:
      "An unforgettable evening of world-class jazz under the open sky.",
    description:
      "Experience the magic of live jazz as the sun sets over the park. Featuring international artists and local talent.",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=600&fit=crop",
    startDate: "2026-11-15T17:00:00",
    endDate: "2026-11-15T23:00:00",
    timezone: "Africa/Addis_Ababa",
    location: {
      name: "Friendship Park",
      city: "Addis Ababa",
      country: "Ethiopia",
    },
    format: "in-person",
    category: "Music",
    tags: ["Jazz", "Outdoor", "Live Music"],
    organizer: {
      id: "org2",
      name: "Bay Area Arts Collective",
      verified: true,
    },
    ticketTiers: [
      {
        id: "t1",
        name: "General Admission",
        price: 65,
        currency: "ETB",
        quantity: 2000,
        remaining: 312,
      },
    ],
    speakers: [],
    capacity: 2200,
    attendeesCount: 1870,
    isFeatured: true,
    status: "published",
    createdAt: "2026-07-15T10:00:00Z",
  },
];
