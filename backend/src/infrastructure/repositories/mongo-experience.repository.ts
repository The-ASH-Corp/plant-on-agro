import {
  IExperienceRepository,
  ExperienceFilter,
} from '../../core/interfaces/experience.repository.interface';
import { Experience } from '../../core/entities/experience.entity';
import { ExperienceModel } from '../database/models/experience.model';
import { ExperienceMapper } from '../database/mappers/experience.mapper';
import { Nullable } from '../../shared/types';

/**
 * MongoExperienceRepository
 * Pure data access layer - handles database interactions only without business logic.
 */
export class MongoExperienceRepository implements IExperienceRepository {
  public async findById(id: string): Promise<Nullable<Experience>> {
    const doc = await ExperienceModel.findById(id).exec();
    return doc ? ExperienceMapper.toDomain(doc) : null;
  }

  public async findBySlug(slug: string): Promise<Nullable<Experience>> {
    const doc = await ExperienceModel.findOne({ slug }).exec();
    return doc ? ExperienceMapper.toDomain(doc) : null;
  }

  public async find(
    filter?: ExperienceFilter,
    skip: number = 0,
    limit: number = 50
  ): Promise<Experience[]> {
    const query = this.toQuery(filter);
    const docs = await ExperienceModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return docs.map(ExperienceMapper.toDomain);
  }

  public async count(filter?: ExperienceFilter): Promise<number> {
    const query = this.toQuery(filter);
    return ExperienceModel.countDocuments(query).exec();
  }

  public async save(experience: Experience): Promise<Experience> {
    const persistenceData = ExperienceMapper.toPersistence(experience);

    if (experience.id) {
      const updated = await ExperienceModel.findByIdAndUpdate(
        experience.id,
        { $set: persistenceData },
        { returnDocument: 'after' }
      ).exec();

      return updated ? ExperienceMapper.toDomain(updated) : experience;
    }

    const created = await ExperienceModel.create(persistenceData);
    return ExperienceMapper.toDomain(created);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await ExperienceModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private toQuery(filter?: ExperienceFilter): Record<string, any> {
    if (!filter) return {};
    const query: Record<string, any> = {};

    if (filter.category) query.category = filter.category;
    if (filter.location) query.location = filter.location;
    if (filter.isActive !== undefined) query.isActive = filter.isActive;

    if (filter.search) {
      const regex = new RegExp(filter.search, 'i');
      query.$or = [
        { title: regex },
        { tagline: regex },
        { description: regex },
        { location: regex },
      ];
    }

    return query;
  }
}
