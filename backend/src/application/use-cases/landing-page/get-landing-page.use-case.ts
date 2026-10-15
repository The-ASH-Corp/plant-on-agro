import { ILandingPageRepository } from '../../../core/interfaces/landing-page.repository.interface';
import {
  LandingPageResponseDto,
  LandingPageResponseMapper,
} from '../../dto/landing-page.dto';

export class GetLandingPageUseCase {
  constructor(private readonly landingPageRepository: ILandingPageRepository) {}

  public async execute(slug: string = 'default'): Promise<LandingPageResponseDto> {
    const landingPage = await this.landingPageRepository.findBySlug(slug);
    if (!landingPage) {
      const created = await this.landingPageRepository.getOrCreateDefault();
      return LandingPageResponseMapper.toDto(created);
    }
    return LandingPageResponseMapper.toDto(landingPage);
  }
}
