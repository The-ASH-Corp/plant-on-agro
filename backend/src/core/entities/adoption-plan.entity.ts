export type OccasionDedication =
  | 'birthday'
  | 'memorial'
  | 'anniversary'
  | 'corporate'
  | 'general';

export interface AdoptionPlanProps {
  id?: string;
  planLabel: string;
  icon: string;
  priceModifier: number; // positive = extra charge, negative = subsidy/discount, 0 = standard
  description: string;
  features: string[];
  occasionDedications: OccasionDedication[];
  badge?: string;
  activeCount?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AdoptionPlan {
  private readonly _id?: string;
  private _planLabel: string;
  private _icon: string;
  private _priceModifier: number;
  private _description: string;
  private _features: string[];
  private _occasionDedications: OccasionDedication[];
  private _badge: string;
  private _activeCount: number;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: AdoptionPlanProps) {
    this.validate(props);

    this._id = props.id;
    this._planLabel = props.planLabel.trim();
    this._icon = props.icon.trim() || '🌱';
    this._priceModifier = props.priceModifier;
    this._description = props.description.trim();
    this._features = props.features ?? [];
    this._occasionDedications = props.occasionDedications ?? ['general'];
    this._badge = props.badge ? props.badge.trim() : 'Standard';
    this._activeCount = props.activeCount ?? 0;
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: AdoptionPlanProps): void {
    if (!props.planLabel || props.planLabel.trim().length === 0) {
      throw new Error('Plan label cannot be empty');
    }
    if (!props.description || props.description.trim().length === 0) {
      throw new Error('Description cannot be empty');
    }
  }

  // Getters
  public get id(): string | undefined {
    return this._id;
  }

  public get planLabel(): string {
    return this._planLabel;
  }

  public get icon(): string {
    return this._icon;
  }

  public get priceModifier(): number {
    return this._priceModifier;
  }

  public get description(): string {
    return this._description;
  }

  public get features(): string[] {
    return [...this._features];
  }

  public get occasionDedications(): OccasionDedication[] {
    return [...this._occasionDedications];
  }

  public get badge(): string {
    return this._badge;
  }

  public get activeCount(): number {
    return this._activeCount;
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
  public update(props: Partial<Omit<AdoptionPlanProps, 'id' | 'createdAt' | 'updatedAt'>>): void {
    if (props.planLabel !== undefined) {
      if (!props.planLabel.trim()) throw new Error('Plan label cannot be empty');
      this._planLabel = props.planLabel.trim();
    }
    if (props.icon !== undefined) {
      this._icon = props.icon.trim() || '🌱';
    }
    if (props.priceModifier !== undefined) {
      this._priceModifier = props.priceModifier;
    }
    if (props.description !== undefined) {
      if (!props.description.trim()) throw new Error('Description cannot be empty');
      this._description = props.description.trim();
    }
    if (props.features !== undefined) {
      this._features = props.features;
    }
    if (props.occasionDedications !== undefined) {
      this._occasionDedications = props.occasionDedications;
    }
    if (props.badge !== undefined) {
      this._badge = props.badge.trim();
    }
    if (props.activeCount !== undefined) {
      this._activeCount = props.activeCount;
    }
    if (props.isActive !== undefined) {
      this._isActive = props.isActive;
    }

    this._updatedAt = new Date();
  }

  public incrementAdopterCount(): void {
    this._activeCount += 1;
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
