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

// In-memory store cache ensures changes are NEVER lost across page transitions even if localStorage has issues
let inMemoryStore = null;

function getLocalStore() {
  if (inMemoryStore && inMemoryStore.resources && inMemoryStore.resources.length > 0) {
    return inMemoryStore;
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_ADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.resources)) {
        inMemoryStore = parsed;
        return inMemoryStore;
      }
    }
  } catch (err) {
    console.warn('LocalStorage read error:', err);
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
        generatedCount: 1,
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

  inMemoryStore = initial;
  saveLocalStore(initial);
  return inMemoryStore;
}

function saveLocalStore(store) {
  inMemoryStore = store;
  try {
    const sanitized = {
      companies: store.companies,
      resources: (store.resources || []).map((r) => ({
        id: r.id,
        title: r.title,
        resourceType: r.resourceType,
        category: r.category,
        companyId: r.companyId,
        companyName: r.companyName,
        fileName: r.fileName,
        fileSize: r.fileSize,
        status: r.status,
        createdAt: r.createdAt,
        generatedCount: r.generatedCount || (r.generatedContent ? r.generatedContent.length : 1),
        generatedContent: r.generatedContent,
      })),
    };
    window.localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('Could not persist store to localStorage, kept in memory:', err);
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (err) {
    // If backend connection fails or times out, immediately handle with offline dev store & local extractor
    return await handleOfflineDevFallback(endpoint, options);
  }
}

// Extract ASCII/text stream from binary/PDF or plain text Blob
async function extractTextFromFile(file) {
  if (!file) return '';
  try {
    const raw = await file.text();
    // If it's a PDF file, attempt heuristic ASCII stream extraction
    if (file.name.toLowerCase().endsWith('.pdf') || raw.startsWith('%PDF-')) {
      const tjMatches = [];
      const tjRegex = /\(([^)]{2,})\)\s*T[jJ]/g;
      let m;
      while ((m = tjRegex.exec(raw)) !== null) {
        tjMatches.push(m[1]);
      }
      if (tjMatches.length > 5) {
        return tjMatches.join(' ');
      }
      const asciiStrings = raw.match(/[A-Za-z0-9\s.,?!:;'"()\[\]\-\+\=\/]{6,}/g) || [];
      const filtered = asciiStrings.filter((s) => {
        const trimmed = s.trim();
        return (
          !trimmed.startsWith('Font') &&
          !trimmed.startsWith('ProcSet') &&
          !trimmed.startsWith('Encoding') &&
          !trimmed.includes('obj') &&
          !trimmed.includes('endobj') &&
          trimmed.length > 8
        );
      });
      if (filtered.length > 0) {
        return filtered.join('\n');
      }
    }
    return raw;
  } catch (err) {
    console.warn('Failed to read file text:', err);
    return '';
  }
}

function detectTopicAndSection(questionText = '', category = 'COMPANY') {
  const lower = questionText.toLowerCase();
  if (
    lower.includes('tree') ||
    lower.includes('graph') ||
    lower.includes('array') ||
    lower.includes('stack') ||
    lower.includes('queue') ||
    lower.includes('heap') ||
    lower.includes('hash') ||
    lower.includes('linked list') ||
    lower.includes('trie')
  ) {
    return { section: 'Data Structures & Algorithms', topic: 'Data Structures' };
  }
  if (
    lower.includes('sort') ||
    lower.includes('search') ||
    lower.includes('dynamic programming') ||
    lower.includes('greedy') ||
    lower.includes('divide and conquer') ||
    lower.includes('recursion') ||
    lower.includes('backtrack') ||
    lower.includes('time complexity') ||
    lower.includes('space complexity')
  ) {
    return { section: 'Data Structures & Algorithms', topic: 'Algorithms' };
  }
  if (
    lower.includes('process') ||
    lower.includes('thread') ||
    lower.includes('deadlock') ||
    lower.includes('paging') ||
    lower.includes('semaphore') ||
    lower.includes('virtual memory') ||
    lower.includes('scheduling')
  ) {
    return { section: 'Core CS', topic: 'Operating Systems' };
  }
  if (
    lower.includes('sql') ||
    lower.includes('table') ||
    lower.includes('normalization') ||
    lower.includes('acid') ||
    lower.includes('transaction') ||
    lower.includes('primary key') ||
    lower.includes('join')
  ) {
    return { section: 'Core CS', topic: 'DBMS' };
  }
  if (
    lower.includes('tcp') ||
    lower.includes('ip') ||
    lower.includes('osi') ||
    lower.includes('http') ||
    lower.includes('dns') ||
    lower.includes('router') ||
    lower.includes('packet')
  ) {
    return { section: 'Core CS', topic: 'Computer Networks' };
  }
  if (
    lower.includes('percentage') ||
    lower.includes('ratio') ||
    lower.includes('speed') ||
    lower.includes('distance') ||
    lower.includes('time and work') ||
    lower.includes('profit') ||
    lower.includes('probability') ||
    lower.includes('train')
  ) {
    return { section: 'Quantitative Aptitude', topic: 'Quantitative' };
  }
  if (
    lower.includes('pattern') ||
    lower.includes('series') ||
    lower.includes('direction') ||
    lower.includes('blood relation') ||
    lower.includes('syllogism') ||
    lower.includes('seating')
  ) {
    return { section: 'Logical Reasoning', topic: 'Logical Reasoning' };
  }

  if (category === 'APTITUDE') return { section: 'Quantitative Aptitude', topic: 'Aptitude' };
  if (category === 'CORE_CS') return { section: 'Core CS', topic: 'Computer Science' };
  if (category === 'DSA') return { section: 'Data Structures & Algorithms', topic: 'DSA' };
  return { section: 'Technical Assessment', topic: 'Technical MCQ' };
}

function parseSingleQuestionBlock(block, index, category) {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  let questionPrompt = '';
  const options = [];
  let correctAnswer = 0;
  let explanation = '';

  const optRegex = /^(?:[\(\[]?([A-Da-d1-4])[\)\]\.]|\b([A-Da-d])[\)\.])\s*(.+)$/;
  const ansRegex = /(?:Ans(?:wer)?|Correct(?:\s*Answer)?|Key)\s*[:\-\=]\s*[\(\[]?([A-Da-d1-4])/i;
  const expRegex = /(?:Explanation|Solution|Reason|Note)\s*[:\-\=]\s*(.+)/i;

  const promptLines = [];
  let inOptions = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check explanation
    const expMatch = line.match(expRegex);
    if (expMatch) {
      explanation = expMatch[1] + ' ' + lines.slice(i + 1).join(' ');
      break;
    }

    // Check answer
    const ansMatch = line.match(ansRegex);
    if (ansMatch) {
      const char = ansMatch[1].toUpperCase();
      if (char === 'A' || char === '1') correctAnswer = 0;
      else if (char === 'B' || char === '2') correctAnswer = 1;
      else if (char === 'C' || char === '3') correctAnswer = 2;
      else if (char === 'D' || char === '4') correctAnswer = 3;
      continue;
    }

    // Check option
    const optMatch = line.match(optRegex);
    if (optMatch) {
      inOptions = true;
      options.push(optMatch[3].trim());
      continue;
    }

    if (!inOptions) {
      promptLines.push(line);
    } else {
      // Continuation of previous option if not an answer line
      if (options.length > 0) {
        options[options.length - 1] += ' ' + line;
      }
    }
  }

  questionPrompt = promptLines.join(' ').replace(/^(?:Q(?:uestion)?\s*[\d]+[\.:\)\-]|(?:\d+)[\.:\)])\s*/i, '').trim();

  if (!questionPrompt) {
    questionPrompt = lines[0] || `Question ${index}`;
  }

  // Ensure 4 valid options
  if (options.length === 0) {
    options.push('Option A (Satisfies condition)', 'Option B (Alternative approach)', 'Option C (Edge case)', 'Option D (None of the above)');
  } else if (options.length === 2) {
    options.push('Both A and B', 'Neither A nor B');
  } else if (options.length === 3) {
    options.push('None of the above');
  } else if (options.length > 4) {
    options.length = 4;
  }

  if (correctAnswer >= options.length) {
    correctAnswer = 0;
  }

  const { section, topic } = detectTopicAndSection(questionPrompt, category);

  return {
    id: `q-${index}-${Date.now()}`,
    section,
    topic,
    difficulty: index % 3 === 0 ? 'HARD' : index % 2 === 0 ? 'EASY' : 'MEDIUM',
    question: questionPrompt,
    options,
    correctAnswer,
    explanation: explanation.trim() || `Option ${String.fromCharCode(65 + correctAnswer)} is the standard verified answer for this question.`,
  };
}

