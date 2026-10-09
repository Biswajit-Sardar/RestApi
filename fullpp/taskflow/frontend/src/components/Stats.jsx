import {
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiAlertCircle,
  FiList,
  FiPercent,
} from 'react-icons/fi';

const Stats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <FiList size={24} />,
      color: 'blue',
    },
    {
      label: 'Pending',
      value: stats.byStatus?.pending || 0,
      icon: <FiClock size={24} />,
      color: 'yellow',
    },
    {
      label: 'In Progress',
      value: stats.byStatus?.inProgress || 0,
      icon: <FiTrendingUp size={24} />,
      color: 'purple',
    },
    {
      label: 'Completed',
      value: stats.byStatus?.completed || 0,
      icon: <FiCheckCircle size={24} />,
      color: 'green',
    },
    {
      label: 'Cancelled',
      value: stats.byStatus?.cancelled || 0,
      icon: <FiAlertCircle size={24} />,
      color: 'red',
    },
    {
      label: 'Completion Rate',
      value: `${stats.completionRate || 0}%`,
      icon: <FiPercent size={24} />,
      color: 'teal',
    },
  ];

  return (
    <div className="stats-grid">
      {statCards.map((stat, index) => (
        <div key={index} className={`stat-card stat-${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-info">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;

