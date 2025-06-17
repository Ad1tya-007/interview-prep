-- Add description column to interviews table
ALTER TABLE interviews
ADD COLUMN description TEXT;

-- Update existing rows with a default description
UPDATE interviews
SET description = 'This is a description'
WHERE description IS NULL;

-- Make description NOT NULL after setting default values
ALTER TABLE interviews
ALTER COLUMN description SET NOT NULL; 