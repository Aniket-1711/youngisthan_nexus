'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMentor } from '@/lib/db';
import { SUBJECTS, AGE_GROUPS, LANGUAGES, DAYS } from '@/lib/utils';
import { UserPlus, Check } from 'lucide-react';

const MULTI = (items: string[], selected: string[], toggle: (v: string) => void, label: string) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <button
          key={item}
          type="button"
          onClick={() => toggle(item)}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            selected.includes(item)
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
          }`}
        >
          {selected.includes(item) && <Check className="inline w-3 h-3 mr-1" />}{item}
        </button>
      ))}
    </div>
  </div>
);

export default function AddMentorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    skills: [] as string[],
    subjectExpertise: [] as string[],
    ageGroupsComfortable: [] as string[],
    languages: [] as string[],
    availabilityDays: [] as string[],
    urban_rural: 'Urban' as 'Urban' | 'Rural',
    mentorshipDurationWeeks: 12,
  });

  const toggle = (field: keyof typeof form, val: string) => {
    const arr = form[field] as string[];
    setForm(f => ({ ...f, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createMentor({
        ...form,
        ageGroupsComfortable: form.ageGroupsComfortable as ('1-6' | '7-12' | '13-19')[],
        trainedModules: [],
        assignedStudents: [],
        durationEndDate: null,
        status: 'Active',
      });
      setSuccess(true);
      setTimeout(() => router.push('/ngo/analytics'), 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to create mentor. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Mentor</h1>
        <p className="text-gray-500 text-sm mt-1">Register a volunteer mentor to the platform</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" /> Mentor created! An invitation email will be sent.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Personal */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" required>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              required className="input-base" placeholder="Arjun Sharma" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
              required className="input-base" placeholder="arjun@example.com" />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
              className="input-base" placeholder="+91 98765 43210" />
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={e => setForm(f => ({...f, gender: e.target.value as 'Male'|'Female'|'Other'}))}
              className="input-base">
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </Field>
          <Field label="Location Type">
            <select value={form.urban_rural} onChange={e => setForm(f => ({...f, urban_rural: e.target.value as 'Urban'|'Rural'}))}
              className="input-base">
              <option>Urban</option><option>Rural</option>
            </select>
          </Field>
          <Field label="Mentorship Duration (weeks)">
            <input type="number" value={form.mentorshipDurationWeeks}
              onChange={e => setForm(f => ({...f, mentorshipDurationWeeks: Number(e.target.value)}))}
              min={1} max={52} className="input-base" />
          </Field>
        </div>

        {MULTI(SUBJECTS, form.skills, v => toggle('skills', v), 'Skills / Subjects')}
        {MULTI(AGE_GROUPS as unknown as string[], form.ageGroupsComfortable, v => toggle('ageGroupsComfortable', v), 'Age Groups Comfortable With')}
        {MULTI(LANGUAGES, form.languages, v => toggle('languages', v), 'Teaching Languages')}
        {MULTI(DAYS, form.availabilityDays, v => toggle('availabilityDays', v), 'Available Days')}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium flex items-center gap-2 disabled:opacity-60">
            <UserPlus className="w-4 h-4" />
            {saving ? 'Saving…' : 'Add Mentor'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .input-base {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.15s;
        }
        .input-base:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
