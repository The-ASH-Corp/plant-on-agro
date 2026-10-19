export type AdoptionOrderStatus =
  | 'New Request'
  | 'Verified & Tagged'
  | 'Planted'
  | 'Pending Drone Scan'
  | 'Certificate Issued'
  | 'Completed';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  treeVarietyId?: string;
  treeSpecies: string;
  scientificName?: string;
  category?: string;
  planType: string;
  reserveName: string; // The designated reserve parcel where we plant the tree
  gpsCoords?: string; // Exact physical coordinates where planted
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface OrderProps {
  id?: string;
  orderNumber: string;
  invoiceNumber?: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  billingAddress?: BillingAddress;
  items?: OrderItem[];
  treeSpecies: string;
  scientificName?: string;
  category?: string;
  reserveName: string; // Designated reserve / plantation location requested by client
  gpsCoords?: string; // Geotagged ground coordinates
  planType: string; // e.g. "Individual", "Memorial", "Birthday", "Corporate"
  dedicationMessage?: string; // Personalized dedication or arborist instructions
  quantity: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  transactionRef?: string;
  status?: AdoptionOrderStatus;
  certificateId?: string;
  ndviScore?: number;
  isRead?: boolean;
  notes?: string;
  datePlanted?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  private readonly _id?: string;
  private _orderNumber: string;
  private _invoiceNumber: string;
  private _adopterName: string;
  private _adopterEmail: string;
  private _adopterPhone: string;
  private _billingAddress: BillingAddress;
  private _items: OrderItem[];
  private _treeSpecies: string;
  private _scientificName: string;
  private _category: string;
  private _reserveName: string;
  private _gpsCoords: string;
  private _planType: string;
  private _dedicationMessage: string;
  private _quantity: number;
  private _totalAmount: number;
  private _paymentMethod: string;
  private _paymentStatus: PaymentStatus;
  private _transactionRef: string;
  private _status: AdoptionOrderStatus;
  private _certificateId: string;
  private _ndviScore: number;
  private _isRead: boolean;
  private _notes: string;
  private _datePlanted: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: OrderProps) {
    this.validate(props);

    this._id = props.id;
    this._orderNumber = props.orderNumber.trim().toUpperCase();
    this._invoiceNumber =
      props.invoiceNumber?.trim() ||
      `INV-${new Date().getFullYear()}-${this._orderNumber.replace(/^ORD-?/, '')}`;
    this._adopterName = props.adopterName.trim();
    this._adopterEmail = props.adopterEmail.trim().toLowerCase();
    this._adopterPhone = props.adopterPhone ? props.adopterPhone.trim() : '';
    this._billingAddress = props.billingAddress || {};
    this._items = props.items || [];
    this._treeSpecies = props.treeSpecies.trim();
    this._scientificName = props.scientificName ? props.scientificName.trim() : '';
    this._category = props.category ? props.category.trim() : 'Fruit Trees';
    this._reserveName = props.reserveName.trim();
    this._gpsCoords = props.gpsCoords ? props.gpsCoords.trim() : '';
    this._planType = props.planType.trim();
    this._dedicationMessage = props.dedicationMessage ? props.dedicationMessage.trim() : '';
    this._quantity = props.quantity;
    this._totalAmount = props.totalAmount;
    this._paymentMethod = props.paymentMethod || 'sandbox';
    this._paymentStatus = props.paymentStatus || 'Paid';
    this._transactionRef =
      props.transactionRef ||
      `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    this._status = props.status || 'New Request';
    this._certificateId =
      props.certificateId || `CERT-${this._orderNumber}`;
    this._ndviScore = props.ndviScore !== undefined ? props.ndviScore : 0.91;
    this._isRead = props.isRead !== undefined ? props.isRead : false;
    this._notes = props.notes || '';
    this._datePlanted = props.datePlanted || new Date();
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: OrderProps): void {
    if (!props.orderNumber || props.orderNumber.trim().length === 0) {
      throw new Error('Order number is required');
    }
    if (!props.adopterName || props.adopterName.trim().length === 0) {
      throw new Error('Adopter name is required');
    }
    if (!props.adopterEmail || props.adopterEmail.trim().length === 0) {
      throw new Error('Adopter email is required');
    }
    if (!props.treeSpecies || props.treeSpecies.trim().length === 0) {
      throw new Error('Tree species is required');
    }
    if (!props.reserveName || props.reserveName.trim().length === 0) {
      throw new Error('Plantation reserve location is required');
    }
    if (props.quantity <= 0) {
      throw new Error('Order quantity must be greater than zero');
    }
    if (props.totalAmount < 0) {
      throw new Error('Order total amount cannot be negative');
    }
  }

  // Getters
  public get id(): string | undefined {
    return this._id;
  }

  public get orderNumber(): string {
    return this._orderNumber;
  }

  public get invoiceNumber(): string {
    return this._invoiceNumber;
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

  public get billingAddress(): BillingAddress {
    return { ...this._billingAddress };
  }

  public get items(): OrderItem[] {
    return [...this._items];
  }

  public get treeSpecies(): string {
    return this._treeSpecies;
  }

  public get scientificName(): string {
    return this._scientificName;
  }

  public get category(): string {
    return this._category;
  }

  public get reserveName(): string {
    return this._reserveName;
  }

  public get gpsCoords(): string {
    return this._gpsCoords;
  }

  public get planType(): string {
    return this._planType;
  }

  public get dedicationMessage(): string {
    return this._dedicationMessage;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public get totalAmount(): number {
    return this._totalAmount;
  }

  public get paymentMethod(): string {
    return this._paymentMethod;
  }

  public get paymentStatus(): PaymentStatus {
    return this._paymentStatus;
  }

  public get transactionRef(): string {
    return this._transactionRef;
  }

  public get status(): AdoptionOrderStatus {
    return this._status;
  }

  public get certificateId(): string {
    return this._certificateId;
  }

  public get ndviScore(): number {
    return this._ndviScore;
  }

  public get isRead(): boolean {
    return this._isRead;
  }

  public get notes(): string {
    return this._notes;
  }

  public get datePlanted(): Date {
    return this._datePlanted;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain behavior / state changes
  public updateStatus(newStatus: AdoptionOrderStatus): void {
    this._status = newStatus;
    this._isRead = true;
    this._updatedAt = new Date();
  }

  public updatePaymentStatus(status: PaymentStatus, transactionRef?: string): void {
    this._paymentStatus = status;
    if (transactionRef) {
      this._transactionRef = transactionRef;
    }
    this._updatedAt = new Date();
  }

  public markAsRead(): void {
    this._isRead = true;
    this._updatedAt = new Date();
  }

  public setCertificateId(certificateId: string): void {
    this._certificateId = certificateId;
    this._updatedAt = new Date();
  }

  public updateNotes(notes: string): void {
    this._notes = notes;
    this._updatedAt = new Date();
  }

  public updateGpsCoords(coords: string): void {
    this._gpsCoords = coords;
    this._updatedAt = new Date();
  }
}
