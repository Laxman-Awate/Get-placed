insert into dsa_topics (id, name, description, sort_order) values
('arrays','Arrays','Traversal, searching, manipulation and common problem-solving patterns.',1),
('strings','Strings','Build fluency with characters, frequency maps and string patterns.',2),
('linked-list','Linked List','Understand nodes, pointers and linked-list transformations.',3),
('binary-search','Binary Search','Learn to reduce search spaces and reason about sorted data.',4),
('recursion','Recursion','Break complex problems into smaller, repeatable decisions.',5),
('stack-queue','Stack & Queue','Practice ordering, monotonic structures and breadth-first thinking.',6),
('sliding-window','Sliding Window','Use moving windows to solve subarray and substring problems.',7),
('hashing','Hashing','Trade space for speed with maps, sets and frequency counting.',8),
('trees','Trees','Explore traversal, recursion and hierarchical data.',9),
('heaps','Heaps','Find priorities efficiently with heap-based structures.',10),
('graphs','Graphs','Model relationships with traversals and shortest paths.',11),
('greedy','Greedy','Make locally optimal choices and prove when they work.',12),
('dynamic-programming','Dynamic Programming','Turn overlapping subproblems into efficient solutions.',13);

insert into dsa_problems (id, number, title, topic_id, difficulty, pattern, description, examples, constraints_text) values
('two-sum',1,'Two Sum','arrays','Easy','Hashing','Given a list of numbers and a target, return the indices of two values that add up to the target.','["Input: [2, 7, 11, 15], target 9","Output: [0, 1]"]','Use each input position at most once.'),
('best-time-to-buy',2,'Best Time to Buy and Sell Stock','arrays','Easy','Greedy','Given daily prices, find the maximum profit from one buy and one later sell.','["Input: [7, 1, 5, 3, 6, 4]","Output: 5"]','You must buy before you sell.'),
('maximum-subarray',3,'Maximum Subarray','arrays','Medium','Kadane''s Algorithm','Find the contiguous subarray with the largest sum and return that sum.','["Input: [-2, 1, -3, 4, -1, 2, 1]","Output: 6"]','The array contains at least one number.'),
('move-zeroes',4,'Move Zeroes','arrays','Easy','Two Pointer','Move all zero values to the end while preserving the relative order of non-zero values.','["Input: [0, 1, 0, 3, 12]","Output: [1, 3, 12, 0, 0]"]','Modify the list in place.'),
('reverse-string',5,'Reverse a String','strings','Easy','Two Pointer','Reverse the characters in a mutable string sequence in place.','["Input: [h, e, l, l, o]","Output: [o, l, l, e, h]"]','Use constant extra space.'),
('valid-anagram',6,'Valid Anagram','strings','Easy','Hashing','Determine whether two strings contain the same characters with the same frequencies.','["Input: listen, silent","Output: true"]','Inputs contain lowercase English letters.'),
('merge-lists',7,'Merge Sorted Lists','linked-list','Medium','Two Pointer','Merge two sorted linked lists into one sorted list.','["Input: 1->3 and 2->4","Output: 1->2->3->4"]','Reuse existing nodes where possible.'),
('first-binary-search',8,'Binary Search','binary-search','Easy','Binary Search','Return the index of a target value in a sorted array, or -1 when absent.','["Input: [1, 3, 5, 7], target 5","Output: 2"]','The array is sorted in ascending order.');

