// ============ MOCK DATA FOR NGO MENTORSHIP PLATFORM ============

export const users = {
  admin: { id: 'u1', name: 'Dr. Kavitha Nair', email: 'kavitha@ngo.org', role: 'ngo_admin', phone: '9876543210', avatar: 'KN' },
  mentor: { id: 'u2', name: 'Gaurav Hegde', email: 'gaurav@mentor.org', role: 'mentor', phone: '9876543211', avatar: 'GH' },
  student: { id: 'u3', name: 'Ravi Kumar', email: 'ravi@student.org', role: 'student', phone: '9876543212', avatar: 'RK' },
};

export const mentors = [
  { id: 'm1', userId: 'u2', name: 'Arun Sharma', email: 'arun@mentor.org', phone: '9876543211', gender: 'male', skills: ['Mathematics', 'Physics'], fieldOfInterest: 'STEM Education', isTrained: true, maxStudents: 10, currentStudents: 5, preferredTiming: 'both', location: { city: 'Delhi', area: 'urban' }, performanceRating: 4.5, status: 'active', trainingCompletedAt: '2026-01-15', createdAt: '2025-12-01' },
  { id: 'm2', userId: 'u4', name: 'Priya Mehta', email: 'priya@mentor.org', phone: '9876543213', gender: 'female', skills: ['Career Guidance', 'English'], fieldOfInterest: 'Language Arts', isTrained: true, maxStudents: 8, currentStudents: 6, preferredTiming: 'weekday_online', location: { city: 'Mumbai', area: 'urban' }, performanceRating: 4.8, status: 'active', trainingCompletedAt: '2026-01-10', createdAt: '2025-11-15' },
  { id: 'm3', userId: 'u5', name: 'Rajesh Gupta', email: 'rajesh@mentor.org', phone: '9876543214', gender: 'male', skills: ['Science', 'Mental Health'], fieldOfInterest: 'Counseling', isTrained: true, maxStudents: 6, currentStudents: 4, preferredTiming: 'weekend_offline', location: { city: 'Bangalore', area: 'urban' }, performanceRating: 4.2, status: 'active', trainingCompletedAt: '2026-02-01', createdAt: '2025-12-20' },
  { id: 'm4', userId: 'u6', name: 'Neha Singh', email: 'neha@mentor.org', phone: '9876543215', gender: 'female', skills: ['Mathematics', 'Career Guidance'], fieldOfInterest: 'Education', isTrained: false, maxStudents: 8, currentStudents: 0, preferredTiming: 'both', location: { city: 'Delhi', area: 'urban' }, performanceRating: 0, status: 'pending_training', trainingCompletedAt: null, createdAt: '2026-02-15' },
  { id: 'm5', userId: 'u7', name: 'Vikram Patel', email: 'vikram@mentor.org', phone: '9876543216', gender: 'male', skills: ['English', 'Cultural'], fieldOfInterest: 'Arts', isTrained: true, maxStudents: 10, currentStudents: 7, preferredTiming: 'weekday_online', location: { city: 'Pune', area: 'urban' }, performanceRating: 3.8, status: 'warning', trainingCompletedAt: '2026-01-20', createdAt: '2025-11-01' },
  { id: 'm6', userId: 'u8', name: 'Anita Desai', email: 'anita@mentor.org', phone: '9876543217', gender: 'female', skills: ['Science', 'Mathematics'], fieldOfInterest: 'STEM', isTrained: true, maxStudents: 12, currentStudents: 9, preferredTiming: 'both', location: { city: 'Chennai', area: 'urban' }, performanceRating: 4.6, status: 'active', trainingCompletedAt: '2026-01-05', createdAt: '2025-10-15' },
  { id: 'm7', userId: 'u9', name: 'Suresh Reddy', email: 'suresh@mentor.org', phone: '9876543218', gender: 'male', skills: ['Ethics & Values'], fieldOfInterest: 'Philosophy', isTrained: true, maxStudents: 5, currentStudents: 3, preferredTiming: 'weekend_offline', location: { city: 'Hyderabad', area: 'rural' }, performanceRating: 4.0, status: 'active', trainingCompletedAt: '2026-02-10', createdAt: '2026-01-01' },
  { id: 'm8', userId: 'u10', name: 'Deepa Joshi', email: 'deepa@mentor.org', phone: '9876543219', gender: 'female', skills: ['Mental Health', 'Career Guidance'], fieldOfInterest: 'Psychology', isTrained: true, maxStudents: 8, currentStudents: 5, preferredTiming: 'weekday_online', location: { city: 'Kolkata', area: 'urban' }, performanceRating: 4.7, status: 'active', trainingCompletedAt: '2026-01-25', createdAt: '2025-12-10' },
];

