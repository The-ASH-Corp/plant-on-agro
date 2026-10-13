import { Email } from '../value-objects/email.vo';
import { HashedPassword } from '../value-objects/password.vo';

export type UserRole = 'admin' | 'farmer' | 'buyer';

export interface UserProps {
  id?: string;
  name: string;
  email: Email;
  passwordHash?: HashedPassword;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly _id?: string;
  private _name: string;
  private _email: Email;
  private _passwordHash?: HashedPassword;
  private _role: UserRole;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._role = props.role;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  // Getters
  public get id(): string | undefined {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): Email {
    return this._email;
  }

  public get passwordHash(): HashedPassword | undefined {
    return this._passwordHash;
  }

  public hasPassword(): boolean {
    return !!this._passwordHash;
  }

  public updatePassword(newPasswordHash: HashedPassword): void {
    this._passwordHash = newPasswordHash;
    this._updatedAt = new Date();
  }

  public get role(): UserRole {
    return this._role;
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
  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this._name = newName.trim();
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }
}