insert into coding_problems (id, number, title, difficulty, topic, pattern, description, examples, constraints_json, hints, starter_code, is_free) values
('two-sum',1,'Two Sum','Easy','Arrays','Hashing','Given a list of numbers and a target, return the positions of two values that add to the target.','["Input: [2, 7, 11, 15], target: 9","Output: [0, 1]"]','["The input contains at least two values.","Use each position at most once."]','["Remember values already seen while scanning.","A hash lookup can reduce repeated searching."]','{"Java":"class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}","C++":"class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};","Python":"class Solution:\n    def solve(self, nums, target):\n        # Write your solution here\n        pass","JavaScript":"class Solution {\n  solve(nums, target) {\n    // Write your solution here\n  }\n}"}',true),
('maximum-subarray',2,'Maximum Subarray','Medium','Arrays','Kadane''s Algorithm','Find the contiguous section of numbers with the largest sum.','["Input: [-2, 1, -3, 4, -1, 2, 1]","Output: 6"]','["The list contains at least one number.","A section must contain consecutive values."]','["Track the best sum ending at the current position.","Decide whether to extend or restart the section."]','{"Java":"class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}","C++":"class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};","Python":"class Solution:\n    def solve(self, nums, target):\n        # Write your solution here\n        pass","JavaScript":"class Solution {\n  solve(nums, target) {\n    // Write your solution here\n  }\n}"}',true),
('reverse-linked-list',3,'Reverse Linked List','Easy','Linked List','Two Pointer','Reverse the direction of a singly linked list and return its new head.','["Input: 1 -> 2 -> 3","Output: 3 -> 2 -> 1"]','["The list may be empty.","Use links rather than creating a second list."]','["Keep track of the previous and next nodes."]','{"Java":"class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}","C++":"class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};","Python":"class Solution:\n    def solve(self, nums, target):\n        # Write your solution here\n        pass","JavaScript":"class Solution {\n  solve(nums, target) {\n    // Write your solution here\n  }\n}"}',true),
('binary-search',4,'Binary Search','Easy','Binary Search','Binary Search','Return the index of a target in a sorted list, or -1 when it is absent.','["Input: [1, 3, 5, 7], target: 5","Output: 2"]','["The list is sorted in ascending order."]','["Discard half the remaining search space each step."]','{"Java":"class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}","C++":"class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};","Python":"class Solution:\n    def solve(self, nums, target):\n        # Write your solution here\n        pass","JavaScript":"class Solution {\n  solve(nums, target) {\n    // Write your solution here\n  }\n}"}',true),
('sliding-window-sum',5,'Sliding Window Sum','Medium','Arrays','Sliding Window','Find the largest sum among all consecutive windows of a fixed size.','["Input: [2, 1, 5, 1, 3], window: 3","Output: 9"]','["Window size is positive and valid."]','["Remove the value leaving the window before adding the next value."]','{"Java":"class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}","C++":"class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};","Python":"class Solution:\n    def solve(self, nums, target):\n        # Write your solution here\n        pass","JavaScript":"class Solution {\n  solve(nums, target) {\n    // Write your solution here\n  }\n}"}',true);

insert into aptitude_categories (id,name,icon,description,difficulty,premium,sort_order) values
('quantitative','Quantitative Aptitude','◎','Master arithmetic and mathematical concepts commonly used in placement assessments.','Easy -> Hard',true,1),
('logical','Logical Reasoning','⌁','Strengthen structured thinking with patterns, arrangements and deductions.','Easy -> Hard',true,2),
('verbal','Verbal Ability','Aa','Improve comprehension, grammar, vocabulary and communication accuracy.','Easy -> Medium',true,3),
('data-interpretation','Data Interpretation','▥','Read tables, charts and caselets with speed and confidence.','Medium -> Hard',true,4);

insert into aptitude_topics (id,category_id,name,description,difficulty,question_count,free,sort_order) values
('number-system','quantitative','Number System','Understand numbers, divisibility and remainders.','Easy',20,true,1),
('percentages','quantitative','Percentages','Learn percentage increase, decrease and comparisons.','Easy -> Medium',25,true,2),
('profit-loss','quantitative','Profit & Loss','Solve selling price, cost price and discount problems.','Medium',30,false,3),
('time-work','quantitative','Time & Work','Solve work-rate and efficiency based problems.','Medium',30,false,4),
('number-series','logical','Number Series','Identify patterns and missing terms.','Easy',18,true,1),
('coding-decoding','logical','Coding-Decoding','Decode rules and transform information.','Easy -> Medium',20,true,2),
('seating-arrangement','logical','Seating Arrangement','Build a clear method for arrangement problems.','Hard',25,false,3),
('reading-comprehension','verbal','Reading Comprehension','Read with purpose and identify the author''s intent.','Medium',20,true,1),
('vocabulary','verbal','Vocabulary','Build useful placement vocabulary in context.','Easy',25,true,2),
('sentence-correction','verbal','Sentence Correction','Spot grammar and usage errors.','Medium',20,false,3),
('tables','data-interpretation','Tables','Compare values and calculate change from tabular data.','Easy -> Medium',15,true,1),
('bar-charts','data-interpretation','Bar Charts','Extract accurate insights from bar charts.','Medium',15,false,2);

insert into aptitude_questions (id,topic_id,question,options,correct_answer,explanation,free,difficulty) values
('percent-001','percentages','A value increases from 200 to 240. What is the percentage increase?','["10%","15%","20%","25%"]',2,'The increase is 40. 40 / 200 * 100 = 20%.',true,'Easy'),
('percent-002','percentages','What is 25% of 160?','["20","30","40","50"]',2,'25% is one quarter. 160 / 4 = 40.',true,'Easy'),
('percent-003','percentages','A price falls from 500 to 450. What is the percentage decrease?','["5%","10%","15%","20%"]',1,'The decrease is 50. 50 / 500 * 100 = 10%.',true,'Easy');

