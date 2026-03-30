import { db } from './firebase';
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, onSnapshot, writeBatch,
  serverTimestamp, increment, Timestamp
} from 'firebase/firestore';
import type { Mentor, Student, Session, Task, MatchResult } from './types';

// ─── Mentors ────────────────────────────────────────────────────────────────

export async function getMentor(id: string): Promise<Mentor | null> {
  const snap = await getDoc(doc(db, 'mentors', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Mentor;
}

export async function getAllMentors(): Promise<Mentor[]> {
  const snap = await getDocs(collection(db, 'mentors'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Mentor));
}

export async function createMentor(data: Omit<Mentor, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'mentors'));
  await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateMentor(id: string, data: Partial<Mentor>): Promise<void> {
  await updateDoc(doc(db, 'mentors', id), data as Record<string, unknown>);
}

export function subscribeMentors(cb: (mentors: Mentor[]) => void) {
  return onSnapshot(collection(db, 'mentors'), snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Mentor)));
  });
}

// ─── Students ────────────────────────────────────────────────────────────────

export async function getStudent(id: string): Promise<Student | null> {
  const snap = await getDoc(doc(db, 'students', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Student;
}

export async function getStudentsByMentor(mentorId: string): Promise<Student[]> {
  const q = query(collection(db, 'students'), where('assignedMentor', '==', mentorId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
}

export async function getAllStudents(): Promise<Student[]> {
  const snap = await getDocs(collection(db, 'students'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
}

export async function createStudent(data: Omit<Student, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'students'));
  await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<void> {
  await updateDoc(doc(db, 'students', id), data as Record<string, unknown>);
}

export function subscribeStudentsByMentor(mentorId: string, cb: (students: Student[]) => void) {
  const q = query(collection(db, 'students'), where('assignedMentor', '==', mentorId));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Student)));
  });
}

// ─── Sessions ────────────────────────────────────────────────────────────────

export async function createSession(data: Omit<Session, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'sessions'));
  await setDoc(ref, { ...data, date: serverTimestamp() });
  return ref.id;
}

export async function getSessionsByStudent(studentId: string): Promise<Session[]> {
  const q = query(
    collection(db, 'sessions'),
    where('studentId', '==', studentId),
    orderBy('date', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Session));
}

export async function getSessionsByMentor(mentorId: string): Promise<Session[]> {
  const q = query(
    collection(db, 'sessions'),
    where('mentorId', '==', mentorId),
    orderBy('date', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Session));
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasksByStudent(studentId: string): Promise<Task[]> {
  const q = query(collection(db, 'tasks'), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'tasks'));
  await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateTaskStatus(
  taskId: string,
  status: Task['status']
): Promise<void> {
  await updateDoc(doc(db, 'tasks', taskId), { status });
}

export async function verifyTask(taskId: string, studentId: string, xpReward: number): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, 'tasks', taskId), { verifiedByMentor: true, status: 'done' });
  batch.update(doc(db, 'students', studentId), { xpPoints: increment(xpReward) });
  await batch.commit();
}

export function subscribeTasksByStudent(studentId: string, cb: (tasks: Task[]) => void) {
  const q = query(collection(db, 'tasks'), where('studentId', '==', studentId));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Task)));
  });
}

// ─── Assignments (bulk) ───────────────────────────────────────────────────────

export async function confirmAssignments(matches: MatchResult[]): Promise<void> {
  const batch = writeBatch(db);
  for (const match of matches) {
    batch.update(doc(db, 'students', match.studentId), {
      assignedMentor: match.mentorId,
    });
    batch.update(doc(db, 'mentors', match.mentorId), {
      assignedStudents: [] // will be overwritten by arrayUnion below
    });
  }
  await batch.commit();

  // Second pass: arrayUnion for mentor's student list
  const { arrayUnion } = await import('firebase/firestore');
  const batch2 = writeBatch(db);
  const mentorStudentMap: Record<string, string[]> = {};
  for (const m of matches) {
    if (!mentorStudentMap[m.mentorId]) mentorStudentMap[m.mentorId] = [];
    mentorStudentMap[m.mentorId].push(m.studentId);
  }
  for (const [mentorId, studentIds] of Object.entries(mentorStudentMap)) {
    batch2.update(doc(db, 'mentors', mentorId), {
      assignedStudents: arrayUnion(...studentIds),
    });
  }
  await batch2.commit();
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getNGOStats() {
  const [mentors, students, sessions] = await Promise.all([
    getDocs(collection(db, 'mentors')),
    getDocs(collection(db, 'students')),
    getDocs(query(collection(db, 'sessions'), where('synced', '==', true))),
  ]);

  const mentorList = mentors.docs.map(d => d.data() as Mentor);
  const studentList = students.docs.map(d => d.data() as Student);
  const sessionList = sessions.docs.map(d => d.data() as Session);

  const activeMentors = mentorList.filter(m => m.status === 'Active').length;
  const assignedStudents = studentList.filter(s => s.assignedMentor).length;
  const ratio = activeMentors > 0 ? assignedStudents / activeMentors : 0;

  const schools = Array.from(new Set(studentList.map(s => s.school).filter(Boolean)));
  const cities = Array.from(new Set(studentList.map(s => s.school?.split(',')[1]?.trim()).filter(Boolean)));

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sessionsThisWeek = sessionList.filter(s => {
    const d = s.date instanceof Timestamp ? s.date.toDate() : new Date(s.date);
    return d >= weekAgo;
  });

  return {
    totalMentors: mentorList.length,
    activeMentors,
    totalStudents: studentList.length,
    assignedStudents,
    ratio,
    schools: schools.length,
    cities: cities.length,
    sessionsThisWeek: sessionsThisWeek.length,
    onlineSessions: sessionsThisWeek.filter(s => s.type === 'online').length,
    offlineSessions: sessionsThisWeek.filter(s => s.type === 'offline').length,
    mentorPerformance: mentorList.map(m => ({
      id: m.id,
      name: m.name,
      studentCount: m.assignedStudents?.length ?? 0,
      avgProgress: 0,
    })),
  };
}
