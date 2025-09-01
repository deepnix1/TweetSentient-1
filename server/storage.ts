// Local storage configuration for browser-based data persistence
// This replaces the external database dependency

export interface StorageConfig {
  type: 'indexeddb' | 'localstorage' | 'sessionstorage';
  databaseName?: string;
  version?: number;
}

export const defaultStorageConfig: StorageConfig = {
  type: 'indexeddb',
  databaseName: 'TweetSentientDB',
  version: 1
};

// Storage interface for different storage types
export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

// IndexedDB implementation (most powerful)
export class IndexedDBStorage implements StorageAdapter {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(config: StorageConfig) {
    this.dbName = config.databaseName || 'TweetSentientDB';
    this.version = config.version || 1;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for different data types
        if (!db.objectStoreNames.contains('tweets')) {
          const tweetStore = db.createObjectStore('tweets', { keyPath: 'id', autoIncrement: true });
          tweetStore.createIndex('timestamp', 'timestamp', { unique: false });
          tweetStore.createIndex('sentiment', 'sentiment', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
          analyticsStore.createIndex('date', 'date', { unique: false });
        }
      };
    });
  }

  async get(key: string): Promise<any> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tweets', 'userPreferences', 'analytics'], 'readonly');
      const store = transaction.objectStore('tweets');
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tweets', 'userPreferences', 'analytics'], 'readwrite');
      const store = transaction.objectStore('tweets');
      const request = store.put({ id: key, ...value, timestamp: Date.now() });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async delete(key: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tweets'], 'readwrite');
      const store = transaction.objectStore('tweets');
      const request = store.delete(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tweets', 'userPreferences', 'analytics'], 'readwrite');
      const tweetStore = transaction.objectStore('tweets');
      const prefStore = transaction.objectStore('userPreferences');
      const analyticsStore = transaction.objectStore('analytics');
      
      tweetStore.clear();
      prefStore.clear();
      analyticsStore.clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async keys(): Promise<string[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tweets'], 'readonly');
      const store = transaction.objectStore('tweets');
      const request = store.getAllKeys();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result.map(key => key.toString()));
    });
  }

  // Special methods for tweets
  async getAllTweets(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tweets'], 'readonly');
      const store = transaction.objectStore('tweets');
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getTweetsBySentiment(sentiment: string): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tweets'], 'readonly');
      const store = transaction.objectStore('tweets');
      const index = store.index('sentiment');
      const request = index.getAll(sentiment);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

// localStorage implementation (fallback)
export class LocalStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<any> {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  async keys(): Promise<string[]> {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }
}

// Storage factory
export function createStorage(config: StorageConfig = defaultStorageConfig): StorageAdapter {
  switch (config.type) {
    case 'indexeddb':
      return new IndexedDBStorage(config);
    case 'localstorage':
      return new LocalStorageAdapter();
    case 'sessionstorage':
      return new LocalStorageAdapter(); // Use localStorage as fallback
    default:
      return new LocalStorageAdapter();
  }
}

// Export default storage instance
export const storage = createStorage();
