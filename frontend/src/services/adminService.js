const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const LOCAL_ADMIN_STORAGE_KEY = 'placepro.admin_local_store';

function getAuthHeaders(isJson = true) {
  const token = window.localStorage.getItem('placepro.token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

// Local mock store for offline/local development when backend API is not running
function getLocalStore() {
  try {
    const raw = window.localStorage.getItem(LOCAL_ADMIN_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  const initial = {
    companies: [
      { id: 'google', name: 'Google', type: 'Product', difficulty: 'Hard', premium: true, description: 'Google placement track and interview questions.', areas: ['DSA', 'System Design', 'Algorithms'], modules: 5 },
      { id: 'amazon', name: 'Amazon', type: 'Product', difficulty: 'Medium', premium: false, description: 'Amazon online assessment and leadership principles.', areas: ['DSA', 'OOP', 'Aptitude'], modules: 4 },
      { id: 'microsoft', name: 'Microsoft', type: 'Product', difficulty: 'Medium', premium: false, description: 'Microsoft technical interview rounds and coding problems.', areas: ['DSA', 'OS', 'System Design'], modules: 4 },
      { id: 'tcs', name: 'TCS', type: 'Consulting', difficulty: 'Easy', premium: false, description: 'TCS NQT and Digital assessment rounds.', areas: ['Aptitude', 'Basic Coding', 'Verbal'], modules: 3 },
    ],
    resources: [
      {
        id: 'res-demo-1',
        title: 'Amazon SDE-1 OA Questions 2026',
        resourceType: 'PDF_COMPANY_QUESTIONS',
        category: 'COMPANY',
        companyId: 'amazon',
        companyName: 'Amazon',
        fileName: 'amazon_oa_2026.pdf',
        fileSize: 412500,
        status: 'REVIEW',
        createdAt: new Date().toISOString(),
        generatedContent: [
          {
            id: 'draft-demo-1',
            resourceId: 'res-demo-1',
            contentType: 'MOCK_TEST',
            title: 'Amazon Placement Assessment (2026 Batch)',
            status: 'DRAFT',
            data: {
              proposedId: 'amazon-oa-mock-2026',
              title: 'Amazon Placement Assessment (2026 Batch)',
              type: 'company',
              category: 'COMPANY',
              companyId: 'amazon',
              difficulty: 'MEDIUM',
              durationMinutes: 45,
              isFree: true,
              marksPerQuestion: 1,
              sections: ['Technical Assessment', 'Data Structures & Algorithms'],
              questions: [
                {
                  id: 'q1',
                  section: 'Technical Assessment',
                  topic: 'Data Structures',
                  difficulty: 'MEDIUM',
                  question: 'What is the worst-case time complexity of searching in a Hash Table with separate chaining?',
                  options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                  correctAnswer: 2,
                  explanation: 'If all keys collide and hash to the same bucket, the lookup degrades into a linear traversal of the linked list taking O(n) time.',
                },
                {
                  id: 'q2',
                  section: 'Data Structures & Algorithms',
                  topic: 'Binary Trees',
                  difficulty: 'MEDIUM',
                  question: 'Which tree traversal visits the root node before visiting both subtrees?',
                  options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
                  correctAnswer: 1,
                  explanation: 'Preorder traversal visits the root first, followed by the left subtree, and finally the right subtree (Root-Left-Right).',
                },
                {
                  id: 'q3',
                  section: 'Technical Assessment',
                  topic: 'Operating Systems',
                  difficulty: 'EASY',
                  question: 'Which of the following is NOT a necessary condition for a deadlock to occur?',
                  options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
                  correctAnswer: 2,
                  explanation: 'No preemption is the necessary condition. If preemption is allowed, deadlock cannot happen because resources can be forcibly allocated.',
                },
              ],
            },
          },
        ],
      },
    ],
  };

  saveLocalStore(initial);
  return initial;
}

function saveLocalStore(store) {
  try {
    window.localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (err) {
    // If backend connection fails, handle with offline dev store
    return handleOfflineDevFallback(endpoint, options);
  }
}

function handleOfflineDevFallback(endpoint, options) {
  const store = getLocalStore();
  const method = options.method || 'GET';

  // 1. Stats
  if (endpoint === '/admin/resources/stats') {
    const total = store.resources.length;
    const pending = store.resources.filter((r) => r.status === 'REVIEW').length;
    const published = store.resources.filter((r) => r.status === 'PUBLISHED').length;
    const inProgress = store.resources.filter((r) => r.status === 'PARSING' || r.status === 'GENERATING').length;
    return {
      totalResources: total,
      inProgress,
      pendingReview: pending,
      published,
      failed: 0,
      publishedContentCount: published,
    };
  }

  // 2. Resources list
  if (endpoint.startsWith('/admin/resources?') || endpoint === '/admin/resources') {
    return {
      resources: store.resources,
      stats: {
        totalResources: store.resources.length,
        inProgress: store.resources.filter((r) => r.status === 'PARSING' || r.status === 'GENERATING').length,
        pendingReview: store.resources.filter((r) => r.status === 'REVIEW').length,
        published: store.resources.filter((r) => r.status === 'PUBLISHED').length,
        failed: 0,
        publishedContentCount: store.resources.filter((r) => r.status === 'PUBLISHED').length,
      },
    };
  }

  // 3. Single resource
  const resourceMatch = endpoint.match(/\/admin\/resources\/([^/?]+)$/);
  if (resourceMatch && method === 'GET') {
    const id = resourceMatch[1];
    const res = store.resources.find((r) => r.id === id);
    if (!res) throw new Error('Resource not found in local store.');
    return res;
  }

  // 4. Upload resource
  if (endpoint === '/admin/resources' && method === 'POST') {
    const formData = options.body;
    const title = formData.get('title') || 'Uploaded Resource';
    const category = formData.get('category') || 'COMPANY';
    const resourceType = formData.get('resourceType') || 'PDF_COMPANY_QUESTIONS';
    const companyId = formData.get('companyId') || '';
    const file = formData.get('file');
    const rawText = formData.get('rawText') || '';

    const company = store.companies.find((c) => c.id === companyId);
    const companyName = company ? company.name : '';

    const newId = `res-${Date.now()}`;
    const newDraftId = `draft-${Date.now()}`;

    // Sample generated questions from text/title
    const questions = [
      {
        id: 'q1',
        section: category === 'COMPANY' ? 'Technical MCQ' : 'General Assessment',
        topic: 'Data Structures',
        difficulty: 'MEDIUM',
        question: `Question derived from ${title}: What is the optimal time complexity to solve this problem?`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        correctAnswer: 2,
        explanation: 'Linear scan is optimal as every item must be inspected once.',
      },
      {
        id: 'q2',
        section: category === 'COMPANY' ? 'Technical MCQ' : 'General Assessment',
        topic: 'Algorithms',
        difficulty: 'MEDIUM',
        question: 'Which design technique divides a problem into subproblems, solves them, and combines the solutions?',
        options: ['Divide and Conquer', 'Dynamic Programming', 'Greedy Method', 'Backtracking'],
        correctAnswer: 0,
        explanation: 'Divide and Conquer recursively breaks down a problem into two or more sub-problems of the same or related type.',
      },
      {
        id: 'q3',
        section: category === 'COMPANY' ? 'Technical MCQ' : 'General Assessment',
        topic: 'System Design',
        difficulty: 'HARD',
        question: 'Which mechanism ensures consistent data writes across distributed database nodes in CAP theorem?',
        options: ['High Availability', 'Strong Consistency', 'Eventual Partitioning', 'Soft State'],
        correctAnswer: 1,
        explanation: 'Consistency guarantees every read receives the most recent write or an error.',
      },
    ];

    const newResource = {
      id: newId,
      title,
      resourceType,
      category,
      companyId,
      companyName,
      fileName: file ? file.name : `${title}.txt`,
      fileSize: file ? file.size : rawText.length,
      status: 'REVIEW',
      createdAt: new Date().toISOString(),
      generatedContent: [
        {
          id: newDraftId,
          resourceId: newId,
          contentType: 'MOCK_TEST',
          title: companyName ? `${companyName} Assessment (${title})` : `${title} Assessment`,
          status: 'DRAFT',
          data: {
            proposedId: `mock-${Date.now()}`,
            title: companyName ? `${companyName} Assessment (${title})` : `${title} Assessment`,
            type: companyId ? 'company' : 'mixed',
            category,
            companyId,
            difficulty: 'MEDIUM',
            durationMinutes: 45,
            isFree: true,
            marksPerQuestion: 1,
            sections: ['Technical MCQ', 'General Assessment'],
            questions,
          },
        },
      ],
    };

    store.resources.unshift(newResource);
    saveLocalStore(store);
    return { resourceId: newId, status: 'UPLOADED', message: 'Resource processed successfully.' };
  }

  // 5. Delete resource
  if (resourceMatch && method === 'DELETE') {
    const id = resourceMatch[1];
    store.resources = store.resources.filter((r) => r.id !== id);
    saveLocalStore(store);
    return null;
  }

  // 6. Generated draft operations
  const draftMatch = endpoint.match(/\/admin\/generated-content\/([^/?]+)(?:\/(approve|reject))?$/);
  if (draftMatch) {
    const draftId = draftMatch[1];
    const action = draftMatch[2];

    for (const r of store.resources) {
      const draft = (r.generatedContent || []).find((d) => d.id === draftId);
      if (draft) {
        if (action === 'approve') {
          draft.status = 'PUBLISHED';
          draft.targetEntityId = draft.data.proposedId || `test-${draftId}`;
          r.status = 'PUBLISHED';
          saveLocalStore(store);
          return { contentId: draftId, status: 'PUBLISHED', targetEntityId: draft.targetEntityId };
        }
        if (action === 'reject') {
          draft.status = 'REJECTED';
          saveLocalStore(store);
          return { id: draftId, status: 'REJECTED' };
        }
        if (method === 'PUT') {
          const body = JSON.parse(options.body || '{}');
          if (body.title) draft.title = body.title;
          if (body.data) draft.data = body.data;
          saveLocalStore(store);
          return draft;
        }
        return draft;
      }
    }
  }

  // 7. Companies
  if (endpoint === '/admin/companies') {
    if (method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const newCompany = {
        id: body.id || body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: body.name,
        type: body.type || 'Product',
        difficulty: body.difficulty || 'Medium',
        premium: Boolean(body.premium),
        description: body.description || '',
        areas: body.areas || ['DSA', 'Aptitude'],
        modules: body.modules || 4,
      };
      store.companies.push(newCompany);
      saveLocalStore(store);
      return newCompany;
    }
    return store.companies;
  }

  return {};
}

export const adminService = {
  getStats: () => request('/admin/resources/stats', { headers: getAuthHeaders() }),

  getResources: ({ category, status, limit = 50, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    params.append('limit', limit);
    params.append('offset', offset);
    return request(`/admin/resources?${params.toString()}`, { headers: getAuthHeaders() });
  },

  getResource: (id) => request(`/admin/resources/${id}`, { headers: getAuthHeaders() }),

  uploadResource: (formData) => {
    return request('/admin/resources', {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData,
    });
  },

  reprocessResource: (id, { generateMockTest = true, generateQuiz = false, generateSheet = false } = {}) => {
    const params = new URLSearchParams();
    params.append('generateMockTest', generateMockTest);
    params.append('generateQuiz', generateQuiz);
    params.append('generateSheet', generateSheet);
    return request(`/admin/resources/${id}/reprocess?${params.toString()}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  deleteResource: (id) => {
    return request(`/admin/resources/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  getGeneratedContent: (id) => request(`/admin/generated-content/${id}`, { headers: getAuthHeaders() }),

  updateDraft: (id, payload) => {
    return request(`/admin/generated-content/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
  },

  approveContent: (id) => {
    return request(`/admin/generated-content/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  rejectContent: (id) => {
    return request(`/admin/generated-content/${id}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  deleteContent: (id) => {
    return request(`/admin/generated-content/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  getCompanies: () => request('/admin/companies', { headers: getAuthHeaders() }),

  createCompany: (company) => {
    return request('/admin/companies', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(company),
    });
  },
};
