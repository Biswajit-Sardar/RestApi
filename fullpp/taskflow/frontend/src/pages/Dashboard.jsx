import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiCalendar, FiAlertTriangle, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import useAuth from '../hooks/useAuth';
import { userAPI } from '../api/axios';
import Stats from '../components/Stats';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await userAPI.getDashboard();
      setDashboardData(data.dashboard);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <div className="dashboard-header">
        <div>
          <h1>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted">
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>
        <Link to="/tasks" className="btn btn-primary">
          <FiPlus size={18} /> New Task
        </Link>
      </div>

      {/* Statistics */}
      {dashboardData?.stats && <Stats stats={dashboardData.stats} />}

      {/* Task Sections */}
      <div className="dashboard-sections">
        {/* Overdue Tasks */}
        {dashboardData?.overdueTasks?.length > 0 && (
          <div className="dashboard-section overdue-section">
            <h2>
              <FiAlertTriangle size={20} /> Overdue Tasks
            </h2>
            <div className="mini-task-list">
              {dashboardData.overdueTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="mini-task-item overdue"
                >
                  <span className="mini-task-title">{task.title}</span>
                  <span className="mini-task-date">
                    <FiCalendar size={12} />
                    {format(new Date(task.dueDate), 'MMM dd')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        <div className="dashboard-section">
          <h2>
            <FiClock size={20} /> Upcoming Tasks
          </h2>
          {dashboardData?.upcomingTasks?.length > 0 ? (
            <div className="mini-task-list">
              {dashboardData.upcomingTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="mini-task-item"
                >
                  <span className="mini-task-title">{task.title}</span>
                  <span className={`badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="mini-task-date">
                      <FiCalendar size={12} />
                      {format(new Date(task.dueDate), 'MMM dd')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted">No upcoming tasks</p>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="dashboard-section">
          <h2>
            <FiClock size={20} /> Recent Tasks
          </h2>
          {dashboardData?.recentTasks?.length > 0 ? (
            <div className="mini-task-list">
              {dashboardData.recentTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="mini-task-item"
                >
                  <span className="mini-task-title">{task.title}</span>
                  <span className={`badge status-${task.status}`}>
                    {task.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted">No tasks yet. Create one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

