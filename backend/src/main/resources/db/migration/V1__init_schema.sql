create extension if not exists pgcrypto;

create table users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) not null unique,
  password_hash varchar(255),
  name varchar(160) not null,
  picture_url text,
  provider varchar(40) not null default 'LOCAL',
  role varchar(30) not null default 'STUDENT',
  plan varchar(30) not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table student_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  phone varchar(40),
  location varchar(160),
  college varchar(200),
  degree varchar(120),
  branch varchar(120),
  graduation_year varchar(10),
  semester varchar(10),
  cgpa varchar(20),
  target_role varchar(160),
  preferred_locations text,
  target_companies jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table dsa_topics (
  id varchar(80) primary key,
  name varchar(160) not null,
  description text not null,
  sort_order integer not null
);

create table dsa_problems (
  id varchar(100) primary key,
  number integer not null unique,
  title varchar(220) not null,
  topic_id varchar(80) not null references dsa_topics(id),
  difficulty varchar(30) not null,
  pattern varchar(120) not null,
  description text not null,
  examples jsonb not null default '[]'::jsonb,
  constraints_text text not null
);

create table user_dsa_progress (
  user_id uuid not null references users(id) on delete cascade,
  problem_id varchar(100) not null references dsa_problems(id) on delete cascade,
  solved boolean not null default false,
  bookmarked boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, problem_id)
);

create table coding_problems (
  id varchar(100) primary key,
  number integer not null unique,
  title varchar(220) not null,
  difficulty varchar(30) not null,
  topic varchar(120) not null,
  pattern varchar(120) not null,
  description text not null,
  examples jsonb not null default '[]'::jsonb,
  constraints_json jsonb not null default '[]'::jsonb,
  hints jsonb not null default '[]'::jsonb,
  starter_code jsonb not null default '{}'::jsonb,
  is_free boolean not null default true
);

create table user_coding_progress (
  user_id uuid not null references users(id) on delete cascade,
  problem_id varchar(100) not null references coding_problems(id) on delete cascade,
  solved boolean not null default false,
  bookmarked boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, problem_id)
);

create table aptitude_categories (
  id varchar(100) primary key,
  name varchar(160) not null,
  icon varchar(20) not null,
  description text not null,
  difficulty varchar(80) not null,
  premium boolean not null default true,
  sort_order integer not null
);

create table aptitude_topics (
  id varchar(100) primary key,
  category_id varchar(100) not null references aptitude_categories(id) on delete cascade,
  name varchar(160) not null,
  description text not null,
  difficulty varchar(80) not null,
  question_count integer not null default 0,
  free boolean not null default false,
  sort_order integer not null
);

create table aptitude_questions (
  id varchar(100) primary key,
  topic_id varchar(100) not null references aptitude_topics(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_answer integer not null,
  explanation text not null,
  free boolean not null default true,
  difficulty varchar(40) not null
);

create table user_aptitude_progress (
  user_id uuid not null references users(id) on delete cascade,
  question_id varchar(100) not null references aptitude_questions(id) on delete cascade,
  selected_answer integer,
  correct boolean not null default false,
  attempted_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table companies (
  id varchar(100) primary key,
  name varchar(160) not null,
  type varchar(100) not null,
  difficulty varchar(40) not null,
  premium boolean not null default false,
  description text not null,
  areas jsonb not null default '[]'::jsonb,
  modules integer not null default 0
);

create table company_modules (
  id varchar(100) primary key,
  title varchar(180) not null,
  description text not null,
  icon varchar(20) not null,
  free boolean not null default false,
  action varchar(80) not null,
  sort_order integer not null
);

create table company_roadmap_steps (
  id bigserial primary key,
  label varchar(160) not null,
  sort_order integer not null
);

create table user_company_progress (
  user_id uuid not null references users(id) on delete cascade,
  company_id varchar(100) not null references companies(id) on delete cascade,
  bookmarked boolean not null default false,
  overall integer not null default 0,
  aptitude integer not null default 0,
  dsa integer not null default 0,
  technical integer not null default 0,
  interview integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, company_id)
);

create table learning_semesters (
  id varchar(40) primary key,
  name varchar(80) not null,
  subjects integer not null,
  sort_order integer not null,
  drive_url text
);

create table semester_subjects (
  id varchar(100) primary key,
  name varchar(160) not null,
  code varchar(40) not null,
  topics integer not null,
  sort_order integer not null
);

create table subject_topics (
  id varchar(120) primary key,
  name varchar(180) not null,
  minutes integer not null,
  sort_order integer not null
);

create table learning_dsa_modules (
  id varchar(100) primary key,
  name varchar(160) not null,
  level varchar(40) not null,
  lessons integer not null,
  sort_order integer not null
);

create table learning_dsa_lessons (
  id bigserial primary key,
  module_id varchar(100) references learning_dsa_modules(id) on delete cascade,
  name varchar(160) not null,
  sort_order integer not null
);

create table user_learning_progress (
  user_id uuid not null references users(id) on delete cascade,
  content_type varchar(40) not null,
  content_id varchar(120) not null,
  complete boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, content_type, content_id)
);

create table mock_tests (
  id varchar(120) primary key,
  title varchar(220) not null,
  type varchar(60) not null,
  category varchar(80) not null,
  difficulty varchar(40) not null,
  duration_minutes integer not null,
  is_free boolean not null default true,
  sections jsonb not null default '[]'::jsonb,
  marks_per_question integer not null default 1
);

create table mock_test_questions (
  id varchar(120) primary key,
  test_id varchar(120) not null references mock_tests(id) on delete cascade,
  section varchar(120) not null,
  topic varchar(120) not null,
  difficulty varchar(40) not null,
  question text not null,
  options jsonb not null,
  correct_answer integer not null,
  explanation text not null,
  sort_order integer not null
);

create table mock_test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  test_id varchar(120) not null references mock_tests(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score integer not null default 0,
  total_questions integer not null default 0,
  correct_answers integer not null default 0,
  completed_at timestamptz not null default now()
);

create table activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  icon varchar(20) not null,
  title varchar(220) not null,
  meta varchar(220) not null,
  tone varchar(40) not null,
  activity_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index idx_dsa_problems_topic on dsa_problems(topic_id);
create index idx_coding_topic on coding_problems(topic);
create index idx_aptitude_topics_category on aptitude_topics(category_id);
create index idx_mock_questions_test on mock_test_questions(test_id);
create index idx_activity_user_date on activity_events(user_id, activity_date desc);
