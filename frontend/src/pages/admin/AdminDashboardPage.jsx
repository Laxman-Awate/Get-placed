import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { useRoute } from '../../context/RouteContext';

export function AdminDashboardPage() {
  const { navigate } = useRoute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({
    totalResources: 0,
    inProgress: 0,
    pendingReview: 0,
    published: 0,
    failed: 0,
    publishedContentCount: 0,
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reprocessingId, setReprocessingId] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await adminService.getResources({
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      });
      setResources(data.resources || []);
      if (data.stats) {
        setStats(data.stats);
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load admin resources.');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-poll if any resource is currently being processed
  useEffect(() => {
    const hasActiveProcessing = resources.some(
      (r) => r.status === 'UPLOADED' || r.status === 'PARSING' || r.status === 'GENERATING'
    );
    if (!hasActiveProcessing) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 3000);
    return () => clearInterval(interval);
  }, [resources, fetchDashboardData]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will delete all associated drafts.`)) {
      return;
    }
    try {
      await adminService.deleteResource(id);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete resource');
    }
  };

  const handleReprocess = async (id) => {
    try {
      setReprocessingId(id);
      await adminService.reprocessResource(id, { generateMockTest: true });
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to reprocess resource');
    } finally {
      setReprocessingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'REVIEW':
        return 'admin-badge-warning';
      case 'PUBLISHED':
        return 'admin-badge-success';
      case 'PARSING':
      case 'GENERATING':
        return 'admin-badge-info admin-badge-pulse';
      case 'FAILED':
        return 'admin-badge-danger';
      default:
        return 'admin-badge-neutral';
    }
  };

  return (
    <div className="admin-portal-container">
      {/* Top Header */}
      <div className="admin-header-row">
        <div>
          <span className="admin-eyebrow">Secret Admin Control Center</span>
          <h1 className="admin-page-title">Content Pipeline & Resources</h1>
          <p className="admin-subtitle">
            Upload interview PDFs and notes, extract questions via LLM, review structured drafts, and publish to the live platform.
          </p>
        </div>
        <div className="admin-actions-group">
          <button
            className="button secondary"
            onClick={() => navigate('/admin/companies')}
          >
            🏢 Companies
          </button>
          <button
            className="button"
            onClick={() => navigate('/admin/upload')}
          >
            ➕ Upload Resource
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Resources</div>
          <div className="admin-stat-value">{stats.totalResources}</div>
          <div className="admin-stat-hint">Uploaded documents</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Processing Now</div>
          <div className="admin-stat-value admin-stat-highlight-blue">
            {stats.inProgress}
          </div>
          <div className="admin-stat-hint">PDFBox &amp; LLM parsing</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Pending Review</div>
          <div className="admin-stat-value admin-stat-highlight-orange">
            {stats.pendingReview}
          </div>
          <div className="admin-stat-hint">Ready for admin approval</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Published Mock Tests</div>
          <div className="admin-stat-value admin-stat-highlight-green">
            {stats.publishedContentCount || stats.published}
          </div>
          <div className="admin-stat-hint">Live in student catalog</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="admin-filters-bar">
        <div className="admin-filter-group">
          <label>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">All Categories</option>
            <option value="COMPANY">Company-Specific</option>
            <option value="DSA">Data Structures &amp; Algorithms</option>
            <option value="APTITUDE">Aptitude &amp; Reasoning</option>
            <option value="CORE_CS">Core CS (OS/DBMS/CN)</option>
          </select>
        </div>

        <div className="admin-filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">All Statuses</option>
            <option value="REVIEW">Pending Review</option>
            <option value="PUBLISHED">Published</option>
            <option value="PARSING">Parsing / Generating</option>
            <option value="FAILED">Failed</option>
            <option value="UPLOADED">Uploaded</option>
          </select>
        </div>

        <button
          className="button secondary sm"
          onClick={fetchDashboardData}
          disabled={loading}
          style={{ marginLeft: 'auto' }}
        >
          {loading ? 'Refreshing…' : '⟳ Refresh'}
        </button>
      </div>

      {/* Resources Table */}
      <div className="admin-card">
        {loading && resources.length === 0 ? (
          <div className="admin-empty-state">Loading resources…</div>
        ) : resources.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No resources found</h3>
            <p>Upload a company interview PDF or question paper to start extracting tests.</p>
            <button
              className="button mt-3"
              onClick={() => navigate('/admin/upload')}
            >
              Upload First Resource
            </button>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Resource Title</th>
                  <th>Category</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Generated</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((res) => (
                  <tr key={res.id}>
                    <td>
                      <div className="admin-table-title">{res.title}</div>
                      <div className="admin-table-sub">
                        {res.fileName || 'Pasted text'} • {res.resourceType}
                      </div>
                      {res.errorMessage && (
                        <div className="admin-table-error" title={res.errorMessage}>
                          ⚠ {res.errorMessage}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="admin-pill">{res.category}</span>
                    </td>
                    <td>
                      {res.companyName ? (
                        <span className="admin-company-tag">{res.companyName}</span>
                      ) : (
                        <span className="admin-muted">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`admin-badge ${getStatusBadgeClass(res.status)}`}>
                        {res.status === 'PARSING' ? 'PARSING PDF…' :
                         res.status === 'GENERATING' ? 'LLM GENERATING…' :
                         res.status}
                      </span>
                    </td>
                    <td>
                      <span className="admin-count-pill">
                        {res.generatedCount || 0} drafts
                      </span>
                    </td>
                    <td>
                      <span className="admin-muted" style={{ fontSize: '0.85rem' }}>
                        {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions">
                        {res.status === 'REVIEW' && (
                          <button
                            className="button sm"
                            onClick={() => navigate(`/admin/review/${res.id}`)}
                          >
                            Review &amp; Publish →
                          </button>
                        )}
                        {res.status === 'PUBLISHED' && (
                          <button
                            className="button secondary sm"
                            onClick={() => navigate(`/admin/review/${res.id}`)}
                          >
                            View Draft
                          </button>
                        )}
                        <button
                          className="button icon-btn"
                          title="Reprocess with LLM"
                          disabled={reprocessingId === res.id}
                          onClick={() => handleReprocess(res.id)}
                        >
                          {reprocessingId === res.id ? '…' : '⟲'}
                        </button>
                        <button
                          className="button danger icon-btn"
                          title="Delete Resource"
                          onClick={() => handleDelete(res.id, res.title)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
