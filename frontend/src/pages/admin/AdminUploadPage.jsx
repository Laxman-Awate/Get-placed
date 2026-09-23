import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';
import { useRoute } from '../../context/RouteContext';

export function AdminUploadPage() {
  const { navigate } = useRoute();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState([]);

  // Form states
  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState('PDF_COMPANY_QUESTIONS');
  const [category, setCategory] = useState('COMPANY');
  const [companyId, setCompanyId] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
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

  // Pipeline animated progress states
  const [pipelineStep, setPipelineStep] = useState(0);

  const SAMPLE_QUESTIONS = `1. What is the worst-case time complexity of searching in a Hash Table with separate chaining?
A) O(1)
B) O(log n)
C) O(n)
D) O(n log n)
Ans: C
Explanation: In the worst case, all keys collide and hash into a single linked list bucket, degrading lookup to linear traversal O(n).

2. Which tree traversal visits the root node before visiting both the left and right subtrees?
A) Inorder
B) Preorder
C) Postorder
D) Level-order
Ans: B
Explanation: Preorder traversal visits the root first, then left subtree, then right subtree (Root-Left-Right).

3. Which of the following is NOT a necessary condition for a deadlock to occur in an operating system?
A) Mutual Exclusion
B) Hold and Wait
C) Preemption Allowed
D) Circular Wait
Ans: C
Explanation: The Coffman condition is "No Preemption". If preemption is allowed, deadlocks cannot occur.

4. In SQL, which clause is used to filter groups created by the GROUP BY clause?
A) WHERE
B) HAVING
C) ORDER BY
D) LIMIT
Ans: B
Explanation: The HAVING clause was added to SQL because the WHERE clause cannot be used with aggregate functions.

5. A train 240 meters long passes a pole in 24 seconds. What is the speed of the train in km/hr?
A) 36 km/hr
B) 40 km/hr
C) 42 km/hr
D) 48 km/hr
Ans: A
Explanation: Speed = 240m / 24s = 10 m/s. Converting to km/hr: 10 * (18 / 5) = 36 km/hr.`;

  useEffect(() => {
    adminService.getCompanies().then(setCompanies).catch(() => {});
  }, []);

  const handleSelectedFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setError('');
    if (!title) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleInsertSampleText = () => {
    setRawText(SAMPLE_QUESTIONS);
    setError('');
    if (!title) {
      setTitle('Placement Technical & Aptitude Assessment 2026');
    }
  };

  const handleLoadSampleFile = () => {
    const sampleBlob = new Blob([SAMPLE_QUESTIONS], { type: 'text/plain' });
    const sampleFile = new File([sampleBlob], 'Placement_Assessment_Question_Bank_2026.txt', { type: 'text/plain' });
    handleSelectedFile(sampleFile);
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

    // Auto-derive title if empty
    let effectiveTitle = title.trim();
    if (!effectiveTitle) {
      if (file) {
        effectiveTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      } else if (rawText.trim()) {
        const firstLine = rawText.trim().split('\n')[0].replace(/^[#\d\.\-\s]+/, '').trim();
        effectiveTitle = firstLine.slice(0, 50) || 'Placement Assessment Questions';
      } else {
        const comp = companies.find((c) => c.id === companyId);
        effectiveTitle = comp ? `${comp.name} Assessment 2026` : `${category} Assessment 2026`;
      }
      setTitle(effectiveTitle);
    }

    if (uploadMode === 'file' && !file) {
      setError('Please select a file or click "Use Sample Placement Resource", or switch to the "Paste Raw Text" tab.');
      return;
    }
    if (uploadMode === 'text' && !rawText.trim()) {
      setError('Please paste questions/notes or click "Insert Sample Question Bank" to test.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setPipelineStep(1); // Step 1: Ingesting

      const formData = new FormData();
      formData.append('title', effectiveTitle);
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

      await new Promise((r) => setTimeout(r, 450));
      setPipelineStep(2); // Step 2: Extracting

      const result = await adminService.uploadResource(formData);

      setPipelineStep(3); // Step 3: Compiling drafts
      await new Promise((r) => setTimeout(r, 450));

      setPipelineStep(4); // Step 4: Ready
      await new Promise((r) => setTimeout(r, 350));

      // Redirect immediately to Review Workbench to show output!
      if (result && result.resourceId) {
        navigate(`/admin/review/${result.resourceId}`);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Extraction pipeline failed. Please verify format and try again.');
    } finally {
      setLoading(false);
      setPipelineStep(0);
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
          <div>
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              accept=".pdf,.txt,.csv,.md,.json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {file ? (
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1.5px solid rgba(99, 102, 241, 0.4)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2.2rem' }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary, #f8fafc)', fontSize: '1rem' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                      <span style={{ color: '#22c55e', fontWeight: 600 }}>✓ File attached &amp; ready for extraction</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    className="button secondary sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    className="button danger sm icon-btn"
                    title="Remove file"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`admin-file-dropzone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: dragActive ? '2px dashed #818cf8' : '2px dashed rgba(255, 255, 255, 0.15)',
                  backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📁</span>
                <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary, #f8fafc)' }}>
                  Drag &amp; drop a PDF, TXT, or CSV file here, or click to browse
                </div>
                <div className="admin-muted" style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>
                  Supports PDF question papers, notes, TXT, MD, CSV files up to 50MB
                </div>
                <div
                  style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="button secondary sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </button>
                  <button
                    type="button"
                    className="button secondary sm"
                    style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#818cf8' }}
                    onClick={handleLoadSampleFile}
                  >
                    ✨ Load Sample Placement Document
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="admin-form-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label htmlFor="raw-text">Paste Raw Document / Questions Text *</label>
              <button
                type="button"
                className="admin-link-btn"
                style={{ fontSize: '0.82rem', fontWeight: 600, color: '#818cf8' }}
                onClick={handleInsertSampleText}
              >
                ✨ Insert Sample Question Bank (5 Questions)
              </button>
            </div>
            <textarea
              id="raw-text"
              className="admin-textarea"
              rows={10}
              placeholder="Paste questions here, e.g.:&#10;1. What is the time complexity of QuickSort in the worst case?&#10;A) O(n)&#10;B) O(n log n)&#10;C) O(n^2)&#10;D) O(log n)&#10;Ans: C&#10;Explanation: When the pivot is the smallest or largest element..."
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setError('');
              }}
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

        {/* Inline Bottom Error Banner (always visible right above submit) */}
        {error && (
          <div className="admin-alert-error" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }} role="alert">
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div style={{ flex: 1 }}>{error}</div>
          </div>
        )}

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
            {loading ? 'Processing Extraction Pipeline…' : '🚀 Start Extraction Pipeline'}
          </button>
        </div>
      </form>

      {/* Animated Extraction Pipeline Progress Overlay */}
      {loading && (
        <div className="admin-pipeline-overlay">
          <div className="admin-pipeline-modal">
            <div className="admin-pipeline-header">
              <div className="admin-pulse-icon">⚡</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Automated Extraction Pipeline Active</h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                  Structuring questions, options, answer keys and generating placement test artifacts...
                </p>
              </div>
            </div>

            <div className="admin-pipeline-steps">
              <div className={`admin-pipeline-step ${pipelineStep >= 1 ? 'active' : ''} ${pipelineStep > 1 ? 'completed' : ''}`}>
                <div className="step-circle">{pipelineStep > 1 ? '✓' : '1'}</div>
                <div className="step-text">
                  <strong>Ingest &amp; Decode Document</strong>
                  <small>Reading text buffers and extracting question streams</small>
                </div>
              </div>

              <div className={`admin-pipeline-step ${pipelineStep >= 2 ? 'active' : ''} ${pipelineStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">{pipelineStep > 2 ? '✓' : '2'}</div>
                <div className="step-text">
                  <strong>Question &amp; Key Extraction</strong>
                  <small>Parsing prompts, options A/B/C/D, explanations, and verifying answers</small>
                </div>
              </div>

              <div className={`admin-pipeline-step ${pipelineStep >= 3 ? 'active' : ''} ${pipelineStep > 3 ? 'completed' : ''}`}>
                <div className="step-circle">{pipelineStep > 3 ? '✓' : '3'}</div>
                <div className="step-text">
                  <strong>Synthesize Assessment Drafts</strong>
                  <small>Generating mock test, section weighting, and question taxonomy</small>
                </div>
              </div>

              <div className={`admin-pipeline-step ${pipelineStep >= 4 ? 'active' : ''}`}>
                <div className="step-circle">{pipelineStep >= 4 ? '✓' : '4'}</div>
                <div className="step-text">
                  <strong>Launching Review Workbench</strong>
                  <small>Redirecting to interactive workbench for review and publishing</small>
                </div>
              </div>
            </div>

            <div className="admin-pipeline-bar-wrapper">
              <div
                className="admin-pipeline-bar-fill"
                style={{
                  width: pipelineStep === 1 ? '25%' : pipelineStep === 2 ? '55%' : pipelineStep === 3 ? '85%' : '100%',
                }}
              />
            </div>
          </div>
        </div>
      )}

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
