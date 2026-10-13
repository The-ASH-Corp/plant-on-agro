import { BadRequestError } from '../errors/app-error';

export class Password {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128; 

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }


  public static create(plainText: string): Password {
    if (!plainText || typeof plainText !== 'string') {
      throw new BadRequestError('Password must be a non-empty string');
    }

    if (plainText.length < Password.MIN_LENGTH) {
      throw new BadRequestError(
        `Password must be at least ${Password.MIN_LENGTH} characters long`
      );
    }

    if (plainText.length > Password.MAX_LENGTH) {
      throw new BadRequestError(
        `Password must not exceed ${Password.MAX_LENGTH} characters`
      );
    }

    // OWASP Complexity Rules
    const hasUppercase = /[A-Z]/.test(plainText);
    const hasLowercase = /[a-z]/.test(plainText);
    const hasDigit = /[0-9]/.test(plainText);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(plainText);

    if (!hasUppercase) {
      throw new BadRequestError('Password must contain at least one uppercase letter');
    }
    if (!hasLowercase) {
      throw new BadRequestError('Password must contain at least one lowercase letter');
    }
    if (!hasDigit) {
      throw new BadRequestError('Password must contain at least one numeric digit');
    }
    if (!hasSpecialChar) {
      throw new BadRequestError('Password must contain at least one special character');
    }

    // Prevent null byte injections or ASCII control characters
    if (/[\x00-\x1F\x7F]/.test(plainText)) {
      throw new BadRequestError('Password contains invalid control characters');
    }

    return new Password(plainText);
  }

  public getValue(): string {
    return this.value;
  }
}

export class HashedPassword {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(hash: string): HashedPassword {
    if (!hash || typeof hash !== 'string' || hash.trim().length === 0) {
      throw new BadRequestError('Hashed password cannot be empty');
    }

    // Argon2 hashes begin with $argon2id$ (or $argon2i$ / $argon2d$)
    if (!hash.startsWith('$argon2')) {
      throw new BadRequestError('Invalid Argon2 password hash format');
    }

    return new HashedPassword(hash);
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return '[PROTECTED_HASH]'; // Prevents accidental leakage in string conversions or logs
  }
}
