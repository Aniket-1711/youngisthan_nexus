import { openDB, IDBPDatabase } from 'idb';
import type { OfflineEntry } from './types';

const DB_NAME = 'mentorbridge-offline';
const DB_VERSION = 1;

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('offline_entries')) {
        const store = db.createObjectStore('offline_entries', { keyPath: 'id' });
        store.createIndex('synced', 'synced');
        store.createIndex('mentorId', 'mentorId');
      }
      if (!db.objectStoreNames.contains('cached_students')) {
        db.createObjectStore('cached_students', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cached_tasks')) {
        db.createObjectStore('cached_tasks', { keyPath: 'id' });
      }
    },
  });
}

export async function saveOfflineEntry(entry: OfflineEntry): Promise<void> {
  const db = await getDB();
  await db.put('offline_entries', entry);
}

export async function getUnsynced(): Promise<OfflineEntry[]> {
  const db = await getDB();
  return db.getAllFromIndex('offline_entries', 'synced', IDBKeyRange.only(false));
}

export async function markSynced(id: string): Promise<void> {
  const db = await getDB();
  const entry = await db.get('offline_entries', id);
  if (entry) {
    await db.put('offline_entries', { ...entry, synced: true });
  }
}

export async function getAllOfflineEntries(): Promise<OfflineEntry[]> {
  const db = await getDB();
  return db.getAll('offline_entries');
}

export async function cacheStudents(students: unknown[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('cached_students', 'readwrite');
  for (const s of students) {
    await tx.store.put(s);
  }
  await tx.done;
}

export async function getCachedStudents(): Promise<unknown[]> {
  const db = await getDB();
  return db.getAll('cached_students');
}

export async function cacheTasks(tasks: unknown[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('cached_tasks', 'readwrite');
  for (const t of tasks) {
    await tx.store.put(t);
  }
  await tx.done;
}

export async function getCachedTasks(): Promise<unknown[]> {
  const db = await getDB();
  return db.getAll('cached_tasks');
}
