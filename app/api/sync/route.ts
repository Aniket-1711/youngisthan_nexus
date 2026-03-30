import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import type { OfflineEntry } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { entries }: { entries: OfflineEntry[] } = await req.json();
    if (!entries?.length) return NextResponse.json({ synced: 0 });

    const batch = adminDb.batch();
    let synced = 0;

    for (const entry of entries) {
      if (entry.synced) continue;

      // Write session
      const sessionRef = adminDb.collection('sessions').doc(entry.id);
      const existing = await sessionRef.get();
      if (!existing.exists) {
        batch.set(sessionRef, {
          mentorId: entry.mentorId,
          studentId: entry.studentId,
          date: new Date(entry.sessionDate),
          type: 'offline',
          notes: entry.notes,
          synced: true,
        });

        // Update student progress
        const studentRef = adminDb.collection('students').doc(entry.studentId);
        batch.update(studentRef, {
          progressScore: entry.progressScore,
        });

        // Mark tasks completed
        for (const taskId of entry.tasksCompleted) {
          const taskRef = adminDb.collection('tasks').doc(taskId);
          batch.update(taskRef, { status: 'done' });
        }

        synced++;
      }
    }

    await batch.commit();
    return NextResponse.json({ synced });
  } catch (err) {
    console.error('Sync error:', err);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
