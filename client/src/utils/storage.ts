// Client-side storage utility for browser-based data persistence
// This provides a unified interface for localStorage and IndexedDB

export interface StorageItem {
  id: string;
  timestamp: number;
  [key: string]: any;
}

export interface TweetData extends StorageItem {
  content: string;
  style: string;
  characterCount: number;
  sentiment?: string;
  prompt?: string;
}

export interface UserPreferences extends StorageItem {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
}

class ClientStorage {
  private useIndexedDB: boolean = false;
  private dbName = 'TweetSentientDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    // Check if IndexedDB is available
    this.useIndexedDB = 'indexedDB' in window;
    if (this.useIndexedDB) {
      this.initIndexedDB();
    }
  }

  private async initIndexedDB(): Promise<void> {
    try {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.warn('IndexedDB not available, falling back to localStorage');
        this.useIndexedDB = false;
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('tweets')) {
          const tweetStore = db.createObjectStore('tweets', { keyPath: 'id' });
          tweetStore.createIndex('timestamp', 'timestamp', { unique: false });
          tweetStore.createIndex('style', 'style', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
      };
    } catch (error) {
      console.warn('IndexedDB initialization failed, using localStorage:', error);
      this.useIndexedDB = false;
    }
  }

  // Generic storage methods
  async set(key: string, value: any): Promise<void> {
    if (this.useIndexedDB && this.db) {
      return this.setIndexedDB(key, value);
    } else {
      return this.setLocalStorage(key, value);
    }
  }

  async get(key: string): Promise<any> {
    if (this.useIndexedDB && this.db) {
      return this.getIndexedDB(key);
    } else {
      return this.getLocalStorage(key);
    }
  }

  async delete(key: string): Promise<void> {
    if (this.useIndexedDB && this.db) {
      return this.deleteIndexedDB(key);
    } else {
      return this.deleteLocalStorage(key);
    }
  }

  async clear(): Promise<void> {
    if (this.useIndexedDB && this.db) {
      return this.clearIndexedDB();
    } else {
      return this.clearLocalStorage();
    }
  }

  // IndexedDB methods
  private async setIndexedDB(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction(['tweets', 'preferences'], 'readwrite');
      const store = transaction.objectStore('tweets');
      
      const item = {
        id: key,
        ...value,
        timestamp: Date.now()
      };

      const request = store.put(item);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async getIndexedDB(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction(['tweets'], 'readonly');
      const store = transaction.objectStore('tweets');
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private async deleteIndexedDB(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction(['tweets'], 'readwrite');
      const store = transaction.objectStore('tweets');
      const request = store.delete(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction(['tweets', 'preferences'], 'readwrite');
      const tweetStore = transaction.objectStore('tweets');
      const prefStore = transaction.objectStore('preferences');
      
      tweetStore.clear();
      prefStore.clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // localStorage methods
  private async setLocalStorage(key: string, value: any): Promise<void> {
    try {
      const item = {
        id: key,
        ...value,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  private async getLocalStorage(key: string): Promise<any> {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  private async deleteLocalStorage(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
    }
  }

  private async clearLocalStorage(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Specialized methods for tweets
  async saveTweet(tweet: Omit<TweetData, 'id' | 'timestamp'>): Promise<string> {
    const id = `tweet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.set(id, tweet);
    return id;
  }

  async getAllTweets(): Promise<TweetData[]> {
    if (this.useIndexedDB && this.db) {
      return this.getAllTweetsIndexedDB();
    } else {
      return this.getAllTweetsLocalStorage();
    }
  }

  private async getAllTweetsIndexedDB(): Promise<TweetData[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction(['tweets'], 'readonly');
      const store = transaction.objectStore('tweets');
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private async getAllTweetsLocalStorage(): Promise<TweetData[]> {
    try {
      const tweets: TweetData[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tweet-')) {
          const tweet = await this.get(key);
          if (tweet) {
            tweets.push(tweet);
          }
        }
      }
      return tweets.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting tweets from localStorage:', error);
      return [];
    }
  }

  // User preferences
  async getPreferences(): Promise<UserPreferences> {
    const prefs = await this.get('userPreferences');
    return prefs || {
      theme: 'system',
      language: 'en',
      notifications: true
    };
  }

  async setPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const current = await this.getPreferences();
    await this.set('userPreferences', { ...current, ...preferences });
  }
}

// Export singleton instance
export const clientStorage = new ClientStorage();

// Convenience functions
export const saveTweet = (tweet: Omit<TweetData, 'id' | 'timestamp'>) => 
  clientStorage.saveTweet(tweet);

export const getAllTweets = () => clientStorage.getAllTweets();
export const getPreferences = () => clientStorage.getPreferences();
export const setPreferences = (prefs: Partial<UserPreferences>) => 
  clientStorage.setPreferences(prefs);
