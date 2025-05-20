-- Seed Department Designations
INSERT INTO department_designations (id, name, created_at, updated_at)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c7d-ef0123456789', 'Primary Assignment', NOW(), NOW()),
  ('b2c3d4e5-f6a7-5b6c-9d8e-f01234567890', 'Secondary Assignment', NOW(), NOW()),
  ('c3d4e5f6-a7b8-6c7d-0e9f-123456789012', 'Temporary Coverage', NOW(), NOW()),
  ('d4e5f6a7-b8c9-7d8e-1f0a-234567890123', 'Emergency Response', NOW(), NOW()),
  ('e5f6a7b8-c9d0-8e9f-2a1b-345678901234', 'Training Assignment', NOW(), NOW());

-- Sample Shifts (1 active, 1 completed)
INSERT INTO shifts (id, supervisor_id, shift_type, start_time, end_time, is_active, created_at, updated_at)
SELECT
  'f6a7b8c9-d0e1-9f0a-3b2c-456789012345',
  id,
  'Day Shift',
  NOW() - INTERVAL '2 hours',
  NULL,
  TRUE,
  NOW(),
  NOW()
FROM staff 
WHERE type = 'supervisor'
LIMIT 1;

INSERT INTO shifts (id, supervisor_id, shift_type, start_time, end_time, is_active, created_at, updated_at)
SELECT
  'a7b8c9d0-e1f2-0a1b-4c3d-567890123456',
  id,
  'Night Shift',
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '4 hours',
  FALSE,
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '4 hours'
FROM staff 
WHERE type = 'supervisor'
LIMIT 1;

-- Assign some porters to the active shift
INSERT INTO shift_porters (shift_id, porter_id, created_at, updated_at)
SELECT
  'f6a7b8c9-d0e1-9f0a-3b2c-456789012345',
  id,
  NOW(),
  NOW()
FROM staff
WHERE type = 'porter'
LIMIT 3;

-- Assign some porters to the completed shift
INSERT INTO shift_porters (shift_id, porter_id, created_at, updated_at)
SELECT
  'a7b8c9d0-e1f2-0a1b-4c3d-567890123456',
  id,
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '12 hours'
FROM staff
WHERE type = 'porter'
LIMIT 3;

-- Create some department assignments for porters in the active shift
INSERT INTO porter_department_assignments (
  shift_id, 
  porter_id, 
  department_id, 
  designation_id,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  'f6a7b8c9-d0e1-9f0a-3b2c-456789012345',
  s.id,
  d.id,
  'a1b2c3d4-e5f6-4a5b-8c7d-ef0123456789',
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '1 hour',
  TRUE,
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '1 hour'
FROM staff s, departments d
WHERE s.type = 'porter' AND EXISTS (
  SELECT 1 FROM shift_porters sp 
  WHERE sp.shift_id = 'f6a7b8c9-d0e1-9f0a-3b2c-456789012345' AND sp.porter_id = s.id
)
LIMIT 2;

-- Create some completed department assignments for the completed shift
INSERT INTO porter_department_assignments (
  shift_id, 
  porter_id, 
  department_id, 
  designation_id,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  'a7b8c9d0-e1f2-0a1b-4c3d-567890123456',
  s.id,
  d.id,
  'a1b2c3d4-e5f6-4a5b-8c7d-ef0123456789',
  NOW() - INTERVAL '11 hours',
  NOW() - INTERVAL '5 hours',
  FALSE,
  NOW() - INTERVAL '11 hours',
  NOW() - INTERVAL '5 hours'
FROM staff s, departments d
WHERE s.type = 'porter' AND EXISTS (
  SELECT 1 FROM shift_porters sp 
  WHERE sp.shift_id = 'a7b8c9d0-e1f2-0a1b-4c3d-567890123456' AND sp.porter_id = s.id
)
LIMIT 2;

-- Create some tasks for the active shift (2 pending, 1 completed)
INSERT INTO shift_tasks (
  shift_id,
  task_id,
  porter_id,
  time_received,
  time_allocated,
  time_completed,
  status,
  created_at,
  updated_at
)
SELECT
  'f6a7b8c9-d0e1-9f0a-3b2c-456789012345',
  t.id,
  s.id,
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '29 minutes',
  NULL,
  'pending',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '30 minutes'
FROM tasks t, staff s
WHERE s.type = 'porter' AND EXISTS (
  SELECT 1 FROM shift_porters sp 
  WHERE sp.shift_id = 'f6a7b8c9-d0e1-9f0a-3b2c-456789012345' AND sp.porter_id = s.id
)
LIMIT 2;

INSERT INTO shift_tasks (
  shift_id,
  task_id,
  porter_id,
  time_received,
  time_allocated,
  time_completed,
  status,
  created_at,
  updated_at
)
SELECT
  'f6a7b8c9-d0e1-9f0a-3b2c-456789012345',
  t.id,
  s.id,
  NOW() - INTERVAL '90 minutes',
  NOW() - INTERVAL '89 minutes',
  NOW() - INTERVAL '60 minutes',
  'completed',
  NOW() - INTERVAL '90 minutes',
  NOW() - INTERVAL '60 minutes'
FROM tasks t, staff s
WHERE s.type = 'porter' AND EXISTS (
  SELECT 1 FROM shift_porters sp 
  WHERE sp.shift_id = 'f6a7b8c9-d0e1-9f0a-3b2c-456789012345' AND sp.porter_id = s.id
)
LIMIT 1;

-- Create some tasks for the completed shift (all completed)
INSERT INTO shift_tasks (
  shift_id,
  task_id,
  porter_id,
  time_received,
  time_allocated,
  time_completed,
  status,
  created_at,
  updated_at
)
SELECT
  'a7b8c9d0-e1f2-0a1b-4c3d-567890123456',
  t.id,
  s.id,
  NOW() - INTERVAL '10 hours',
  NOW() - INTERVAL '9 hours 59 minutes',
  NOW() - INTERVAL '9 hours',
  'completed',
  NOW() - INTERVAL '10 hours',
  NOW() - INTERVAL '9 hours'
FROM tasks t, staff s
WHERE s.type = 'porter' AND EXISTS (
  SELECT 1 FROM shift_porters sp 
  WHERE sp.shift_id = 'a7b8c9d0-e1f2-0a1b-4c3d-567890123456' AND sp.porter_id = s.id
)
LIMIT 3;