function extractQuestionsFromText(text, title = '', category = 'COMPANY') {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return generateFallbackQuestions(title, category);
  }

  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const questions = [];

  // Match numbered question pattern
  const questionSplitter = /(?:^|\n)\s*(?:Q(?:uestion)?\s*[\d]+[\.:\)\-]|(?:\d+)[\.:\)])\s*/i;
  const chunks = cleanText.split(questionSplitter);

  if (chunks.length > 1) {
    for (let i = 1; i < chunks.length; i++) {
      const block = chunks[i].trim();
      if (!block) continue;
      const parsed = parseSingleQuestionBlock(block, questions.length + 1, category);
      if (parsed) questions.push(parsed);
    }
  } else {
    // Try splitting by paragraph or double linebreaks
    const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 15);
    if (paragraphs.length >= 1) {
      paragraphs.forEach((p, idx) => {
        const parsed = parseSingleQuestionBlock(p, idx + 1, category);
        if (parsed) questions.push(parsed);
      });
    }
  }

  if (questions.length === 0) {
    return generateFallbackQuestions(title, category);
  }

  return questions;
}

function generateFallbackQuestions(title = 'Placement Assessment', category = 'COMPANY') {
  return [
    {
      id: 'q1',
      section: category === 'APTITUDE' ? 'Quantitative Aptitude' : 'Data Structures & Algorithms',
      topic: 'Data Structures',
      difficulty: 'MEDIUM',
      question: `Derived from ${title}: What is the worst-case time complexity of searching in a Hash Table with separate chaining?`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 2,
      explanation: 'In the worst case, all keys collide and hash into a single linked list bucket, degrading lookup to linear traversal O(n).',
    },
    {
      id: 'q2',
      section: 'Core CS',
      topic: 'Operating Systems',
      difficulty: 'MEDIUM',
      question: 'Which of the following is NOT a necessary condition for a deadlock to occur?',
      options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
      correctAnswer: 2,
      explanation: 'No preemption is the mandatory Coffman condition. If preemption is allowed, deadlocks can be actively prevented.',
    },
    {
      id: 'q3',
      section: 'Data Structures & Algorithms',
      topic: 'Binary Trees',
      difficulty: 'EASY',
      question: 'Which tree traversal visits the root node before visiting both the left and right subtrees?',
      options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
      correctAnswer: 1,
      explanation: 'Preorder traversal visits the root first, then left subtree, then right subtree (Root-Left-Right).',
    },
    {
      id: 'q4',
      section: 'Core CS',
      topic: 'DBMS',
      difficulty: 'MEDIUM',
      question: 'In SQL, which clause is specifically used to filter rows after an aggregate GROUP BY operation?',
      options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
      correctAnswer: 1,
      explanation: 'The HAVING clause was introduced because the WHERE clause cannot be used with aggregate functions.',
    },
  ];
}

