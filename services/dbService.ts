import { Reading, UserProfile } from '../types';

const DB_NAME = 'OKBloodDiaryDB_Local_MultiUser';
const DB_VERSION = 1;
const USERS_STORE_NAME = 'users';
const READINGS_STORE_NAME = 'readings';

let db: IDBDatabase;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject('Error opening database');
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(USERS_STORE_NAME)) {
        dbInstance.createObjectStore(USERS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!dbInstance.objectStoreNames.contains(READINGS_STORE_NAME)) {
        const readingsStore = dbInstance.createObjectStore(READINGS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        readingsStore.createIndex('userId_idx', 'userId', { unique: false });
      }
    };
    
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
  });
};


const performDbOperation = <T>(
    storeNames: string | string[],
    mode: IDBTransactionMode,
    operation: (transaction: IDBTransaction) => IDBRequest,
): Promise<T> => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction(storeNames, mode);
            const request = operation(transaction);

            request.onsuccess = () => {
                resolve(request.result as T);
            };
            request.onerror = () => {
                console.error(`Error in DB operation:`, request.error);
                reject(request.error);
            };
        }).catch(reject);
    });
};

// --- User Profile Functions ---
export const getUsers = (): Promise<UserProfile[]> => {
    return performDbOperation(USERS_STORE_NAME, 'readonly', tx => tx.objectStore(USERS_STORE_NAME).getAll());
};

export const addUser = (profile: Omit<UserProfile, 'id'>): Promise<number> => {
    return performDbOperation(USERS_STORE_NAME, 'readwrite', tx => tx.objectStore(USERS_STORE_NAME).add(profile));
};

export const saveUserProfile = (profile: UserProfile): Promise<number> => {
    return performDbOperation(USERS_STORE_NAME, 'readwrite', tx => tx.objectStore(USERS_STORE_NAME).put(profile));
};

export const deleteUser = (userId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    openDB().then(db => {
      const tx = db.transaction([USERS_STORE_NAME, READINGS_STORE_NAME], 'readwrite');
      const readingsStore = tx.objectStore(READINGS_STORE_NAME);
      const usersStore = tx.objectStore(USERS_STORE_NAME);
      const readingIndex = readingsStore.index('userId_idx');

      const getReadingKeysRequest = readingIndex.getAllKeys(userId);

      getReadingKeysRequest.onsuccess = () => {
        const readingKeysToDelete = getReadingKeysRequest.result;
        
        readingKeysToDelete.forEach(key => {
          readingsStore.delete(key);
        });

        usersStore.delete(userId);
      };
      
      tx.oncomplete = () => {
        resolve();
      };
      
      tx.onerror = () => {
        console.error("Delete user transaction error:", tx.error);
        reject(tx.error);
      };
      
      getReadingKeysRequest.onerror = () => {
         console.error("Error getting reading keys for user deletion:", getReadingKeysRequest.error);
         reject(getReadingKeysRequest.error);
      }

    }).catch(reject);
  });
};


// --- Reading Functions ---
export const addReading = (userId: number, reading: Omit<Reading, 'id' | 'userId'>): Promise<number> => {
    const newReading = { ...reading, userId };
    return performDbOperation(READINGS_STORE_NAME, 'readwrite', tx => tx.objectStore(READINGS_STORE_NAME).add(newReading));
};

export const getReadings = (userId: number): Promise<Reading[]> => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction(READINGS_STORE_NAME, 'readonly');
            const store = transaction.objectStore(READINGS_STORE_NAME);
            const index = store.index('userId_idx');
            const request = index.getAll(userId);

            request.onsuccess = () => {
                resolve(request.result.reverse());
            };
            request.onerror = () => {
                console.error("Error getting readings:", request.error);
                reject(request.error);
            };
        }).catch(reject);
    });
};


export const deleteReading = (id: number): Promise<void> => {
    return performDbOperation(READINGS_STORE_NAME, 'readwrite', tx => tx.objectStore(READINGS_STORE_NAME).delete(id));
};

export const deleteAllReadings = (userId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction(READINGS_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(READINGS_STORE_NAME);
            const index = store.index('userId_idx');
            const getKeysRequest = index.getAllKeys(IDBKeyRange.only(userId));

            getKeysRequest.onsuccess = () => {
                const keysToDelete = getKeysRequest.result;
                keysToDelete.forEach(key => {
                    store.delete(key);
                });
            };

            getKeysRequest.onerror = () => {
                console.error("Error getting keys for deletion:", getKeysRequest.error);
                reject(getKeysRequest.error);
            };

            transaction.oncomplete = () => {
                resolve();
            };

            transaction.onerror = () => {
                console.error("Error during deleteAllReadings transaction:", transaction.error);
                reject(transaction.error);
            };
        }).catch(reject);
    });
};