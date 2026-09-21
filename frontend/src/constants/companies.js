export const COMPANIES = [
  { id: 'tcs', name: 'TCS', type: 'Service Based', difficulty: 'Medium', premium: false, description: 'A practical preparation path for common service-company placement areas.', areas: ['Aptitude', 'Technical', 'Interview'], modules: 8 },
  { id: 'infosys', name: 'Infosys', type: 'Service Based', difficulty: 'Medium', premium: false, description: 'Build confidence across aptitude, programming fundamentals and interviews.', areas: ['Aptitude', 'Coding', 'Technical'], modules: 9 },
  { id: 'wipro', name: 'Wipro', type: 'Mass Recruiters', difficulty: 'Medium', premium: false, description: 'Focus your preparation around commonly reported placement areas.', areas: ['Aptitude', 'DSA', 'Technical'], modules: 8 },
  { id: 'accenture', name: 'Accenture', type: 'Service Based', difficulty: 'Medium', premium: true, description: 'A structured roadmap for aptitude, coding and technical rounds.', areas: ['Aptitude', 'Coding', 'Interview'], modules: 10 },
  { id: 'cognizant', name: 'Cognizant', type: 'Mass Recruiters', difficulty: 'Medium', premium: true, description: 'Practice the skills commonly used in service-company hiring processes.', areas: ['Aptitude', 'DSA', 'Technical'], modules: 9 },
  { id: 'capgemini', name: 'Capgemini', type: 'Service Based', difficulty: 'Medium', premium: true, description: 'Prepare with a focused set of technical and problem-solving modules.', areas: ['Aptitude', 'Coding', 'Technical'], modules: 9 },
  { id: 'deloitte', name: 'Deloitte', type: 'High Competition', difficulty: 'High', premium: true, description: 'Strengthen your technical preparation and interview confidence.', areas: ['DSA', 'Technical', 'Interview'], modules: 11 },
  { id: 'amazon', name: 'Amazon', type: 'Product Based', difficulty: 'High', premium: true, description: 'A preparation roadmap for product-company problem solving and interviews.', areas: ['DSA', 'Technical', 'Interview'], modules: 12 },
  { id: 'microsoft', name: 'Microsoft', type: 'Tech Companies', difficulty: 'High', premium: true, description: 'Build depth in algorithms, systems and technical interviews.', areas: ['DSA', 'Technical', 'Interview'], modules: 12 },
  { id: 'google', name: 'Google', type: 'High Competition', difficulty: 'High', premium: true, description: 'A focused roadmap for advanced problem solving and technical depth.', areas: ['DSA', 'Technical', 'Interview'], modules: 13 },
  { id: 'flipkart', name: 'Flipkart', type: 'Product Based', difficulty: 'High', premium: true, description: 'Prepare around product engineering and common interview patterns.', areas: ['DSA', 'Coding', 'Interview'], modules: 11 },
  { id: 'walmart', name: 'Walmart', type: 'Product Based', difficulty: 'High', premium: true, description: 'Develop consistent algorithmic and technical preparation habits.', areas: ['DSA', 'Technical', 'Interview'], modules: 11 },
  { id: 'ibm', name: 'IBM', type: 'Tech Companies', difficulty: 'Medium', premium: true, description: 'Explore a balanced preparation roadmap for technical roles.', areas: ['Aptitude', 'Technical', 'Interview'], modules: 9 },
  { id: 'oracle', name: 'Oracle', type: 'Tech Companies', difficulty: 'High', premium: true, description: 'Practice data structures, databases and technical fundamentals.', areas: ['DSA', 'DBMS', 'Interview'], modules: 10 },
  { id: 'zoho', name: 'Zoho', type: 'Product Based', difficulty: 'High', premium: true, description: 'Build problem-solving fluency with a product-focused roadmap.', areas: ['DSA', 'Coding', 'Technical'], modules: 10 },
];
export const COMPANY_MODULES = [
  { id: 'overview', title: 'Company Overview', description: 'Understand the process and commonly reported preparation areas.', icon: 'Γùç', free: true, progress: 100, action: 'Explore overview' },
  { id: 'aptitude', title: 'Aptitude Preparation', description: 'Quantitative, logical, verbal and data interpretation practice.', icon: 'ΓùÄ', free: false, progress: 0, action: 'Unlock module' },
  { id: 'dsa', title: 'Company-specific DSA', description: 'Curated patterns and problems for this preparation focus.', icon: 'Γîÿ', free: false, progress: 0, action: 'Unlock module' },
  { id: 'technical', title: 'Technical Preparation', description: 'OOP, DBMS, OS, networks, SQL and programming fundamentals.', icon: 'Γûª', free: false, progress: 0, action: 'Unlock module' },
  { id: 'coding', title: 'Coding Practice', description: 'Practice coding patterns relevant to technical placement rounds.', icon: '</>', free: false, progress: 0, action: 'Unlock module' },
  { id: 'mock-tests', title: 'Company Mock Tests', description: 'Practice company-oriented test simulations.', icon: 'Γùë', free: false, progress: 0, action: 'View tests' },
  { id: 'interview', title: 'Interview Preparation', description: 'Prepare for technical, behavioral, HR and project discussions.', icon: 'Γ£ª', free: false, progress: 0, action: 'Explore module' },
];
export const COMPANY_ROADMAP = ['Company Basics', 'Aptitude', 'DSA', 'Technical Preparation', 'Mock Tests', 'Interview Preparation'];
