import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../Components/Dashboard Pages/Sidebar';
import Navbar from '../../Components/Dashboard Pages/Navbar';
import CustomSelect from '../../Components/Admin/CustomSelect';

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18,15 12,9 6,15" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ArticleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
  </svg>
);

const PatternIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);

// Format date
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get action color
const getActionColor = (action) => {
  switch (action) {
    case 'CREATE': return '#10b981';
    case 'UPDATE': return '#3b82f6';
    case 'DELETE': return '#ef4444';
    default: return '#6b7280';
  }
};

// Get action background
const getActionBg = (action) => {
  switch (action) {
    case 'CREATE': return 'rgba(16, 185, 129, 0.15)';
    case 'UPDATE': return 'rgba(59, 130, 246, 0.15)';
    case 'DELETE': return 'rgba(239, 68, 68, 0.15)';
    default: return 'rgba(107, 114, 128, 0.15)';
  }
};

// Get target icon
const getTargetIcon = (targetType) => {
  switch (targetType) {
    case 'USER': return <UserIcon />;
    case 'ARTICLE': return <ArticleIcon />;
    case 'PATTERN': return <PatternIcon />;
    default: return null;
  }
};

// Changes Diff Component
const ChangesDiff = ({ changes }) => {
  if (!changes) {
    return <span className="admin-no-changes">No changes recorded</span>;
  }

  // Only display the custom change message if it exists
  if (changes.message) {
    return (
      <div className="admin-change-message">
        <div className="admin-change-message-content">
          <span className="admin-change-message-label">Change Description</span>
          <p className="admin-change-message-text">{changes.message}</p>
        </div>
      </div>
    );
  }

  // If no custom message, show no changes
  return <span className="admin-no-changes">No changes recorded</span>;
};

// Log Row Component
const LogRow = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand = log.action === 'UPDATE';

  return (
    <>
      <tr className="admin-log-row" onClick={() => canExpand && setExpanded(!expanded)}>
        <td>
          <div className="admin-log-time">
            {formatDateTime(log.createdAt)}
          </div>
        </td>
        <td>
          <span 
            className="admin-action-badge"
            style={{ 
              background: getActionBg(log.action),
              color: getActionColor(log.action)
            }}
          >
            {log.action}
          </span>
        </td>
        <td>
          <div className="admin-target-cell">
            <div className="admin-target-info">
              <span className="admin-target-type">{log.targetType}</span>
              <span className="admin-target-name">{log.targetName}</span>
            </div>
          </div>
        </td>
        <td>
          <div className="admin-admin-cell">
            <span className="admin-admin-email">{log.adminEmail}</span>
          </div>
        </td>
        <td>
          {canExpand && (
            <button className="admin-expand-btn" aria-label="Expand row">
              {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
          )}
        </td>
      </tr>
      {canExpand && expanded && (
        <tr className="admin-log-details-row">
          <td colSpan="5">
            <div className="admin-log-details">
              <div className="admin-log-details-header">
                <h4>Change Details</h4>
              </div>
              <ChangesDiff changes={log.changes} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const AuditLogsPage = () => {
  const navigate = useNavigate();
  const { member } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const LOGS_PER_PAGE = 20;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: LOGS_PER_PAGE.toString()
      });

      if (searchQuery) params.append('search', searchQuery);
      if (actionFilter !== 'all') params.append('action', actionFilter);
      if (targetFilter !== 'all') params.append('targetType', targetFilter);

      const response = await fetch(`${API_URL}/api/admin/logs?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': member?.auth?.email || '',
          'X-Admin-Id': member?.id || ''
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch audit logs');
      }

      const result = await response.json();
      // Backend returns { success: true, data: logs, pagination: ... }
      const logsData = result.data || result.logs || [];
      setLogs(Array.isArray(logsData) ? logsData : []);
      setTotalLogs(result.pagination?.total || result.totalCount || 0);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, actionFilter, targetFilter, member, API_URL]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalLogs / LOGS_PER_PAGE);

  return (
    <div className="page-wrapper">
      <div className="main-wrapper is-dashboard">
        <Sidebar isOpen={isSidebarOpen} onNavigate={(path) => navigate(path)} activePage="admin-logs" />
        <div className="dashboard_main_wrapper">
          <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
          <div className="dashboard_main_app">
            <div className="admin-page">
          <div className="admin-page-header">
            <div className="admin-page-title">
              <h1>Audit Logs</h1>
              <p>Track all administrative actions and changes</p>
            </div>
            <button 
              className="admin-action-btn admin-action-btn--secondary"
              onClick={fetchLogs}
              disabled={loading}
            >
              <RefreshIcon /> Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="admin-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by admin email or target name..."
                value={searchQuery}
                onChange={handleSearch}
                className="admin-search-input"
              />
            </div>
            <div className="admin-filter-group">
              <CustomSelect
                value={actionFilter}
                onChange={(value) => { setActionFilter(value); setCurrentPage(1); }}
                options={[
                  { value: 'all', label: 'All Actions' },
                  { value: 'CREATE', label: 'Create' },
                  { value: 'UPDATE', label: 'Update' },
                  { value: 'DELETE', label: 'Delete' }
                ]}
              />
            </div>
            <div className="admin-filter-group">
              <CustomSelect
                value={targetFilter}
                onChange={(value) => { setTargetFilter(value); setCurrentPage(1); }}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'USER', label: 'Users' },
                  { value: 'ARTICLE', label: 'Articles' },
                  { value: 'PATTERN', label: 'Patterns' }
                ]}
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="admin-loading">
              <div className="admin-loading-spinner"></div>
              <p>Loading audit logs...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="admin-error">
              <p>Error: {error}</p>
              <button onClick={fetchLogs} className="admin-retry-btn">
                Try Again
              </button>
            </div>
          )}

          {/* Logs Table */}
          {!loading && !error && (
            <>
              <div className="admin-table-container card_app_wrapper">
                <table className="admin-table admin-logs-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Target</th>
                      <th>Admin</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? (
                      logs.map(log => (
                        <LogRow key={log.id} log={log} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="admin-table-empty">
                          {searchQuery || actionFilter !== 'all' || targetFilter !== 'all'
                            ? 'No logs match your filters'
                            : 'No audit logs yet'
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="admin-pagination">
                  <span className="admin-pagination-info">
                    Showing {(currentPage - 1) * LOGS_PER_PAGE + 1} - {Math.min(currentPage * LOGS_PER_PAGE, totalLogs)} of {totalLogs} logs
                  </span>
                  <div className="admin-pagination-controls">
                    <button 
                      className="admin-pagination-btn"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeftIcon />
                    </button>
                    <span className="admin-pagination-current">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      className="admin-pagination-btn"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
