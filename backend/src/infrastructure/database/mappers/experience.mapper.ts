import { Experience, ExperienceCategory } from '../../../core/entities/experience.entity';
import { IExperienceDocument } from '../models/experience.model';

export class ExperienceMapper {
  public static toDomain(doc: IExperienceDocument): Experience {
    return new Experience({
      id: doc._id ? String(doc._id) : undefined,
      title: doc.title,
      slug: doc.slug,
      category: doc.category as ExperienceCategory,
      tagline: doc.tagline,
      description: doc.description,
      location: doc.location,
      duration: doc.duration,
      price: doc.price,
      included: doc.included,
      galleryImages: doc.galleryImages,
      featuredImage: doc.featuredImage,
      maxGroupSize: doc.maxGroupSize,
      rating: doc.rating,
      reviewsCount: doc.reviewsCount,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(entity: Experience): Partial<IExperienceDocument> {
    return {
      title: entity.title,
      slug: entity.slug,
      category: entity.category,
      tagline: entity.tagline,
      description: entity.description,
      location: entity.location,
      duration: entity.duration,
      price: entity.price,
      included: entity.included,
      galleryImages: entity.galleryImages,
      featuredImage: entity.featuredImage,
      maxGroupSize: entity.maxGroupSize,
      rating: entity.rating,
      reviewsCount: entity.reviewsCount,
      isActive: entity.isActive,
    };
  }
}
