import {
  Inter,
  Plus_Jakarta_Sans,
  DM_Sans,
  Outfit,
  Space_Grotesk,
  Playfair_Display,
  Noto_Sans_Ethiopic,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-ui-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-ui-jakarta" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-ui-dm" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-ui-outfit" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-ui-space" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-ui-playfair" });
const ethiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui-ethiopic",
});

export const FONT_VARIABLE_CLASSES = [
  inter.variable,
  jakarta.variable,
  dmSans.variable,
  outfit.variable,
  space.variable,
  playfair.variable,
  ethiopic.variable,
].join(" ");
