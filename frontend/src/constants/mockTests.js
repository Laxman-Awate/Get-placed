const questions = [
 {id:'q1',section:'Quantitative Aptitude',topic:'Percentages',difficulty:'Easy',question:'A value moves from 200 to 240. What is the percentage increase?',options:['10%','15%','20%','25%'],correctAnswer:2,explanation:'The increase is 40. 40 divided by 200 is 20%.'},
 {id:'q2',section:'Logical Reasoning',topic:'Number Series',difficulty:'Medium',question:'What number continues this pattern: 3, 6, 12, 24, ?',options:['36','42','48','54'],correctAnswer:2,explanation:'Each term is multiplied by two, so the next term is 48.'},
 {id:'q3',section:'Verbal Ability',topic:'Vocabulary',difficulty:'Easy',question:'Choose the closest meaning of “concise”.',options:['Clear and brief','Highly detailed','Difficult to understand','Repeated often'],correctAnswer:0,explanation:'Concise means expressing something clearly in few words.'},
 {id:'q4',section:'Quantitative Aptitude',topic:'Averages',difficulty:'Medium',question:'The average of 8 and 12 is:',options:['8','9','10','12'],correctAnswer:2,explanation:'Add the values and divide by two: 20 ÷ 2 = 10.'},
 {id:'q5',section:'Logical Reasoning',topic:'Direction Sense',difficulty:'Easy',question:'If you face north and turn right, which direction do you face?',options:['West','East','South','North'],correctAnswer:1,explanation:'A right turn from north points east.'},
 {id:'q6',section:'Verbal Ability',topic:'Grammar',difficulty:'Medium',question:'Choose the grammatically correct sentence.',options:['She go to class.','She going to class.','She goes to class.','She gone to class.'],correctAnswer:2,explanation:'The singular subject “she” takes “goes” in the present tense.'},
];
export const MOCK_TESTS = [
 {id:'placement-aptitude-01',title:'Placement Aptitude Mock Test 01',type:'general',category:'aptitude',difficulty:'Medium',durationMinutes:30,isFree:true,totalQuestions:6,sections:['Quantitative Aptitude','Logical Reasoning','Verbal Ability'],questions,marksPerQuestion:1},
 {id:'technical-placement-01',title:'Basic Technical Placement Test',type:'general',category:'technical',difficulty:'Easy',durationMinutes:20,isFree:true,totalQuestions:6,sections:['Programming Fundamentals','DBMS','Operating Systems'],questions:questions.map((q,i)=>({...q,id:`t${i+1}`,section:['Programming Fundamentals','DBMS','Operating Systems'][i%3]})),marksPerQuestion:1},
 {id:'amazon-placement-01',title:'Amazon Placement Mock Test 01',type:'company',category:'mixed',difficulty:'Hard',durationMinutes:45,isFree:false,totalQuestions:6,sections:['Aptitude','DSA','Technical'],questions:questions.map((q,i)=>({...q,id:`a${i+1}`,section:['Aptitude','DSA','Technical'][i%3]})),marksPerQuestion:1},
 {id:'tcs-placement-01',title:'TCS Placement Mock Test 01',type:'company',category:'mixed',difficulty:'Medium',durationMinutes:30,isFree:false,totalQuestions:6,sections:['Aptitude','Reasoning','Technical'],questions,marksPerQuestion:1},
];
export const MOCK_TEST_SUMMARY = { attempted:6, bestScore:82, averageScore:74, questionsAttempted:120 };
export const MOCK_TEST_HISTORY = [{title:'Placement Aptitude Mock Test 01',score:80,when:'Completed today'},{title:'Technical Placement Test',score:72,when:'Completed 2 days ago'}];
