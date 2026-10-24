export interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'buyer';
}

export interface ResetPasswordTokenPayload {
  email: string;
  otpId: string;
  purpose: 'password_reset';
}

export interface IJwtService {
  /**
   * Generates a signed JSON Web Token containing the user payload.
   */
  generateToken(payload: UserPayload): string;

  /**
   * Verifies and decodes a signed JSON Web Token.
   * Throws an error if the token is invalid or expired.
   */
  verifyToken(token: string): UserPayload;

  /**
   * Generates a short-lived cryptographic binding token for password reset verification.
   */
  generateResetToken(payload: ResetPasswordTokenPayload, expiresIn?: string): string;

  /**
   * Verifies and decodes the password reset binding token.
   * Throws an UnauthorizedError if expired or invalid.
   */
  verifyResetToken(token: string): ResetPasswordTokenPayload;
}