export const students = [
  { id: 's1', userId: 'u3', name: 'Ravi Kumar', age: 14, gender: 'male', needs: ['Mathematics'], preferredMentorGender: 'no_preference', contactNumber: '9988776655', mobileAccessible: true, preferredTime: 'evening_6pm', location: { city: 'Delhi', schoolName: 'Govt. Boys School, Saket', area: 'urban' }, internetAccess: true, assignedMentorId: 'm1', assignmentStatus: 'assigned' },
  { id: 's2', name: 'Priya Singh', age: 16, gender: 'female', needs: ['Career Guidance', 'English'], preferredMentorGender: 'female', contactNumber: '9988776656', mobileAccessible: true, preferredTime: 'evening_5pm', location: { city: 'Mumbai', schoolName: 'Municipal Girls School', area: 'urban' }, internetAccess: true, assignedMentorId: 'm2', assignmentStatus: 'assigned' },
  { id: 's3', name: 'Amit Verma', age: 12, gender: 'male', needs: ['Science', 'Mathematics'], preferredMentorGender: 'no_preference', contactNumber: '9988776657', mobileAccessible: false, preferredTime: 'morning_10am', location: { city: 'Bangalore', schoolName: 'Govt. Primary School, Koramangala', area: 'urban' }, internetAccess: false, assignedMentorId: 'm3', assignmentStatus: 'assigned' },
  { id: 's4', name: 'Sneha Devi', age: 15, gender: 'female', needs: ['Mental Health'], preferredMentorGender: 'female', contactNumber: '9988776658', mobileAccessible: true, preferredTime: 'evening_7pm', location: { city: 'Delhi', schoolName: 'Kendriya Vidyalaya', area: 'urban' }, internetAccess: true, assignedMentorId: null, assignmentStatus: 'others_queue' },
  { id: 's5', name: 'Kiran Das', age: 10, gender: 'male', needs: ['English', 'Cultural'], preferredMentorGender: 'no_preference', contactNumber: '9988776659', mobileAccessible: false, preferredTime: 'morning_9am', location: { city: 'Pune', schoolName: 'Zilla Parishad School', area: 'rural' }, internetAccess: false, assignedMentorId: 'm5', assignmentStatus: 'assigned' },
  { id: 's6', name: 'Meera Nair', age: 17, gender: 'female', needs: ['Mathematics', 'Physics'], preferredMentorGender: 'no_preference', contactNumber: '9988776660', mobileAccessible: true, preferredTime: 'evening_6pm', location: { city: 'Chennai', schoolName: 'Govt. Girls Higher Secondary', area: 'urban' }, internetAccess: true, assignedMentorId: 'm6', assignmentStatus: 'assigned' },
  { id: 's7', name: 'Arjun Rao', age: 13, gender: 'male', needs: ['Ethics & Values'], preferredMentorGender: 'male', contactNumber: '9988776661', mobileAccessible: false, preferredTime: 'morning_11am', location: { city: 'Hyderabad', schoolName: 'Rural Community School', area: 'rural' }, internetAccess: false, assignedMentorId: 'm7', assignmentStatus: 'assigned' },
  { id: 's8', name: 'Lakshmi Iyer', age: 18, gender: 'female', needs: ['Career Guidance', 'Mental Health'], preferredMentorGender: 'female', contactNumber: '9988776662', mobileAccessible: true, preferredTime: 'evening_5pm', location: { city: 'Kolkata', schoolName: 'St. Mary School', area: 'urban' }, internetAccess: true, assignedMentorId: 'm8', assignmentStatus: 'assigned' },
  { id: 's9', name: 'Rohit Sharma', age: 11, gender: 'male', needs: ['Science'], preferredMentorGender: 'no_preference', contactNumber: '9988776663', mobileAccessible: false, location: { city: 'Jaipur', schoolName: 'Govt. Middle School', area: 'rural' }, internetAccess: false, assignedMentorId: null, assignmentStatus: 'others_queue' },
  { id: 's10', name: 'Fatima Begum', age: 14, gender: 'female', needs: ['Mathematics', 'English'], preferredMentorGender: 'female', contactNumber: '9988776664', mobileAccessible: true, location: { city: 'Lucknow', schoolName: 'Municipal Urdu School', area: 'urban' }, internetAccess: true, assignedMentorId: null, assignmentStatus: 'others_queue' },
];

