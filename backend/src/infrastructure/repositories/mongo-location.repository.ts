import {
  ILocationRepository,
  LocationFilter,
} from '../../core/interfaces/location.repository.interface';
import { Location } from '../../core/entities/location.entity';
import { LocationModel } from '../database/models/location.model';
import { LocationMapper } from '../database/mappers/location.mapper';
import { Nullable } from '../../shared/types';

const INITIAL_RESERVES = [
  {
    name: 'Western Ghats, Maharashtra',
    region: 'Sahyadri Mountain Range, MH',
    gps: '18.9894° N, 73.4428° E',
    areaHectares: 48.5,
    capacity: 15000,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format',
    survivalRate: '99.2%',
    ndviScore: 0.88,
    soilHealth: 'Rich Volcanic Clay (pH 6.4, Moisture 38%)',
    status: 'Active' as const,
  },
  {
    name: 'Western Ghats Ecological Corridor, MH',
    region: 'Sahyadri Mountain Range, MH',
    gps: '18.9894° N, 73.4428° E',
    areaHectares: 52.0,
    capacity: 18000,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format',
    survivalRate: '98.9%',
    ndviScore: 0.91,
    soilHealth: 'Humus Loam (pH 6.6, Moisture 42%)',
    status: 'Active' as const,
  },
  {
    name: 'Nashik Valley, Maharashtra',
    region: 'Godavari River Basin, MH',
    gps: '19.9975° N, 73.7898° E',
    areaHectares: 26.2,
    capacity: 8500,
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=400&fit=crop&auto=format',
    survivalRate: '97.8%',
    ndviScore: 0.84,
    soilHealth: 'Alluvial Silt Loam (pH 7.1, Moisture 30%)',
    status: 'Active' as const,
  },
  {
    name: 'Satara Plateau, Maharashtra',
    region: 'Kaas UNESCO Biosphere, MH',
    gps: '17.6805° N, 73.9904° E',
    areaHectares: 34.0,
    capacity: 11000,
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop&auto=format',
    survivalRate: '99.5%',
    ndviScore: 0.89,
    soilHealth: 'Laterite Red Earth (pH 6.2, Moisture 36%)',
    status: 'Active' as const,
  },
  {
    name: 'Nagpur Forest Zone',
    region: 'Vidarbha Dry Deciduous Belt, MH',
    gps: '21.1458° N, 79.0882° E',
    areaHectares: 62.0,
    capacity: 22000,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop&auto=format',
    survivalRate: '96.7%',
    ndviScore: 0.82,
    soilHealth: 'Black Cotton Soil (pH 7.8, Moisture 28%)',
    status: 'Active' as const,
  },
  {
    name: 'Aurangabad Green Belt',
    region: 'Marathwada Semi-Arid Zone, MH',
    gps: '19.8762° N, 75.3433° E',
    areaHectares: 18.5,
    capacity: 6000,
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop&auto=format',
    survivalRate: '98.1%',
    ndviScore: 0.85,
    soilHealth: 'Gravelly Loam (pH 7.3, Moisture 25%)',
    status: 'Active' as const,
  },
  {
    name: 'Pune Hills, Maharashtra',
    region: 'Deccan Plateau Foothills, MH',
    gps: '18.5204° N, 73.8567° E',
    areaHectares: 15.0,
    capacity: 5000,
    image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=600&h=400&fit=crop&auto=format',
    survivalRate: '99.0%',
    ndviScore: 0.87,
    soilHealth: 'Porous Basaltic Loam (pH 6.8, Moisture 32%)',
    status: 'Active' as const,
  },
];

export class MongoLocationRepository implements ILocationRepository {
  private hasEnsuredInitialReserves = false;

  private async ensureInitialReserves(): Promise<void> {
    if (this.hasEnsuredInitialReserves) return;
    try {
      const count = await LocationModel.countDocuments().exec();
      if (count === 0) {
        await LocationModel.insertMany(INITIAL_RESERVES);
      }
      this.hasEnsuredInitialReserves = true;
    } catch (err) {
      // Ignore unique collision or duplicate key if raced
      this.hasEnsuredInitialReserves = true;
    }
  }

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
    await this.ensureInitialReserves();
    const doc = await LocationModel.findById(id).exec();
    if (!doc) return null;
    return LocationMapper.toDomain(doc);
  }

  public async findByName(name: string): Promise<Nullable<Location>> {
    await this.ensureInitialReserves();
    const doc = await LocationModel.findOne({ name: name.trim() }).exec();
    if (!doc) return null;
    return LocationMapper.toDomain(doc);
  }

  public async findAll(
    filter?: LocationFilter,
    limit = 100,
    skip = 0
  ): Promise<Location[]> {
    await this.ensureInitialReserves();
    const query = this.buildQuery(filter);
    const docs = await LocationModel.find(query)
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return docs.map(LocationMapper.toDomain);
  }

  public async count(filter?: LocationFilter): Promise<number> {
    await this.ensureInitialReserves();
    const query = this.buildQuery(filter);
    return LocationModel.countDocuments(query).exec();
  }

  public async save(location: Location): Promise<Location> {
    await this.ensureInitialReserves();
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
