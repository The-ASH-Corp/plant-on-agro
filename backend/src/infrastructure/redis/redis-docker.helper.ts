import { execSync, spawn } from 'child_process';
import net from 'net';
import path from 'path';
import fs from 'fs';
import { env } from '../../config/env';

const CONTAINER_NAME = 'plant-on-agro-redis';
const SERVICE_NAME = 'redis';

/**
 * Resolves the directory containing docker-compose.yml.
 * Checks the backend folder first, then workspace root.
 */
function getDockerComposeDir(): string {
  const backendDir = path.resolve(__dirname, '../../..');
  if (fs.existsSync(path.join(backendDir, 'docker-compose.yml'))) {
    return backendDir;
  }
  const rootDir = path.resolve(backendDir, '..');
  if (fs.existsSync(path.join(rootDir, 'docker-compose.yml'))) {
    return rootDir;
  }
  return backendDir;
}

/**
 * Checks if a TCP port is accepting connections.
 */
export function isPortOpen(
  port: number = env.REDIS_PORT,
  host: string = env.REDIS_HOST,
  timeoutMs: number = 400
): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;

    const finalize = (isOpen: boolean) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(isOpen);
      }
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finalize(true));
    socket.once('timeout', () => finalize(false));
    socket.once('error', () => finalize(false));

    try {
      socket.connect(port, host);
    } catch {
      finalize(false);
    }
  });
}

/**
 * Checks if Docker CLI is installed and the daemon is reachable.
 */
export function isDockerDaemonRunningSync(): boolean {
  try {
    execSync('docker info --format "{{.ServerVersion}}"', {
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Attempts to launch Docker Desktop if it is not currently running.
 */
export function startDockerDesktopIfNeeded(): boolean {
  if (isDockerDaemonRunningSync()) {
    return true;
  }

  console.log('🐳 [DOCKER] Docker daemon is not active. Attempting to start Docker Desktop...');

  const candidates: string[] = [];
  if (process.env.LOCALAPPDATA) {
    candidates.push(
      path.join(process.env.LOCALAPPDATA, 'Programs', 'DockerDesktop', 'resources', 'com.docker.backend.exe'),
      path.join(process.env.LOCALAPPDATA, 'Programs', 'DockerDesktop', 'Docker Desktop.exe')
    );
  }
  candidates.push('C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe');

  for (const exePath of candidates) {
    if (fs.existsSync(exePath)) {
      try {
        const child = spawn(exePath, [], {
          detached: true,
          stdio: 'ignore',
        });
        child.unref();
        console.log(`🚀 [DOCKER] Initiated Docker launch via ${exePath}`);
        return true;
      } catch (err: any) {
        console.warn(`⚠️ [DOCKER] Failed to spawn ${exePath}:`, err.message);
      }
    }
  }

  // Fallback on Windows: start via cmd /c start
  if (process.platform === 'win32') {
    try {
      execSync('cmd.exe /c start "" "Docker Desktop"', { stdio: 'ignore' });
      return true;
    } catch {
      // Ignored
    }
  }

  return false;
}

/**
 * Synchronous check and start of Redis container via Docker Compose.
 * Safe to call inside module initialization without blocking on network when Redis is already up.
 */
export function ensureRedisContainerSync(): boolean {
  // Only auto-start for local instances
  const isLocal =
    env.REDIS_HOST === '127.0.0.1' ||
    env.REDIS_HOST === 'localhost' ||
    env.REDIS_URL.includes('127.0.0.1') ||
    env.REDIS_URL.includes('localhost');

  if (!isLocal) {
    return true;
  }

  const composeDir = getDockerComposeDir();

  try {
    // 1. Check if the specific container is already running
    const runningStatus = execSync(
      `docker inspect -f "{{.State.Running}}" ${CONTAINER_NAME}`,
      { stdio: ['ignore', 'pipe', 'ignore'], timeout: 2000 }
    )
      .toString()
      .trim();

    if (runningStatus === 'true') {
      return true;
    }
  } catch {
    // Container might not be running or does not exist yet
  }

  // 2. Container is not running, ensure docker daemon is reachable
  if (!isDockerDaemonRunningSync()) {
    startDockerDesktopIfNeeded();
  }

  // 3. Start redis via Docker Compose
  try {
    console.log(`🐳 [DOCKER] Starting Redis container (${CONTAINER_NAME}) via Docker Compose...`);
    execSync(`docker compose up -d ${SERVICE_NAME}`, {
      cwd: composeDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
    });
    console.log(`✅ [DOCKER] Redis container (${CONTAINER_NAME}) started successfully.`);
    return true;
  } catch (err: any) {
    console.warn(`⚠️ [DOCKER] Could not automatically start Redis container: ${err.message}`);
    return false;
  }
}

/**
 * Asynchronous check and start: verifies TCP port connectivity, launches container if down,
 * and waits until Redis answers connections.
 */
export async function ensureRedisContainerAsync(): Promise<boolean> {
  const isLocal =
    env.REDIS_HOST === '127.0.0.1' ||
    env.REDIS_HOST === 'localhost' ||
    env.REDIS_URL.includes('127.0.0.1') ||
    env.REDIS_URL.includes('localhost');

  if (!isLocal) {
    return true;
  }

  // 1. Check if Redis is already accepting connections
  const alreadyUp = await isPortOpen(env.REDIS_PORT, env.REDIS_HOST, 300);
  if (alreadyUp) {
    console.log(`⚡ [REDIS] Redis server is already running and ready at ${env.REDIS_HOST}:${env.REDIS_PORT}`);
    return true;
  }

  console.log(`🔍 [REDIS] Redis is not responding at ${env.REDIS_HOST}:${env.REDIS_PORT}. Checking Docker container...`);

  // 2. Ensure Docker daemon is running
  if (!isDockerDaemonRunningSync()) {
    startDockerDesktopIfNeeded();
    // Give daemon up to 10 seconds to respond
    console.log('⏳ [DOCKER] Waiting for Docker daemon to initialize...');
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 500));
      if (isDockerDaemonRunningSync()) {
        console.log('✅ [DOCKER] Docker daemon is ready.');
        break;
      }
    }
  }

  // 3. Start Redis service via docker compose
  const composeDir = getDockerComposeDir();
  try {
    console.log(`🐳 [DOCKER] Running 'docker compose up -d ${SERVICE_NAME}' in ${composeDir}...`);
    execSync(`docker compose up -d ${SERVICE_NAME}`, {
      cwd: composeDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 20000,
    });
  } catch (err: any) {
    console.error(`❌ [DOCKER] Failed to start Redis container:`, err.message);
    return false;
  }

  // 4. Poll until the port is open and accepting traffic (up to 10 seconds)
  console.log(`⏳ [REDIS] Waiting for Redis on port ${env.REDIS_PORT} to accept connections...`);
  const startTime = Date.now();
  while (Date.now() - startTime < 10000) {
    const ready = await isPortOpen(env.REDIS_PORT, env.REDIS_HOST, 300);
    if (ready) {
      console.log(`✅ [DOCKER] Redis container (${CONTAINER_NAME}) is healthy and accepting connections!`);
      return true;
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  console.warn(`⚠️ [REDIS] Redis container was started, but port ${env.REDIS_PORT} did not respond within 10s.`);
  return false;
}
