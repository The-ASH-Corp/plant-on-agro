export interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'buyer';
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
}
