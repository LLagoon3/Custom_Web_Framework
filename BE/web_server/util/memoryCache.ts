type CacheEntry = {
  value: Buffer;
  contentType: string;
  expiresAt: number;
};

class MemoryCache {
    private cache: Map<string, CacheEntry> = new Map();

    set(key: string, value: Buffer, contentType: string, ttl: number = 60000) {
        const expiresAt = Date.now() + ttl;
        this.cache.set(key, { value, contentType, expiresAt });
    }

    get(key: string): CacheEntry | undefined {
        const entry = this.cache.get(key);
        if (entry && entry.expiresAt > Date.now()) {
            return entry;
        }
        this.cache.delete(key);
        return undefined;
    }

    // 만료된 항목을 주기적으로 제거
    cleanUp() {
        const now = Date.now();
        for (const [key, entry] of this.cache) {
            if (entry.expiresAt <= now) {
            this.cache.delete(key);
            }
        }
    }
}

const memoryCache = new MemoryCache();
setInterval(() => memoryCache.cleanUp(), 60000);
export default memoryCache;