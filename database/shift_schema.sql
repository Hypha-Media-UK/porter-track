-- Department Designations table
CREATE TABLE IF NOT EXISTS department_designations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supervisor_id UUID NOT NULL REFERENCES staff(id),
  shift_type TEXT NOT NULL, -- 'Day Shift' or 'Night Shift'
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for the shifts table
CREATE INDEX IF NOT EXISTS shifts_supervisor_id_idx ON shifts(supervisor_id);
CREATE INDEX IF NOT EXISTS shifts_is_active_idx ON shifts(is_active);

-- Shift Porters table
CREATE TABLE IF NOT EXISTS shift_porters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  porter_id UUID NOT NULL REFERENCES staff(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for the shift_porters table
CREATE INDEX IF NOT EXISTS shift_porters_shift_id_idx ON shift_porters(shift_id);
CREATE INDEX IF NOT EXISTS shift_porters_porter_id_idx ON shift_porters(porter_id);

-- Porter Department Assignments table
CREATE TABLE IF NOT EXISTS porter_department_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  porter_id UUID NOT NULL REFERENCES staff(id),
  department_id UUID NOT NULL REFERENCES departments(id),
  designation_id UUID REFERENCES department_designations(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for the porter_department_assignments table
CREATE INDEX IF NOT EXISTS porter_dept_assign_shift_id_idx ON porter_department_assignments(shift_id);
CREATE INDEX IF NOT EXISTS porter_dept_assign_porter_id_idx ON porter_department_assignments(porter_id);
CREATE INDEX IF NOT EXISTS porter_dept_assign_dept_id_idx ON porter_department_assignments(department_id);
CREATE INDEX IF NOT EXISTS porter_dept_assign_is_active_idx ON porter_department_assignments(is_active);

-- Shift Tasks table
CREATE TABLE IF NOT EXISTS shift_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id),
  porter_id UUID REFERENCES staff(id),
  time_received TIMESTAMPTZ NOT NULL,
  time_allocated TIMESTAMPTZ NOT NULL,
  time_completed TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' or 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for the shift_tasks table
CREATE INDEX IF NOT EXISTS shift_tasks_shift_id_idx ON shift_tasks(shift_id);
CREATE INDEX IF NOT EXISTS shift_tasks_task_id_idx ON shift_tasks(task_id);
CREATE INDEX IF NOT EXISTS shift_tasks_porter_id_idx ON shift_tasks(porter_id);
CREATE INDEX IF NOT EXISTS shift_tasks_status_idx ON shift_tasks(status);

-- Triggers to automatically update the updated_at column
-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS update_department_designations_updated_at ON department_designations;
DROP TRIGGER IF EXISTS update_shifts_updated_at ON shifts;
DROP TRIGGER IF EXISTS update_shift_porters_updated_at ON shift_porters;
DROP TRIGGER IF EXISTS update_porter_department_assignments_updated_at ON porter_department_assignments;
DROP TRIGGER IF EXISTS update_shift_tasks_updated_at ON shift_tasks;

-- Create triggers
CREATE TRIGGER update_department_designations_updated_at
BEFORE UPDATE ON department_designations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_shifts_updated_at
BEFORE UPDATE ON shifts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_shift_porters_updated_at
BEFORE UPDATE ON shift_porters
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_porter_department_assignments_updated_at
BEFORE UPDATE ON porter_department_assignments
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_shift_tasks_updated_at
BEFORE UPDATE ON shift_tasks
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
