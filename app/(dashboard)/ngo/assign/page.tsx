'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { getAllMentors, getAllStudents, createStudent, createMentor, confirmAssignments } from '@/lib/db';
import type { MatchResult, UnmatchedStudent, Student, Mentor } from '@/lib/types';
import { Upload, Users, CheckCircle, AlertCircle, Loader2, FileSpreadsheet } from 'lucide-react';

type Step = 'upload' | 'matching' | 'review' | 'done';

export default function AssignPage() {
  const [step, setStep] = useState<Step>('upload');
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [mentorFile, setMentorFile] = useState<File | null>(null);
  const [studentData, setStudentData] = useState<Partial<Student>[]>([]);
  const [mentorData, setMentorData] = useState<Partial<Mentor>[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [unmatched, setUnmatched] = useState<UnmatchedStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  const parseExcel = (file: File): Promise<Record<string, unknown>[]> => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => {
      const wb = XLSX.read(e.target?.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      res(XLSX.utils.sheet_to_json(ws));
    };
    reader.onerror = rej;
    reader.readAsBinaryString(file);
  });

  const handleStudentDrop = useCallback(async (files: File[]) => {
    const f = files[0];
    setStudentFile(f);
    const rows = await parseExcel(f);
    setStudentData(rows.map(r => ({
      name: String(r['name'] || ''),
      age: Number(r['age'] || 0),
      gender: (r['gender'] as 'Male' | 'Female' | 'Other') || 'Other',
      needs: String(r['needs'] || '').split(',').map(s => s.trim()).filter(Boolean),
      preferredMentorGender: (r['preferredMentorGender'] as 'Male' | 'Female' | 'No preference') || 'No preference',
      disability: String(r['disability'] || ''),
      internetAccess: String(r['internetAccess']).toLowerCase() === 'yes',
      mobileAccess: String(r['mobileAccess']).toLowerCase() === 'yes',
      availableTime: String(r['availableTime'] || ''),
      parentPhone: String(r['parentPhone'] || ''),
      urban_rural: (r['urban_rural'] as 'Urban' | 'Rural') || 'Urban',
      school: String(r['school'] || ''),
      assignedMentor: null,
      progressScore: 0,
      xpPoints: 0,
      badges: [],
      profilePublic: true,
    })));
  }, []);

  const handleMentorDrop = useCallback(async (files: File[]) => {
    const f = files[0];
    setMentorFile(f);
    const rows = await parseExcel(f);
    setMentorData(rows.map(r => ({
      name: String(r['name'] || ''),
      email: String(r['email'] || ''),
      phone: String(r['phone'] || ''),
      gender: (r['gender'] as 'Male' | 'Female' | 'Other') || 'Other',
      skills: String(r['skills'] || '').split(',').map(s => s.trim()).filter(Boolean),
      subjectExpertise: String(r['subjectExpertise'] || '').split(',').map(s => s.trim()).filter(Boolean),
      ageGroupsComfortable: String(r['ageGroupsComfortable'] || '').split(',').map(s => s.trim()).filter(Boolean) as ('1-6' | '7-12' | '13-19')[],
      languages: String(r['languages'] || '').split(',').map(s => s.trim()).filter(Boolean),
      availabilityDays: String(r['availabilityDays'] || '').split(',').map(s => s.trim()).filter(Boolean),
      urban_rural: (r['urban_rural'] as 'Urban' | 'Rural') || 'Urban',
      trainedModules: [],
      assignedStudents: [],
      mentorshipDurationWeeks: 12,
      durationEndDate: null,
      status: 'Active' as const,
    })));
  }, []);

  const studentDz = useDropzone({ onDrop: handleStudentDrop, accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }, maxFiles: 1 });
  const mentorDz = useDropzone({ onDrop: handleMentorDrop, accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }, maxFiles: 1 });

  const runMatching = async () => {
    if (!studentData.length || !mentorData.length) { setError('Please upload both files first.'); return; }
    setLoading(true); setError(''); setStep('matching');

    try {
      // Save to Firestore first if they don't exist
      const existingStudents = await getAllStudents();
      const existingMentors = await getAllMentors();

      const studentsWithIds: Student[] = [];
      for (const s of studentData) {
        const exists = existingStudents.find(e => e.name === s.name && e.school === s.school);
        if (exists) { studentsWithIds.push(exists); continue; }
        const id = await createStudent(s as Omit<Student, 'id' | 'createdAt'>);
        studentsWithIds.push({ id, ...s } as Student);
      }

      const mentorsWithIds: Mentor[] = [];
      for (const m of mentorData) {
        const exists = existingMentors.find(e => e.email === m.email);
        if (exists) { mentorsWithIds.push(exists); continue; }
        const id = await createMentor(m as Omit<Mentor, 'id' | 'createdAt'>);
        mentorsWithIds.push({ id, ...m } as Mentor);
      }

      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: studentsWithIds, mentors: mentorsWithIds }),
      });

      if (!res.ok) throw new Error('Matching API failed');
      const data = await res.json();
      setMatches(data.matches || []);
      setUnmatched(data.unmatched || []);
      setStep('review');
    } catch (err) {
      setError('Matching failed. Check your API key and try again.');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const confirmAll = async () => {
    setConfirming(true);
    try {
      await confirmAssignments(matches);
      setStep('done');
    } catch {
      setError('Failed to confirm assignments.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Mentor Assignment</h1>
        <p className="text-gray-500 text-sm mt-1">Upload Excel sheets and let Claude match students to mentors</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {(['upload', 'matching', 'review', 'done'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
              step === s ? 'bg-indigo-600 text-white' : i < ['upload','matching','review','done'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>{i + 1}</div>
            <span className={`text-sm font-medium ${step === s ? 'text-indigo-700' : 'text-gray-400'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 3 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}
        </div>
      )}

      {/* Upload step */}
      {step === 'upload' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Dropzone dz={studentDz} file={studentFile} label="Student Excel" count={studentData.length} icon="👩‍🎓" />
          <Dropzone dz={mentorDz} file={mentorFile} label="Mentor Excel" count={mentorData.length} icon="👨‍🏫" />
          <div className="md:col-span-2">
            <button
              onClick={runMatching}
              disabled={!studentData.length || !mentorData.length || loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center gap-2 text-base transition"
            >
              <Users className="w-5 h-5" /> Run AI Matching
            </button>
          </div>
        </div>
      )}

      {/* Matching step */}
      {step === 'matching' && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-lg font-semibold text-gray-700">Claude is matching students to mentors…</p>
          <p className="text-sm text-gray-400">This may take 10–30 seconds</p>
        </div>
      )}

      {/* Review step */}
      {step === 'review' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                ✓ {matches.length} matched
              </span>
              {unmatched.length > 0 && (
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  ⚠ {unmatched.length} unmatched → Cultural Activities
                </span>
              )}
            </div>
            <button onClick={confirmAll} disabled={confirming}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-60">
              {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Confirm All Assignments
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {matches.map((m, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                  {m.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">{m.studentName}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold text-indigo-700">{m.mentorName}</span>
                    <span className="ml-auto bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">Score: {m.score}/100</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{m.explanation}</p>
                </div>
              </div>
            ))}
          </div>

          {unmatched.length > 0 && (
            <div>
              <h3 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Unmatched Students → Assigned to Cultural Activities
              </h3>
              <div className="space-y-2">
                {unmatched.map((u, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="font-medium text-gray-800">{u.studentName}</span>
                    <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">{u.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Done */}
      {step === 'done' && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignments Confirmed!</h2>
          <p className="text-gray-500">{matches.length} students have been assigned to mentors in Firestore.</p>
          <button onClick={() => setStep('upload')} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
            Run Another Assignment
          </button>
        </div>
      )}
    </div>
  );
}

function Dropzone({ dz, file, label, count, icon }: {
  dz: ReturnType<typeof useDropzone>; file: File | null; label: string; count: number; icon: string;
}) {
  return (
    <div {...dz.getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
      dz.isDragActive ? 'border-indigo-400 bg-indigo-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
    }`}>
      <input {...dz.getInputProps()} />
      <div className="text-3xl mb-3">{icon}</div>
      {file ? (
        <>
          <p className="font-semibold text-green-700">{file.name}</p>
          <p className="text-sm text-green-600 mt-1">{count} rows parsed</p>
        </>
      ) : (
        <>
          <p className="font-semibold text-gray-700">{label}</p>
          <p className="text-sm text-gray-400 mt-1">Drop .xlsx here or click to browse</p>
          <FileSpreadsheet className="w-8 h-8 text-gray-300 mx-auto mt-3" />
        </>
      )}
    </div>
  );
}
