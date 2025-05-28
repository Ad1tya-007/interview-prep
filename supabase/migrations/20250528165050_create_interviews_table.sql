create table "public"."interviews" (
  "id" uuid not null default gen_random_uuid(),
  "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "user_id" uuid not null references auth.users(id) on delete cascade,
  "questions" jsonb not null,
  "type" text not null,
  "role" text not null,
  "level" text not null,
  "techstack" text[] not null,
  constraint "interviews_pkey" primary key ("id")
);

-- Enable RLS
alter table "public"."interviews" enable row level security;

-- Create policies
create policy "Users can view their own interviews"
  on interviews for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interviews"
  on interviews for insert
  with check (auth.uid() = user_id);

-- Add indexes
create index "interviews_user_id_idx" on "public"."interviews" ("user_id");
create index "interviews_type_idx" on "public"."interviews" ("type");
create index "interviews_role_idx" on "public"."interviews" ("role");
create index "interviews_level_idx" on "public"."interviews" ("level");

-- Add comments
comment on table "public"."interviews" is 'Stores interview questions and related information';
comment on column "public"."interviews"."questions" is 'Array of interview questions';
comment on column "public"."interviews"."type" is 'Type of interview (technical, behavioral, etc)';
comment on column "public"."interviews"."role" is 'Job role for the interview';
comment on column "public"."interviews"."level" is 'Experience level for the role';
comment on column "public"."interviews"."techstack" is 'Array of technologies required for the role'; 