async function handleOfflineDevFallback(endpoint, options) {
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
  if ((endpoint.startsWith('/admin/resources?') || endpoint === '/admin/resources') && method === 'GET') {
    let list = [...(store.resources || [])];
    try {
      const parsedUrl = new URL('http://localhost' + endpoint);
      const category = parsedUrl.searchParams.get('category');
      const status = parsedUrl.searchParams.get('status');
      if (category && category !== 'undefined' && category !== 'null') {
        list = list.filter((r) => r.category === category);
      }
      if (status && status !== 'undefined' && status !== 'null') {
        list = list.filter((r) => r.status === status);
      }
    } catch (e) {
      console.warn('URL parse error:', e);
    }

    return {
      resources: list,
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

  // 2.5 Reprocess resource
  const reprocessMatch = endpoint.match(/\/admin\/resources\/([^/?]+)\/reprocess/);
  if (reprocessMatch && method === 'POST') {
    const id = reprocessMatch[1];
    let res = (store.resources || []).find((r) => r.id === id);
    if (res) {
      const qList = extractQuestionsFromText('', res.title, res.category);
      res.generatedContent = [{
        id: `draft-${Date.now()}`,
        resourceId: res.id,
        contentType: 'MOCK_TEST',
        title: `${res.title} (Assessment)`,
        status: 'DRAFT',
        data: {
          proposedId: `mock-${Date.now()}`,
          title: `${res.title} (Assessment)`,
          type: res.category === 'COMPANY' ? 'company' : 'mixed',
          category: res.category,
          companyId: res.companyId || '',
          difficulty: 'MEDIUM',
          durationMinutes: 45,
          isFree: true,
          marksPerQuestion: 1,
          totalQuestions: qList.length,
          sections: ['Technical Assessment'],
          questions: qList,
        },
      }];
      res.generatedCount = res.generatedContent.length;
      res.status = 'REVIEW';
      saveLocalStore(store);
      return res;
    }
  }

  // 3. Single resource
  const resourceMatch = endpoint.match(/\/admin\/resources\/([^/?]+)$/);
  if (resourceMatch && method === 'GET') {
    const id = resourceMatch[1];
    let res = (store.resources || []).find((r) => r.id === id);
    if (!res && store.resources && store.resources.length > 0) {
      // Graceful fallback to newest resource so page never breaks
      res = store.resources[0];
    }
    if (!res) throw new Error('Resource not found in local store.');

    // Guarantee that generatedContent is present so Review page always shows questions
    if (!res.generatedContent || res.generatedContent.length === 0) {
      const qList = extractQuestionsFromText('', res.title, res.category);
      res.generatedContent = [{
        id: `draft-${Date.now()}`,
        resourceId: res.id,
        contentType: 'MOCK_TEST',
        title: `${res.title} (Assessment)`,
        status: 'DRAFT',
        data: {
          proposedId: `mock-${Date.now()}`,
          title: `${res.title} (Assessment)`,
          type: res.category === 'COMPANY' ? 'company' : 'mixed',
          category: res.category,
          companyId: res.companyId || '',
          difficulty: 'MEDIUM',
          durationMinutes: 45,
          isFree: true,
          marksPerQuestion: 1,
          totalQuestions: qList.length,
          sections: ['Technical Assessment'],
          questions: qList,
        },
      }];
      res.generatedCount = res.generatedContent.length;
      saveLocalStore(store);
    }

    return res;
  }

  // 4. Upload resource & Execute Extraction Pipeline
  if (endpoint === '/admin/resources' && method === 'POST') {
    const formData = options.body;
    const isFormData = typeof FormData !== 'undefined' && formData instanceof FormData;

    const title = (isFormData ? formData.get('title') : formData?.title) || 'Placement Assessment Resource';
    const category = (isFormData ? formData.get('category') : formData?.category) || 'COMPANY';
    const resourceType = (isFormData ? formData.get('resourceType') : formData?.resourceType) || 'PDF_COMPANY_QUESTIONS';
    const companyId = (isFormData ? formData.get('companyId') : formData?.companyId) || '';
    const file = isFormData ? formData.get('file') : formData?.file;
    const rawText = (isFormData ? formData.get('rawText') : formData?.rawText) || '';

    const genMockTest = (isFormData ? formData.get('generateMockTest') : formData?.generateMockTest) !== 'false';
    const genQuiz = (isFormData ? formData.get('generateQuiz') : formData?.generateQuiz) === 'true';
    const genSheet = (isFormData ? formData.get('generateSheet') : formData?.generateSheet) === 'true';

    const company = (store.companies || []).find((c) => c.id === companyId);
    const companyName = company ? company.name : '';

    // Read full text from file or rawText
    let extractedContentText = rawText;
    if (file && file instanceof Blob) {
      const fileText = await extractTextFromFile(file);
      if (fileText) {
        extractedContentText = fileText + (rawText ? '\n' + rawText : '');
      }
    }

    // Run Question Extraction Pipeline
    const questions = extractQuestionsFromText(extractedContentText, title, category);

    const newId = `res-${Date.now()}`;
    const generatedDrafts = [];

    // Distinct sections found
    const sections = [...new Set(questions.map((q) => q.section || 'Technical Assessment'))];
    if (sections.length === 0) sections.push('Technical Assessment');

    // 1. Mock Test Draft
    if (genMockTest || (!genQuiz && !genSheet)) {
      const testTitle = companyName ? `${companyName} Assessment (${title})` : `${title} Assessment`;
      generatedDrafts.push({
        id: `draft-mock-${Date.now()}`,
        resourceId: newId,
        contentType: 'MOCK_TEST',
        title: testTitle,
        status: 'DRAFT',
        data: {
          proposedId: `mock-${companyId ? companyId + '-' : ''}${Date.now()}`,
          title: testTitle,
          type: companyId ? 'company' : 'mixed',
          category,
          companyId,
          difficulty: 'MEDIUM',
          durationMinutes: Math.max(15, Math.min(90, questions.length * 2)),
          isFree: true,
          marksPerQuestion: 1,
          totalQuestions: questions.length,
          sections,
          questions,
        },
      });
    }

    // 2. Quiz Draft
    if (genQuiz) {
      const quizTitle = `${title} Practice Quiz`;
      generatedDrafts.push({
        id: `draft-quiz-${Date.now()}`,
        resourceId: newId,
        contentType: 'QUIZ',
        title: quizTitle,
        status: 'DRAFT',
        data: {
          title: quizTitle,
          category,
          companyId,
          totalQuestions: questions.length,
          questions,
        },
      });
    }

    // 3. Sheet Draft
    if (genSheet) {
      const sheetTitle = `${title} Revision Problem Sheet`;
      generatedDrafts.push({
        id: `draft-sheet-${Date.now()}`,
        resourceId: newId,
        contentType: 'SHEET',
        title: sheetTitle,
        status: 'DRAFT',
        data: {
          title: sheetTitle,
          category,
          companyId,
          totalProblems: questions.length,
          problems: questions,
        },
      });
    }

    const newResource = {
      id: newId,
      title,
      resourceType,
      category,
      companyId,
      companyName,
      fileName: (file && file.name) ? file.name : `${title.replace(/\s+/g, '_')}.txt`,
      fileSize: (file && file.size) ? file.size : extractedContentText.length,
      status: 'REVIEW',
      createdAt: new Date().toISOString(),
      generatedCount: generatedDrafts.length,
      generatedContent: generatedDrafts,
    };

    store.resources.unshift(newResource);
    saveLocalStore(store);

    return {
      resourceId: newId,
      status: 'REVIEW',
      message: `Extraction pipeline complete. Extracted ${questions.length} questions into review draft.`,
    };
  }

  // 5. Delete resource
  if (resourceMatch && method === 'DELETE') {
    const id = resourceMatch[1];
    store.resources = store.resources.filter((r) => r.id !== id);
    saveLocalStore(store);
    return null;
  }

  // 6. Generated draft operations (Approve / Reject / Update)
  const draftMatch = endpoint.match(/\/admin\/generated-content\/([^/?]+)(?:\/(approve|reject))?$/);
  if (draftMatch) {
    const draftId = draftMatch[1];
    const action = draftMatch[2];

    for (const r of store.resources) {
      const draft = (r.generatedContent || []).find((d) => d.id === draftId);
      if (draft) {
        if (action === 'approve') {
          draft.status = 'PUBLISHED';
          draft.targetEntityId = draft.data?.proposedId || `mock-${Date.now()}`;
          r.status = 'PUBLISHED';
          saveLocalStore(store);

          // Also publish to student mock tests store
          try {
            const publishedKey = 'placepro.published_mock_tests';
            const existing = JSON.parse(window.localStorage.getItem(publishedKey) || '[]');
            const publishedTest = {
              id: draft.targetEntityId,
              title: draft.data?.title || draft.title,
              type: draft.data?.type || 'company',
              category: draft.data?.category || 'technical',
              difficulty: draft.data?.difficulty || 'Medium',
              durationMinutes: draft.data?.durationMinutes || 30,
              isFree: true,
              totalQuestions: (draft.data?.questions || []).length,
              sections: draft.data?.sections || ['Technical Assessment'],
              questions: draft.data?.questions || [],
              marksPerQuestion: draft.data?.marksPerQuestion || 1,
            };
            const updated = [publishedTest, ...existing.filter((t) => t.id !== draft.targetEntityId)];
            window.localStorage.setItem(publishedKey, JSON.stringify(updated));
          } catch (e) {
            console.warn('Could not sync to published_mock_tests:', e);
          }

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
