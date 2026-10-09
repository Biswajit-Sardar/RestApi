import { useState } from 'react';
import TaskCard from './TaskCard';
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

const TaskList = ({
  tasks,
  loading,
  pagination,
  filters,
  onUpdateFilters,
  onResetFilters,
  onDelete,
  onArchive,
  onStatusChange,
  onPageChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="task-list-container">
      {/* Search and Filter Bar */}
      <div className="task-toolbar">
        <div className="search-bar">
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onUpdateFilters({ search: e.target.value })}
            className="search-input"
          />
        </div>

        <div className="toolbar-actions">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-outline btn-sm ${showFilters ? 'active' : ''}`}
          >
            <FiFilter size={16} />
            Filters
          </button>
          <button onClick={onResetFilters} className="btn btn-outline btn-sm">
            <FiRefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => onUpdateFilters({ status: e.target.value })}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => onUpdateFilters({ priority: e.target.value })}
              className="form-select"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => onUpdateFilters({ category: e.target.value })}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => onUpdateFilters({ sort: e.target.value })}
              className="form-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="due-date">Due Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}

      {/* Task Count */}
      <div className="task-count">
        <p>
          Showing {tasks.length} of {pagination.total} tasks
        </p>
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="loading-placeholder">
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            {filters.search || filters.status || filters.priority || filters.category
              ? 'Try adjusting your filters'
              : 'Create your first task to get started!'}
          </p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={onDelete}
              onArchive={onArchive}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn btn-outline btn-sm"
          >
            <FiChevronLeft size={16} />
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`page-btn ${
                    pageNum === pagination.page ? 'active' : ''
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="btn btn-outline btn-sm"
          >
            Next
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;

