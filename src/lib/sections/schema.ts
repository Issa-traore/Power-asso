import { z } from "zod";

// Every section on a tenant's public homepage is one of these types.
// `content` in the DB is untyped Json — these schemas are the single source of
// truth for what's inside it, used both to validate editor form submissions
// and to type the renderer components.

const cta = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const statItem = z.object({
  icon: z.string().default("globe"),
  value: z.string().min(1),
  label: z.string().min(1),
});

const featureItem = z.object({
  icon: z.string().default("globe"),
  title: z.string().min(1),
  description: z.string().default(""),
});

const linkItem = z.object({
  icon: z.string().default("globe"),
  label: z.string().min(1),
  href: z.string().min(1),
});

export const heroSchema = z.object({
  eyebrow: z.string().default(""),
  titleLine1: z.string().min(1),
  titleLine2: z.string().default(""),
  titleHighlight: z.string().default(""),
  description: z.string().default(""),
  primaryCta: cta,
  secondaryCta: cta.optional(),
  backgroundImageUrl: z.string().default(""),
});

export const statsSchema = z.object({
  items: z.array(statItem).default([]),
});

export const featuresSchema = z.object({
  heading: z.string().default(""),
  items: z.array(featureItem).default([]),
});

export const networkMapSchema = z.object({
  heading: z.string().default(""),
  mapImageUrl: z.string().default(""),
  stats: z.array(statItem).default([]),
  sideHeading: z.string().default(""),
  sideText: z.string().default(""),
  primaryCta: cta.optional(),
  links: z.array(linkItem).default([]),
});

const article = z.object({
  tag: z.string().default("Article"),
  imageUrl: z.string().default(""),
  date: z.string().default(""),
  title: z.string().min(1),
  excerpt: z.string().default(""),
  href: z.string().default("#"),
});

export const newsNewsletterSchema = z.object({
  heading: z.string().default(""),
  articles: z.array(article).default([]),
  newsletterBadge: z.string().default("Newsletter"),
  newsletterHeading: z.string().default(""),
  newsletterText: z.string().default(""),
  newsletterButtonLabel: z.string().default("Je m'inscris"),
  quoteImageUrl: z.string().default(""),
  quoteText: z.string().default(""),
});

const communityColumn = z.object({
  heading: z.string().default(""),
  imageUrl: z.string().default(""),
  items: z.array(
    z.object({
      icon: z.string().default("globe"),
      title: z.string().min(1),
      description: z.string().default(""),
      href: z.string().default("#"),
    }),
  ).default([]),
  cta: cta.optional(),
});

export const communityGridSchema = z.object({
  heading: z.string().default(""),
  left: communityColumn,
  right: communityColumn,
});

export const testimonialSchema = z.object({
  imageUrl: z.string().default(""),
  quote: z.string().min(1),
  author: z.string().default(""),
});

export const ctaFooterSchema = z.object({
  heading: z.string().min(1),
  text: z.string().default(""),
  primaryCta: cta,
  secondaryCta: cta.optional(),
  backgroundImageUrl: z.string().default(""),
});

export const customHtmlSchema = z.object({
  html: z.string().default(""),
});

export const SECTION_SCHEMAS = {
  HERO: heroSchema,
  STATS: statsSchema,
  FEATURES: featuresSchema,
  NETWORK_MAP: networkMapSchema,
  NEWS_NEWSLETTER: newsNewsletterSchema,
  COMMUNITY_GRID: communityGridSchema,
  TESTIMONIAL: testimonialSchema,
  CTA_FOOTER: ctaFooterSchema,
  CUSTOM_HTML: customHtmlSchema,
} as const;

export type SectionTypeKey = keyof typeof SECTION_SCHEMAS;

export type SectionContent<T extends SectionTypeKey> = z.infer<(typeof SECTION_SCHEMAS)[T]>;

export const SECTION_LABELS: Record<SectionTypeKey, string> = {
  HERO: "Bannière d'accueil (Hero)",
  STATS: "Bandeau de statistiques",
  FEATURES: "Grille de fonctionnalités",
  NETWORK_MAP: "Réseau / carte",
  NEWS_NEWSLETTER: "Actualités & newsletter",
  COMMUNITY_GRID: "Communauté (double colonne)",
  TESTIMONIAL: "Témoignage",
  CTA_FOOTER: "Bandeau d'appel à l'action",
  CUSTOM_HTML: "Bloc HTML personnalisé",
};

export function parseSectionContent<T extends SectionTypeKey>(type: T, content: unknown): SectionContent<T> {
  const schema = SECTION_SCHEMAS[type];
  return schema.parse(content ?? {}) as SectionContent<T>;
}

export function defaultSectionContent(type: SectionTypeKey): unknown {
  switch (type) {
    case "HERO":
      return heroSchema.parse({
        titleLine1: "Votre titre principal",
        titleLine2: "vient ici",
        description: "Décrivez en une phrase la mission de votre association.",
        primaryCta: { label: "Rejoindre", href: "/adherer" },
        secondaryCta: { label: "Découvrir", href: "#about" },
      });
    case "STATS":
      return statsSchema.parse({
        items: [
          { icon: "globe", value: "0", label: "Pays" },
          { icon: "users", value: "0", label: "Membres" },
        ],
      });
    case "FEATURES":
      return featuresSchema.parse({
        heading: "Une communauté, un métier, un avenir",
        items: [
          { icon: "users", title: "Réseau", description: "Connectez-vous avec des membres." },
          { icon: "book", title: "Formation", description: "Développez vos compétences." },
        ],
      });
    case "NETWORK_MAP":
      return networkMapSchema.parse({
        heading: "Notre réseau en chiffres",
        sideHeading: "Découvrez notre réseau",
        sideText: "Trouvez un membre près de chez vous.",
        stats: [{ icon: "globe", value: "0", label: "Pays représentés" }],
        links: [{ icon: "users2", label: "Annuaire des membres", href: "#" }],
      });
    case "NEWS_NEWSLETTER":
      return newsNewsletterSchema.parse({
        heading: "Actualités & événements",
        newsletterHeading: "Recevez nos nouvelles",
        newsletterText: "Abonnez-vous à notre newsletter.",
        quoteText: "Ensemble, nous allons plus loin.",
      });
    case "COMMUNITY_GRID":
      return communityGridSchema.parse({
        heading: "Ensemble, nous pouvons aller plus loin",
        left: { heading: "Apprendre. Transmettre. Progresser.", items: [] },
        right: { heading: "Ensemble, nous pouvons aller plus loin", items: [] },
      });
    case "TESTIMONIAL":
      return testimonialSchema.parse({ quote: "Ensemble, nous allons plus loin." });
    case "CTA_FOOTER":
      return ctaFooterSchema.parse({
        heading: "Rejoignez une communauté qui construit l'avenir",
        primaryCta: { label: "Adhérer maintenant", href: "/adherer" },
      });
    case "CUSTOM_HTML":
      return customHtmlSchema.parse({ html: "<p>Votre contenu HTML</p>" });
  }
}
