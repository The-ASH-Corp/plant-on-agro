export type VisitBookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface VisitMemory {
  imageUrl: string;
  caption?: string;
  recordedAt?: Date;
}

export interface VisitBookingProps {
  id?: string;
  bookingReference: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  experienceId?: string;
  experienceTitle: string;
  reserveName: string;
  visitDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "Morning Slot (08:30 AM - 12:30 PM)"
  numberOfGuests: number;
  associatedTrees?: string[]; // Tree tags the adopter wants to visit
  specialRequests?: string;
  status?: VisitBookingStatus;
  guestPassCode: string;
  guideName?: string;
  notes?: string;
  memories?: VisitMemory[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class VisitBooking {
  private readonly _id?: string;
  private _bookingReference: string;
  private _adopterName: string;
  private _adopterEmail: string;
  private _adopterPhone: string;
  private _experienceId?: string;
  private _experienceTitle: string;
  private _reserveName: string;
  private _visitDate: string;
  private _timeSlot: string;
  private _numberOfGuests: number;
  private _associatedTrees: string[];
  private _specialRequests: string;
  private _status: VisitBookingStatus;
  private _guestPassCode: string;
  private _guideName: string;
  private _notes: string;
  private _memories: VisitMemory[];
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: VisitBookingProps) {
    this.validate(props);

    this._id = props.id;
    this._bookingReference = props.bookingReference.trim().toUpperCase();
    this._adopterName = props.adopterName.trim();
    this._adopterEmail = props.adopterEmail.trim().toLowerCase();
    this._adopterPhone = props.adopterPhone ? props.adopterPhone.trim() : '';
    this._experienceId = props.experienceId;
    this._experienceTitle = props.experienceTitle ? props.experienceTitle.trim() : 'General Plantation Visit';
    this._reserveName = props.reserveName.trim();
    this._visitDate = props.visitDate.trim();
    this._timeSlot = props.timeSlot.trim();
    this._numberOfGuests = props.numberOfGuests > 0 ? props.numberOfGuests : 1;
    this._associatedTrees = Array.isArray(props.associatedTrees)
      ? props.associatedTrees.map((t) => t.trim().toUpperCase()).filter(Boolean)
      : [];
    this._specialRequests = props.specialRequests ? props.specialRequests.trim() : '';
    this._status = props.status ?? 'Confirmed';
    this._guestPassCode = props.guestPassCode || `GP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    this._guideName = props.guideName ? props.guideName.trim() : '';
    this._notes = props.notes ? props.notes.trim() : '';
    this._memories = Array.isArray(props.memories) ? props.memories : [];
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: VisitBookingProps): void {
    if (!props.adopterName || props.adopterName.trim().length === 0) {
      throw new Error('Adopter name is required for visit booking.');
    }
    if (!props.adopterEmail || props.adopterEmail.trim().length === 0) {
      throw new Error('Adopter email is required for visit booking.');
    }
    if (!props.reserveName || props.reserveName.trim().length === 0) {
      throw new Error('Reserve location is required for visit booking.');
    }
    if (!props.visitDate || props.visitDate.trim().length === 0) {
      throw new Error('Visit date is required.');
    }
  }

  public get id(): string | undefined {
    return this._id;
  }
  public get bookingReference(): string {
    return this._bookingReference;
  }
  public get adopterName(): string {
    return this._adopterName;
  }
  public get adopterEmail(): string {
    return this._adopterEmail;
  }
  public get adopterPhone(): string {
    return this._adopterPhone;
  }
  public get experienceId(): string | undefined {
    return this._experienceId;
  }
  public get experienceTitle(): string {
    return this._experienceTitle;
  }
  public get reserveName(): string {
    return this._reserveName;
  }
  public get visitDate(): string {
    return this._visitDate;
  }
  public get timeSlot(): string {
    return this._timeSlot;
  }
  public get numberOfGuests(): number {
    return this._numberOfGuests;
  }
  public get associatedTrees(): string[] {
    return [...this._associatedTrees];
  }
  public get specialRequests(): string {
    return this._specialRequests;
  }
  public get status(): VisitBookingStatus {
    return this._status;
  }
  public get guestPassCode(): string {
    return this._guestPassCode;
  }
  public get guideName(): string {
    return this._guideName;
  }
  public get notes(): string {
    return this._notes;
  }
  public get memories(): VisitMemory[] {
    return [...this._memories];
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateStatus(status: VisitBookingStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  public updateGuide(guideName: string): void {
    this._guideName = guideName.trim();
    this._updatedAt = new Date();
  }

  public addMemory(memory: VisitMemory): void {
    this._memories.push({
      imageUrl: memory.imageUrl,
      caption: memory.caption || '',
      recordedAt: memory.recordedAt || new Date(),
    });
    this._updatedAt = new Date();
  }
}
