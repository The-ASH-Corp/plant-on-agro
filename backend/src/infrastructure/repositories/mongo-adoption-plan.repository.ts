import {
  IAdoptionPlanRepository,
  AdoptionPlanFilter,
} from '../../core/interfaces/adoption-plan.repository.interface';
import { AdoptionPlan } from '../../core/entities/adoption-plan.entity';
import { AdoptionPlanModel } from '../database/models/adoption-plan.model';
import { AdoptionPlanMapper } from '../database/mappers/adoption-plan.mapper';
import { Nullable } from '../../shared/types';

export class MongoAdoptionPlanRepository implements IAdoptionPlanRepository {
  private buildQuery(filter?: AdoptionPlanFilter): Record<string, any> {
    const query: Record<string, any> = {};

    if (!filter) return query;

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }

    if (filter.occasion && filter.occasion !== 'all') {
      query.occasionDedications = filter.occasion;
    }

    if (filter.search && filter.search.trim().length > 0) {
      const searchRegex = new RegExp(filter.search.trim(), 'i');
      query.$or = [
        { planLabel: searchRegex },
        { description: searchRegex },
        { badge: searchRegex },
      ];
    }

    return query;
  }

  public async findById(id: string): Promise<Nullable<AdoptionPlan>> {
    const doc = await AdoptionPlanModel.findById(id).exec();
    if (!doc) return null;
    return AdoptionPlanMapper.toDomain(doc);
  }

  public async findByLabel(label: string): Promise<Nullable<AdoptionPlan>> {
    const doc = await AdoptionPlanModel.findOne({
      planLabel: { $regex: new RegExp(`^${label.trim()}$`, 'i') },
    }).exec();
    if (!doc) return null;
    return AdoptionPlanMapper.toDomain(doc);
  }

  public async findAll(
    filter?: AdoptionPlanFilter,
    limit = 50,
    skip = 0
  ): Promise<AdoptionPlan[]> {
    const query = this.buildQuery(filter);
    const docs = await AdoptionPlanModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return docs.map(AdoptionPlanMapper.toDomain);
  }

  public async count(filter?: AdoptionPlanFilter): Promise<number> {
    const query = this.buildQuery(filter);
    return AdoptionPlanModel.countDocuments(query).exec();
  }

  public async save(plan: AdoptionPlan): Promise<AdoptionPlan> {
    const persistenceData = AdoptionPlanMapper.toPersistence(plan);
    const doc = await AdoptionPlanModel.create(persistenceData);
    return AdoptionPlanMapper.toDomain(doc);
  }

  public async update(plan: AdoptionPlan): Promise<AdoptionPlan> {
    if (!plan.id) {
      throw new Error('Cannot update adoption plan without an ID');
    }
    const persistenceData = AdoptionPlanMapper.toPersistence(plan);
    const doc = await AdoptionPlanModel.findByIdAndUpdate(
      plan.id,
      persistenceData,
      { returnDocument: 'after' }
    ).exec();

    if (!doc) {
      throw new Error(`Adoption plan with ID ${plan.id} not found`);
    }

    return AdoptionPlanMapper.toDomain(doc);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await AdoptionPlanModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