export const sessions = [
  { id: 'ses1', mentorId: 'm1', studentId: 's1', type: 'online', scheduledDate: '2026-03-31T18:00:00', status: 'scheduled', topic: 'Algebra Basics', notes: '', attendance: 'present' },
  { id: 'ses2', mentorId: 'm1', studentId: 's1', type: 'offline', scheduledDate: '2026-04-05T10:00:00', status: 'scheduled', topic: 'Geometry Review', notes: '', attendance: 'present', offlineLocation: 'Govt. Boys School, Saket' },
  { id: 'ses3', mentorId: 'm1', studentId: 's1', type: 'online', scheduledDate: '2026-03-26T18:00:00', status: 'completed', topic: 'Linear Equations', notes: 'Good progress', attendance: 'present', completedAt: '2026-03-26T19:00:00' },
  { id: 'ses4', mentorId: 'm2', studentId: 's2', type: 'online', scheduledDate: '2026-04-01T17:00:00', status: 'scheduled', topic: 'Resume Building', notes: '', attendance: 'present' },
  { id: 'ses5', mentorId: 'm3', studentId: 's3', type: 'offline', scheduledDate: '2026-04-06T10:00:00', status: 'scheduled', topic: 'Basic Chemistry', notes: '', attendance: 'present', offlineLocation: 'Govt. Primary School, Koramangala' },
  { id: 'ses6', mentorId: 'm1', studentId: 's1', type: 'online', scheduledDate: '2026-03-24T18:00:00', status: 'completed', topic: 'Number Systems', notes: 'Excellent understanding', attendance: 'present', completedAt: '2026-03-24T19:00:00' },
];

export const trainingContent = [
  { id: 'tc1', title: 'Introduction to Mentoring', type: 'video', category: 'Basics', description: 'Overview of mentoring best practices', uploadAt: '2025-12-01', isActive: true, targetAgeGroups: ['all'] },
  { id: 'tc2', title: 'Child Psychology 101', type: 'pdf', category: 'Psychology', description: 'Understanding child development stages', uploadAt: '2025-12-15', isActive: true, targetAgeGroups: ['1-8', '9-15'] },
  { id: 'tc3', title: 'Teaching Methods for Rural Students', type: 'video', category: 'Teaching Methods', description: 'Effective techniques for rural classrooms', uploadAt: '2026-01-05', isActive: true, targetAgeGroups: ['all'] },
  { id: 'tc4', title: 'Conducting Effective Online Sessions', type: 'document', category: 'Online Teaching', description: 'Best practices for video call sessions', uploadAt: '2026-01-20', isActive: true, targetAgeGroups: ['9-15', '16-19'] },
  { id: 'tc5', title: 'Assessment & Quiz Design', type: 'pdf', category: 'Assessment', description: 'How to create fair and effective quizzes', uploadAt: '2026-02-01', isActive: true, targetAgeGroups: ['all'] },
];

