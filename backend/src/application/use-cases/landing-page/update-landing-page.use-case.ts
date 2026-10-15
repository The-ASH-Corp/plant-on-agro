import { ILandingPageRepository } from '../../../core/interfaces/landing-page.repository.interface';
import {
  LandingPageResponseDto,
  LandingPageResponseMapper,
  UpdateLandingPageDto,
} from '../../dto/landing-page.dto';

export class UpdateLandingPageUseCase {
  constructor(private readonly landingPageRepository: ILandingPageRepository) {}

  public async execute(
    dto: UpdateLandingPageDto,
    slug: string = 'default'
  ): Promise<LandingPageResponseDto> {
    let landingPage = await this.landingPageRepository.findBySlug(slug);

    if (!landingPage) {
      landingPage = await this.landingPageRepository.getOrCreateDefault();
    }

    landingPage.update(dto as any);
    const updated = await this.landingPageRepository.update(landingPage);

    return LandingPageResponseMapper.toDto(updated);
  }
}
