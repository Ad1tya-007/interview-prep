-- Add delete policy for interviews table
create policy "Users can delete their own interviews"
  on interviews for delete
  using (auth.uid() = user_id); 