export interface PasswordResetOtpProps {
  id?: string;
  email: string;
  otp: string;
  expiresAt: Date;
  used: boolean;
  attempts: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PasswordResetOtp {
  private readonly _id?: string;
  private readonly _email: string;
  private readonly _otp: string;
  private readonly _expiresAt: Date;
  private _used: boolean;
  private _attempts: number;
  private readonly _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: PasswordResetOtpProps) {
    this._id = props.id;
    this._email = props.email.trim().toLowerCase();
    this._otp = props.otp.trim();
    this._expiresAt = props.expiresAt;
    this._used = props.used ?? false;
    this._attempts = props.attempts ?? 0;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get email(): string {
    return this._email;
  }

  public get otp(): string {
    return this._otp;
  }

  public get expiresAt(): Date {
    return this._expiresAt;
  }

  public get used(): boolean {
    return this._used;
  }

  public get attempts(): number {
    return this._attempts;
  }

  public get createdAt(): Date | undefined {
    return this._createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  public isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  public isMaxAttemptsExceeded(maxAllowed = 5): boolean {
    return this._attempts >= maxAllowed;
  }

  public matches(candidateOtp: string): boolean {
    return this._otp === candidateOtp.trim();
  }
}
