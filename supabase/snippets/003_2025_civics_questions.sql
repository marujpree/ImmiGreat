-- 003_2025_civics_questions.sql
-- Adds new questions from the 2025 USCIS civics test (128-question version).
-- Uses INSERT ... WHERE NOT EXISTS to avoid duplicating any questions already in the DB.
-- Run this in the Supabase SQL editor.

-- ─────────────────────────────────────────────
-- 1. Update current-official answers
-- ─────────────────────────────────────────────
UPDATE public.civics_questions
SET official_answer = 'Donald Trump', updated_at = now()
WHERE lower(question_text) LIKE '%name of the president%'
  AND is_active = true;

UPDATE public.civics_questions
SET official_answer = 'JD Vance', updated_at = now()
WHERE lower(question_text) LIKE '%vice president%now%'
  AND is_active = true;

UPDATE public.civics_questions
SET official_answer = 'Mike Johnson', updated_at = now()
WHERE lower(question_text) LIKE '%speaker of the house%'
  AND is_active = true;

UPDATE public.civics_questions
SET official_answer = 'John Roberts', updated_at = now()
WHERE lower(question_text) LIKE '%chief justice%'
  AND is_active = true;

-- ─────────────────────────────────────────────
-- 2. Insert new 2025 questions (skip if text already exists)
-- ─────────────────────────────────────────────
INSERT INTO public.civics_questions (question_text, official_answer, category, source_version, is_active)
SELECT q.question_text, q.official_answer, q.category, '2025', true
FROM (VALUES

  -- Principles of American Democracy (new in 2025)
  (
    'The U.S. Constitution starts with the words "We the People." What does "We the People" mean?',
    'Self-government / Popular sovereignty / Consent of the governed / People should govern themselves / (Example of) social contract',
    'Principles of American Democracy'
  ),
  (
    'Name two important ideas from the Declaration of Independence and the U.S. Constitution.',
    'Equality / Liberty / Social contract / Natural rights / Limited government / Self-government',
    'Principles of American Democracy'
  ),
  (
    'The words "Life, Liberty, and the pursuit of Happiness" are in what founding document?',
    'Declaration of Independence',
    'Principles of American Democracy'
  ),
  (
    'Many documents influenced the U.S. Constitution. Name one.',
    'Declaration of Independence / Articles of Confederation / Federalist Papers / Anti-Federalist Papers / Virginia Declaration of Rights / Fundamental Orders of Connecticut / Mayflower Compact / Iroquois Great Law of Peace',
    'Principles of American Democracy'
  ),

  -- System of Government (new in 2025)
  (
    'Why do U.S. representatives serve shorter terms than U.S. senators?',
    'To more closely follow public opinion',
    'System of Government'
  ),
  (
    'Why does each state have two senators?',
    'Equal representation (for small states) / The Great Compromise (Connecticut Compromise)',
    'System of Government'
  ),
  (
    'The President of the United States can serve only two terms. Why?',
    '(Because of) the 22nd Amendment / To keep the president from becoming too powerful',
    'System of Government'
  ),
  (
    'Why is the Electoral College important?',
    'It decides who is elected president. / It provides a compromise between the popular election of the president and congressional selection.',
    'System of Government'
  ),
  (
    'How many Supreme Court justices are usually needed to decide a case?',
    'Five (5)',
    'System of Government'
  ),
  (
    'Supreme Court justices serve for life. Why?',
    'To be independent (of politics) / To limit outside (political) influence',
    'System of Government'
  ),
  (
    'What is the purpose of the 10th Amendment?',
    '(It states that the) powers not given to the federal government belong to the states or to the people.',
    'System of Government'
  ),
  (
    'What are two Cabinet-level positions?',
    'Attorney General / Secretary of Agriculture / Secretary of Commerce / Secretary of Education / Secretary of Energy / Secretary of Health and Human Services / Secretary of Homeland Security / Secretary of Housing and Urban Development / Secretary of the Interior / Secretary of Labor / Secretary of State / Secretary of Transportation / Secretary of the Treasury / Secretary of Veterans Affairs / Vice-President',
    'System of Government'
  ),

  -- Rights and Responsibilities (new in 2025)
  (
    'There are four amendments to the U.S. Constitution about who can vote. Describe one of them.',
    'Citizens eighteen (18) and older (can vote). / You don''t have to pay (a poll tax) to vote. / Any citizen can vote. (Women and men can vote.) / A male citizen of any race (can vote).',
    'Rights and Responsibilities'
  ),
  (
    'Who can vote in federal elections, run for federal office, and serve on a jury in the United States?',
    'Citizens / Citizens of the United States / U.S. citizens',
    'Rights and Responsibilities'
  ),
  (
    'Name two promises that new citizens make in the Oath of Allegiance.',
    'Give up loyalty to other countries / Defend the (U.S.) Constitution / Obey the laws of the United States / Serve in the military (if needed) / Serve (help, do important work for) the nation (if needed) / Be loyal to the United States',
    'Rights and Responsibilities'
  ),
  (
    'How can people become United States citizens?',
    'Be born in the United States, under the conditions set by the 14th Amendment / Naturalize / Derive citizenship (under conditions set by Congress)',
    'Rights and Responsibilities'
  ),
  (
    'What are two examples of civic participation in the United States?',
    'Vote / Run for office / Join a political party / Help with a campaign / Join a civic group / Join a community group / Give an elected official your opinion (on an issue) / Contact elected officials / Support or oppose an issue or policy / Write to a newspaper',
    'Rights and Responsibilities'
  ),

  -- Colonial Period and Independence (new in 2025)
  (
    'Why were the Federalist Papers important?',
    'They helped people understand the (U.S.) Constitution. / They supported passing the (U.S.) Constitution.',
    'Colonial Period and Independence'
  ),
  (
    'Benjamin Franklin is famous for many things. Name one.',
    'Founded the first free public libraries / First Postmaster General of the United States / Helped write the Declaration of Independence / Inventor / U.S. diplomat',
    'Colonial Period and Independence'
  ),
  (
    'James Madison is famous for many things. Name one.',
    '"Father of the Constitution" / Fourth president of the United States / President during the War of 1812 / One of the writers of the Federalist Papers',
    'Colonial Period and Independence'
  ),
  (
    'Alexander Hamilton is famous for many things. Name one.',
    'First Secretary of the Treasury / One of the writers of the Federalist Papers / Helped establish the First Bank of the United States / Aide to General George Washington / Member of the Continental Congress',
    'Colonial Period and Independence'
  ),

  -- 1800s (new in 2025)
  (
    'The Civil War had many important events. Name one.',
    '(Battle of) Fort Sumter / Emancipation Proclamation / (Battle of) Vicksburg / (Battle of) Gettysburg / Sherman''s March / (Surrender at) Appomattox / (Battle of) Antietam/Sharpsburg / Lincoln was assassinated.',
    '1800s'
  ),
  (
    'When did all men get the right to vote?',
    'After the Civil War / During Reconstruction / (With the) 15th Amendment / 1870',
    '1800s'
  ),
  (
    'Name one leader of the women''s rights movement in the 1800s.',
    'Susan B. Anthony / Elizabeth Cady Stanton / Sojourner Truth / Harriet Tubman / Lucretia Mott / Lucy Stone',
    '1800s'
  ),

  -- Recent American History (new in 2025)
  (
    'Dwight Eisenhower is famous for many things. Name one.',
    'General during World War II / President at the end of (during) the Korean War / 34th president of the United States / Signed the Federal-Aid Highway Act of 1956 (Created the Interstate System)',
    'Recent American History'
  ),
  (
    'Name one American Indian tribe in the United States.',
    'Apache / Blackfeet / Cayuga / Cherokee / Cheyenne / Chippewa / Choctaw / Creek / Crow / Hopi / Huron / Inupiat / Lakota / Mohawk / Mohegan / Navajo / Oneida / Onondaga / Pueblo / Seminole / Seneca / Shawnee / Sioux / Teton / Tuscarora',
    'Recent American History'
  ),
  (
    'Name one example of an American innovation.',
    'Light bulb / Automobile (cars, internal combustion engine) / Skyscrapers / Airplane / Assembly line / Landing on the moon / Integrated circuit (IC)',
    'Recent American History'
  ),

  -- Symbols and Holidays (new in 2025)
  (
    'The Nation''s first motto was "E Pluribus Unum." What does that mean?',
    'Out of many, one / We all become one',
    'Symbols and Holidays'
  ),
  (
    'What is Memorial Day?',
    'A holiday to honor soldiers who died in military service',
    'Symbols and Holidays'
  ),
  (
    'What is Veterans Day?',
    'A holiday to honor people in the (U.S.) military / A holiday to honor people who have served (in the U.S. military)',
    'Symbols and Holidays'
  )

) AS q(question_text, official_answer, category)
WHERE NOT EXISTS (
  SELECT 1 FROM public.civics_questions cq
  WHERE lower(cq.question_text) = lower(q.question_text)
);
