import { TreeHealthStatus, GpsCoordinates } from '../../core/entities/tree-instance.entity';

export interface UpdateTreeInstanceDto {
  treeTag?: string;
  orderRef?: string;
  assignedReserve?: string;
  gpsCoordinates?: GpsCoordinates;
  datePlanted?: string | Date;
  healthStatus?: TreeHealthStatus;
  treeVarietyName?: string;
  adopterName?: string;
  adopterEmail?: string;
  notes?: string;
  imageUrl?: string;
  lastInspectedAt?: string | Date;
  isActive?: boolean;
}