export const mentorTrainingProgress = [
  { mentorId: 'm1', contentId: 'tc1', status: 'completed', completedAt: '2026-01-10', timeSpent: 45 },
  { mentorId: 'm1', contentId: 'tc2', status: 'completed', completedAt: '2026-01-12', timeSpent: 60 },
  { mentorId: 'm1', contentId: 'tc3', status: 'completed', completedAt: '2026-01-14', timeSpent: 50 },
  { mentorId: 'm1', contentId: 'tc4', status: 'completed', completedAt: '2026-01-15', timeSpent: 30 },
  { mentorId: 'm1', contentId: 'tc5', status: 'completed', completedAt: '2026-01-15', timeSpent: 40 },
  { mentorId: 'm2', contentId: 'tc1', status: 'completed', completedAt: '2026-01-08', timeSpent: 42 },
  { mentorId: 'm2', contentId: 'tc2', status: 'completed', completedAt: '2026-01-09', timeSpent: 55 },
  { mentorId: 'm2', contentId: 'tc3', status: 'in_progress', timeSpent: 20 },
  { mentorId: 'm4', contentId: 'tc1', status: 'in_progress', timeSpent: 15 },
];

export const progressRecords = [
  { id: 'pr1', studentId: 's1', mentorId: 'm1', weekNumber: 1, metrics: { attendanceRate: 100, assignmentCompletion: 90, quizAverage: 85, mentorRating: 4, skillImprovement: 'Significant' }, status: 'excellent', recordedAt: '2026-03-10' },
  { id: 'pr2', studentId: 's1', mentorId: 'm1', weekNumber: 2, metrics: { attendanceRate: 100, assignmentCompletion: 95, quizAverage: 88, mentorRating: 5, skillImprovement: 'Significant' }, status: 'excellent', recordedAt: '2026-03-17' },
  { id: 'pr3', studentId: 's1', mentorId: 'm1', weekNumber: 3, metrics: { attendanceRate: 80, assignmentCompletion: 85, quizAverage: 80, mentorRating: 4, skillImprovement: 'Moderate' }, status: 'on_track', recordedAt: '2026-03-24' },
  { id: 'pr4', studentId: 's2', mentorId: 'm2', weekNumber: 1, metrics: { attendanceRate: 90, assignmentCompletion: 70, quizAverage: 65, mentorRating: 3, skillImprovement: 'Moderate' }, status: 'on_track', recordedAt: '2026-03-10' },
  { id: 'pr5', studentId: 's3', mentorId: 'm3', weekNumber: 1, metrics: { attendanceRate: 60, assignmentCompletion: 50, quizAverage: 55, mentorRating: 3, skillImprovement: 'Slight' }, status: 'needs_attention', recordedAt: '2026-03-10' },
];

export const othersQueue = [
  { studentId: 's4', student: students[3], addedAt: '2026-03-15', reason: 'no_skill_match', tempActivityType: 'mental_health', notes: 'No Mental Health mentor available in Delhi' },
  { studentId: 's9', student: students[8], addedAt: '2026-03-18', reason: 'mentor_capacity_full', tempActivityType: 'ethics_values', notes: 'All Science mentors at capacity in Jaipur' },
  { studentId: 's10', student: students[9], addedAt: '2026-03-20', reason: 'timing_mismatch', tempActivityType: 'cultural', notes: 'No female mentor available in Lucknow for Math + English' },
];

