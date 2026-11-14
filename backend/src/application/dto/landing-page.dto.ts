import {
  LandingPage,
  HeroSectionContent,
  VisionMissionSectionContent,
  HowItWorksSectionContent,
  ImpactSectionContent,
  CertificateSectionContent,
  FooterSectionContent,
} from '../../core/entities/landing-page.entity';

export interface LandingPageResponseDto {
  id?: string;
  slug: string;
  hero: HeroSectionContent;
  visionMission?: VisionMissionSectionContent;
  howItWorks: HowItWorksSectionContent;
  impact: ImpactSectionContent;
  certificate: CertificateSectionContent;
  footer: FooterSectionContent;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLandingPageDto {
  hero?: Partial<HeroSectionContent>;
  visionMission?: Partial<VisionMissionSectionContent>;
  howItWorks?: Partial<HowItWorksSectionContent>;
  impact?: Partial<ImpactSectionContent>;
  certificate?: Partial<CertificateSectionContent>;
  footer?: Partial<FooterSectionContent>;
  isActive?: boolean;
}

export class LandingPageResponseMapper {
  public static toDto(entity: LandingPage): LandingPageResponseDto {
    return {
      id: entity.id,
      slug: entity.slug,
      hero: entity.hero,
      visionMission: entity.visionMission,
      howItWorks: entity.howItWorks,
      impact: entity.impact,
      certificate: entity.certificate,
      footer: entity.footer,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
