export interface IPasswordHasher {
  /**
   * Hashes a plaintext password using a cryptographically secure algorithm.
   */
  hash(plainText: string): Promise<string>;

  /**
   * Verifies that a plaintext password matches an existing cryptographic hash.
   */
  verify(hashed: string, plainText: string): Promise<boolean>;
}
