import readline from 'readline';
import { Database } from '../infrastructure/database/connection';
import { MongoUserRepository } from '../infrastructure/repositories/mongo-user.repository';
import { Argon2PasswordHasher } from '../infrastructure/services/argon2-password-hasher.service';
import { Email } from '../core/value-objects/email.vo';
import { Password, HashedPassword } from '../core/value-objects/password.vo';
import { User } from '../core/entities/user.entity';

// Colors and styles for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};


class TerminalReader {
  private readonly isTTY: boolean;
  private readonly lineBuffer: string[] = [];
  private readonly lineResolvers: ((val: string) => void)[] = [];
  private rl?: readline.Interface;

  constructor() {
    this.isTTY = Boolean(process.stdin.isTTY);

    if (!this.isTTY) {
      this.rl = readline.createInterface({ input: process.stdin, terminal: false });
      this.rl.on('line', (line) => {
        const trimmed = line.trim();
        if (this.lineResolvers.length > 0) {
          const resolve = this.lineResolvers.shift()!;
          resolve(trimmed);
        } else {
          this.lineBuffer.push(trimmed);
        }
      });
    }
  }

  public ask(query: string): Promise<string> {
    if (!this.isTTY) {
      process.stdout.write(query);
      if (this.lineBuffer.length > 0) {
        const val = this.lineBuffer.shift()!;
        process.stdout.write(`${val}\n`);
        return Promise.resolve(val);
      }
      return new Promise((resolve) => {
        this.lineResolvers.push((val) => {
          process.stdout.write(`${val}\n`);
          resolve(val);
        });
      });
    }

    return new Promise((resolve) => {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      rl.question(query, (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    });
  }

  public askPassword(query: string): Promise<string> {
    if (!this.isTTY) {
      return this.ask(query);
    }

    process.stdout.write(query);
    return new Promise((resolve) => {
      let pwd = '';
      const wasRaw = process.stdin.isRaw;
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      const onData = (chunk: string) => {
        for (const char of chunk) {
          if (char === '\n' || char === '\r' || char === '\u0004') {
            process.stdin.removeListener('data', onData);
            process.stdin.setRawMode(wasRaw || false);
            process.stdin.pause();
            process.stdout.write('\n');
            resolve(pwd);
            return;
          } else if (char === '\u0003') {
            // Ctrl+C
            process.stdout.write('\n');
            process.exit(130);
          } else if (char === '\u007f' || char === '\b') {
            if (pwd.length > 0) {
              pwd = pwd.slice(0, -1);
              process.stdout.write('\b \b');
            }
          } else if (char >= ' ') {
            pwd += char;
            process.stdout.write('*');
          }
        }
      };

      process.stdin.on('data', onData);
    });
  }

  public close(): void {
    if (this.rl) {
      this.rl.close();
    }
  }
}


function parseArgs(): {
  name?: string;
  email?: string;
  password?: string;
  autoConfirm: boolean;
} {
  const args = process.argv.slice(2);
  const result: {
    name?: string;
    email?: string;
    password?: string;
    autoConfirm: boolean;
  } = { autoConfirm: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--name' || arg === '-n') {
      result.name = args[++i];
    } else if (arg.startsWith('--name=')) {
      result.name = arg.split('=')[1];
    } else if (arg === '--email' || arg === '-e') {
      result.email = args[++i];
    } else if (arg.startsWith('--email=')) {
      result.email = arg.split('=')[1];
    } else if (arg === '--password' || arg === '-p') {
      result.password = args[++i];
    } else if (arg.startsWith('--password=')) {
      result.password = arg.split('=')[1];
    } else if (arg === '--yes' || arg === '-y') {
      result.autoConfirm = true;
    } else if (!arg.startsWith('-')) {
      if (!result.name) {
        result.name = arg;
      } else if (!result.email) {
        result.email = arg;
      } else if (!result.password) {
        result.password = arg;
      }
    }
  }

  return result;
}

async function getValidName(reader: TerminalReader, initial?: string): Promise<string> {
  if (initial && initial.trim().length >= 2) {
    return initial.trim();
  }

  while (true) {
    const name = await reader.ask(`${colors.cyan}?${colors.reset} ${colors.bold}Enter the name:${colors.reset} `);
    if (name.length >= 2) {
      return name;
    }
    console.log(`${colors.red}❌ Name must be at least 2 characters long. Please try again.${colors.reset}`);
  }
}

async function getValidEmail(reader: TerminalReader, initial?: string): Promise<Email> {
  if (initial) {
    try {
      return Email.create(initial);
    } catch {
      console.log(`${colors.yellow}⚠️ Initial email "${initial}" is invalid.${colors.reset}`);
    }
  }

  while (true) {
    const emailStr = await reader.ask(`${colors.cyan}?${colors.reset} ${colors.bold}Enter email:${colors.reset} `);
    try {
      return Email.create(emailStr);
    } catch {
      console.log(`${colors.red}❌ Invalid email format (example: admin@example.com). Please try again.${colors.reset}`);
    }
  }
}

async function getValidPassword(reader: TerminalReader, initial?: string, isInteractive = true): Promise<Password> {
  if (initial) {
    try {
      return Password.create(initial);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`${colors.yellow}⚠️ Provided password invalid: ${msg}${colors.reset}`);
    }
  }

