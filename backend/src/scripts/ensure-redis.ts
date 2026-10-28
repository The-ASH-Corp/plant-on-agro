import { ensureRedisContainerAsync } from '../infrastructure/redis/redis-docker.helper';

async function main() {
  const success = await ensureRedisContainerAsync();
  if (!success) {
    console.warn('⚠️ [REDIS] Could not verify Redis container. Continuing with server bootstrap...');
  }
}

main().catch((err) => {
  console.error('❌ [REDIS] Error in ensure-redis script:', err);
  // Do not exit with 1 to avoid blocking server start if developer runs standalone redis
  process.exit(0);
});
