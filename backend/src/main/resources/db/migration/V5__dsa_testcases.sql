-- V5: separate test-case table for DSA problems.
-- Each problem holds 2-3 sample cases (shown in the UI) plus hidden cases
-- (used for judging on submit). Capacity is 10-15 cases per problem.

create table if not exists dsa_testcases (
  id bigserial primary key,
  problem_id varchar(100) not null references dsa_problems(id) on delete cascade,
  input_text text not null,
  expected_output text not null,
  is_sample boolean not null default false,
  sort_order integer not null default 0,
  unique (problem_id, sort_order)
);

create index if not exists idx_dsa_testcases_problem on dsa_testcases(problem_id);

-- two-sum
insert into dsa_testcases (problem_id, input_text, expected_output, is_sample, sort_order) values
  ('two-sum', 'nums = [2,7,11,15], target = 9', '[0,1]', true, 1),
  ('two-sum', 'nums = [3,2,4], target = 6', '[1,2]', true, 2),
  ('two-sum', 'nums = [3,3], target = 6', '[0,1]', true, 3),
  ('two-sum', 'nums = [-1,-2,-3,-4,-5], target = -8', '[2,4]', false, 4),
  ('two-sum', 'nums = [0,4,3,0], target = 0', '[0,3]', false, 5),
  ('two-sum', 'nums = [1,2,3,4,5], target = 9', '[3,4]', false, 6),
  ('two-sum', 'nums = [-3,4,3,90], target = 0', '[0,2]', false, 7)
on conflict (problem_id, sort_order) do nothing;

-- best-time-to-buy
insert into dsa_testcases (problem_id, input_text, expected_output, is_sample, sort_order) values
  ('best-time-to-buy', 'prices = [7,1,5,3,6,4]', '5', true, 1),
  ('best-time-to-buy', 'prices = [7,6,4,3,1]', '0', true, 2),
  ('best-time-to-buy', 'prices = [1,2,3,4,5]', '4', false, 3),
  ('best-time-to-buy', 'prices = [2,4,1]', '2', false, 4),
  ('best-time-to-buy', 'prices = [3,3,3,3]', '0', false, 5),
  ('best-time-to-buy', 'prices = [5]', '0', false, 6)
on conflict (problem_id, sort_order) do nothing;

-- maximum-subarray
insert into dsa_testcases (problem_id, input_text, expected_output, is_sample, sort_order) values
  ('maximum-subarray', 'nums = [-2,1,-3,4,-1,2,1]', '6', true, 1),
  ('maximum-subarray', 'nums = [1]', '1', true, 2),
  ('maximum-subarray', 'nums = [5,4,-1,7,8]', '23', true, 3),
  ('maximum-subarray', 'nums = [-1]', '-1', false, 4),
  ('maximum-subarray', 'nums = [-2,-1]', '-1', false, 5),
  ('maximum-subarray', 'nums = [0,0,0]', '0', false, 6)
on conflict (problem_id, sort_order) do nothing;

-- move-zeroes
insert into dsa_testcases (problem_id, input_text, expected_output, is_sample, sort_order) values
  ('move-zeroes', 'nums = [0,1,0,3,12]', '[1,3,12,0,0]', true, 1),
  ('move-zeroes', 'nums = [0]', '[0]', true, 2),
  ('move-zeroes', 'nums = [1,2,3]', '[1,2,3]', false, 3),
  ('move-zeroes', 'nums = [0,0,1]', '[1,0,0]', false, 4),
  ('move-zeroes', 'nums = [4,2,4,0,0,3,0,5,1,0]', '[4,2,4,3,5,1,0,0,0,0]', false, 5)
on conflict (problem_id, sort_order) do nothing;

-- reverse-string
insert into dsa_testcases (problem_id, input_text, expected_output, is_sample, sort_order) values
  ('reverse-string', 's = [h,e,l,l,o]', '[o,l,l,e,h]', true, 1),
  ('reverse-string', 's = [H,a,n,n,a,h]', '[h,a,n,n,a,H]', true, 2),
  ('reverse-string', 's = [a]', '[a]', false, 3),
  ('reverse-string', 's = [a,b]', '[b,a]', false, 4),
  ('reverse-string', 's = []', '[]', false, 5)
on conflict (problem_id, sort_order) do nothing;

-- valid-anagram
insert into dsa_testcases (problem_id, input_text, expected_output, is_sample, sort_order) values
  ('valid-anagram', 's = "listen", t = "silent"', 'true', true, 1),
  ('valid-anagram', 's = "rat", t = "car"', 'false', true, 2),
  ('valid-anagram', 's = "a", t = "a"', 'true', false, 3),
  ('valid-anagram', 's = "ab", t = "a"', 'false', false, 4),
  ('valid-anagram', 's = "aacc", t = "ccac"', 'true', false, 5)
on conflict (problem_id, sort_order) do nothing;

-- merge-lists
insert into dsa_testcases (problem_id, input_text, expected_output, is_sample, sort_order) values
  ('merge-lists', 'l1 = 1->3, l2 = 2->4', '1->2->3->4', true, 1),
  ('merge-lists', 'l1 = [], l2 = []', '[]', true, 2),
  ('merge-lists', 'l1 = [], l2 = [0]', '[0]', false, 3),
  ('merge-lists', 'l1 = [1], l2 = [1,2]', '[1,1,2]', false, 4),
  ('merge-lists', 'l1 = [1,2,4], l2 = [1,3,4]', '[1,1,2,3,4,4]', false, 5)
on conflict (problem_id, sort_order) do nothing;

-- first-binary-search
insert into dsa_testcases (problem_id, input_text, expected_output, is_sample, sort_order) values
  ('first-binary-search', 'nums = [1,3,5,7], target = 5', '2', true, 1),
  ('first-binary-search', 'nums = [1,3,5,7], target = 2', '-1', true, 2),
  ('first-binary-search', 'nums = [], target = 5', '-1', false, 3),
  ('first-binary-search', 'nums = [5], target = 5', '0', false, 4),
  ('first-binary-search', 'nums = [1,2,3,4,5,6,7,8,9,10], target = 9', '8', false, 5),
  ('first-binary-search', 'nums = [1,3], target = 3', '1', false, 6)
on conflict (problem_id, sort_order) do nothing;