  while (true) {
    console.log(`${colors.gray}Password rules: min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character (!@#$%^&*...)${colors.reset}`);
    const pwdStr = await reader.askPassword(`${colors.cyan}?${colors.reset} ${colors.bold}Enter the password:${colors.reset} `);

    try {
      const passwordVO = Password.create(pwdStr);

      if (isInteractive) {
        const confirmStr = await reader.askPassword(`${colors.cyan}?${colors.reset} ${colors.bold}Confirm password:${colors.reset} `);
        if (pwdStr !== confirmStr) {
          console.log(`${colors.red}❌ Passwords do not match. Please try again.${colors.reset}\n`);
          continue;
        }
      }

      return passwordVO;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`${colors.red}❌ ${msg}. Please try again.${colors.reset}\n`);
    }
  }
}

async function seedAdmin(): Promise<void> {
  console.log(`\n${colors.green}${colors.bold}==============================================${colors.reset}`);
  console.log(`${colors.green}${colors.bold}       🌱 Plant-on-Agro Admin Seeder          ${colors.reset}`);
  console.log(`${colors.green}${colors.bold}==============================================${colors.reset}\n`);

  const args = parseArgs();
  const reader = new TerminalReader();
  const isInteractive = !args.name || !args.email || !args.password;

  try {
    if (isInteractive) {
      console.log(`${colors.cyan}Please enter the admin details below:${colors.reset}\n`);
    }

    // 1. Collect terminal input
    const name = await getValidName(reader, args.name);
    const emailVO = await getValidEmail(reader, args.email);
    const passwordVO = await getValidPassword(reader, args.password, isInteractive);

    const userRepository = new MongoUserRepository();
    const passwordHasher = new Argon2PasswordHasher();

    // 2. Connect to Database
    console.log(`\n${colors.dim}Connecting to MongoDB...${colors.reset}`);
    await Database.connect();

    // 3. Check for existing user with this email
    const existingUser = await userRepository.findByEmail(emailVO.getValue());

    if (existingUser) {
      console.log(`\n${colors.yellow}⚠️ A user with email "${emailVO.getValue()}" already exists.${colors.reset}`);
      console.log(`${colors.yellow}   Current Role:   ${existingUser.role}${colors.reset}`);
      console.log(`${colors.yellow}   Current Status: ${existingUser.isActive ? 'Active' : 'Inactive'}${colors.reset}`);

      let shouldUpdate = args.autoConfirm;
      if (!shouldUpdate) {
        const answer = await reader.ask(
          `\n${colors.cyan}?${colors.reset} ${colors.bold}Do you want to update this user's password and ensure "admin" role? (y/N):${colors.reset} `
        );
        shouldUpdate = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
      }

      if (!shouldUpdate) {
        console.log(`\n${colors.gray}Operation cancelled. Existing user was not modified.${colors.reset}\n`);
        return;
      }

      console.log(`\n${colors.dim}Hashing new password with Argon2id...${colors.reset}`);
      const rawHash = await passwordHasher.hash(passwordVO.getValue());
      const passwordHashVO = HashedPassword.create(rawHash);

      existingUser.updateName(name);
      existingUser.updatePassword(passwordHashVO);
      existingUser.changeRole('admin');
      if (!existingUser.isActive) {
        existingUser.activate();
      }

      const updatedUser = await userRepository.update(existingUser);

      console.log(`\n${colors.green}${colors.bold}✅ Admin user updated successfully!${colors.reset}`);
      console.log(`${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
      console.log(` ${colors.bold}User ID:${colors.reset}    ${updatedUser.id}`);
      console.log(` ${colors.bold}Name:${colors.reset}       ${updatedUser.name}`);
      console.log(` ${colors.bold}Email:${colors.reset}      ${updatedUser.email.getValue()}`);
      console.log(` ${colors.bold}Role:${colors.reset}       ${colors.green}${updatedUser.role}${colors.reset}`);
      console.log(` ${colors.bold}Status:${colors.reset}     ${updatedUser.isActive ? 'Active' : 'Inactive'}`);
      console.log(` ${colors.bold}Updated At:${colors.reset} ${updatedUser.updatedAt.toISOString()}`);
      console.log(`${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
      return;
    }

    // 4. Create new admin user
    console.log(`\n${colors.dim}Hashing password with Argon2id...${colors.reset}`);
    const rawHash = await passwordHasher.hash(passwordVO.getValue());
    const passwordHashVO = HashedPassword.create(rawHash);

    const newAdmin = new User({
      name: name,
      email: emailVO,
      passwordHash: passwordHashVO,
      role: 'admin',
      isActive: true,
    });

    console.log(`${colors.dim}Saving admin user to database...${colors.reset}`);
    const savedAdmin = await userRepository.save(newAdmin);

    console.log(`\n${colors.green}${colors.bold}🎉 Admin user created successfully!${colors.reset}`);
    console.log(`${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(` ${colors.bold}User ID:${colors.reset}    ${savedAdmin.id}`);
    console.log(` ${colors.bold}Name:${colors.reset}       ${savedAdmin.name}`);
    console.log(` ${colors.bold}Email:${colors.reset}      ${savedAdmin.email.getValue()}`);
    console.log(` ${colors.bold}Role:${colors.reset}       ${colors.green}${savedAdmin.role}${colors.reset}`);
    console.log(` ${colors.bold}Status:${colors.reset}     ${savedAdmin.isActive ? 'Active' : 'Inactive'}`);
    console.log(` ${colors.bold}Created At:${colors.reset} ${savedAdmin.createdAt.toISOString()}`);
    console.log(`${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  } catch (error) {
    console.error(`\n${colors.red}❌ Failed to seed admin user:${colors.reset}`, error);
    process.exitCode = 1;
  } finally {
    reader.close();
    try {
      await Database.disconnect();
    } catch (err) {
      console.error('Error disconnecting from database:', err);
    }
  }
}

// Handle unexpected terminations
process.on('SIGINT', async () => {
  console.log(`\n${colors.yellow}⚠️ Received interrupt signal (Ctrl+C). Cleaning up...${colors.reset}`);
  try {
    await Database.disconnect();
  } finally {
    process.exit(130);
  }
});

// Run script
seedAdmin().catch(async (error) => {
  console.error('Fatal error during seed execution:', error);
  try {
    await Database.disconnect();
  } finally {
    process.exit(1);
  }
});
