import crypto from 'crypto';

export type CertificateStatus = 'Issued' | 'Pending Generation' | 'Revoked';

export interface CertificateProps {
  id?: string;
  certificateNumber: string; // Unique certificate serial ID e.g. "POA-CERT-2026-88219"
  certificateHash?: string; // Cryptographic verification hash
  orderRef: string; // Reference to adoption order
  recipientName: string; // Name of certificate recipient / dedication
  dedicatedMessage: string; // Dedicated message for occasion
  issueDate: Date; // Date certificate was officially issued
  pdfUrl?: string; // Download link for PDF
  qrCodeVerificationUrl?: string; // Direct QR link to verify authenticity
  treeTag?: string; // Associated physical tree tag
  treeSpecies?: string; // Species adopted e.g. "Indian Mango"
  reserveName?: string; // Location planted
  adopterName?: string; // Adopter / buyer name
  status?: CertificateStatus;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Certificate {
  private readonly _id?: string;
  private _certificateNumber: string;
  private _certificateHash: string;
  private _orderRef: string;
  private _recipientName: string;
  private _dedicatedMessage: string;
  private _issueDate: Date;
  private _pdfUrl: string;
  private _qrCodeVerificationUrl: string;
  private _treeTag: string;
  private _treeSpecies: string;
  private _reserveName: string;
  private _adopterName: string;
  private _status: CertificateStatus;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CertificateProps) {
    this.validate(props);

    this._id = props.id;
    this._certificateNumber = props.certificateNumber.trim().toUpperCase();
    this._orderRef = props.orderRef.trim();
    this._recipientName = props.recipientName.trim();
    this._dedicatedMessage = props.dedicatedMessage.trim();
    this._issueDate = props.issueDate instanceof Date ? props.issueDate : new Date(props.issueDate);
    this._status = props.status || 'Issued';
    this._treeTag = props.treeTag ? props.treeTag.trim().toUpperCase() : '';
    this._treeSpecies = props.treeSpecies ? props.treeSpecies.trim() : '';
    this._reserveName = props.reserveName ? props.reserveName.trim() : '';
    this._adopterName = props.adopterName ? props.adopterName.trim() : '';
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    // Auto-generate verification hash if not provided
    this._certificateHash = props.certificateHash?.trim() || this.generateVerificationHash();

    // Setup PDF download and verification URLs
    this._qrCodeVerificationUrl =
      props.qrCodeVerificationUrl?.trim() ||
      `/verify/${this._certificateHash}`;
    this._pdfUrl =
      props.pdfUrl?.trim() ||
      `/api/v1/certificates/${this._certificateNumber}/download`;
  }

  private validate(props: CertificateProps): void {
    if (!props.certificateNumber || props.certificateNumber.trim().length === 0) {
      throw new Error('Certificate ID/number cannot be empty');
    }
    if (!props.orderRef || props.orderRef.trim().length === 0) {
      throw new Error('Order reference cannot be empty');
    }
    if (!props.recipientName || props.recipientName.trim().length === 0) {
      throw new Error('Recipient name cannot be empty');
    }
    if (!props.dedicatedMessage || props.dedicatedMessage.trim().length === 0) {
      throw new Error('Dedicated message cannot be empty');
    }
    if (!props.issueDate) {
      throw new Error('Issue date is required');
    }
  }

  private generateVerificationHash(): string {
    const raw = `${this._certificateNumber}:${this._orderRef}:${this._recipientName}:${this._issueDate.getTime()}`;
    return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 32);
  }

  // Getters
  public get id(): string | undefined {
    return this._id;
  }

  public get certificateNumber(): string {
    return this._certificateNumber;
  }

  public get certificateHash(): string {
    return this._certificateHash;
  }

  public get orderRef(): string {
    return this._orderRef;
  }

  public get recipientName(): string {
    return this._recipientName;
  }

  public get dedicatedMessage(): string {
    return this._dedicatedMessage;
  }

  public get issueDate(): Date {
    return this._issueDate;
  }

  public get pdfUrl(): string {
    return this._pdfUrl;
  }

  public get qrCodeVerificationUrl(): string {
    return this._qrCodeVerificationUrl;
  }

  public get treeTag(): string {
    return this._treeTag;
  }

  public get treeSpecies(): string {
    return this._treeSpecies;
  }

  public get reserveName(): string {
    return this._reserveName;
  }

  public get adopterName(): string {
    return this._adopterName;
  }

  public get status(): CertificateStatus {
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

  // Domain behavior / state changes
  public update(props: Partial<Omit<CertificateProps, 'id' | 'createdAt' | 'updatedAt'>>): void {
    if (props.certificateNumber !== undefined) {
      if (!props.certificateNumber.trim()) throw new Error('Certificate number cannot be empty');
      this._certificateNumber = props.certificateNumber.trim().toUpperCase();
    }
    if (props.orderRef !== undefined) {
      if (!props.orderRef.trim()) throw new Error('Order reference cannot be empty');
      this._orderRef = props.orderRef.trim();
    }
    if (props.recipientName !== undefined) {
      if (!props.recipientName.trim()) throw new Error('Recipient name cannot be empty');
      this._recipientName = props.recipientName.trim();
    }
    if (props.dedicatedMessage !== undefined) {
      if (!props.dedicatedMessage.trim()) throw new Error('Dedicated message cannot be empty');
      this._dedicatedMessage = props.dedicatedMessage.trim();
    }
    if (props.issueDate !== undefined) {
      this._issueDate = props.issueDate instanceof Date ? props.issueDate : new Date(props.issueDate);
    }
    if (props.pdfUrl !== undefined) {
      this._pdfUrl = props.pdfUrl.trim();
    }
    if (props.qrCodeVerificationUrl !== undefined) {
      this._qrCodeVerificationUrl = props.qrCodeVerificationUrl.trim();
    }
    if (props.treeTag !== undefined) {
      this._treeTag = props.treeTag.trim().toUpperCase();
    }
    if (props.treeSpecies !== undefined) {
      this._treeSpecies = props.treeSpecies.trim();
    }
    if (props.reserveName !== undefined) {
      this._reserveName = props.reserveName.trim();
    }
    if (props.adopterName !== undefined) {
      this._adopterName = props.adopterName.trim();
    }
    if (props.status !== undefined) {
      this._status = props.status;
    }
    if (props.isActive !== undefined) {
      this._isActive = props.isActive;
    }

    this._updatedAt = new Date();
  }

  public revoke(): void {
    this._status = 'Revoked';
    this._updatedAt = new Date();
  }

  public reissue(newIssueDate: Date = new Date()): void {
    this._issueDate = newIssueDate;
    this._status = 'Issued';
    this._certificateHash = this.generateVerificationHash();
    this._qrCodeVerificationUrl = `/verify/${this._certificateHash}`;
    this._updatedAt = new Date();
  }
}