insert into companies (id,name,type,difficulty,premium,description,areas,modules) values
('tcs','TCS','Service Based','Medium',false,'A practical preparation path for common service-company placement areas.','["Aptitude","Technical","Interview"]',8),
('infosys','Infosys','Service Based','Medium',false,'Build confidence across aptitude, programming fundamentals and interviews.','["Aptitude","Coding","Technical"]',9),
('wipro','Wipro','Mass Recruiters','Medium',false,'Focus your preparation around commonly reported placement areas.','["Aptitude","DSA","Technical"]',8),
('accenture','Accenture','Service Based','Medium',true,'A structured roadmap for aptitude, coding and technical rounds.','["Aptitude","Coding","Interview"]',10),
('cognizant','Cognizant','Mass Recruiters','Medium',true,'Practice the skills commonly used in service-company hiring processes.','["Aptitude","DSA","Technical"]',9),
('capgemini','Capgemini','Service Based','Medium',true,'Prepare with a focused set of technical and problem-solving modules.','["Aptitude","Coding","Technical"]',9),
('deloitte','Deloitte','High Competition','High',true,'Strengthen your technical preparation and interview confidence.','["DSA","Technical","Interview"]',11),
('amazon','Amazon','Product Based','High',true,'A preparation roadmap for product-company problem solving and interviews.','["DSA","Technical","Interview"]',12),
('microsoft','Microsoft','Tech Companies','High',true,'Build depth in algorithms, systems and technical interviews.','["DSA","Technical","Interview"]',12),
('google','Google','High Competition','High',true,'A focused roadmap for advanced problem solving and technical depth.','["DSA","Technical","Interview"]',13),
('flipkart','Flipkart','Product Based','High',true,'Prepare around product engineering and common interview patterns.','["DSA","Coding","Interview"]',11),
('walmart','Walmart','Product Based','High',true,'Develop consistent algorithmic and technical preparation habits.','["DSA","Technical","Interview"]',11),
('ibm','IBM','Tech Companies','Medium',true,'Explore a balanced preparation roadmap for technical roles.','["Aptitude","Technical","Interview"]',9),
('oracle','Oracle','Tech Companies','High',true,'Practice data structures, databases and technical fundamentals.','["DSA","DBMS","Interview"]',10),
('zoho','Zoho','Product Based','High',true,'Build problem-solving fluency with a product-focused roadmap.','["DSA","Coding","Technical"]',10);

insert into company_modules (id,title,description,icon,free,action,sort_order) values
('overview','Company Overview','Understand the process and commonly reported preparation areas.','◇',true,'Explore overview',1),
('aptitude','Aptitude Preparation','Quantitative, logical, verbal and data interpretation practice.','◎',false,'Unlock module',2),
('dsa','Company-specific DSA','Curated patterns and problems for this preparation focus.','⌘',false,'Unlock module',3),
('technical','Technical Preparation','OOP, DBMS, OS, networks, SQL and programming fundamentals.','▦',false,'Unlock module',4),
('coding','Coding Practice','Practice coding patterns relevant to technical placement rounds.','</>',false,'Unlock module',5),
('mock-tests','Company Mock Tests','Practice company-oriented test simulations.','◉',false,'View tests',6),
('interview','Interview Preparation','Prepare for technical, behavioral, HR and project discussions.','✦',false,'Explore module',7);

insert into company_roadmap_steps (label, sort_order) values
('Company Basics',1),('Aptitude',2),('DSA',3),('Technical Preparation',4),('Mock Tests',5),('Interview Preparation',6);

insert into learning_semesters (id,name,subjects,sort_order,drive_url) values
('semester-1','Semester 1',5,1,null),('semester-2','Semester 2',6,2,null),('semester-3','Semester 3',7,3,null),('semester-4','Semester 4',5,4,null),
('semester-5','Semester 5',6,5,null),('semester-6','Semester 6',7,6,null),('semester-7','Semester 7',5,7,null),('semester-8','Semester 8',6,8,null);

insert into semester_subjects (id,name,code,topics,sort_order) values
('mathematics','Mathematics','MATH101',8,1),
('programming-fundamentals','Programming Fundamentals','CSE101',8,2),
('engineering-physics','Engineering Physics','PHY101',6,3),
('engineering-chemistry','Engineering Chemistry','CHEM101',7,4),
('communication-skills','Communication Skills','HUM101',5,5);

insert into subject_topics (id,name,minutes,sort_order) values
('introduction-to-programming','Introduction to Programming',12,1),
('variables-and-data-types','Variables & Data Types',18,2),
('operators','Operators',14,3),
('conditional-statements','Conditional Statements',22,4),
('loops','Loops',20,5),
('functions','Functions',16,6),
('arrays','Arrays',25,7),
('basic-problem-solving','Basic Problem Solving',28,8);

