import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { Mentor, Student, MatchResult, UnmatchedStudent } from '@/lib/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { students, mentors }: { students: Student[]; mentors: Mentor[] } = await req.json();

    if (!students?.length || !mentors?.length) {
      return NextResponse.json({ error: 'Students and mentors are required' }, { status: 400 });
    }

    const prompt = `You are an AI matching engine for MentorBridge, a platform that pairs volunteer mentors with underserved students in India.

Given the following students and mentors, create optimal matches based on these weighted criteria:
1. (30%) Student needs vs. mentor skills/subject expertise
2. (20%) Student preferred mentor gender vs. mentor gender
3. (20%) Mentor availability vs. student available time
4. (15%) Urban/rural match (prefer same)
5. (10%) Disability/accessibility accommodations
6. (5%) Age group training completion (mentor must be trained for the student's age group)

Rules:
- Each mentor can be assigned at most 5 students
- A mentor CANNOT be assigned to an age group they haven't been trained for
- If no suitable mentor exists, mark as unmatched
- Unmatched students go to Cultural Activities (mental health, ethics, human values)

Students:
${JSON.stringify(students.map(s => ({
  id: s.id,
  name: s.name,
  age: s.age,
  needs: s.needs,
  preferredGender: s.preferredMentorGender,
  disability: s.disability,
  internetAccess: s.internetAccess,
  availableTime: s.availableTime,
  urban_rural: s.urban_rural,
})), null, 2)}

Mentors:
${JSON.stringify(mentors.map(m => ({
  id: m.id,
  name: m.name,
  gender: m.gender,
  skills: m.skills,
  subjectExpertise: m.subjectExpertise,
  ageGroupsComfortable: m.ageGroupsComfortable,
  trainedModules: m.trainedModules,
  availabilityDays: m.availabilityDays,
  urban_rural: m.urban_rural,
  currentLoad: m.assignedStudents?.length ?? 0,
})), null, 2)}

Return ONLY valid JSON in this exact format with no extra text:
{
  "matches": [
    {
      "studentId": "string",
      "studentName": "string",
      "mentorId": "string",
      "mentorName": "string",
      "score": 0-100,
      "explanation": "1-2 sentence reason"
    }
  ],
  "unmatched": [
    {
      "studentId": "string",
      "studentName": "string",
      "reason": "string"
    }
  ]
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean) as {
      matches: MatchResult[];
      unmatched: UnmatchedStudent[];
    };

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Match API error:', err);
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 });
  }
}
