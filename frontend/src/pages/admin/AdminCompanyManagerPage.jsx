import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useRoute } from '../../context/RouteContext';

export function AdminCompanyManagerPage() {
  const { navigate } = useRoute();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('Product');
  const [difficulty, setDifficulty] = useState('Medium');
  const [premium, setPremium] = useState(false);
  const [description, setDescription] = useState('');
  const [areasInput, setAreasInput] = useState('DSA, System Design, Aptitude, Core CS');
  const [modules, setModules] = useState(4);
  const [submitting, setSubmitting] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCompanies();
      setCompanies(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const areasList = areasInput
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      await adminService.createCompany({
        name: name.trim(),
        type,
        difficulty,
        premium,
        description: description.trim() || `${name.trim()} placement preparation track and interview questions.`,
        areas: areasList,
        modules: parseInt(modules, 10) || 4,
      });

      setShowModal(false);
      setName('');
      setDescription('');
      fetchCompanies();
    } catch (err) {
      alert(err.message || 'Failed to create company');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-portal-container" style={{ maxWidth: '1050px' }}>
      <div className="admin-header-row">
        <div>
          <button
            className="button secondary sm"
            onClick={() => navigate('/admin/dashboard')}
            style={{ marginBottom: '0.75rem' }}
          >
            ← Back to Resources Dashboard
          </button>
          <h1 className="admin-page-title">Company Track Directory</h1>
          <p className="admin-subtitle">
            Manage company tags and roadmaps so uploaded interview question papers can be attached directly to hiring partners.
          </p>
        </div>
        <div className="admin-actions-group">
          <button className="button" onClick={() => setShowModal(true)}>
            ➕ Add Company
          </button>
        </div>
      </div>

      {error && <div className="admin-alert-error">{error}</div>}

      {loading ? (
        <div className="admin-empty-state">Loading companies…</div>
      ) : companies.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No companies configured yet</h3>
          <p>Create your first company profile to start tagging company question banks.</p>
          <button className="button mt-3" onClick={() => setShowModal(true)}>
            Add Company
          </button>
        </div>
      ) : (
        <div className="admin-companies-grid">
          {companies.map((c) => (
            <div key={c.id} className="admin-company-card">
              <div className="admin-company-card-header">
                <div>
                  <h3 className="admin-company-card-title">{c.name}</h3>
                  <div className="admin-company-card-type">{c.type || 'Tech'}</div>
                </div>
                <span className={`admin-badge admin-badge-${c.difficulty?.toLowerCase() === 'hard' ? 'danger' : 'neutral'}`}>
                  {c.difficulty || 'Medium'}
                </span>
              </div>

              <p className="admin-company-card-desc">
                {c.description || 'Comprehensive company placement preparation track.'}
              </p>

              <div className="admin-company-card-areas">
                {(c.areas || []).map((area, idx) => (
                  <span key={idx} className="admin-area-tag">
                    {area}
                  </span>
                ))}
              </div>

              <div className="admin-company-card-footer">
                <span className="admin-muted" style={{ fontSize: '0.85rem' }}>
                  {c.modules || 0} preparation modules
                </span>
                {c.premium && <span className="admin-badge admin-badge-warning">Premium</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding company */}
      {showModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card" style={{ maxWidth: '520px' }}>
            <h3>Create New Company Record</h3>
            <p className="admin-muted" style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Once created, you can attach PDF interview questions directly to this company.
            </p>

            <form onSubmit={handleCreateCompany}>
              <div className="admin-form-field">
                <label>Company Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Google, Atlassian, Oracle"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Type / Industry</label>
                  <select
                    className="admin-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Product">Product / Big Tech</option>
                    <option value="FinTech">FinTech / Trading</option>
                    <option value="Startup">Unicorn Startup</option>
                    <option value="Consulting">Consulting / IT Services</option>
                  </select>
                </div>

                <div className="admin-form-field">
                  <label>Difficulty Tier</label>
                  <select
                    className="admin-select"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-field">
                <label>Key Interview Areas (Comma separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={areasInput}
                  onChange={(e) => setAreasInput(e.target.value)}
                  placeholder="DSA, System Design, Aptitude, Core CS"
                />
              </div>

              <div className="admin-form-field">
                <label>Overview / Hiring Description</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of their hiring process and typical assessment rounds..."
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="button secondary sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button sm"
                  disabled={submitting || !name.trim()}
                >
                  {submitting ? 'Creating…' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
