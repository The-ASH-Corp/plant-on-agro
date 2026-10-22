export type ExperienceCategory =
  | 'Forest Walk'
  | 'Harvesting'
  | 'Wellness'
  | 'Heritage Stay'
  | 'Farm Experience'
  | 'Adventure';

export interface ExperienceProps {
  id?: string;
  title: string;
  slug?: string;
  category: ExperienceCategory;
  tagline: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  included: string[];
  galleryImages: string[];
  featuredImage: string;
  maxGroupSize: number;
  rating?: number;
  reviewsCount?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Experience {
  private readonly _id?: string;
  private _title: string;
  private _slug: string;
  private _category: ExperienceCategory;
  private _tagline: string;
  private _description: string;
  private _location: string;
  private _duration: string;
  private _price: number;
  private _included: string[];
  private _galleryImages: string[];
  private _featuredImage: string;
  private _maxGroupSize: number;
  private _rating: number;
  private _reviewsCount: number;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ExperienceProps) {
    this.validate(props);

    this._id = props.id;
    this._title = props.title.trim();
    this._slug = props.slug
      ? props.slug.trim().toLowerCase()
      : props.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
    this._category = props.category;
    this._tagline = props.tagline.trim();
    this._description = props.description.trim();
    this._location = props.location.trim();
    this._duration = props.duration.trim();
    this._price = props.price >= 0 ? props.price : 0;
    this._included = Array.isArray(props.included) ? props.included.map((s) => s.trim()).filter(Boolean) : [];
    this._galleryImages = Array.isArray(props.galleryImages)
      ? props.galleryImages.map((s) => s.trim()).filter(Boolean)
      : [];
    this._featuredImage = props.featuredImage && props.featuredImage.trim().length > 0
      ? props.featuredImage.trim()
      : (this._galleryImages[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format');
    this._maxGroupSize = props.maxGroupSize > 0 ? props.maxGroupSize : 15;
    this._rating = props.rating !== undefined ? props.rating : 4.9;
    this._reviewsCount = props.reviewsCount !== undefined ? props.reviewsCount : 12;
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: ExperienceProps): void {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Experience title is required.');
    }
    if (!props.description || props.description.trim().length === 0) {
      throw new Error('Experience description is required.');
    }
    if (!props.location || props.location.trim().length === 0) {
      throw new Error('Experience location is required.');
    }
  }

  public get id(): string | undefined {
    return this._id;
  }
  public get title(): string {
    return this._title;
  }
  public get slug(): string {
    return this._slug;
  }
  public get category(): ExperienceCategory {
    return this._category;
  }
  public get tagline(): string {
    return this._tagline;
  }
  public get description(): string {
    return this._description;
  }
  public get location(): string {
    return this._location;
  }
  public get duration(): string {
    return this._duration;
  }
  public get price(): number {
    return this._price;
  }
  public get included(): string[] {
    return [...this._included];
  }
  public get galleryImages(): string[] {
    return [...this._galleryImages];
  }
  public get featuredImage(): string {
    return this._featuredImage;
  }
  public get maxGroupSize(): number {
    return this._maxGroupSize;
  }
  public get rating(): number {
    return this._rating;
  }
  public get reviewsCount(): number {
    return this._reviewsCount;
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

  public update(props: Partial<ExperienceProps>): void {
    if (props.title !== undefined) this._title = props.title.trim();
    if (props.slug !== undefined) this._slug = props.slug.trim().toLowerCase();
    if (props.category !== undefined) this._category = props.category;
    if (props.tagline !== undefined) this._tagline = props.tagline.trim();
    if (props.description !== undefined) this._description = props.description.trim();
    if (props.location !== undefined) this._location = props.location.trim();
    if (props.duration !== undefined) this._duration = props.duration.trim();
    if (props.price !== undefined) this._price = Math.max(0, props.price);
    if (props.included !== undefined) this._included = props.included.map((s) => s.trim()).filter(Boolean);
    if (props.galleryImages !== undefined) {
      this._galleryImages = props.galleryImages.map((s) => s.trim()).filter(Boolean);
      if (!this._featuredImage && this._galleryImages.length > 0) {
        this._featuredImage = this._galleryImages[0];
      }
    }
    if (props.featuredImage !== undefined && props.featuredImage.trim().length > 0) {
      this._featuredImage = props.featuredImage.trim();
    }
    if (props.maxGroupSize !== undefined) this._maxGroupSize = Math.max(1, props.maxGroupSize);
    if (props.isActive !== undefined) this._isActive = props.isActive;
    this._updatedAt = new Date();
  }
}
