export const SITE = {
  name: "Expedition Reading",
  tagline: "Every child deserves a chance to learn.",
  description:
    "A 501(c)(3) nonprofit placing books in the hands of children from birth onward.",
  url: "https://expeditionreading.org",
  contactEmail: "contact@expeditionreading.org",
  socials: {
    instagram: "https://www.instagram.com/expeditionreading",
    facebook: "https://www.facebook.com/expeditionreading",
  },
  nav: [
    { href: "/about", label: "About" },
    { href: "/what-we-do", label: "What We Do" },
    { href: "/partners", label: "Partners" },
    { href: "/get-involved", label: "Get Involved" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export type SiteConfig = typeof SITE;
