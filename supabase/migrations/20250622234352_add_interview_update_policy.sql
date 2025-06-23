-- Add update policy for interviews table
create policy "Users can update their own interviews"
  on interviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Add comment
comment on policy "Users can update their own interviews" on interviews is 'Enable users to update their own interviews'; 