create table "public"."reports" (
  "id" uuid not null default gen_random_uuid(),
  "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "user_id" uuid not null references auth.users(id) on delete cascade,
  "interview_id" uuid not null references public.interviews(id) on delete cascade,
  "feedback" jsonb not null,
  constraint "reports_pkey" primary key ("id")
);

-- Enable RLS
alter table "public"."reports" enable row level security;

-- Create policies
create policy "Users can view their own reports"
  on reports for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reports"
  on reports for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reports"
  on reports for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reports"
  on reports for delete
  using (auth.uid() = user_id);

-- Add indexes
create index "reports_user_id_idx" on "public"."reports" ("user_id");
create index "reports_interview_id_idx" on "public"."reports" ("interview_id");

-- Add comments
comment on table "public"."reports" is 'Stores interview feedback reports';
comment on column "public"."reports"."feedback" is 'JSON object containing feedback with scores and comments for communication skills, technical knowledge, problem solving, cultural fit, and confidence and clarity';
comment on column "public"."reports"."interview_id" is 'References the interview this report is for';

-- Add constraint to ensure feedback has the required structure
alter table "public"."reports" 
add constraint "feedback_structure_check" 
check (
  feedback ? 'communication_skills' and
  feedback ? 'technical_knowledge' and
  feedback ? 'problem_solving' and
  feedback ? 'cultural_fit' and
  feedback ? 'confidence_and_clarity' and
  (feedback->'communication_skills') ? 'score' and
  (feedback->'communication_skills') ? 'comments' and
  (feedback->'technical_knowledge') ? 'score' and
  (feedback->'technical_knowledge') ? 'comments' and
  (feedback->'problem_solving') ? 'score' and
  (feedback->'problem_solving') ? 'comments' and
  (feedback->'cultural_fit') ? 'score' and
  (feedback->'cultural_fit') ? 'comments' and
  (feedback->'confidence_and_clarity') ? 'score' and
  (feedback->'confidence_and_clarity') ? 'comments'
); 