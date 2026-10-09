import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiTag,
  FiClock,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { useTaskContext } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import Spinner from '../components/Spinner';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTask, fetchTask, updateTask, deleteTask, loading } =
    useTaskContext();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTask(id);
  }, [id]);

  const handleUpdate = async (taskData) => {
    const result = await updateTask(id, taskData);
    if (result.success) {
      setIsEditing(false);
      fetchTask(id);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(id);
      if (result.success) {
        navigate('/tasks');
      }
    }
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  if (!currentTask) {
    return (
      <div className="not-found-container">
        <h2>Task not found</h2>
        <Link to="/tasks" className="btn btn-primary">
          Back to Tasks
        </Link>
      </div>
    );
  }

  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <div className="task-detail-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
          <FiArrowLeft size={16} /> Back
        </button>
        <div className="header-actions">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-outline btn-sm"
          >
            <FiEdit2 size={16} /> {isEditing ? 'Cancel Edit' : 'Edit'}
          </button>
          <button onClick={handleDelete} className="btn btn-danger btn-sm">
            <FiTrash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="form-container">
          <h2>Edit Task</h2>
          <TaskForm
            task={currentTask}
            isEditing
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className="task-detail-card">
          <div className="task-detail-header">
            <h1>{currentTask.title}</h1>
            <div className="task-badges">
              <span className={`badge status-${currentTask.status}`}>
                {statusLabels[currentTask.status]}
              </span>
              <span className={`badge priority-${currentTask.priority}`}>
                {currentTask.priority}
              </span>
              <span className="badge badge-category">{currentTask.category}</span>
            </div>
          </div>

          {currentTask.description && (
            <div className="task-detail-section">
              <h3>Description</h3>
              <p>{currentTask.description}</p>
            </div>
          )}

          <div className="task-detail-meta">
            {currentTask.dueDate && (
              <div className="meta-item">
                <FiCalendar size={16} />
                <span>
                  Due: {format(new Date(currentTask.dueDate), 'MMMM dd, yyyy')}
                </span>
              </div>
            )}

            {currentTask.completedAt && (
              <div className="meta-item">
                <FiClock size={16} />
                <span>
                  Completed:{' '}
                  {format(new Date(currentTask.completedAt), 'MMMM dd, yyyy')}
                </span>
              </div>
            )}

            <div className="meta-item">
              <FiClock size={16} />
              <span>
                Created:{' '}
                {format(new Date(currentTask.createdAt), 'MMMM dd, yyyy HH:mm')}
              </span>
            </div>

            <div className="meta-item">
              <FiClock size={16} />
              <span>
                Updated:{' '}
                {format(new Date(currentTask.updatedAt), 'MMMM dd, yyyy HH:mm')}
              </span>
            </div>

            {currentTask.tags && currentTask.tags.length > 0 && (
              <div className="meta-item">
                <FiTag size={16} />
                <div className="task-tags">
                  {currentTask.tags.map((tag, i) => (
                    <span key={i} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;

