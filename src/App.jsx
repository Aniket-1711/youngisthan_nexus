import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import MentorManagement from './pages/admin/MentorManagement';
import TrainingCenter from './pages/admin/TrainingCenter';
import BulkUpload from './pages/admin/BulkUpload';
import AutoAssignment from './pages/admin/AutoAssignment';
import Reports from './pages/admin/Reports';
import MonitorProgress from './pages/admin/MonitorProgress';
import AdminChatMonitor from './pages/admin/ChatMonitor';

// Mentor Pages
import MentorDashboard from './pages/mentor/Dashboard';
import MyMentees from './pages/mentor/MyMentees';
import MentorSessions from './pages/mentor/Sessions';
import MentorTraining from './pages/mentor/Training';
import MentorChat from './pages/mentor/Chat';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentChat from './pages/student/Chat';
import StudentResources from './pages/student/Resources';
import StudentProgress from './pages/student/Progress';

function ProtectedRoute({ children, allowedRole }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (allowedRole && currentUser.role !== allowedRole) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role === 'ngo_admin' ? 'admin' : currentUser.role}`} /> : <Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="ngo_admin"><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="mentors" element={<MentorManagement />} />
        <Route path="training" element={<TrainingCenter />} />
        <Route path="upload" element={<BulkUpload />} />
        <Route path="assignment" element={<AutoAssignment />} />
        <Route path="reports" element={<Reports />} />
        <Route path="progress" element={<MonitorProgress />} />
        <Route path="chat" element={<AdminChatMonitor />} />
      </Route>

      {/* Mentor Routes */}
      <Route path="/mentor" element={<ProtectedRoute allowedRole="mentor"><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<MentorDashboard />} />
        <Route path="mentees" element={<MyMentees />} />
        <Route path="sessions" element={<MentorSessions />} />
        <Route path="training" element={<MentorTraining />} />
        <Route path="chat" element={<MentorChat />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRole="student"><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="chat" element={<StudentChat />} />
        <Route path="resources" element={<StudentResources />} />
        <Route path="progress" element={<StudentProgress />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
