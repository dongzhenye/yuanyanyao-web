interface CacheKey {
  drugId: string;
  width: number;
  height: number;
  devicePixelRatio: number;
}

export const imageCache = new Map<string, string>();

// 生成缓存键
const generateCacheKey = (key: CacheKey): string => {
  return JSON.stringify(key);
};

// 获取缓存的图片
export const getCachedImage = (key: CacheKey): string | undefined => {
  return imageCache.get(generateCacheKey(key));
};

// 设置缓存的图片
export const setCachedImage = (key: CacheKey, dataUrl: string): void => {
  imageCache.set(generateCacheKey(key), dataUrl);
};

// 清除特定的缓存
export const clearCache = (key: CacheKey): void => {
  imageCache.delete(generateCacheKey(key));
};

// 清除所有缓存
export const clearAllCache = (): void => {
  imageCache.clear();
};

// 获取缓存大小
export const getCacheSize = (): number => {
  return imageCache.size;
}; 