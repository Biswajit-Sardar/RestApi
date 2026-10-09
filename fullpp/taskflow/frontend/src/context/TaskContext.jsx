import { createContext, useState, useContext, useCallback } from 'react';
import { taskAPI } from '../api/axios';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    count: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
    sort: 'newest',
    page: 1,
    limit: 10,
  });

  // Fetch tasks
  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = { ...filters, ...params };
      // Remove empty filters
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === '' || queryParams[key] === null) {
          delete queryParams[key];
        }
      });

      const { data } = await taskAPI.getTasks(queryParams);
      setTasks(data.tasks);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total,
        count: data.count,
      });
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch single task
  const fetchTask = async (id) => {
    setLoading(true);
    try {
      const { data } = await taskAPI.getTask(id);
      setCurrentTask(data.task);
      return data.task;
    } catch (error) {
      toast.error('Failed to fetch task');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create task
  const createTask = async (taskData) => {
    try {
      const { data } = await taskAPI.createTask(taskData);
      setTasks((prev) => [data.task, ...prev]);
      toast.success('Task created successfully! ✅');
      return { success: true, task: data.task };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      const { data } = await taskAPI.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? data.task : task))
      );
      if (currentTask && currentTask._id === id) {
        setCurrentTask(data.task);
      }
      toast.success('Task updated successfully! ');
      return { success: true, task: data.task };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success('Task deleted successfully! ');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const { data } = await taskAPI.getStats();
      setStats(data.stats);
      return data.stats;
    } catch (error) {
      toast.error('Failed to fetch stats');
      return null;
    }
  };

  // Toggle archive
  const toggleArchive = async (id) => {
    try {
      const { data } = await taskAPI.toggleArchive(id);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? data.task : task))
      );
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      toast.error('Failed to archive task');
      return { success: false };
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      search: '',
      sort: 'newest',
      page: 1,
      limit: 10,
    });
  };

  const value = {
    tasks,
    currentTask,
    stats,
    loading,
    pagination,
    filters,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    fetchStats,
    toggleArchive,
    updateFilters,
    resetFilters,
    setCurrentTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

