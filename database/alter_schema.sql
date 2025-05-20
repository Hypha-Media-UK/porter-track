-- Make department_id nullable in porter_department_assignments table
ALTER TABLE porter_department_assignments 
ALTER COLUMN department_id DROP NOT NULL;
