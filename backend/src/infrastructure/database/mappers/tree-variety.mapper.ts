import { TreeVariety } from '../../../core/entities/tree-variety.entity';
import { ITreeVarietyDocument } from '../models/tree-variety.model';

export class TreeVarietyMapper {
  public static toDomain(doc: ITreeVarietyDocument): TreeVariety {
    return new TreeVariety({
      id: doc._id ? String(doc._id) : undefined,
      commonName: doc.commonName,
      scientificName: doc.scientificName,
      category: doc.category,
      price: doc.price,
      co2AbsorptionRateKgYear: doc.co2AbsorptionRateKgYear,
      growthTimeline: doc.growthTimeline,
      careRequirements: doc.careRequirements,
      coverImages: doc.coverImages,
      location: doc.location,
      description: doc.description,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(tree: TreeVariety): Partial<ITreeVarietyDocument> {
    return {
      commonName: tree.commonName,
      scientificName: tree.scientificName,
      category: tree.category,
      price: tree.price,
      co2AbsorptionRateKgYear: tree.co2AbsorptionRateKgYear,
      growthTimeline: tree.growthTimeline,
      careRequirements: tree.careRequirements,
      coverImages: tree.coverImages,
      location: tree.location,
      description: tree.description,
      isActive: tree.isActive,
    };
  }
}
