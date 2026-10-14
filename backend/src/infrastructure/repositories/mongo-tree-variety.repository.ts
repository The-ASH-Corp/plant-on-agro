import {
  ITreeVarietyRepository,
  TreeVarietyFilter,
} from '../../core/interfaces/tree-variety.repository.interface';
import { TreeVariety } from '../../core/entities/tree-variety.entity';
import { TreeVarietyModel } from '../database/models/tree-variety.model';
import { TreeVarietyMapper } from '../database/mappers/tree-variety.mapper';
import { Nullable } from '../../shared/types';

export class MongoTreeVarietyRepository implements ITreeVarietyRepository {
  private buildQuery(filter?: TreeVarietyFilter): Record<string, any> {
    const query: Record<string, any> = {};

    if (!filter) return query;

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }

    if (filter.category && filter.category !== 'All') {
      query.category = filter.category;
    }

    if (filter.search && filter.search.trim().length > 0) {
      const searchRegex = new RegExp(filter.search.trim(), 'i');
      query.$or = [
        { commonName: searchRegex },
        { scientificName: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }

    return query;
  }

  public async findById(id: string): Promise<Nullable<TreeVariety>> {
    const doc = await TreeVarietyModel.findById(id).exec();
    if (!doc) return null;
    return TreeVarietyMapper.toDomain(doc);
  }

  public async findAll(
    filter?: TreeVarietyFilter,
    limit = 50,
    skip = 0
  ): Promise<TreeVariety[]> {
    const query = this.buildQuery(filter);
    const docs = await TreeVarietyModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return docs.map(TreeVarietyMapper.toDomain);
  }

  public async count(filter?: TreeVarietyFilter): Promise<number> {
    const query = this.buildQuery(filter);
    return TreeVarietyModel.countDocuments(query).exec();
  }

  public async save(tree: TreeVariety): Promise<TreeVariety> {
    const persistenceData = TreeVarietyMapper.toPersistence(tree);
    const doc = await TreeVarietyModel.create(persistenceData);
    return TreeVarietyMapper.toDomain(doc);
  }

  public async update(tree: TreeVariety): Promise<TreeVariety> {
    if (!tree.id) {
      throw new Error('Cannot update tree variety without an ID');
    }
    const persistenceData = TreeVarietyMapper.toPersistence(tree);
    const doc = await TreeVarietyModel.findByIdAndUpdate(
      tree.id,
      persistenceData,
      { returnDocument: 'after' }
    ).exec();

    if (!doc) {
      throw new Error(`Tree variety with ID ${tree.id} not found`);
    }

    return TreeVarietyMapper.toDomain(doc);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await TreeVarietyModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
