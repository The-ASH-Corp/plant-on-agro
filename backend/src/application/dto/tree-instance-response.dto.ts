import {
  TreeInstance,
  TreeHealthStatus,
  GpsCoordinates,
} from '../../core/entities/tree-instance.entity';

export interface TreeInstanceResponseDto {
  id: string;
  treeTag: string;
  orderRef: string;
  assignedReserve: string;
  gpsCoordinates: GpsCoordinates;
  formattedGps: string; // e.g. "18.5204° N, 73.8567° E"
  datePlanted: string;
  healthStatus: TreeHealthStatus;
  treeVarietyName: string;
  adopterName: string;
  adopterEmail: string;
  notes: string;
  imageUrl: string;
  lastInspectedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class TreeInstanceResponseMapper {
  public static toDto(entity: TreeInstance): TreeInstanceResponseDto {
    const lat = entity.gpsCoordinates.latitude;
    const lng = entity.gpsCoordinates.longitude;
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    const formattedGps = `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;

    return {
      id: entity.id || '',
      treeTag: entity.treeTag,
      orderRef: entity.orderRef,
      assignedReserve: entity.assignedReserve,
      gpsCoordinates: entity.gpsCoordinates,
      formattedGps,
      datePlanted: entity.datePlanted.toISOString(),
      healthStatus: entity.healthStatus,
      treeVarietyName: entity.treeVarietyName,
      adopterName: entity.adopterName,
      adopterEmail: entity.adopterEmail,
      notes: entity.notes,
      imageUrl: entity.imageUrl,
      lastInspectedAt: entity.lastInspectedAt ? entity.lastInspectedAt.toISOString() : null,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
