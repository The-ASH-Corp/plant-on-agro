import {
  ILocationRepository,
  LocationFilter,
} from '../../core/interfaces/location.repository.interface';
import { Location } from '../../core/entities/location.entity';
import { LocationModel } from '../database/models/location.model';
import { LocationMapper } from '../database/mappers/location.mapper';
import { Nullable } from '../../shared/types';

export class MongoLocationRepository implements ILocationRepository {
  private buildQuery(filter?: LocationFilter): Record<string, any> {
    const query: Record<string, any> = {};

    if (!filter) return query;

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }

    if (filter.status && filter.status !== 'All') {
      query.status = filter.status;
    }

    if (filter.search && filter.search.trim().length > 0) {
      const searchRegex = new RegExp(filter.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { region: searchRegex },
        { gps: searchRegex },
        { soilHealth: searchRegex },
      ];
    }

    return query;
  }

  public async findById(id: string): Promise<Nullable<Location>> {
    const doc = await LocationModel.findById(id).exec();
    if (!doc) return null;
    return LocationMapper.toDomain(doc);
  }

  public async findByName(name: string): Promise<Nullable<Location>> {
    const doc = await LocationModel.findOne({ name: name.trim() }).exec();
    if (!doc) return null;
    return LocationMapper.toDomain(doc);
  }

  public async findAll(
    filter?: LocationFilter,
    limit = 100,
    skip = 0
  ): Promise<Location[]> {
    const query = this.buildQuery(filter);
    const docs = await LocationModel.find(query)
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return docs.map(LocationMapper.toDomain);
  }

  public async count(filter?: LocationFilter): Promise<number> {
    const query = this.buildQuery(filter);
    return LocationModel.countDocuments(query).exec();
  }

  public async save(location: Location): Promise<Location> {
    const persistenceData = LocationMapper.toPersistence(location);
    const doc = new LocationModel(persistenceData);
    const savedDoc = await doc.save();
    return LocationMapper.toDomain(savedDoc);
  }

  public async update(location: Location): Promise<Location> {
    if (!location.id) {
      throw new Error('Location must have an ID to be updated');
    }

    const persistenceData = LocationMapper.toPersistence(location);
    const updatedDoc = await LocationModel.findByIdAndUpdate(
      location.id,
      { $set: persistenceData },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedDoc) {
      throw new Error(`Location with ID ${location.id} not found`);
    }

    return LocationMapper.toDomain(updatedDoc);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await LocationModel.findByIdAndDelete(id).exec();
    return Boolean(result);
  }
}
