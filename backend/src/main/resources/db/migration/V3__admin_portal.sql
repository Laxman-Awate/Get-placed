-- Flyway Migration V3: Admin Portal & Content Generation Pipeline

-- 1. Ensure role column exists on users
alter table users add column if not exists role varchar(30) not null default 'STUDENT';

-- 2. Create admin_resources table for uploaded raw documents
create table if not exists admin_resources (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references users(id) on delete set null,
  title varchar(255) not null,
  resource_type varchar(40) not null,           -- PDF_COMPANY_QUESTIONS | PDF_TOPIC_NOTES | RAW_QUESTION_LIST | LINK
  category varchar(60) not null,                -- DSA | APTITUDE | CORE_CS | COMPANY
  company_id varchar(100) references companies(id) on delete set null,
  file_path text,
  file_name varchar(255),
  file_size bigint,
  raw_text text,
  status varchar(30) not null default 'UPLOADED', -- UPLOADED | PARSING | PARSED | GENERATING | REVIEW | PUBLISHED | FAILED
  parsed_json jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Create generated_content table for structured drafts awaiting review
create table if not exists generated_content (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references admin_resources(id) on delete cascade,
  content_type varchar(40) not null,            -- MOCK_TEST | QUIZ | SHEET
  title varchar(255) not null,
  target_entity_id varchar(120),                -- ID of published mock_test / question topic
  data jsonb not null default '{}'::jsonb,      -- draft structured content (questions, answers, sections, etc.)
  status varchar(30) not null default 'DRAFT',   -- DRAFT | APPROVED | PUBLISHED | REJECTED
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Indexes for fast dashboard filtering & joins
create index if not exists idx_admin_resources_status on admin_resources(status);
create index if not exists idx_admin_resources_category on admin_resources(category);
create index if not exists idx_admin_resources_company on admin_resources(company_id);
create index if not exists idx_generated_content_resource on generated_content(resource_id);
create index if not exists idx_generated_content_status on generated_content(status);

-- 5. Seed initial admin user if not present (password: admin123)
insert into users (email, password_hash, name, provider, role, plan)
values (
  'admin@placepro.com',
  crypt('admin123', gen_salt('bf', 10)),
  'PlacePro Administrator',
  'LOCAL',
  'ADMIN',
  'premium'
)
on conflict (email) do update set role = 'ADMIN';

insert into student_profiles (user_id)
select id from users where email = 'admin@placepro.com'
on conflict (user_id) do nothing;
