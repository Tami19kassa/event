export type CookieSettings = {
  enabled: boolean;
  title: string;
  description: string;
  acceptAllLabel: string;
  rejectAllLabel: string;
  customizeLabel: string;
  privacyPolicyUrl: string;
  showAnalytics: boolean;
  showMarketing: boolean;
};

export const defaultCookieSettings: CookieSettings = {
  enabled: true,
  title: "We value your privacy",
  description:
    "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies.",
  acceptAllLabel: "Accept All",
  rejectAllLabel: "Reject Non-Essential",
  customizeLabel: "Customize",
  privacyPolicyUrl: "/privacy",
  showAnalytics: true,
  showMarketing: true,
};
