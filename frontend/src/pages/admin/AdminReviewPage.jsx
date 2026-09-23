import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { useRoute } from '../../context/RouteContext';

export function AdminReviewPage() {
  const { path, navigate } = useRoute();
  const resourceId = path.split('/')[3]; // /admin/review/:id

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [resource, setResource] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [activeDraftIndex, setActiveDraftIndex] = useState(0);

  // Active draft editable data
  const [draftTitle, setDraftTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [questions, setQuestions] = useState([]);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
  const [activePreviewQ, setActivePreviewQ] = useState(0);

  const [publishedEntityId, setPublishedEntityId] = useState(null);

  const loadResourceData = useCallback(async (isPolling = false) => {
    if (!resourceId) return;
    try {
      if (!isPolling) setLoading(true);
      setError('');
      let data = await adminService.getResource(resourceId);
      setResource(data);

      let generatedList = data.generatedContent || [];
      if (generatedList.length === 0) {
        // Auto-reprocess to generate draft immediately if missing
        try {
          const reprocessed = await adminService.reprocessResource(resourceId);
          if (reprocessed && reprocessed.generatedContent && reprocessed.generatedContent.length > 0) {
            data = reprocessed;
            generatedList = reprocessed.generatedContent;
            setResource(reprocessed);
          }
        } catch {}
      }

      setDrafts(generatedList);

      if (generatedList.length > 0) {
        const target = generatedList[activeDraftIndex] || generatedList[0];
        populateDraftState(target);
      } else if (data.status === 'PARSING' || data.status === 'GENERATING') {
        // Auto-poll in background until generation finishes
        setTimeout(() => loadResourceData(true), 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to load resource for review.');
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [resourceId, activeDraftIndex]);

  const populateDraftState = (draft) => {
    if (!draft) return;
    setDraftTitle(draft.title || '');
    const data = draft.data || {};
    setDurationMinutes(data.durationMinutes || 45);
    setDifficulty(data.difficulty || 'MEDIUM');
    setQuestions(data.questions || data.problems || []);
    setActivePreviewQ(0);
  };

  useEffect(() => {
    loadResourceData();
  }, [loadResourceData]);

  const handleSelectDraft = (index) => {
    setActiveDraftIndex(index);
    populateDraftState(drafts[index]);
  };

  const handleUpdateQuestion = (qIndex, field, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex] = { ...next[qIndex], [field]: value };
      return next;
    });
  };

  const handleUpdateOption = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      const nextOpts = [...(next[qIndex].options || [])];
      nextOpts[optIndex] = value;
      next[qIndex] = { ...next[qIndex], options: nextOpts };
      return next;
    });
  };

  const handleSetCorrectAnswer = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex] = { ...next[qIndex], correctAnswer: optIndex };
      return next;
    });
  };

  const handleDeleteQuestion = (qIndex) => {
    if (questions.length <= 1) {
      alert('A test must contain at least 1 question.');
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
  };

  const handleAddQuestion = () => {
    const newQ = {
      id: `q-${Date.now()}`,
      section: 'Technical Assessment',
      topic: 'General',
      difficulty: 'MEDIUM',
      question: 'Enter question text here...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'Explanation for correct answer.',
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const handleSaveDraft = async () => {
    const currentDraft = drafts[activeDraftIndex];
    if (!currentDraft) return;

    try {
      setSaving(true);
      setError('');
      setSuccessMsg('');

      const updatedData = {
        ...currentDraft.data,
        title: draftTitle,
        durationMinutes: parseInt(durationMinutes, 10) || 45,
        difficulty,
        questions,
      };

      await adminService.updateDraft(currentDraft.id, {
        title: draftTitle,
        data: updatedData,
      });

      setSuccessMsg('Draft changes saved successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save draft changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleApproveAndPublish = async () => {
    const currentDraft = drafts[activeDraftIndex];
    if (!currentDraft) return;

    if (!window.confirm('Approve and publish this content to the live platform? It will become immediately visible in student catalogs.')) {
      return;
    }

    try {
      setPublishing(true);
      setError('');
      setSuccessMsg('');

      // Save draft first
      const updatedData = {
        ...currentDraft.data,
        title: draftTitle,
        durationMinutes: parseInt(durationMinutes, 10) || 45,
        difficulty,
        questions,
      };
      await adminService.updateDraft(currentDraft.id, {
        title: draftTitle,
        data: updatedData,
      });

      // Approve & publish
      const res = await adminService.approveContent(currentDraft.id);
      const targetId = res.targetEntityId || currentDraft.data?.proposedId;
      setPublishedEntityId(targetId);
      setSuccessMsg(`Assessment is now live in student mock tests catalog! (ID: ${targetId})`);
      loadResourceData();
    } catch (err) {
      setError(err.message || 'Failed to publish content.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-portal-container">
        <div className="admin-empty-state">Loading extraction review data…</div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="admin-portal-container">
        <div className="admin-alert-error">Resource not found.</div>
        <button className="button secondary mt-3" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="admin-portal-container" style={{ maxWidth: '850px' }}>
        <button
          className="button secondary sm"
          onClick={() => navigate('/admin/dashboard')}
          style={{ marginBottom: '0.75rem' }}
        >
          ← Back to Dashboard
        </button>
        <div className="admin-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div className="admin-pulse-icon" style={{ margin: '0 auto 1.5rem auto' }}>⚡</div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>Extraction Pipeline In Progress</h2>
          <p className="admin-muted" style={{ maxWidth: '520px', margin: '0 auto 1.75rem auto' }}>
            The extraction engine is currently parsing <strong>{resource.title}</strong> and compiling structured questions. This page will update automatically.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="button primary sm"
              onClick={async () => {
                setLoading(true);
                try {
                  await adminService.reprocessResource(resourceId);
                  loadResourceData(false);
                } catch (e) {
                  setError(e.message || 'Failed to generate questions');
                  setLoading(false);
                }
              }}
            >
              ⚡ Extract &amp; Generate Questions Now
            </button>
            <button className="button secondary sm" onClick={() => loadResourceData(false)}>
              🔄 Check Status Now
            </button>
            <button className="button secondary sm" onClick={() => navigate('/admin/dashboard')}>
              Back to Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentDraft = drafts[activeDraftIndex];

  return (
    <div className="admin-portal-container" style={{ maxWidth: '1100px' }}>
      {/* Header Breadcrumbs & Status */}
      <div className="admin-header-row">
        <div>
          <button
            className="button secondary sm"
            onClick={() => navigate('/admin/dashboard')}
            style={{ marginBottom: '0.75rem' }}
          >
            ← Back to Resources Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="admin-page-title" style={{ margin: 0 }}>Review &amp; Refine Extraction</h1>
            <span className={`admin-badge admin-badge-${resource.status === 'PUBLISHED' ? 'success' : 'warning'}`}>
              {resource.status}
            </span>
          </div>
          <p className="admin-subtitle">
            Source: <strong>{resource.title}</strong> ({resource.fileName || 'Pasted text'}) • Extracted {questions.length} questions
          </p>
        </div>

        {/* Top Actions & View Mode Switcher */}
        <div className="admin-actions-group">
          <div className="admin-toggle-bar">
            <button
              className={`admin-toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
              onClick={() => setViewMode('edit')}
            >
              ✏ Edit Mode
            </button>
            <button
              className={`admin-toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              👁 Student Preview
            </button>
          </div>

          <button
            type="button"
            className="button secondary sm"
            disabled={saving || publishing}
            onClick={handleSaveDraft}
          >
            {saving ? 'Saving…' : '💾 Save Draft'}
          </button>

          <button
            type="button"
            className="button primary sm"
            disabled={saving || publishing}
            onClick={handleApproveAndPublish}
          >
            {publishing ? 'Publishing…' : '🚀 Approve & Publish to Platform'}
          </button>
        </div>
      </div>

      {/* Prominent Review & Publish Action Banner */}
      <div className="admin-review-callout">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="admin-pulse-icon" style={{ width: '42px', height: '42px', fontSize: '1.25rem' }}>⚡</div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: '#f8fafc' }}>
              Extraction Pipeline Succeeded — Ready for Review &amp; Publishing
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              Review the structured questions, options, and verified answer keys below. Click <strong>Approve &amp; Publish to Platform</strong> to make this assessment immediately visible to students.
            </p>
          </div>
          <button
            type="button"
            className="button primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.92rem', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
            disabled={saving || publishing}
            onClick={handleApproveAndPublish}
          >
            {publishing ? 'Publishing…' : '🚀 Approve & Publish to Platform'}
          </button>
        </div>
      </div>

      {error && <div className="admin-alert-error">{error}</div>}
      {successMsg && (
        <div
          className="admin-alert-success"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🎉</span>
            <div>
              <strong>Published to Live Platform!</strong>
              <div style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>{successMsg}</div>
            </div>
          </div>
          {publishedEntityId && (
            <button
              type="button"
              className="button sm"
              style={{
                background: '#22c55e',
                color: '#0f172a',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/mock-tests/${publishedEntityId}`)}
            >
              👀 View Live in Student Portal →
            </button>
          )}
        </div>
      )}

      {/* Drafts Tab Switcher if multiple outputs generated */}
      {drafts.length > 1 && (
        <div className="admin-draft-tabs">
          {drafts.map((d, idx) => (
            <button
              key={d.id}
              className={`admin-draft-tab ${activeDraftIndex === idx ? 'active' : ''}`}
              onClick={() => handleSelectDraft(idx)}
            >
              {d.contentType === 'MOCK_TEST' ? '🎯 Mock Test' :
               d.contentType === 'QUIZ' ? '❓ Quiz' : '📋 Sheet'} ({d.status})
            </button>
          ))}
        </div>
      )}

      {/* Main Review Body */}
      {viewMode === 'edit' ? (
        <div className="admin-review-grid">
          {/* Left Column: Metadata & Settings */}
          <div className="admin-review-sidebar">
            <div className="admin-card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Test Properties</h3>

              <div className="admin-form-field">
                <label>Published Test Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                />
              </div>

              <div className="admin-form-field">
                <label>Time Limit (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  className="admin-input"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>

              <div className="admin-form-field">
                <label>Difficulty Tier</label>
                <select
                  className="admin-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="admin-form-field">
                <label>Company Tag</label>
                <div className="admin-input-static">
                  {resource.companyName || 'None (General Assessment)'}
                </div>
              </div>

              <div className="admin-review-summary-stats">
                <div>Total Questions: <strong>{questions.length}</strong></div>
                <div>Status: <strong style={{ color: currentDraft?.status === 'PUBLISHED' ? '#22c55e' : '#f59e0b' }}>{currentDraft?.status}</strong></div>
              </div>
            </div>
          </div>

          {/* Right Column: Questions List Editor */}
          <div className="admin-review-main">
            <div className="admin-section-header">
              <h2>Questions ({questions.length})</h2>
              <button
                type="button"
                className="button secondary sm"
                onClick={handleAddQuestion}
              >
                + Add Question
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={q.id || qIdx} className="admin-question-card">
                <div className="admin-q-card-header">
                  <div className="admin-q-number">Question {qIdx + 1}</div>
                  <div className="admin-q-meta-inputs">
                    <input
                      type="text"
                      className="admin-input sm"
                      placeholder="Section (e.g. Aptitude)"
                      value={q.section || ''}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'section', e.target.value)}
                      title="Section"
                    />
                    <input
                      type="text"
                      className="admin-input sm"
                      placeholder="Topic (e.g. Arrays)"
                      value={q.topic || ''}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'topic', e.target.value)}
                      title="Topic"
                    />
                    <select
                      className="admin-select sm"
                      value={q.difficulty || 'MEDIUM'}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'difficulty', e.target.value)}
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                    <button
                      type="button"
                      className="button danger icon-btn sm"
                      title="Delete Question"
                      onClick={() => handleDeleteQuestion(qIdx)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="admin-form-field" style={{ marginTop: '0.5rem' }}>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={q.question || ''}
                    onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                    placeholder="Question prompt..."
                  />
                </div>

                {/* Options List */}
                <div className="admin-options-editor">
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', marginBottom: '0.5rem' }}>
                    Options (select the radio button next to the correct answer):
                  </div>
                  {(q.options || []).map((opt, optIdx) => (
                    <div key={optIdx} className="admin-option-row">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        id={`q-${qIdx}-opt-${optIdx}`}
                        checked={q.correctAnswer === optIdx}
                        onChange={() => handleSetCorrectAnswer(qIdx, optIdx)}
                        title="Mark as correct answer"
                      />
                      <label htmlFor={`q-${qIdx}-opt-${optIdx}`} className="admin-option-letter">
                        {String.fromCharCode(65 + optIdx)}
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        value={opt || ''}
                        onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="admin-form-field" style={{ marginTop: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem' }}>Answer Explanation</label>
                  <textarea
                    className="admin-textarea sm"
                    rows={2}
                    value={q.explanation || ''}
                    onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                    placeholder="Explanation for why this option is correct..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="button secondary full mt-3"
              onClick={handleAddQuestion}
            >
              + Add Another Question
            </button>
          </div>
        </div>
      ) : (
        /* Student Preview Mode */
        <div className="admin-student-preview-container">
          <div className="admin-preview-banner">
            👁 <strong>Student Presentation Preview</strong> — This is exactly how students will experience this assessment on the platform.
          </div>

          <div className="admin-preview-test-box">
            <div className="admin-preview-header">
              <div>
                <h2>{draftTitle}</h2>
                <div className="admin-muted">
                  Section: {questions[activePreviewQ]?.section || 'General'} • Difficulty: {questions[activePreviewQ]?.difficulty || 'Medium'}
                </div>
              </div>
              <div className="admin-preview-timer">
                ⏱ {durationMinutes}:00 Remaining
              </div>
            </div>

            {questions.length > 0 && (
              <div className="admin-preview-question-card">
                <div className="admin-preview-q-count">
                  Question {activePreviewQ + 1} of {questions.length}
                </div>
                <div className="admin-preview-q-text">
                  {questions[activePreviewQ]?.question}
                </div>

                <div className="admin-preview-options-list">
                  {(questions[activePreviewQ]?.options || []).map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`admin-preview-option ${questions[activePreviewQ]?.correctAnswer === optIdx ? 'correct-highlight' : ''}`}
                    >
                      <span className="admin-opt-badge">{String.fromCharCode(65 + optIdx)}</span>
                      <span>{opt}</span>
                      {questions[activePreviewQ]?.correctAnswer === optIdx && (
                        <span className="admin-correct-tag">✓ Correct Key</span>
                      )}
                    </div>
                  ))}
                </div>

                {questions[activePreviewQ]?.explanation && (
                  <div className="admin-preview-explanation">
                    <strong>Solution &amp; Explanation:</strong>
                    <p>{questions[activePreviewQ]?.explanation}</p>
                  </div>
                )}
              </div>
            )}

            <div className="admin-preview-nav">
              <button
                className="button secondary sm"
                disabled={activePreviewQ === 0}
                onClick={() => setActivePreviewQ((prev) => Math.max(0, prev - 1))}
              >
                ← Previous Question
              </button>
              <div className="admin-preview-palette">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    className={`admin-palette-dot ${activePreviewQ === idx ? 'current' : ''}`}
                    onClick={() => setActivePreviewQ(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                className="button secondary sm"
                disabled={activePreviewQ >= questions.length - 1}
                onClick={() => setActivePreviewQ((prev) => Math.min(questions.length - 1, prev + 1))}
              >
                Next Question →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions Bar */}
      <div className="admin-sticky-footer">
        <div className="admin-footer-status">
          Draft Status: <strong>{currentDraft?.status || 'DRAFT'}</strong>
          {currentDraft?.status === 'PUBLISHED' && (
            <span style={{ marginLeft: '1rem', color: '#22c55e' }}>
              ✓ Live on platform (ID: {currentDraft.targetEntityId})
            </span>
          )}
        </div>
        <div className="admin-footer-actions">
          <button
            type="button"
            className="button secondary"
            disabled={saving || publishing}
            onClick={handleSaveDraft}
          >
            {saving ? 'Saving Changes…' : '💾 Save Changes'}
          </button>

          <button
            type="button"
            className="button primary"
            disabled={saving || publishing}
            onClick={handleApproveAndPublish}
          >
            {publishing ? 'Publishing to Platform…' : '🚀 Approve & Publish to Platform'}
          </button>
        </div>
      </div>
    </div>
  );
}
