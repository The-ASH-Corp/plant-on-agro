import { ILandingPageRepository } from '../../../core/interfaces/landing-page.repository.interface';
import {
  LandingPageResponseDto,
  LandingPageResponseMapper,
} from '../../dto/landing-page.dto';

export class ResetLandingPageUseCase {
  constructor(private readonly landingPageRepository: ILandingPageRepository) {}

  public async execute(): Promise<LandingPageResponseDto> {
    const reset = await this.landingPageRepository.resetToDefault();
    return LandingPageResponseMapper.toDto(reset);
  }
}
