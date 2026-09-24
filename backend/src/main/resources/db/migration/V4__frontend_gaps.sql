-- V4: fill gaps found during frontend/backend audit.
-- interview prep, resume builder, roadmap progress, learning progress
-- real values, activity write-path, code execution log, perf indexes.

-- Interview prep: question bank + per-user practice log
create table if not exists interview_questions (
  id varchar(120) primary key,
  category varchar(60) not null default 'technical',
  question text not null,
  tips text not null default '',
  sort_order integer not null default 0
);

create table if not exists user_interview_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  question_id varchar(120) not null references interview_questions(id) on delete cascade,
  answer text not null default '',
  feedback text not null default '',
  practiced_at timestamptz not null default now()
);

-- Resume builder persistence (one row per user)
create table if not exists user_resumes (
  user_id uuid primary key references users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  ats_score integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Roadmap: per-user level completion (levels 1..6)
create table if not exists user_roadmap_progress (
  user_id uuid not null references users(id) on delete cascade,
  level_id integer not null,
  status varchar(20) not null default 'locked',
  updated_at timestamptz not null default now(),
  primary key (user_id, level_id)
);

-- Code execution log (Piston/Judge0 proxy results, or local stub)
create table if not exists code_executions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  problem_id varchar(100),
  language varchar(30) not null,
  source_hash varchar(64) not null default '',
  status varchar(30) not null default 'ok',
  output text not null default '',
  created_at timestamptz not null default now()
);

-- Seed interview questions (matches frontend Interview Arena content)
insert into interview_questions (id, category, question, tips, sort_order) values
  ('tech-1', 'technical', 'Explain the difference between process and thread.', 'Think out loud; cover memory isolation vs shared memory.', 1),
  ('tech-2', 'technical', 'What is ACID in DBMS?', 'Give one-line per letter + example.', 2),
  ('tech-3', 'technical', 'How does HTTP differ from HTTPS?', 'Mention TLS handshake briefly.', 3),
  ('tech-4', 'technical', 'What are the SOLID principles?', 'One sentence per principle.', 4),
  ('tech-5', 'technical', 'Explain the concept of polymorphism with example.', 'Code example helps.', 5),
  ('tech-6', 'technical', 'What is the time complexity of QuickSort in worst case?', 'Explain pivot choice impact.', 6),
  ('hr-1', 'hr', 'Tell me about yourself.', 'Use STAR; 90 seconds; end with why this company.', 1),
  ('hr-2', 'hr', 'What are your greatest strengths and weaknesses?', 'Show self-awareness + growth.', 2),
  ('hr-3', 'hr', 'Why do you want to work at our company?', 'Research the company first.', 3),
  ('hr-4', 'hr', 'Where do you see yourself in 5 years?', 'Align with role growth.', 4),
  ('hr-5', 'hr', 'Describe a challenging situation and how you handled it.', 'STAR method.', 5),
  ('hr-6', 'hr', 'What is your salary expectation?', 'Give a researched range.', 6)
on conflict (id) do nothing;

-- Perf indexes for dashboard fan-out queries
create index if not exists idx_user_dsa_progress_user on user_dsa_progress(user_id);
create index if not exists idx_user_coding_progress_user on user_coding_progress(user_id);
create index if not exists idx_user_aptitude_progress_user on user_aptitude_progress(user_id);
create index if not exists idx_mock_attempts_user on mock_test_attempts(user_id, completed_at desc);
create index if not exists idx_company_progress_user on user_company_progress(user_id);
create index if not exists idx_learning_progress_user on user_learning_progress(user_id);
create index if not exists idx_interview_attempts_user on user_interview_attempts(user_id, practiced_at desc);
create index if not exists idx_code_executions_user on code_executions(user_id, created_at desc);
