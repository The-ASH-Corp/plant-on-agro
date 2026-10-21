import { TreeInstance } from '../../../core/entities/tree-instance.entity';
import { ITreeInstanceDocument } from '../models/tree-instance.model';

export class TreeInstanceMapper {
  public static toDomain(doc: ITreeInstanceDocument): TreeInstance {
    return new TreeInstance({
      id: doc._id ? String(doc._id) : undefined,
      treeTag: doc.treeTag,
      orderRef: doc.orderRef,
      assignedReserve: doc.assignedReserve,
      gpsCoordinates: {
        latitude: doc.gpsCoordinates.latitude,
        longitude: doc.gpsCoordinates.longitude,
      },
      datePlanted: doc.datePlanted,
      healthStatus: doc.healthStatus,
      treeVarietyName: doc.treeVarietyName,
      adopterName: doc.adopterName,
      adopterEmail: doc.adopterEmail,
      notes: doc.notes,
      imageUrl: doc.imageUrl,
      growthUpdates: (doc.growthUpdates || []).map((u) => ({
        id: u._id ? String(u._id) : undefined,
        imageUrl: u.imageUrl,
        stageName: u.stageName,
        notes: u.notes,
        recordedAt: u.recordedAt,
        heightCm: u.heightCm !== null && u.heightCm !== undefined ? Number(u.heightCm) : undefined,
      })),
      lastInspectedAt: doc.lastInspectedAt || undefined,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(entity: TreeInstance): Partial<ITreeInstanceDocument> {
    return {
      treeTag: entity.treeTag,
      orderRef: entity.orderRef,
      assignedReserve: entity.assignedReserve,
      gpsCoordinates: {
        latitude: entity.gpsCoordinates.latitude,
        longitude: entity.gpsCoordinates.longitude,
      },
      datePlanted: entity.datePlanted,
      healthStatus: entity.healthStatus,
      treeVarietyName: entity.treeVarietyName,
      adopterName: entity.adopterName,
      adopterEmail: entity.adopterEmail,
      notes: entity.notes,
      imageUrl: entity.imageUrl,
      growthUpdates: entity.growthUpdates.map((u) => ({
        imageUrl: u.imageUrl,
        stageName: u.stageName || 'Vegetative Growth',
        notes: u.notes || '',
        recordedAt: u.recordedAt,
        heightCm: u.heightCm ?? null,
      })),
      lastInspectedAt: entity.lastInspectedAt || null,
      isActive: entity.isActive,
    };
  }
}
