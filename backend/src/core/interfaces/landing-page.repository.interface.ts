import { LandingPage } from '../entities/landing-page.entity';
import { Nullable } from '../../shared/types';

export interface ILandingPageRepository {
  findBySlug(slug?: string): Promise<Nullable<LandingPage>>;
  save(landingPage: LandingPage): Promise<LandingPage>;
  update(landingPage: LandingPage): Promise<LandingPage>;
  getOrCreateDefault(): Promise<LandingPage>;
  resetToDefault(): Promise<LandingPage>;
}
