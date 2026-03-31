import { chatMessages, students, mentors } from '../../data/mockData';
import { Eye } from 'lucide-react';

export default function AdminChatMonitor() {
  return (
    <div className="animate-in">
      <h1 className="page-title">Chat Monitor</h1>
      <p className="page-subtitle">View mentor-student chat activity (read-only mode)</p>

      <div className="data-table-wrapper">
        <div className="data-table-header"><div className="data-table-title">Recent Messages</div></div>
        <table className="data-table">
          <thead><tr><th>From</th><th>To</th><th>Message</th><th>Time</th><th></th></tr></thead>
          <tbody>
            {chatMessages.map(msg => {
              const sender = msg.senderId === 'u2' ? 'Arun Sharma' : 'Ravi Kumar';
              const receiver = msg.receiverId === 'u2' ? 'Arun Sharma' : 'Ravi Kumar';
              return (
                <tr key={msg.id}>
                  <td style={{ fontWeight: 600 }}>{sender}</td>
                  <td>{receiver}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(msg.timestamp).toLocaleString()}</td>
                  <td><button className="btn btn-secondary btn-sm"><Eye size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
