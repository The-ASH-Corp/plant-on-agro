export type LocationStatus = 'Active' | 'Expanding' | 'Full';

export interface LocationProps {
  id?: string;
  name: string;
  region: string;
  gps: string;
  areaHectares: number;
  capacity: number;
  treesPlanted?: number;
  survivalRate?: string;
  ndviScore?: number;
  soilHealth?: string;
  image?: string;
  status?: LocationStatus;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Location {
  private readonly _id?: string;
  private _name: string;
  private _region: string;
  private _gps: string;
  private _areaHectares: number;
  private _capacity: number;
  private _treesPlanted: number;
  private _survivalRate: string;
  private _ndviScore: number;
  private _soilHealth: string;
  private _image: string;
  private _status: LocationStatus;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: LocationProps) {
    this.validate(props);

    this._id = props.id;
    this._name = props.name.trim();
    this._region = props.region.trim();
    this._gps = props.gps.trim();
    this._areaHectares = props.areaHectares;
    this._capacity = props.capacity;
    this._treesPlanted = props.treesPlanted ?? 0;
    this._survivalRate = props.survivalRate ? props.survivalRate.trim() : '99.0%';
    this._ndviScore = props.ndviScore !== undefined ? props.ndviScore : 0.88;
    this._soilHealth = props.soilHealth ? props.soilHealth.trim() : 'Optimal Loam (pH 6.5, Moisture 35%)';
    this._image =
      props.image && props.image.trim().length > 0
        ? props.image.trim()
        : 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format';
    this._status = props.status ?? 'Active';
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: LocationProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Reserve location name cannot be empty');
    }
    if (!props.region || props.region.trim().length === 0) {
      throw new Error('Region cannot be empty');
    }
    if (!props.gps || props.gps.trim().length === 0) {
      throw new Error('GPS coordinates cannot be empty');
    }
    if (props.areaHectares === undefined || props.areaHectares <= 0) {
      throw new Error('Area in hectares must be greater than 0');
    }
    if (props.capacity === undefined || props.capacity <= 0) {
      throw new Error('Sapling capacity must be greater than 0');
    }
    if (props.treesPlanted !== undefined && props.treesPlanted < 0) {
      throw new Error('Trees planted cannot be negative');
    }
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get region(): string {
    return this._region;
  }

  public get gps(): string {
    return this._gps;
  }

  public get areaHectares(): number {
    return this._areaHectares;
  }

  public get capacity(): number {
    return this._capacity;
  }

  public get treesPlanted(): number {
    return this._treesPlanted;
  }

  public get survivalRate(): string {
    return this._survivalRate;
  }

  public get ndviScore(): number {
    return this._ndviScore;
  }

  public get soilHealth(): string {
    return this._soilHealth;
  }

  public get image(): string {
    return this._image;
  }

  public get status(): LocationStatus {
    return this._status;
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

  public update(props: Partial<LocationProps>): void {
    if (props.name !== undefined) {
      if (props.name.trim().length === 0) throw new Error('Reserve location name cannot be empty');
      this._name = props.name.trim();
    }
    if (props.region !== undefined) {
      if (props.region.trim().length === 0) throw new Error('Region cannot be empty');
      this._region = props.region.trim();
    }
    if (props.gps !== undefined) {
      if (props.gps.trim().length === 0) throw new Error('GPS coordinates cannot be empty');
      this._gps = props.gps.trim();
    }
    if (props.areaHectares !== undefined) {
      if (props.areaHectares <= 0) throw new Error('Area in hectares must be greater than 0');
      this._areaHectares = props.areaHectares;
    }
    if (props.capacity !== undefined) {
      if (props.capacity <= 0) throw new Error('Sapling capacity must be greater than 0');
      this._capacity = props.capacity;
    }
    if (props.treesPlanted !== undefined) {
      if (props.treesPlanted < 0) throw new Error('Trees planted cannot be negative');
      this._treesPlanted = props.treesPlanted;
    }
    if (props.survivalRate !== undefined) {
      this._survivalRate = props.survivalRate.trim();
    }
    if (props.ndviScore !== undefined) {
      this._ndviScore = props.ndviScore;
    }
    if (props.soilHealth !== undefined) {
      this._soilHealth = props.soilHealth.trim();
    }
    if (props.image !== undefined) {
      this._image = props.image.trim();
    }
    if (props.status !== undefined) {
      this._status = props.status;
    }
    if (props.isActive !== undefined) {
      this._isActive = props.isActive;
    }

    this._updatedAt = new Date();
  }
}