insert into learning_dsa_modules (id,name,level,lessons,sort_order) values
('arrays','Arrays','Beginner',12,1),('strings','Strings','Beginner',10,2),('linked-lists','Linked Lists','Beginner',9,3),('stack','Stack','Beginner',7,4),('queue','Queue','Beginner',7,5),
('binary-search','Binary Search','Intermediate',8,6),('recursion','Recursion','Intermediate',10,7),('trees','Trees','Intermediate',14,8),('heaps','Heaps','Intermediate',8,9),('hashing','Hashing','Intermediate',8,10),
('graphs','Graphs','Advanced',15,11),('greedy','Greedy','Advanced',9,12),('dynamic-programming','Dynamic Programming','Advanced',18,13);

insert into learning_dsa_lessons (module_id,name,sort_order) values
('arrays','Introduction',1),('arrays','Array Traversal',2),('arrays','Searching',3),('arrays','Two Pointer',4),('arrays','Sliding Window',5),('arrays','Prefix Sum',6),('arrays','Practice Problems',7);

insert into mock_tests (id,title,type,category,difficulty,duration_minutes,is_free,sections,marks_per_question) values
('placement-aptitude-01','Placement Aptitude Mock Test 01','general','aptitude','Medium',30,true,'["Quantitative Aptitude","Logical Reasoning","Verbal Ability"]',1),
('technical-placement-01','Basic Technical Placement Test','general','technical','Easy',20,true,'["Programming Fundamentals","DBMS","Operating Systems"]',1),
('amazon-placement-01','Amazon Placement Mock Test 01','company','mixed','Hard',45,false,'["Aptitude","DSA","Technical"]',1),
('tcs-placement-01','TCS Placement Mock Test 01','company','mixed','Medium',30,false,'["Aptitude","Reasoning","Technical"]',1);

insert into mock_test_questions (id,test_id,section,topic,difficulty,question,options,correct_answer,explanation,sort_order) values
('q1','placement-aptitude-01','Quantitative Aptitude','Percentages','Easy','A value moves from 200 to 240. What is the percentage increase?','["10%","15%","20%","25%"]',2,'The increase is 40. 40 divided by 200 is 20%.',1),
('q2','placement-aptitude-01','Logical Reasoning','Number Series','Medium','What number continues this pattern: 3, 6, 12, 24, ?','["36","42","48","54"]',2,'Each term is multiplied by two, so the next term is 48.',2),
('q3','placement-aptitude-01','Verbal Ability','Vocabulary','Easy','Choose the closest meaning of "concise".','["Clear and brief","Highly detailed","Difficult to understand","Repeated often"]',0,'Concise means expressing something clearly in few words.',3),
('q4','placement-aptitude-01','Quantitative Aptitude','Averages','Medium','The average of 8 and 12 is:','["8","9","10","12"]',2,'Add the values and divide by two: 20 / 2 = 10.',4),
('q5','placement-aptitude-01','Logical Reasoning','Direction Sense','Easy','If you face north and turn right, which direction do you face?','["West","East","South","North"]',1,'A right turn from north points east.',5),
('q6','placement-aptitude-01','Verbal Ability','Grammar','Medium','Choose the grammatically correct sentence.','["She go to class.","She going to class.","She goes to class.","She gone to class."]',2,'The singular subject "she" takes "goes" in the present tense.',6);

insert into mock_test_questions (id,test_id,section,topic,difficulty,question,options,correct_answer,explanation,sort_order)
select 't' || sort_order, 'technical-placement-01',
case (sort_order - 1) % 3 when 0 then 'Programming Fundamentals' when 1 then 'DBMS' else 'Operating Systems' end,
topic, difficulty, question, options, correct_answer, explanation, sort_order
from mock_test_questions where test_id='placement-aptitude-01';

insert into mock_test_questions (id,test_id,section,topic,difficulty,question,options,correct_answer,explanation,sort_order)
select 'a' || sort_order, 'amazon-placement-01',
case (sort_order - 1) % 3 when 0 then 'Aptitude' when 1 then 'DSA' else 'Technical' end,
topic, difficulty, question, options, correct_answer, explanation, sort_order
from mock_test_questions where test_id='placement-aptitude-01';

insert into mock_test_questions (id,test_id,section,topic,difficulty,question,options,correct_answer,explanation,sort_order)
select 'tc' || sort_order, 'tcs-placement-01',
case (sort_order - 1) % 3 when 0 then 'Aptitude' when 1 then 'Reasoning' else 'Technical' end,
topic, difficulty, question, options, correct_answer, explanation, sort_order
from mock_test_questions where test_id='placement-aptitude-01';
