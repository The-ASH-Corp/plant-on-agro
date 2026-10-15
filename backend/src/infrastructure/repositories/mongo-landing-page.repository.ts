import { ILandingPageRepository } from '../../core/interfaces/landing-page.repository.interface';
import { LandingPage, DEFAULT_LANDING_PAGE_DATA } from '../../core/entities/landing-page.entity';
import { LandingPageModel } from '../database/models/landing-page.model';
import { LandingPageMapper } from '../database/mappers/landing-page.mapper';
import { Nullable } from '../../shared/types';

export class MongoLandingPageRepository implements ILandingPageRepository {
  public async findBySlug(slug: string = 'default'): Promise<Nullable<LandingPage>> {
    const doc = await LandingPageModel.findOne({ slug }).exec();
    if (!doc) return null;
    return LandingPageMapper.toDomain(doc);
  }

  public async save(landingPage: LandingPage): Promise<LandingPage> {
    const persistenceData = LandingPageMapper.toPersistence(landingPage);
    const doc = await LandingPageModel.create(persistenceData);
    return LandingPageMapper.toDomain(doc);
  }

  public async update(landingPage: LandingPage): Promise<LandingPage> {
    const persistenceData = LandingPageMapper.toPersistence(landingPage);
    const doc = await LandingPageModel.findOneAndUpdate(
      { slug: landingPage.slug },
      { $set: persistenceData },
      { returnDocument: 'after', upsert: true }
    ).exec();

    if (!doc) {
      throw new Error(`Failed to update landing page with slug ${landingPage.slug}`);
    }

    return LandingPageMapper.toDomain(doc);
  }

  public async getOrCreateDefault(): Promise<LandingPage> {
    const existing = await this.findBySlug('default');
    if (existing) return existing;

    const defaultEntity = new LandingPage({
      slug: 'default',
      hero: DEFAULT_LANDING_PAGE_DATA.hero,
      howItWorks: DEFAULT_LANDING_PAGE_DATA.howItWorks,
      impact: DEFAULT_LANDING_PAGE_DATA.impact,
      certificate: DEFAULT_LANDING_PAGE_DATA.certificate,
      footer: DEFAULT_LANDING_PAGE_DATA.footer,
      isActive: true,
    });

    return this.save(defaultEntity);
  }

  public async resetToDefault(): Promise<LandingPage> {
    const existing = await this.findBySlug('default');
    if (existing) {
      existing.resetToDefaults();
      return this.update(existing);
    }
    return this.getOrCreateDefault();
  }
}