export const notifications = [
  { id: 'n1', userId: 'u1', type: 'assignment', title: 'Auto-Assignment Complete', message: '23 students were successfully matched with mentors.', isRead: false, createdAt: '2026-03-30T10:00:00' },
  { id: 'n2', userId: 'u1', type: 'warning', title: 'Mentor Under Review', message: 'Vikram Patel has a session completion rate below 60%.', isRead: false, createdAt: '2026-03-29T15:30:00' },
  { id: 'n3', userId: 'u1', type: 'system', title: 'New Mentor Registered', message: 'Neha Singh has registered and is pending training.', isRead: true, createdAt: '2026-03-28T09:00:00' },
  { id: 'n4', userId: 'u2', type: 'session_reminder', title: 'Session Tomorrow', message: 'You have a session with Ravi Kumar tomorrow at 6:00 PM.', isRead: false, createdAt: '2026-03-30T08:00:00' },
  { id: 'n5', userId: 'u2', type: 'progress_update', title: 'Progress Report Due', message: 'Weekly progress report for Ravi Kumar is due today.', isRead: false, createdAt: '2026-03-30T07:00:00' },
  { id: 'n6', userId: 'u2', type: 'assignment', title: 'New Student Assigned', message: 'Amit Verma has been assigned to you for Science mentoring.', isRead: true, createdAt: '2026-03-25T12:00:00' },
  { id: 'n7', userId: 'u3', type: 'session_reminder', title: 'Upcoming Session', message: 'Your session with Mr. Arun Sharma is on Monday at 6:00 PM.', isRead: false, createdAt: '2026-03-30T09:00:00' },
  { id: 'n8', userId: 'u3', type: 'progress_update', title: 'Quiz Results', message: 'You scored 8/10 on the Algebra quiz!', isRead: false, createdAt: '2026-03-29T16:00:00' },
];

export const chatMessages = [
  { id: 'c1', senderId: 'u2', receiverId: 'u3', type: 'direct', message: 'Hi Ravi! How is your algebra practice going?', timestamp: '2026-03-29T10:00:00', readBy: ['u2', 'u3'] },
  { id: 'c2', senderId: 'u3', receiverId: 'u2', type: 'direct', message: 'Hello sir! I solved all the problems from Chapter 5. But I am stuck on quadratic equations.', timestamp: '2026-03-29T10:05:00', readBy: ['u3', 'u2'] },
  { id: 'c3', senderId: 'u2', receiverId: 'u3', type: 'direct', message: "That's great progress! We'll cover quadratic equations in tomorrow's session. Can you share which problems are confusing you?", timestamp: '2026-03-29T10:08:00', readBy: ['u2', 'u3'] },
  { id: 'c4', senderId: 'u3', receiverId: 'u2', type: 'direct', message: 'Problems 3 and 7 from the exercise sheet. I understand the formula but the word problems are tricky.', timestamp: '2026-03-29T10:12:00', readBy: ['u3'] },
  { id: 'c5', senderId: 'u2', receiverId: 'u3', type: 'direct', message: "Word problems need practice. I'll prepare some simpler examples for you first. See you tomorrow!", timestamp: '2026-03-29T10:15:00', readBy: ['u2'] },
  { id: 'c6', senderId: 'u3', receiverId: 'u2', type: 'direct', message: 'Thank you sir! 🙏', timestamp: '2026-03-29T10:16:00', readBy: ['u3'] },
];

export const assignments = [
  { id: 'a1', mentorId: 'm1', studentId: 's1', assignedAt: '2026-02-01', assignedBy: 'auto', status: 'active', matchScore: 95, matchFactors: { skillMatch: true, genderPreferenceMet: true, timingAligned: true, locationCompatible: true } },
  { id: 'a2', mentorId: 'm2', studentId: 's2', assignedAt: '2026-02-01', assignedBy: 'auto', status: 'active', matchScore: 90, matchFactors: { skillMatch: true, genderPreferenceMet: true, timingAligned: true, locationCompatible: true } },
  { id: 'a3', mentorId: 'm3', studentId: 's3', assignedAt: '2026-02-05', assignedBy: 'auto', status: 'active', matchScore: 75, matchFactors: { skillMatch: true, genderPreferenceMet: true, timingAligned: true, locationCompatible: false } },
  { id: 'a4', mentorId: 'm5', studentId: 's5', assignedAt: '2026-02-10', assignedBy: 'manual', status: 'active', matchScore: 70, matchFactors: { skillMatch: true, genderPreferenceMet: true, timingAligned: false, locationCompatible: true } },
  { id: 'a5', mentorId: 'm6', studentId: 's6', assignedAt: '2026-02-15', assignedBy: 'auto', status: 'active', matchScore: 100, matchFactors: { skillMatch: true, genderPreferenceMet: true, timingAligned: true, locationCompatible: true } },
];

