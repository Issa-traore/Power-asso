import type { Section, SiteSettings } from "@prisma/client";
import { parseSectionContent } from "@/lib/sections/schema";
import { Hero } from "./sections/Hero";
import { Stats } from "./sections/Stats";
import { Features } from "./sections/Features";
import { NetworkMap } from "./sections/NetworkMap";
import { NewsNewsletter } from "./sections/NewsNewsletter";
import { CommunityGrid } from "./sections/CommunityGrid";
import { Testimonial } from "./sections/Testimonial";
import { CtaFooter } from "./sections/CtaFooter";

export function SectionRenderer({
  section,
  settings,
  basePath,
}: {
  section: Section;
  settings: SiteSettings;
  basePath: string;
}) {
  const primaryColor = settings.primaryColor;
  const secondaryColor = settings.secondaryColor;

  switch (section.type) {
    case "HERO":
      return <Hero content={parseSectionContent("HERO", section.content)} basePath={basePath} primaryColor={primaryColor} />;
    case "STATS":
      return <Stats content={parseSectionContent("STATS", section.content)} secondaryColor={secondaryColor} />;
    case "FEATURES":
      return <Features content={parseSectionContent("FEATURES", section.content)} primaryColor={primaryColor} />;
    case "NETWORK_MAP":
      return (
        <NetworkMap
          content={parseSectionContent("NETWORK_MAP", section.content)}
          basePath={basePath}
          primaryColor={primaryColor}
        />
      );
    case "NEWS_NEWSLETTER":
      return (
        <NewsNewsletter
          content={parseSectionContent("NEWS_NEWSLETTER", section.content)}
          basePath={basePath}
          primaryColor={primaryColor}
        />
      );
    case "COMMUNITY_GRID":
      return (
        <CommunityGrid
          content={parseSectionContent("COMMUNITY_GRID", section.content)}
          basePath={basePath}
          primaryColor={primaryColor}
        />
      );
    case "TESTIMONIAL":
      return <Testimonial content={parseSectionContent("TESTIMONIAL", section.content)} />;
    case "CTA_FOOTER":
      return (
        <CtaFooter
          content={parseSectionContent("CTA_FOOTER", section.content)}
          basePath={basePath}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      );
    case "CUSTOM_HTML": {
      const content = parseSectionContent("CUSTOM_HTML", section.content);
      return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6" dangerouslySetInnerHTML={{ __html: content.html }} />;
    }
    default:
      return null;
  }
}
