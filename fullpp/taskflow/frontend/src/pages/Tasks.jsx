import { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import toast from 'react-hot-toast';

const Tasks = () => {
  const {
    tasks,
    loading,
    pagination,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleArchive,
    updateFilters,
    resetFilters,
  } = useTaskContext();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      setShowForm(false);
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(id);
      if (result.success) {
        fetchTasks();
      }
    }
  };

  const handleArchive = async (id) => {
    const result = await toggleArchive(id);
    if (result.success) {
      fetchTasks();
    }
  };

  const handleStatusChange = async (id, status) => {
    const result = await updateTask(id, { status });
    if (result.success) {
      fetchTasks();
    }
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>My Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`}
        >
          {showForm ? (
            <>
              <FiX size={18} /> Close Form
            </>
          ) : (
            <>
              <FiPlus size={18} /> Add Task
            </>
          )}
        </button>
      </div>

      {/* Create Task Form */}
      {showForm && (
        <div className="form-container">
          <h2>Create New Task</h2>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        pagination={pagination}
        filters={filters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onStatusChange={handleStatusChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Tasks;

