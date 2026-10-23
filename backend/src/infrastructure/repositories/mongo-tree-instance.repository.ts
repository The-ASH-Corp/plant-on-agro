import {
  ITreeInstanceRepository,
  TreeInstanceFilter,
} from '../../core/interfaces/tree-instance.repository.interface';
import { TreeInstance } from '../../core/entities/tree-instance.entity';
import { TreeInstanceModel } from '../database/models/tree-instance.model';
import { TreeInstanceMapper } from '../database/mappers/tree-instance.mapper';
import { Nullable } from '../../shared/types';

export class MongoTreeInstanceRepository implements ITreeInstanceRepository {
  private buildQuery(filter?: TreeInstanceFilter): Record<string, any> {
    const query: Record<string, any> = {};

    if (!filter) return query;

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }

    if (filter.reserve && filter.reserve !== 'All') {
      query.assignedReserve = filter.reserve;
    }

    if (filter.healthStatus && filter.healthStatus !== 'All') {
      query.healthStatus = filter.healthStatus;
    }

    if (filter.orderRef && filter.orderRef.trim().length > 0) {
      query.orderRef = filter.orderRef.trim();
    }

    if (filter.adopterEmail && filter.adopterEmail.trim().length > 0) {
      query.adopterEmail = filter.adopterEmail.trim().toLowerCase();
    }

    if (filter.search && filter.search.trim().length > 0) {
      const searchRegex = new RegExp(filter.search.trim(), 'i');
      query.$or = [
        { treeTag: searchRegex },
        { orderRef: searchRegex },
        { assignedReserve: searchRegex },
        { treeVarietyName: searchRegex },
        { adopterName: searchRegex },
        { adopterEmail: searchRegex },
        { notes: searchRegex },
      ];
    }

    return query;
  }

  public async findById(id: string): Promise<Nullable<TreeInstance>> {
    const doc = await TreeInstanceModel.findById(id).exec();
    if (!doc) return null;
    return TreeInstanceMapper.toDomain(doc);
  }

  public async findByTag(treeTag: string): Promise<Nullable<TreeInstance>> {
    const doc = await TreeInstanceModel.findOne({
      treeTag: treeTag.trim().toUpperCase(),
    }).exec();
    if (!doc) return null;
    return TreeInstanceMapper.toDomain(doc);
  }

  public async findByOrderRef(orderRef: string): Promise<TreeInstance[]> {
    const docs = await TreeInstanceModel.find({
      orderRef: orderRef.trim(),
    })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map(TreeInstanceMapper.toDomain);
  }

  public async findAll(
    filter?: TreeInstanceFilter,
    limit = 50,
    skip = 0
  ): Promise<TreeInstance[]> {
    const query = this.buildQuery(filter);
    const docs = await TreeInstanceModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return docs.map(TreeInstanceMapper.toDomain);
  }

  public async count(filter?: TreeInstanceFilter): Promise<number> {
    const query = this.buildQuery(filter);
    return TreeInstanceModel.countDocuments(query).exec();
  }

  public async save(treeInstance: TreeInstance): Promise<TreeInstance> {
    const persistenceData = TreeInstanceMapper.toPersistence(treeInstance);
    const doc = await TreeInstanceModel.create(persistenceData);
    return TreeInstanceMapper.toDomain(doc);
  }

  public async update(treeInstance: TreeInstance): Promise<TreeInstance> {
    if (!treeInstance.id) {
      throw new Error('Cannot update tree instance without an ID');
    }
    const persistenceData = TreeInstanceMapper.toPersistence(treeInstance);
    const doc = await TreeInstanceModel.findByIdAndUpdate(
      treeInstance.id,
      persistenceData,
      { returnDocument: 'after' }
    ).exec();

    if (!doc) {
      throw new Error(`Tree instance with ID ${treeInstance.id} not found`);
    }

    return TreeInstanceMapper.toDomain(doc);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await TreeInstanceModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
