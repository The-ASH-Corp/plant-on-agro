export type TreeCategory =
  | 'Fruit Trees'
  | 'Timber Trees'
  | 'Medicinal'
  | 'Native Trees'
  | 'Shade Trees'
  | 'Occasion';

export interface TreeVarietyProps {
  id?: string;
  commonName: string;
  scientificName: string;
  category: TreeCategory;
  price: number;
  co2AbsorptionRateKgYear: number;
  growthTimeline: string;
  careRequirements: string;
  coverImages: string[];
  location?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TreeVariety {
  private readonly _id?: string;
  private _commonName: string;
  private _scientificName: string;
  private _category: TreeCategory;
  private _price: number;
  private _co2AbsorptionRateKgYear: number;
  private _growthTimeline: string;
  private _careRequirements: string;
  private _coverImages: string[];
  private _location: string;
  private _description: string;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: TreeVarietyProps) {
    this.validate(props);

    this._id = props.id;
    this._commonName = props.commonName.trim();
    this._scientificName = props.scientificName.trim();
    this._category = props.category;
    this._price = props.price;
    this._co2AbsorptionRateKgYear = props.co2AbsorptionRateKgYear;
    this._growthTimeline = props.growthTimeline.trim();
    this._careRequirements = props.careRequirements.trim();
    this._coverImages = props.coverImages ?? [];
    this._location = props.location ? props.location.trim() : 'Western Ghats, Maharashtra';
    this._description = props.description ? props.description.trim() : '';
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: TreeVarietyProps): void {
    if (!props.commonName || props.commonName.trim().length === 0) {
      throw new Error('Common name cannot be empty');
    }
    if (!props.scientificName || props.scientificName.trim().length === 0) {
      throw new Error('Scientific name cannot be empty');
    }
    if (props.price < 0) {
      throw new Error('Price cannot be negative');
    }
    if (props.co2AbsorptionRateKgYear < 0) {
      throw new Error('CO2 absorption rate cannot be negative');
    }
  }

  // Getters
  public get id(): string | undefined {
    return this._id;
  }

  public get commonName(): string {
    return this._commonName;
  }

  public get scientificName(): string {
    return this._scientificName;
  }

  public get category(): TreeCategory {
    return this._category;
  }

  public get price(): number {
    return this._price;
  }

  public get co2AbsorptionRateKgYear(): number {
    return this._co2AbsorptionRateKgYear;
  }

  public get growthTimeline(): string {
    return this._growthTimeline;
  }

  public get careRequirements(): string {
    return this._careRequirements;
  }

  public get coverImages(): string[] {
    return [...this._coverImages];
  }

  public get location(): string {
    return this._location;
  }

  public get description(): string {
    return this._description;
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

  // Domain behavior / state changes
  public update(props: Partial<Omit<TreeVarietyProps, 'id' | 'createdAt' | 'updatedAt'>>): void {
    if (props.commonName !== undefined) {
      if (!props.commonName.trim()) throw new Error('Common name cannot be empty');
      this._commonName = props.commonName.trim();
    }
    if (props.scientificName !== undefined) {
      if (!props.scientificName.trim()) throw new Error('Scientific name cannot be empty');
      this._scientificName = props.scientificName.trim();
    }
    if (props.category !== undefined) {
      this._category = props.category;
    }
    if (props.price !== undefined) {
      if (props.price < 0) throw new Error('Price cannot be negative');
      this._price = props.price;
    }
    if (props.co2AbsorptionRateKgYear !== undefined) {
      if (props.co2AbsorptionRateKgYear < 0) throw new Error('CO2 absorption rate cannot be negative');
      this._co2AbsorptionRateKgYear = props.co2AbsorptionRateKgYear;
    }
    if (props.growthTimeline !== undefined) {
      this._growthTimeline = props.growthTimeline.trim();
    }
    if (props.careRequirements !== undefined) {
      this._careRequirements = props.careRequirements.trim();
    }
    if (props.coverImages !== undefined) {
      this._coverImages = props.coverImages;
    }
    if (props.location !== undefined) {
      this._location = props.location.trim();
    }
    if (props.description !== undefined) {
      this._description = props.description.trim();
    }
    if (props.isActive !== undefined) {
      this._isActive = props.isActive;
    }

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
