import { LandingPage } from '../../../core/entities/landing-page.entity';
import { ILandingPageDocument } from '../models/landing-page.model';

export class LandingPageMapper {
  public static toDomain(doc: ILandingPageDocument): LandingPage {
    return new LandingPage({
      id: doc._id.toString(),
      slug: doc.slug,
      hero: {
        isEnabled: doc.hero.isEnabled !== false,
        badge: doc.hero.badge,
        headlinePart1: doc.hero.headlinePart1,
        headlineHighlight: doc.hero.headlineHighlight,
        description: doc.hero.description,
        primaryCtaText: doc.hero.primaryCtaText,
        secondaryCtaText: doc.hero.secondaryCtaText,
        bgImageUrl: doc.hero.bgImageUrl,
        stats: doc.hero.stats.map((s) => ({
          target: s.target,
          suffix: s.suffix,
          label: s.label,
        })),
      },
      howItWorks: {
        isEnabled: doc.howItWorks.isEnabled !== false,
        tagline: doc.howItWorks.tagline,
        title: doc.howItWorks.title,
        steps: doc.howItWorks.steps.map((st) => ({
          num: st.num,
          icon: st.icon,
          title: st.title,
          desc: st.desc,
        })),
      },
      impact: {
        isEnabled: doc.impact.isEnabled !== false,
        tagline: doc.impact.tagline,
        title: doc.impact.title,
        description: doc.impact.description,
        stats: doc.impact.stats.map((st) => ({
          icon: st.icon,
          value: st.value,
          suffix: st.suffix,
          label: st.label,
          color: st.color,
        })),
        projects: doc.impact.projects.map((p) => ({
          img: p.img,
          title: p.title,
          trees: p.trees,
          region: p.region,
        })),
      },
      certificate: {
        isEnabled: doc.certificate.isEnabled !== false,
        tagline: doc.certificate.tagline,
        titlePart1: doc.certificate.titlePart1,
        titleHighlight: doc.certificate.titleHighlight,
        description: doc.certificate.description,
        features: [...doc.certificate.features],
        sampleRecipientName: doc.certificate.sampleRecipientName,
        sampleTreeName: doc.certificate.sampleTreeName,
        sampleTreeId: doc.certificate.sampleTreeId,
        sampleLocation: doc.certificate.sampleLocation,
        sampleDate: doc.certificate.sampleDate,
        sampleQuote: doc.certificate.sampleQuote,
      },
      footer: {
        ctaBandEnabled: doc.footer.ctaBandEnabled !== false,
        ctaTagline: doc.footer.ctaTagline,
        ctaTitlePart1: doc.footer.ctaTitlePart1,
        ctaTitleHighlight: doc.footer.ctaTitleHighlight,
        ctaDescription: doc.footer.ctaDescription,
        ctaButtonText: doc.footer.ctaButtonText,
        footerTagline: doc.footer.footerTagline,
        copyrightText: doc.footer.copyrightText,
      },
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(entity: LandingPage): Record<string, any> {
    return {
      slug: entity.slug,
      hero: entity.hero,
      howItWorks: entity.howItWorks,
      impact: entity.impact,
      certificate: entity.certificate,
      footer: entity.footer,
      isActive: entity.isActive,
    };
  }
}
