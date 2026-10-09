import { Link } from 'react-router-dom';
import {
  FiEdit2,
  FiTrash2,
  FiArchive,
  FiCalendar,
  FiTag,
} from 'react-icons/fi';
import { format, isPast } from 'date-fns';
import clsx from 'clsx';

const TaskCard = ({ task, onDelete, onArchive, onStatusChange }) => {
  const isOverdue =
    task.dueDate &&
    isPast(new Date(task.dueDate)) &&
    task.status !== 'completed' &&
    task.status !== 'cancelled';

  const priorityColors = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    urgent: 'priority-urgent',
  };

  const statusColors = {
    pending: 'status-pending',
    'in-progress': 'status-in-progress',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
  };

  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <div className={clsx('task-card', isOverdue && 'task-overdue')}>
      <div className="task-card-header">
        <div className="task-badges">
          <span className={clsx('badge', statusColors[task.status])}>
            {statusLabels[task.status]}
          </span>
          <span className={clsx('badge', priorityColors[task.priority])}>
            {task.priority}
          </span>
          <span className="badge badge-category">{task.category}</span>
        </div>
      </div>

      <div className="task-card-body">
        <Link to={`/tasks/${task._id}`} className="task-title-link">
          <h3 className="task-title">{task.title}</h3>
        </Link>
        {task.description && (
          <p className="task-description">
            {task.description.length > 120
              ? `${task.description.substring(0, 120)}...`
              : task.description}
          </p>
        )}
      </div>

      <div className="task-card-meta">
        {task.dueDate && (
          <span className={clsx('task-due', isOverdue && 'overdue')}>
            <FiCalendar size={14} />
            {isOverdue ? 'Overdue: ' : 'Due: '}
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            <FiTag size={14} />
            {task.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="task-card-footer">
        {/* Status change dropdown */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="task-actions">
          <Link
            to={`/tasks/${task._id}`}
            className="action-btn edit"
            title="Edit"
          >
            <FiEdit2 size={16} />
          </Link>
          <button
            onClick={() => onArchive(task._id)}
            className="action-btn archive"
            title={task.isArchived ? 'Unarchive' : 'Archive'}
          >
            <FiArchive size={16} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="action-btn delete"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

