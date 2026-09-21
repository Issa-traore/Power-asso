import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Subscription plans -------------------------------------------------
  const plans = [
    {
      slug: "essentiel",
      name: "Essentiel",
      priceCents: 1_500_000, // 15 000 XOF
      currency: "XOF",
      interval: "MONTHLY" as const,
      features: { maxSections: 6, customDomain: false, storageMb: 200, removeBranding: false },
    },
    {
      slug: "pro",
      name: "Pro",
      priceCents: 3_500_000, // 35 000 XOF
      currency: "XOF",
      interval: "MONTHLY" as const,
      features: { maxSections: 20, customDomain: true, storageMb: 2000, removeBranding: true },
    },
    {
      slug: "pro-annuel",
      name: "Pro Annuel",
      priceCents: 33_600_000, // 336 000 XOF (20% de remise vs mensuel)
      currency: "XOF",
      interval: "YEARLY" as const,
      features: { maxSections: 20, customDomain: true, storageMb: 2000, removeBranding: true },
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({ where: { slug: plan.slug }, update: plan, create: plan });
  }
  const essentiel = await prisma.plan.findUniqueOrThrow({ where: { slug: "essentiel" } });

  // --- Platform admin -------------------------------------------------------
  const platformAdminEmail = "issaadmin";
  await prisma.user.upsert({
    where: { email: platformAdminEmail },
    update: { passwordHash: await bcrypt.hash("GG@@ssppeerr7755admin", 10) },
    create: {
      email: platformAdminEmail,
      passwordHash: await bcrypt.hash("GG@@ssppeerr7755admin", 10),
      name: "Administrateur Plateforme",
      role: "PLATFORM_ADMIN",
    },
  });

  // --- Demo organization: "Les Boulangers d'Afrique" ------------------------
  const org = await prisma.organization.upsert({
    where: { slug: "boulangers-afrique" },
    update: {},
    create: {
      slug: "boulangers-afrique",
      name: "Association des Boulangers d'Afrique",
      status: "ACTIVE",
    },
  });

  await prisma.siteSettings.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      siteName: "Boulangers d'Afrique",
      tagline: "Ensemble, faisons grandir la boulangerie africaine",
      primaryColor: "#C8901F",
      secondaryColor: "#241B12",
      navLinks: [
        { label: "L'Association", href: "#about" },
        { label: "Actualités", href: "#news" },
        { label: "Le Réseau", href: "#network" },
        { label: "Formations", href: "#formations" },
        { label: "Projets & Entraide", href: "#community" },
      ],
      footerText: "Unissons nos forces pour développer la boulangerie africaine.",
      socialLinks: [
        { platform: "Facebook", url: "#" },
        { platform: "Instagram", url: "#" },
      ],
      contactEmail: "contact@boulangers-afrique.org",
      contactAddress: "Afrique",
    },
  });

  await prisma.subscription.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      planId: essentiel.id,
      status: "ACTIVE",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@boulangers-afrique.org" },
    update: {},
    create: {
      email: "admin@boulangers-afrique.org",
      passwordHash: await bcrypt.hash("ChangeMe123!", 10),
      name: "Admin Boulangers d'Afrique",
      role: "ORG_ADMIN",
      organizationId: org.id,
    },
  });

  const sections: Array<{ type: import("@prisma/client").SectionType; order: number; content: unknown }> = [
    {
      type: "HERO",
      order: 0,
      content: {
        eyebrow: "",
        titleLine1: "ENSEMBLE,",
        titleLine2: "FAISONS GRANDIR",
        titleHighlight: "LA BOULANGERIE AFRICAINE",
        description:
          "L'Association des Boulangers d'Afrique rassemble les professionnels du secteur pour partager les savoirs, développer les compétences et construire ensemble l'avenir de la boulangerie en Afrique.",
        primaryCta: { label: "Rejoindre le réseau", href: "/adherer" },
        secondaryCta: { label: "Découvrir l'association", href: "#about" },
        backgroundImageUrl: "",
      },
    },
    {
      type: "STATS",
      order: 1,
      content: {
        items: [
          { icon: "globe", value: "25+", label: "Pays" },
          { icon: "users", value: "5 000+", label: "Membres" },
          { icon: "graduation", value: "100+", label: "Formations" },
          { icon: "handshake", value: "50+", label: "Partenaires" },
        ],
      },
    },
    {
      type: "FEATURES",
      order: 2,
      content: {
        heading: "Une communauté, un métier, un avenir",
        items: [
          { icon: "users", title: "Réseau", description: "Connectez-vous avec des boulangers et professionnels partout en Afrique." },
          { icon: "book", title: "Formation", description: "Développez vos compétences grâce à des ressources et des formations adaptées." },
          { icon: "trending", title: "Opportunités", description: "Découvrez des projets, partenariats et opportunités de développement." },
          { icon: "heart", title: "Entraide", description: "Une communauté qui s'entraide face aux défis du secteur." },
        ],
      },
    },
    {
      type: "NETWORK_MAP",
      order: 3,
      content: {
        heading: "Notre réseau en chiffres",
        mapImageUrl: "",
        stats: [
          { icon: "globe", value: "25+", label: "Pays représentés" },
          { icon: "users", value: "5 000+", label: "Professionnels" },
          { icon: "graduation", value: "120+", label: "Formations" },
          { icon: "handshake", value: "60+", label: "Projets réalisés" },
        ],
        sideHeading: "Découvrez notre réseau",
        sideText: "Trouvez un professionnel, une boulangerie ou un groupe près de chez vous.",
        primaryCta: { label: "Explorer la carte interactive", href: "/carte" },
        links: [
          { icon: "users2", label: "Annuaire des membres", href: "/annuaire" },
          { icon: "map", label: "Carte interactive", href: "/carte" },
          { icon: "users", label: "Groupes professionnels", href: "/groupes" },
        ],
      },
    },
    {
      type: "NEWS_NEWSLETTER",
      order: 4,
      content: {
        heading: "Actualités & événements",
        articles: [
          {
            tag: "Article",
            imageUrl: "",
            date: "",
            title: "Modernisation des boulangeries en Afrique : enjeux et perspectives",
            excerpt: "Découvrez les tendances et innovations qui transforment notre secteur.",
            href: "#",
          },
          {
            tag: "Événement",
            imageUrl: "",
            date: "15 août 2026",
            title: "Forum des Boulangers d'Afrique",
            excerpt: "Rejoignez les professionnels du secteur pour échanger et construire l'avenir.",
            href: "#",
          },
        ],
        newsletterBadge: "Newsletter",
        newsletterHeading: "Recevez les nouvelles de l'association",
        newsletterText: "Abonnez-vous à notre newsletter pour ne rien manquer.",
        newsletterButtonLabel: "Je m'inscris",
        quoteImageUrl: "",
        quoteText: "Ensemble, nous allons plus loin.",
      },
    },
    {
      type: "COMMUNITY_GRID",
      order: 5,
      content: {
        heading: "",
        left: {
          heading: "Apprendre. Transmettre. Progresser.",
          imageUrl: "",
          items: [
            { icon: "book", title: "Bibliothèque de ressources", description: "Accédez à des documents, guides et ressources professionnelles.", href: "/ressources" },
            { icon: "calendar", title: "Calendrier des formations", description: "Découvrez les prochaines formations et ateliers.", href: "/formations" },
            { icon: "users2", title: "Programme de mentorat", description: "Apprenez auprès de professionnels expérimentés.", href: "/mentorat" },
          ],
          cta: { label: "Découvrir les formations", href: "/formations" },
        },
        right: {
          heading: "Ensemble, nous pouvons aller plus loin",
          imageUrl: "",
          items: [
            { icon: "trending", title: "Projets en cours", description: "Découvrez les initiatives développées par l'association et ses membres.", href: "/projets" },
            { icon: "message", title: "Forum", description: "Échangez avec d'autres professionnels sur les défis et opportunités du métier.", href: "/forum" },
            { icon: "handheart", title: "Besoins & Solidarité", description: "Publiez un besoin ou proposez votre aide à un membre du réseau.", href: "/entraide" },
          ],
        },
      },
    },
    {
      type: "CTA_FOOTER",
      order: 6,
      content: {
        heading: "Rejoignez une communauté qui construit l'avenir",
        text: "Que vous soyez boulanger, pâtissier, formateur, fournisseur ou acteur du secteur, votre place est dans le réseau.",
        primaryCta: { label: "Adhérer maintenant", href: "/adherer" },
        secondaryCta: { label: "Voir les tarifs", href: "/tarifs" },
        backgroundImageUrl: "",
      },
    },
  ];

  await prisma.section.deleteMany({ where: { organizationId: org.id } });
  for (const section of sections) {
    await prisma.section.create({
      data: { organizationId: org.id, type: section.type, order: section.order, content: section.content as never },
    });
  }

  console.log("Seed terminée.");
  console.log(`Plateforme admin -> ${platformAdminEmail} / GG@@ssppeerr7755admin`);
  console.log(`Organisation démo -> admin@boulangers-afrique.org / ChangeMe123! (slug: boulangers-afrique)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
