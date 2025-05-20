-- Create Task Item-Department association table
CREATE TABLE IF NOT EXISTS task_item_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  task_item_id UUID NOT NULL REFERENCES task_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure a task item can only be associated with a department once
  CONSTRAINT task_item_department_unique UNIQUE (department_id, task_item_id)
);

-- Create indexes for the task_item_departments table
CREATE INDEX IF NOT EXISTS task_item_departments_department_id_idx ON task_item_departments(department_id);
CREATE INDEX IF NOT EXISTS task_item_departments_task_item_id_idx ON task_item_departments(task_item_id);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'supervisor' or 'porter'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on the type column for quicker filtering
CREATE INDEX IF NOT EXISTS staff_type_idx ON staff(type);

-- Add trigger for updated_at
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON staff
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
