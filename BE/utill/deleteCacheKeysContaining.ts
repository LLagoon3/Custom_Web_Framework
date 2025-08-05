import { redisClient } from "../config/redis";

export const deleteCacheKeysContaining = async (searchString: string): Promise<void> => {
  let cursor = '0';
  do {
    const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', `*${searchString}*`, 'COUNT', 100);
    if (keys.length > 0) {
      console.log('Deleting keys:', keys);
      await redisClient.del(...keys);
    }
    cursor = nextCursor;
  } while (cursor !== '0');
};