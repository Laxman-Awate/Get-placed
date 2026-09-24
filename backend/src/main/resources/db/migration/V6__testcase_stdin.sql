-- V6: stdin payloads for test-case judging.
-- input_text stays human-readable for display; stdin_text is what gets piped
-- to the submitted program on Run/Submit.

alter table dsa_testcases add column if not exists stdin_text text not null default '';

-- two-sum: line 1 = target, line 2 = space-separated nums
update dsa_testcases set stdin_text = '9
2 7 11 15' where problem_id = 'two-sum' and sort_order = 1;
update dsa_testcases set stdin_text = '6
3 2 4' where problem_id = 'two-sum' and sort_order = 2;
update dsa_testcases set stdin_text = '6
3 3' where problem_id = 'two-sum' and sort_order = 3;
update dsa_testcases set stdin_text = '-8
-1 -2 -3 -4 -5' where problem_id = 'two-sum' and sort_order = 4;
update dsa_testcases set stdin_text = '0
0 4 3 0' where problem_id = 'two-sum' and sort_order = 5;
update dsa_testcases set stdin_text = '9
1 2 3 4 5' where problem_id = 'two-sum' and sort_order = 6;
update dsa_testcases set stdin_text = '0
-3 4 3 90' where problem_id = 'two-sum' and sort_order = 7;

-- best-time-to-buy: one line of prices
update dsa_testcases set stdin_text = '7 1 5 3 6 4' where problem_id = 'best-time-to-buy' and sort_order = 1;
update dsa_testcases set stdin_text = '7 6 4 3 1' where problem_id = 'best-time-to-buy' and sort_order = 2;
update dsa_testcases set stdin_text = '1 2 3 4 5' where problem_id = 'best-time-to-buy' and sort_order = 3;
update dsa_testcases set stdin_text = '2 4 1' where problem_id = 'best-time-to-buy' and sort_order = 4;
update dsa_testcases set stdin_text = '3 3 3 3' where problem_id = 'best-time-to-buy' and sort_order = 5;
update dsa_testcases set stdin_text = '5' where problem_id = 'best-time-to-buy' and sort_order = 6;

-- maximum-subarray: one line of nums
update dsa_testcases set stdin_text = '-2 1 -3 4 -1 2 1' where problem_id = 'maximum-subarray' and sort_order = 1;
update dsa_testcases set stdin_text = '1' where problem_id = 'maximum-subarray' and sort_order = 2;
update dsa_testcases set stdin_text = '5 4 -1 7 8' where problem_id = 'maximum-subarray' and sort_order = 3;
update dsa_testcases set stdin_text = '-1' where problem_id = 'maximum-subarray' and sort_order = 4;
update dsa_testcases set stdin_text = '-2 -1' where problem_id = 'maximum-subarray' and sort_order = 5;
update dsa_testcases set stdin_text = '0 0 0' where problem_id = 'maximum-subarray' and sort_order = 6;

-- move-zeroes: one line of nums
update dsa_testcases set stdin_text = '0 1 0 3 12' where problem_id = 'move-zeroes' and sort_order = 1;
update dsa_testcases set stdin_text = '0' where problem_id = 'move-zeroes' and sort_order = 2;
update dsa_testcases set stdin_text = '1 2 3' where problem_id = 'move-zeroes' and sort_order = 3;
update dsa_testcases set stdin_text = '0 0 1' where problem_id = 'move-zeroes' and sort_order = 4;
update dsa_testcases set stdin_text = '4 2 4 0 0 3 0 5 1 0' where problem_id = 'move-zeroes' and sort_order = 5;

-- reverse-string: single line string
update dsa_testcases set stdin_text = 'hello' where problem_id = 'reverse-string' and sort_order = 1;
update dsa_testcases set stdin_text = 'Hannah' where problem_id = 'reverse-string' and sort_order = 2;
update dsa_testcases set stdin_text = 'a' where problem_id = 'reverse-string' and sort_order = 3;
update dsa_testcases set stdin_text = 'ab' where problem_id = 'reverse-string' and sort_order = 4;
update dsa_testcases set stdin_text = '' where problem_id = 'reverse-string' and sort_order = 5;

-- valid-anagram: line 1 = s, line 2 = t
update dsa_testcases set stdin_text = 'listen
silent' where problem_id = 'valid-anagram' and sort_order = 1;
update dsa_testcases set stdin_text = 'rat
car' where problem_id = 'valid-anagram' and sort_order = 2;
update dsa_testcases set stdin_text = 'a
a' where problem_id = 'valid-anagram' and sort_order = 3;
update dsa_testcases set stdin_text = 'ab
a' where problem_id = 'valid-anagram' and sort_order = 4;
update dsa_testcases set stdin_text = 'aacc
ccac' where problem_id = 'valid-anagram' and sort_order = 5;

-- merge-lists: line 1 = l1 values, line 2 = l2 values (blank = empty)
update dsa_testcases set stdin_text = '1 3
2 4' where problem_id = 'merge-lists' and sort_order = 1;
update dsa_testcases set stdin_text = '
' where problem_id = 'merge-lists' and sort_order = 2;
update dsa_testcases set stdin_text = '
0' where problem_id = 'merge-lists' and sort_order = 3;
update dsa_testcases set stdin_text = '1
1 2' where problem_id = 'merge-lists' and sort_order = 4;
update dsa_testcases set stdin_text = '1 2 4
1 3 4' where problem_id = 'merge-lists' and sort_order = 5;

-- first-binary-search: line 1 = nums, line 2 = target
update dsa_testcases set stdin_text = '1 3 5 7
5' where problem_id = 'first-binary-search' and sort_order = 1;
update dsa_testcases set stdin_text = '1 3 5 7
2' where problem_id = 'first-binary-search' and sort_order = 2;
update dsa_testcases set stdin_text = '
5' where problem_id = 'first-binary-search' and sort_order = 3;
update dsa_testcases set stdin_text = '5
5' where problem_id = 'first-binary-search' and sort_order = 4;
update dsa_testcases set stdin_text = '1 2 3 4 5 6 7 8 9 10
9' where problem_id = 'first-binary-search' and sort_order = 5;
update dsa_testcases set stdin_text = '1 3
3' where problem_id = 'first-binary-search' and sort_order = 6;
