export type TreeHealthStatus =
  | 'Healthy'
  | 'Thriving'
  | 'Needs Attention'
  | 'Critical'
  | 'Sapling Growing';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

export interface TreeGrowthUpdate {
  id?: string;
  imageUrl: string;
  stageName?: string;
  notes?: string;
  recordedAt: Date;
  heightCm?: number;
}

export interface TreeInstanceProps {
  id?: string;
  treeTag: string; // Unique serial tag e.g. "POA-TR-2026-0001"
  orderRef?: string; // Reference to adoption order (e.g. "ORD-88219")
  assignedReserve: string; // Name or ID of reserve parcel
  gpsCoordinates: GpsCoordinates; // Physical ground coordinates
  datePlanted: Date; // Date physically put into the ground
  healthStatus: TreeHealthStatus; // Current health status
  treeVarietyName?: string; // e.g. "Indian Mango", "Teakwood"
  adopterName?: string;
  adopterEmail?: string;
  notes?: string;
  imageUrl?: string;
  growthUpdates?: TreeGrowthUpdate[];
  lastInspectedAt?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TreeInstance {
  private readonly _id?: string;
  private _treeTag: string;
  private _orderRef: string;
  private _assignedReserve: string;
  private _gpsCoordinates: GpsCoordinates;
  private _datePlanted: Date;
  private _healthStatus: TreeHealthStatus;
  private _treeVarietyName: string;
  private _adopterName: string;
  private _adopterEmail: string;
  private _notes: string;
  private _imageUrl: string;
  private _growthUpdates: TreeGrowthUpdate[];
  private _lastInspectedAt?: Date;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: TreeInstanceProps) {
    this.validate(props);

    this._id = props.id;
    this._treeTag = props.treeTag.trim().toUpperCase();
    this._orderRef = props.orderRef ? props.orderRef.trim() : '';
    this._assignedReserve = props.assignedReserve.trim();
    this._gpsCoordinates = {
      latitude: props.gpsCoordinates.latitude,
      longitude: props.gpsCoordinates.longitude,
    };
    this._datePlanted = props.datePlanted instanceof Date ? props.datePlanted : new Date(props.datePlanted);
    this._healthStatus = props.healthStatus || 'Sapling Growing';
    this._treeVarietyName = props.treeVarietyName ? props.treeVarietyName.trim() : '';
    this._adopterName = props.adopterName ? props.adopterName.trim() : '';
    this._adopterEmail = props.adopterEmail ? props.adopterEmail.trim().toLowerCase() : '';
    this._notes = props.notes ? props.notes.trim() : '';
    this._imageUrl = props.imageUrl ? props.imageUrl.trim() : '';
    this._growthUpdates = (props.growthUpdates || []).map((u) => ({
      ...u,
      recordedAt: u.recordedAt instanceof Date ? u.recordedAt : new Date(u.recordedAt),
    }));
    this._lastInspectedAt = props.lastInspectedAt;
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: TreeInstanceProps): void {
    if (!props.treeTag || props.treeTag.trim().length === 0) {
      throw new Error('Tree tag / serial number cannot be empty');
    }
    if (!props.assignedReserve || props.assignedReserve.trim().length === 0) {
      throw new Error('Assigned reserve cannot be empty');
    }
    if (!props.gpsCoordinates) {
      throw new Error('GPS coordinates are required');
    }
    const { latitude, longitude } = props.gpsCoordinates;
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be a valid number between -90 and 90');
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be a valid number between -180 and 180');
    }
    if (!props.datePlanted) {
      throw new Error('Date planted is required');
    }
  }

  // Getters
  public get id(): string | undefined {
    return this._id;
  }

  public get treeTag(): string {
    return this._treeTag;
  }

  public get orderRef(): string {
    return this._orderRef;
  }

  public get assignedReserve(): string {
    return this._assignedReserve;
  }

  public get gpsCoordinates(): GpsCoordinates {
    return { ...this._gpsCoordinates };
  }

  public get datePlanted(): Date {
    return this._datePlanted;
  }

  public get healthStatus(): TreeHealthStatus {
    return this._healthStatus;
  }

  public get treeVarietyName(): string {
    return this._treeVarietyName;
  }

  public get adopterName(): string {
    return this._adopterName;
  }

  public get adopterEmail(): string {
    return this._adopterEmail;
  }

  public get notes(): string {
    return this._notes;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public get growthUpdates(): TreeGrowthUpdate[] {
    return [...this._growthUpdates];
  }

  public get lastInspectedAt(): Date | undefined {
    return this._lastInspectedAt;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain logic
  public update(props: Partial<TreeInstanceProps>): void {
    if (props.treeTag !== undefined) {
      if (!props.treeTag.trim()) throw new Error('Tree tag cannot be empty');
      this._treeTag = props.treeTag.trim().toUpperCase();
    }
    if (props.orderRef !== undefined) {
      this._orderRef = props.orderRef.trim();
    }
    if (props.assignedReserve !== undefined) {
      if (!props.assignedReserve.trim()) throw new Error('Assigned reserve cannot be empty');
      this._assignedReserve = props.assignedReserve.trim();
    }
    if (props.gpsCoordinates !== undefined) {
      const { latitude, longitude } = props.gpsCoordinates;
      if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        throw new Error('Latitude must be a valid number between -90 and 90');
      }
      if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        throw new Error('Longitude must be a valid number between -180 and 180');
      }
      this._gpsCoordinates = { latitude, longitude };
    }
    if (props.datePlanted !== undefined) {
      this._datePlanted = props.datePlanted instanceof Date ? props.datePlanted : new Date(props.datePlanted);
    }
    if (props.healthStatus !== undefined) {
      this._healthStatus = props.healthStatus;
    }
    if (props.treeVarietyName !== undefined) {
      this._treeVarietyName = props.treeVarietyName.trim();
    }
    if (props.adopterName !== undefined) {
      this._adopterName = props.adopterName.trim();
    }
    if (props.adopterEmail !== undefined) {
      this._adopterEmail = props.adopterEmail.trim().toLowerCase();
    }
    if (props.notes !== undefined) {
      this._notes = props.notes.trim();
    }
    if (props.imageUrl !== undefined) {
      this._imageUrl = props.imageUrl.trim();
    }
    if (props.growthUpdates !== undefined) {
      this._growthUpdates = props.growthUpdates.map((u) => ({
        ...u,
        recordedAt: u.recordedAt instanceof Date ? u.recordedAt : new Date(u.recordedAt),
      }));
    }
    if (props.lastInspectedAt !== undefined) {
      this._lastInspectedAt = props.lastInspectedAt;
    }
    if (props.isActive !== undefined) {
      this._isActive = props.isActive;
    }

    this._updatedAt = new Date();
  }

  public addGrowthUpdate(update: TreeGrowthUpdate): void {
    const newUpdate: TreeGrowthUpdate = {
      id: update.id || `upd-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      imageUrl: update.imageUrl.trim(),
      stageName: update.stageName?.trim() || 'Vegetative Growth',
      notes: update.notes?.trim() || '',
      recordedAt: update.recordedAt instanceof Date ? update.recordedAt : new Date(update.recordedAt),
      heightCm: update.heightCm,
    };
    this._growthUpdates.push(newUpdate);
    this._growthUpdates.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
    if (newUpdate.imageUrl) {
      this._imageUrl = newUpdate.imageUrl;
    }
    this._lastInspectedAt = newUpdate.recordedAt;
    this._updatedAt = new Date();
  }

  public updateGrowthUpdate(updateId: string, data: Partial<TreeGrowthUpdate>): void {
    const idx = this._growthUpdates.findIndex((u) => u.id === updateId);
    if (idx !== -1) {
      const existing = this._growthUpdates[idx];
      this._growthUpdates[idx] = {
        ...existing,
        ...data,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl.trim() : existing.imageUrl,
        stageName: data.stageName !== undefined ? data.stageName.trim() : existing.stageName,
        notes: data.notes !== undefined ? data.notes.trim() : existing.notes,
        recordedAt: data.recordedAt
          ? data.recordedAt instanceof Date
            ? data.recordedAt
            : new Date(data.recordedAt)
          : existing.recordedAt,
        heightCm: data.heightCm !== undefined ? data.heightCm : existing.heightCm,
      };
      if (this._growthUpdates[idx].imageUrl) {
        this._imageUrl = this._growthUpdates[idx].imageUrl;
      }
      this._updatedAt = new Date();
    }
  }

  public removeGrowthUpdate(updateId: string): void {
    this._growthUpdates = this._growthUpdates.filter((u) => u.id !== updateId);
    this._updatedAt = new Date();
  }

  public updateHealthStatus(status: TreeHealthStatus, notes?: string): void {
    this._healthStatus = status;
    if (notes) {
      this._notes = notes.trim();
    }
    this._lastInspectedAt = new Date();
    this._updatedAt = new Date();
  }

  public updateGpsCoordinates(latitude: number, longitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }
    this._gpsCoordinates = { latitude, longitude };
    this._updatedAt = new Date();
  }

  public assignOrder(orderRef: string, adopterName?: string, adopterEmail?: string): void {
    this._orderRef = orderRef.trim();
    if (adopterName) this._adopterName = adopterName.trim();
    if (adopterEmail) this._adopterEmail = adopterEmail.trim().toLowerCase();
    this._updatedAt = new Date();
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }
}