export const generatedReports = [
  { id: 'r1', generatedAt: '2026-03-25', reportType: 'comprehensive', format: 'pdf', filters: { dateRange: { start: '2026-03-01', end: '2026-03-25' } }, fileSize: 2400000 },
  { id: 'r2', generatedAt: '2026-03-20', reportType: 'mentor_performance', format: 'excel', filters: { dateRange: { start: '2026-02-01', end: '2026-03-20' } }, fileSize: 1800000 },
  { id: 'r3', generatedAt: '2026-03-15', reportType: 'student_progress', format: 'pdf', filters: { dateRange: { start: '2026-01-01', end: '2026-03-15' }, city: 'Delhi' }, fileSize: 1200000 },
];

export const dashboardStats = {
  totalStudents: 150,
  activeStudents: 132,
  totalMentors: 25,
  activeMentors: 20,
  mentorStudentRatio: '1:6',
  citiesReached: 8,
  schoolsReached: 12,
  sessionsThisWeek: 45,
  completionRate: 87,
  othersQueueCount: 12,
};

export const enrollmentTrend = [
  { month: 'Oct', students: 45, mentors: 8 },
  { month: 'Nov', students: 62, mentors: 12 },
  { month: 'Dec', students: 85, mentors: 16 },
  { month: 'Jan', students: 102, mentors: 19 },
  { month: 'Feb', students: 128, mentors: 22 },
  { month: 'Mar', students: 150, mentors: 25 },
];

export const sessionCompletionData = [
  { week: 'W1', completed: 38, scheduled: 42 },
  { week: 'W2', completed: 40, scheduled: 45 },
  { week: 'W3', completed: 35, scheduled: 43 },
  { week: 'W4', completed: 42, scheduled: 45 },
];

export const cityDistribution = [
  { city: 'Delhi', students: 35, mentors: 6, lat: 28.6139, lng: 77.2090 },
  { city: 'Mumbai', students: 28, mentors: 5, lat: 19.0760, lng: 72.8777 },
  { city: 'Bangalore', students: 22, mentors: 4, lat: 12.9716, lng: 77.5946 },
  { city: 'Chennai', students: 18, mentors: 3, lat: 13.0827, lng: 80.2707 },
  { city: 'Pune', students: 14, mentors: 2, lat: 18.5204, lng: 73.8567 },
  { city: 'Hyderabad', students: 12, mentors: 2, lat: 17.3850, lng: 78.4867 },
  { city: 'Kolkata', students: 11, mentors: 2, lat: 22.5726, lng: 88.3639 },
  { city: 'Jaipur', students: 10, mentors: 1, lat: 26.9124, lng: 75.7873 },
];

export const recentActivity = [
  { id: 'ra1', text: '5 new mentors completed training', time: '2 hours ago', type: 'success' },
  { id: 'ra2', text: '23 students auto-assigned today', time: '4 hours ago', type: 'info' },
  { id: 'ra3', text: 'Vikram Patel flagged for review', time: '6 hours ago', type: 'warning' },
  { id: 'ra4', text: 'Monthly report generated', time: '1 day ago', type: 'info' },
  { id: 'ra5', text: '3 new students added to Others Queue', time: '1 day ago', type: 'warning' },
  { id: 'ra6', text: 'Anita Desai reached 9 mentees', time: '2 days ago', type: 'success' },
];
