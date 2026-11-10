import { HeroSlide, SponsorItem } from "./expo-types";

export const defaultExpoSlides: HeroSlide[] = [
  {
    id: "slide-privexpo-2026",
    title: "PRIVEXPO 2026 B2B Trade & FMCG Expo",
    titleHighlight: "B2B Trade",
    subtitle:
      "Connecting regional manufacturers and contract producers with 750+ verified retail chain buyers, e-commerce distributors, and FMCG importers.",
    detailedDescription: `PRIVEXPO 2026 is the Horn of Africa's premier B2B contract manufacturing, private label, and retail matchmaking trade show.

Held at the iconic Millennium Hall in Addis Ababa, this 3-day exhibition gathers over 750 verified commercial procurement directors from regional supermarket chains, pharmaceutical distributors, hotel procurement networks, and e-commerce platforms across East Africa.

Key Highlights:
• 1-on-1 Pre-Scheduled Buyer-Seller Matchmaking Sessions
• Dedicated Private Label & Contract Manufacturing Pavilion
• Official Delegations from Kenya, Uganda, Rwanda, and the Middle East
• Live FMCG Product Showcases and Sustainable Packaging Forums`,
    badgeText: "B2B Trade Meeting & Matchmaking",
    category: "Trade Show",
    datesText: "Nov 4–5, 2026",
    venueText: "Millennium Hall, Addis Ababa",
    mediaType: "image",
    posterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600",
    visitorCtaText: "Get Trade Buyer Pass",
    visitorCtaLink: "/discover?category=business",
    exhibitorCtaText: "Book Exhibition Booth",
    exhibitorCtaLink: "#exhibit",
    isActive: true,
  },
  {
    id: "slide-tech-summit-2026",
    title: "Addis AI & Cloud Innovation Expo 2026",
    titleHighlight: "Innovation Expo",
    subtitle:
      "East Africa's flagship technology exhibition gathering 350+ software enterprise exhibitors, tech founders, and digital leaders.",
    detailedDescription: `Addis AI & Cloud Innovation Expo 2026 is East Africa's flagship technology exhibition gathering 350+ software enterprise exhibitors, tech founders, and digital leaders.

Taking place across the state-of-the-art halls of Skylight Convention Center, the summit convenes enterprise tech builders, fintech innovators, cloud infrastructure architects, and sovereign AI researchers.

Key Highlights:
• Enterprise Cloud Infrastructure & Migration Stages
• Sovereign African AI and Multilingual LLM Summits
• Startup Alley: 100+ Early-Stage Founders Pitching to Global Venture Funds
• Developer Hackathons and Hands-on API Workshops`,
    badgeText: "Enterprise Technology Summit",
    category: "Technology",
    datesText: "Dec 10–12, 2026",
    venueText: "Skylight Convention Center",
    mediaType: "image",
    posterUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600",
    visitorCtaText: "Explore Keynotes & Passes",
    visitorCtaLink: "/discover?category=technology",
    exhibitorCtaText: "Reserve Startup Stand",
    exhibitorCtaLink: "#exhibit",
    isActive: true,
  },
  {
    id: "slide-agro-food-2027",
    title: "Ethiopia Agro-Manufacturing & Packaging Expo",
    titleHighlight: "Manufacturing",
    subtitle:
      "The premier B2B sourcing platform for agricultural processing machinery, packaging materials, and international food exports.",
    detailedDescription: `The premier B2B sourcing platform for agricultural processing machinery, packaging materials, and international food exports.

Hosted at Friendship Expo Center in Addis Ababa, this exhibition unites international machinery manufacturers from Germany, Turkey, China, and Italy with commercial farm owners, coffee exporters, and beverage processors.

Key Highlights:
• Live Industrial Food Processing Machinery Demonstrations
• Cold Chain Logistics & Export Compliance Workshops
• Eco-Friendly Packaging and Biodegradable Solutions Pavilion
• Direct Bilateral Export Trade Matching Desk`,
    badgeText: "International Industry Expo",
    category: "Manufacturing",
    datesText: "Jan 18–20, 2027",
    venueText: "Friendship Expo Center, Addis Ababa",
    mediaType: "image",
    posterUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600",
    visitorCtaText: "Register as Buyer",
    visitorCtaLink: "/discover",
    exhibitorCtaText: "Apply for Shell Scheme",
    exhibitorCtaLink: "#exhibit",
    isActive: true,
  },
];

export const defaultSponsors: SponsorItem[] = [
  {
    id: "sp-ethio-telecom",
    name: "Ethio Telecom",
    logoText: "Ethio Telecom",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ethio_telecom_logo.png/640px-Ethio_telecom_logo.png",
    tier: "STRATEGIC",
    websiteUrl: "https://www.ethiotelecom.et",
  },
  {
    id: "sp-cbe",
    name: "Commercial Bank of Ethiopia",
    logoText: "Commercial Bank of Ethiopia",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Commercial_Bank_of_Ethiopia_logo.png/640px-Commercial_Bank_of_Ethiopia_logo.png",
    tier: "STRATEGIC",
    websiteUrl: "https://www.combanketh.et",
  },
  {
    id: "sp-ethiopian-airlines",
    name: "Ethiopian Airlines",
    logoText: "Ethiopian Airlines",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Ethiopian_Airlines_Logo.svg/640px-Ethiopian_Airlines_Logo.svg.png",
    tier: "PLATINUM",
    websiteUrl: "https://www.ethiopianairlines.com",
  },
  {
    id: "sp-chamber",
    name: "Addis Ababa Chamber of Commerce",
    logoText: "Addis Chamber",
    tier: "PLATINUM",
    websiteUrl: "https://addischamber.com",
  },
  {
    id: "sp-tradeshow-intel",
    name: "TradeShow Intelligence",
    logoText: "TradeShow Intel",
    tier: "MEDIA",
    websiteUrl: "https://tradeshowintel.com",
  },
  {
    id: "sp-eurasia-b2b",
    name: "Eurasia Trade Network",
    logoText: "Eurasia B2B",
    tier: "MEDIA",
    websiteUrl: "https://privexpo.com",
  },
];
