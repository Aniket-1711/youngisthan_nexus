'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { getUnsynced } from '@/lib/idb';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const online = () => { setIsOnline(true); checkUnsynced(); };
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, []);

  const checkUnsynced = async () => {
    const entries = await getUnsynced();
    setUnsyncedCount(entries.length);
  };

  useEffect(() => { checkUnsynced(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const entries = await getUnsynced();
      if (!entries.length) { setSyncing(false); return; }
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json();
      setSyncDone(true);
      setUnsyncedCount(0);
      setTimeout(() => setSyncDone(false), 3000);
    } catch {
      alert('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  if (isOnline && unsyncedCount === 0 && !syncDone) return null;

  if (!isOnline) {
    return (
      <div className="offline-banner flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>You&apos;re offline — data is saved locally and will sync when reconnected</span>
      </div>
    );
  }

  if (syncDone) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-white text-center py-2 px-4 text-sm font-medium z-50 flex items-center justify-center gap-2">
        <CheckCircle className="w-4 h-4" />
        Sync complete! All offline data has been uploaded.
      </div>
    );
  }

  if (unsyncedCount > 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white py-2 px-4 text-sm font-medium z-50 flex items-center justify-center gap-3">
        <span>{unsyncedCount} offline session{unsyncedCount > 1 ? 's' : ''} ready to sync</span>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-indigo-50"
        >
          <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing…' : 'Sync now'}
        </button>
      </div>
    );
  }

  return null;
}
