import { IExperienceRepository } from '../../../core/interfaces/experience.repository.interface';
import { Experience, ExperienceCategory } from '../../../core/entities/experience.entity';

export interface CreateExperienceDto {
  title: string;
  category: ExperienceCategory;
  tagline: string;
  description: string;
  location: string;
  duration: string;
  price?: number;
  included?: string[];
  galleryImages?: string[];
  featuredImage?: string;
  maxGroupSize?: number;
}

export class CreateExperienceUseCase {
  constructor(private readonly experienceRepository: IExperienceRepository) {}

  public async execute(dto: CreateExperienceDto): Promise<Experience> {
    const experience = new Experience({
      title: dto.title,
      category: dto.category,
      tagline: dto.tagline,
      description: dto.description,
      location: dto.location,
      duration: dto.duration,
      price: dto.price ?? 0,
      included: dto.included ?? [],
      galleryImages: dto.galleryImages ?? [],
      featuredImage: dto.featuredImage ?? (dto.galleryImages && dto.galleryImages[0] ? dto.galleryImages[0] : ''),
      maxGroupSize: dto.maxGroupSize ?? 15,
      isActive: true,
    });

    return this.experienceRepository.save(experience);
  }
}
