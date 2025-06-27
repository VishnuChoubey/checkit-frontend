/* eslint-disable no-unused-vars */
import {
    openDB
} from 'idb';
import {
    AES,
    enc
} from 'crypto-js';
import {
    set as lodashSet,
    get as lodashGet
} from 'lodash';

const objectStoreKeys = {
    myPassHistory: 'myPassHistory',
    currentTransactionId: 'currentTransactionId',
    auth: 'auth',
    cachedPassData: 'cachedPassData',
    rideReceipt: 'rideReceipt',
    syncInProgress: 'syncInProgress',
    syncInPending: 'syncInPending',
};

const NotEncryptKeys = ['city', 'userId', 'userId_city', 'transactionId', 'userProfile.userId', 'process'];

const objectStoreIndexKeys = {
    myPassHistory: {
        city: NotEncryptKeys[0],
        userId: NotEncryptKeys[1],
        userId_city: NotEncryptKeys[2],
    },
};

const myDBName = 'chalo-pwa-v1';

const encryptObject = (object, key) => {
    try {
        if (!key) {
            return object;
        }
        const encrypted = AES.encrypt(JSON.stringify(object), key).toString();
        const notEncryptData = {};
        NotEncryptKeys.map((value) => {
            const val = lodashGet(object, value);
            if (val) {
                lodashSet(notEncryptData, value, val);
            }
            return true;
        });

        return {
            e_Data: encrypted,
            ...notEncryptData
        };
    } catch (err) {
        console.log('Error in encryptObject***', err);
        return object;
    }
};

const decryptFunction = (value, key) => {
    const decryptedObject = AES.decrypt(value, key);
    return JSON.parse(decryptedObject.toString(enc.Utf8));
};

const decryptObject = (data, key) => {
    try {
        if (!key) {
            return data;
        }
        if (Array.isArray(data)) {
            const newData = [];
            for (let index = 0; index < data.length; index += 1) {
                const value = data[index];
                if (value.e_Data) {
                    const decryptedData = decryptFunction(value.e_Data, key);
                    newData.push({ ...decryptedData
                    });
                } else {
                    newData.push({ ...value
                    });
                }
            }
            return newData;
        }
        if (typeof data === 'object') {
            if (data.e_Data) {
                const decryptedData = decryptFunction(data.e_Data, key);
                return decryptedData;
            }
            return data;
        }
    } catch (err) {
        console.log('Error in decryptObject***', err);
    }
    return data;
};

const dbPromise = openDB(myDBName, 7, {
    upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains(objectStoreKeys.currentTransactionId)) {
            db.createObjectStore(objectStoreKeys.currentTransactionId);
        }
        if (!db.objectStoreNames.contains(objectStoreKeys.cachedPassData)) {
            db.createObjectStore(
                objectStoreKeys.cachedPassData, {
                    keyPath: 'transactionId'
                },
            );
        }
        if (!db.objectStoreNames.contains(objectStoreKeys.rideReceipt)) {
            db.createObjectStore(
                objectStoreKeys.rideReceipt, {
                    keyPath: 'transactionId'
                },
            );
        }
        if (!db.objectStoreNames.contains(objectStoreKeys.syncInProgress)) {
            db.createObjectStore(
                objectStoreKeys.syncInProgress, {
                    keyPath: 'process'
                },
            );
        }
        if (!db.objectStoreNames.contains(objectStoreKeys.syncInPending)) {
            db.createObjectStore(
                objectStoreKeys.syncInPending, {
                    keyPath: 'process'
                },
            );
        }
        if (!db.objectStoreNames.contains(objectStoreKeys.myPassHistory)) {
            const myPassHistoryStore = db.createObjectStore(
                objectStoreKeys.myPassHistory, {
                    keyPath: 'transactionId'
                },
            );
            myPassHistoryStore.createIndex(
                objectStoreIndexKeys.myPassHistory.userId_city, ['userProfile.userId', 'city'], {
                    unique: false
                },
            );
        } else {
            const myPassHistoryStore = transaction.objectStore(
                objectStoreKeys.myPassHistory,
            );
            if (oldVersion === 3) {
                // myPassHistory objectStore Indexes -> 'city' and 'userId' were
                // no longer required with db name 'chalo-pwa-v1' and version 4
                if (
                    myPassHistoryStore.indexNames.contains(
                        objectStoreIndexKeys.myPassHistory.city,
                    )
                ) {
                    myPassHistoryStore.deleteIndex(
                        objectStoreIndexKeys.myPassHistory.city,
                    );
                }
                if (
                    myPassHistoryStore.indexNames.contains(
                        objectStoreIndexKeys.myPassHistory.userId,
                    )
                ) {
                    myPassHistoryStore.deleteIndex(
                        objectStoreIndexKeys.myPassHistory.userId,
                    );
                }
            }
            if (!myPassHistoryStore.indexNames.contains(
                    objectStoreIndexKeys.myPassHistory.userId_city,
                )) {
                myPassHistoryStore.createIndex(
                    objectStoreIndexKeys.myPassHistory.userId_city, ['userProfile.userId', 'city'], {
                        unique: false
                    },
                );
            }
        }
        if (!db.objectStoreNames.contains(objectStoreKeys.auth)) {
            db.createObjectStore(objectStoreKeys.auth);
        }
    },
});

const IndexDB = (objectStore = '') => ({
    get: async function get(key, decryptKey) {
        const data = await (await dbPromise).get(`${objectStore}`, key);
        return decryptObject(data, decryptKey);
    },
    getFromIndex: async function getFromIndex(indexName, query, decryptKey) {
        const data = (await dbPromise).getFromIndex(`${objectStore}`, indexName, query);
        return decryptObject(data, decryptKey);
    },
    getAll: async function getAll(decryptKey) {
        const data = await (await dbPromise).getAll(`${objectStore}`);
        return decryptObject(data, decryptKey);
    },
    getAllFromIndex: async function getAllFromIndex(indexName, query, decryptKey, count) {
        const data = await (await dbPromise).getAllFromIndex(
            `${objectStore}`,
            indexName,
            query,
            count,
        );
        return decryptObject(data, decryptKey);
    },
    set: async function set(key, val, encryptKey) {
        const encryptData = encryptObject(val, encryptKey);
        return (await dbPromise).put(`${objectStore}`, encryptData, key);
    },
    del: async function del(key) {
        return (await dbPromise).delete(`${objectStore}`, key);
    },
    clear: async function clear() {
        return (await dbPromise).clear(`${objectStore}`);
    },
    keys: async function keys() {
        return (await dbPromise).getAllKeys(`${objectStore}`);
    },
    dbPromise,
});

export default IndexDB;

export {
    objectStoreKeys,
    objectStoreIndexKeys
};