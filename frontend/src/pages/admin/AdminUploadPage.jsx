import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useRoute } from '../../context/RouteContext';

export function AdminUploadPage() {
  const { navigate } = useRoute();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState([]);

  // Form states
  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState('PDF_COMPANY_QUESTIONS');
  const [category, setCategory] = useState('COMPANY');
  const [companyId, setCompanyId] = useState('');
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'text'
  const [generateMockTest, setGenerateMockTest] = useState(true);
  const [generateQuiz, setGenerateQuiz] = useState(false);
  const [generateSheet, setGenerateSheet] = useState(false);

  // Quick company creation modal
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyType, setNewCompanyType] = useState('Product');
  const [creatingCompany, setCreatingCompany] = useState(false);

  useEffect(() => {
    adminService.getCompanies().then(setCompanies).catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName);
      }
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    try {
      setCreatingCompany(true);
      const created = await adminService.createCompany({
        name: newCompanyName.trim(),
        type: newCompanyType,
      });
      setCompanies((prev) => [...prev, created]);
      setCompanyId(created.id);
      setShowCompanyModal(false);
      setNewCompanyName('');
    } catch (err) {
      alert(err.message || 'Failed to create company');
    } finally {
      setCreatingCompany(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a descriptive title.');
      return;
    }
    if (uploadMode === 'file' && !file) {
      setError('Please select a PDF or text file to upload.');
      return;
    }
    if (uploadMode === 'text' && !rawText.trim()) {
      setError('Please paste the question or note contents.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('resourceType', resourceType);
      formData.append('category', category);
      if (companyId) {
        formData.append('companyId', companyId);
      }
      formData.append('generateMockTest', generateMockTest);
      formData.append('generateQuiz', generateQuiz);
      formData.append('generateSheet', generateSheet);

      if (uploadMode === 'file' && file) {
        formData.append('file', file);
      } else if (uploadMode === 'text') {
        formData.append('rawText', rawText);
      }

      await adminService.uploadResource(formData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Upload failed. Please check file format and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-portal-container" style={{ maxWidth: '850px' }}>
      <div className="admin-header-row">
        <div>
          <button
            className="button secondary sm"
            onClick={() => navigate('/admin/dashboard')}
            style={{ marginBottom: '0.75rem' }}
          >
            ← Back to Resources
          </button>
          <h1 className="admin-page-title">Upload Placement Resource</h1>
          <p className="admin-subtitle">
            Upload interview question banks, campus PDFs, or topic notes. The extraction engine uses Apache PDFBox and LLMs to structure questions into review-ready mock tests.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-alert-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form-card">
        {/* Title */}
        <div className="admin-form-field">
          <label htmlFor="res-title">Resource Title *</label>
          <input
            id="res-title"
            type="text"
            className="admin-input"
            placeholder="e.g., Amazon 2026 SDE-1 Online Assessment Questions"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category & Type */}
        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="res-category">Category *</label>
            <select
              id="res-category"
              className="admin-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value !== 'COMPANY') {
                  setCompanyId('');
                }
              }}
            >
              <option value="COMPANY">Company-Specific Interview Questions</option>
              <option value="DSA">Data Structures &amp; Algorithms</option>
              <option value="APTITUDE">Quantitative &amp; Logical Aptitude</option>
              <option value="CORE_CS">Core Computer Science (OS/DBMS/CN)</option>
            </select>
          </div>

          <div className="admin-form-field">
            <label htmlFor="res-type">Resource Format *</label>
            <select
              id="res-type"
              className="admin-select"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
            >
              <option value="PDF_COMPANY_QUESTIONS">PDF Company Questions</option>
              <option value="PDF_TOPIC_NOTES">PDF Topic Study Notes</option>
              <option value="RAW_QUESTION_LIST">Raw Question Bank</option>
              <option value="LINK">Online Article / Pasted Link</option>
            </select>
          </div>
        </div>

        {/* Company Tagging (if COMPANY category) */}
        {category === 'COMPANY' && (
          <div className="admin-form-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="res-company">Target Company Tag</label>
              <button
                type="button"
                className="admin-link-btn"
                onClick={() => setShowCompanyModal(true)}
              >
                + Add New Company
              </button>
            </div>
            <select
              id="res-company"
              className="admin-select"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            >
              <option value="">-- Select Company (Optional) --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type || 'Tech'})
                </option>
              ))}
            </select>
            <span className="admin-field-hint">
              Attaching to a company allows this test to show in that company's preparation roadmap.
            </span>
          </div>
        )}

        {/* Upload Mode Selector */}
        <div className="admin-mode-tabs">
          <button
            type="button"
            className={`admin-mode-tab ${uploadMode === 'file' ? 'active' : ''}`}
            onClick={() => setUploadMode('file')}
          >
            📄 Upload PDF / Document
          </button>
          <button
            type="button"
            className={`admin-mode-tab ${uploadMode === 'text' ? 'active' : ''}`}
            onClick={() => setUploadMode('text')}
          >
            ✍ Paste Raw Text / Questions
          </button>
        </div>

        {uploadMode === 'file' ? (
          <div className="admin-file-dropzone">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.txt,.csv,.md,.json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="admin-dropzone-label">
              <span style={{ fontSize: '2.5rem' }}>📁</span>
              <div style={{ fontWeight: 600, marginTop: '0.5rem' }}>
                {file ? file.name : 'Choose a PDF, TXT, or CSV file'}
              </div>
              <div className="admin-muted" style={{ fontSize: '0.85rem' }}>
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports PDF files up to 50MB'}
              </div>
              <button
                type="button"
                className="button secondary sm mt-2"
                onClick={() => document.getElementById('file-upload').click()}
              >
                Browse Files
              </button>
            </label>
          </div>
        ) : (
          <div className="admin-form-field">
            <label htmlFor="raw-text">Paste Raw Document / Questions Text *</label>
            <textarea
              id="raw-text"
              className="admin-textarea"
              rows={10}
              placeholder="Paste text here, e.g.:&#10;1. What is the time complexity of QuickSort in the worst case?&#10;A) O(n)&#10;B) O(n log n)&#10;C) O(n^2)&#10;D) O(log n)&#10;Ans: C&#10;Explanation: When the pivot is the smallest or largest element..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
          </div>
        )}

        {/* Generation Options */}
        <div className="admin-generation-section">
          <h3>Automated Output Generation</h3>
          <p className="admin-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Choose what content artifacts to build from the structured extraction result:
          </p>

          <div className="admin-checkbox-group">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={generateMockTest}
                onChange={(e) => setGenerateMockTest(e.target.checked)}
              />
              <div>
                <strong>Generate Timed Mock Test (Recommended)</strong>
                <p>Creates a full test draft with section splits, timer, and score weighting.</p>
              </div>
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={generateQuiz}
                onChange={(e) => setGenerateQuiz(e.target.checked)}
              />
              <div>
                <strong>Generate Topic Quiz</strong>
                <p>Creates an untimed practice quiz draft with instant explanations.</p>
              </div>
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={generateSheet}
                onChange={(e) => setGenerateSheet(e.target.checked)}
              />
              <div>
                <strong>Generate Practice Problem Sheet</strong>
                <p>Creates a checklist-style sheet categorized by difficulty.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="admin-form-footer">
          <button
            type="button"
            className="button secondary"
            onClick={() => navigate('/admin/dashboard')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button primary"
            disabled={loading}
          >
            {loading ? 'Uploading & Starting Extraction…' : '🚀 Start Extraction Pipeline'}
          </button>
        </div>
      </form>

      {/* Modal for adding company */}
      {showCompanyModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <h3>Add New Company</h3>
            <form onSubmit={handleCreateCompany}>
              <div className="admin-form-field">
                <label>Company Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Atlassian, Goldman Sachs"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="admin-form-field">
                <label>Company Type</label>
                <select
                  className="admin-select"
                  value={newCompanyType}
                  onChange={(e) => setNewCompanyType(e.target.value)}
                >
                  <option value="Product">Product / Big Tech</option>
                  <option value="FinTech">FinTech / Banking</option>
                  <option value="Startup">High-Growth Startup</option>
                  <option value="Consulting">Consulting / IT Services</option>
                </select>
              </div>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="button secondary sm"
                  onClick={() => setShowCompanyModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button sm"
                  disabled={creatingCompany || !newCompanyName.trim()}
                >
                  {creatingCompany ? 'Saving…' : 'Save Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
