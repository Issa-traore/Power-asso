import { notFound } from "next/navigation";
import { requireOrgSession } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { parseSectionContent, type SectionTypeKey } from "@/lib/sections/schema";
import { HeroForm } from "@/components/admin/section-forms/HeroForm";
import { StatsForm } from "@/components/admin/section-forms/StatsForm";
import { FeaturesForm } from "@/components/admin/section-forms/FeaturesForm";
import { NetworkMapForm } from "@/components/admin/section-forms/NetworkMapForm";
import { NewsNewsletterForm } from "@/components/admin/section-forms/NewsNewsletterForm";
import { CommunityGridForm } from "@/components/admin/section-forms/CommunityGridForm";
import { TestimonialForm } from "@/components/admin/section-forms/TestimonialForm";
import { CtaFooterForm } from "@/components/admin/section-forms/CtaFooterForm";
import { CustomHtmlForm } from "@/components/admin/section-forms/CustomHtmlForm";

export default async function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireOrgSession();
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section || section.organizationId !== session.organizationId) notFound();

  const type = section.type as SectionTypeKey;

  switch (type) {
    case "HERO":
      return <HeroForm sectionId={id} initial={parseSectionContent("HERO", section.content)} />;
    case "STATS":
      return <StatsForm sectionId={id} initial={parseSectionContent("STATS", section.content)} />;
    case "FEATURES":
      return <FeaturesForm sectionId={id} initial={parseSectionContent("FEATURES", section.content)} />;
    case "NETWORK_MAP":
      return <NetworkMapForm sectionId={id} initial={parseSectionContent("NETWORK_MAP", section.content)} />;
    case "NEWS_NEWSLETTER":
      return <NewsNewsletterForm sectionId={id} initial={parseSectionContent("NEWS_NEWSLETTER", section.content)} />;
    case "COMMUNITY_GRID":
      return <CommunityGridForm sectionId={id} initial={parseSectionContent("COMMUNITY_GRID", section.content)} />;
    case "TESTIMONIAL":
      return <TestimonialForm sectionId={id} initial={parseSectionContent("TESTIMONIAL", section.content)} />;
    case "CTA_FOOTER":
      return <CtaFooterForm sectionId={id} initial={parseSectionContent("CTA_FOOTER", section.content)} />;
    case "CUSTOM_HTML":
      return <CustomHtmlForm sectionId={id} initial={parseSectionContent("CUSTOM_HTML", section.content)} />;
    default:
      notFound();
  }
}
