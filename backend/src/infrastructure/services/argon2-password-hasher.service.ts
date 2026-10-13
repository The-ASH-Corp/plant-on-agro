import { hash, verify, argon2id, HashOptions } from 'argon2';
import { IPasswordHasher } from '../../core/interfaces/password-hasher.interface';


export class Argon2PasswordHasher implements IPasswordHasher {
  private readonly options: HashOptions & { raw: false };

  constructor(customOptions?: Partial<HashOptions>) {
    this.options = {
      type: argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,       // 3 iterations
      parallelism: 1,    // 1 lane
      hashLength: 32,    // 32-byte output
      raw: false,
      ...customOptions,
    };
  }

 
  public async hash(plainText: string): Promise<string> {
    return hash(plainText, this.options);
  }

 
  public async verify(hashed: string, plainText: string): Promise<boolean> {
    try {
      return await verify(hashed, plainText);
    } catch {
     
      return false;
    }
  }
}
