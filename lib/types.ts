export type UserRole = 'ngo' | 'mentor' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: Date;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  skills: string[];
  subjectExpertise: string[];
  ageGroupsComfortable: ('1-6' | '7-12' | '13-19')[];
  languages: string[];
  availabilityDays: string[];
  urban_rural: 'Urban' | 'Rural';
  trainedModules: string[];
  assignedStudents: string[];
  mentorshipDurationWeeks: number;
  durationEndDate: Date | null;
  status: 'Active' | 'On leave' | 'Removed';
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  needs: string[];
  preferredMentorGender: 'Male' | 'Female' | 'No preference';
  disability: string;
  internetAccess: boolean;
  mobileAccess: boolean;
  availableTime: string;
  parentPhone: string;
  urban_rural: 'Urban' | 'Rural';
  school: string;
  assignedMentor: string | null;
  progressScore: number;
  xpPoints: number;
  badges: string[];
  profilePublic: boolean;
  createdAt: Date;
}

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  date: Date;
  type: 'online' | 'offline';
  notes: string;
  synced: boolean;
  progressScore?: number;
}

export interface Task {
  id: string;
  studentId: string;
  mentorId: string;
  title: string;
  description: string;
  subject: string;
  status: 'todo' | 'inprogress' | 'done';
  xpReward: number;
  verifiedByMentor: boolean;
  dueDate: Date | null;
  createdAt: Date;
}

export interface TrainingModule {
  id: string;
  ageGroup: '1-6' | '7-12' | '13-19';
  title: string;
  description: string;
  contentUrl: string;
  quizQuestions: QuizQuestion[];
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface MatchResult {
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  score: number;
  explanation: string;
}

export interface UnmatchedStudent {
  studentId: string;
  studentName: string;
  reason: string;
}

export interface OfflineEntry {
  id: string;
  mentorId: string;
  studentId: string;
  sessionDate: string;
  progressScore: number;
  notes: string;
  tasksCompleted: string[];
  synced: boolean;
}
