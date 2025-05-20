-- Seed data for buildings
INSERT INTO buildings (id, name)
VALUES
  ('b1f4f56c-0294-4bea-b519-0cefee23a379', 'Main Hospital'),
  ('a2c56e18-5d71-45fa-9ef2-a980c75b214e', 'Outpatient Center'),
  ('b9c7d3e7-bb3f-4e30-8c19-34ef4f2a1294', 'Research Building');

-- Seed data for departments
INSERT INTO departments (id, building_id, name, floor)
VALUES
  -- Main Hospital departments
  ('d1e9f45c-9b32-4256-9a0d-3af4e7b9f722', 'b1f4f56c-0294-4bea-b519-0cefee23a379', 'Emergency Department', 'Ground Floor'),
  ('c2f8b34d-1e33-412e-8e70-49a8c7b0f641', 'b1f4f56c-0294-4bea-b519-0cefee23a379', 'Surgery', '2nd Floor'),
  ('a5b6c7d8-e9f0-4321-5678-9abcdef01234', 'b1f4f56c-0294-4bea-b519-0cefee23a379', 'ICU', '3rd Floor'),
  ('f5e4d3c2-b1a0-8765-5432-1fedcba09876', 'b1f4f56c-0294-4bea-b519-0cefee23a379', 'Radiology', '1st Floor'),
  
  -- Outpatient Center departments
  ('d5e6f7a8-b9c0-12d3-e4f5-a678910bcd12', 'a2c56e18-5d71-45fa-9ef2-a980c75b214e', 'General Medicine', '1st Floor'),
  ('a9b8c7d6-e5f4-a3b2-c1d0-e9f8a7b6c5d4', 'a2c56e18-5d71-45fa-9ef2-a980c75b214e', 'Pediatrics', '2nd Floor'),
  ('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'a2c56e18-5d71-45fa-9ef2-a980c75b214e', 'Orthopedics', '1st Floor'),
  
  -- Research Building departments
  ('f6e5d4c3-b2a1-10f9-e8d7-c6b5a4d3c2b1', 'b9c7d3e7-bb3f-4e30-8c19-34ef4f2a1294', 'Clinical Trials', '3rd Floor'),
  ('e9d8c7b6-a5f4-e3d2-c1b0-a9f8e7d6c5b4', 'b9c7d3e7-bb3f-4e30-8c19-34ef4f2a1294', 'Laboratory', '2nd Floor');

-- Seed data for tasks
INSERT INTO tasks (id, name, description, estimated_duration)
VALUES
  ('51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6', 'Patient Transport', 'Transport patients between departments or for discharge', 30),
  ('62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7', 'Equipment Delivery', 'Deliver medical equipment to requesting departments', 20),
  ('73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8', 'Specimen Collection', 'Collect and transport specimens to the laboratory', 15),
  ('84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9', 'Medication Delivery', 'Deliver medications from pharmacy to departments', 25),
  ('95e6f7a8-b9c0-81d2-e3f4-a5b6c7d8e9f0', 'Linen Delivery', 'Deliver clean linens to departments', 30),
  ('a6f7a8b9-c0d1-92e3-f4a5-b6c7d8e9f0a1', 'Waste Collection', 'Collect and dispose of waste from departments', 40),
  ('b7a8b9c0-d1e2-a3f4-a5b6-c7d8e9f0a1b2', 'Emergency Response', 'Respond to emergency calls for assistance', 15),
  ('c8b9c0d1-e2f3-b4a5-b6c7-d8e9f0a1b2c3', 'General Maintenance Tasks', 'Assist with general maintenance tasks around the hospital', 60);

-- Seed data for task items
INSERT INTO task_items (id, task_id, name, description, order_index)
VALUES
  -- Patient Transport task items
  ('d1e2f3a4-b5c6-d7e8-f9a0-b1c2d3e4f5a6', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6', 'Check patient ID', 'Verify patient identity against transport order', 0),
  ('e2f3a4b5-c6d7-e8f9-a0b1-c2d3e4f5a6b7', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6', 'Prepare wheelchair/stretcher', 'Ensure appropriate transport equipment is ready', 1),
  ('f3a4b5c6-d7e8-f9a0-b1c2-d3e4f5a6b7c8', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6', 'Transfer patient', 'Safely transfer patient to wheelchair/stretcher', 2),
  ('a4b5c6d7-e8f9-a0b1-c2d3-e4f5a6b7c8d9', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6', 'Transport to destination', 'Safely move patient to the destination department', 3),
  ('b5c6d7e8-f9a0-b1c2-d3e4-f5a6b7c8d9e0', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6', 'Handover patient', 'Properly hand over the patient to the receiving staff', 4),
  
  -- Equipment Delivery task items
  ('c6d7e8f9-a0b1-c2d3-e4f5-a6b7c8d9e0f1', '62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7', 'Collect equipment', 'Collect the requested equipment from the storage area', 0),
  ('d7e8f9a0-b1c2-d3e4-f5a6-b7c8d9e0f1a2', '62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7', 'Verify equipment', 'Check that the equipment is in good working condition', 1),
  ('e8f9a0b1-c2d3-e4f5-a6b7-c8d9e0f1a2b3', '62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7', 'Deliver to department', 'Transport equipment to the requesting department', 2),
  ('f9a0b1c2-d3e4-f5a6-b7c8-d9e0f1a2b3c4', '62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7', 'Get confirmation', 'Obtain confirmation of delivery from department staff', 3),
  
  -- Specimen Collection task items
  ('a0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d5', '73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8', 'Pick up container', 'Collect specimen container from the department', 0),
  ('b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6', '73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8', 'Verify specimen details', 'Check that the specimen is properly labeled', 1),
  ('c2d3e4f5-a6b7-c8d9-e0f1-a2b3c4d5e6f7', '73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8', 'Transport to lab', 'Deliver specimen to the laboratory', 2),
  ('d3e4f5a6-b7c8-d9e0-f1a2-b3c4d5e6f7a8', '73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8', 'Log delivery', 'Record the specimen delivery in the system', 3),
  
  -- Medication Delivery task items
  ('e4f5a6b7-c8d9-e0f1-a2b3-c4d5e6f7a8b9', '84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9', 'Collect from pharmacy', 'Pick up medications from the pharmacy', 0),
  ('f5a6b7c8-d9e0-f1a2-b3c4-d5e6f7a8b9c0', '84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9', 'Verify medication orders', 'Check that medications match the order', 1),
  ('a6b7c8d9-e0f1-a2b3-c4d5-e6f7a8b9c0d1', '84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9', 'Deliver to nurse station', 'Transport medications to the department nurse station', 2),
  ('b7c8d9e0-f1a2-b3c4-d5e6-f7a8b9c0d1e2', '84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9', 'Get signature', 'Obtain signature from receiving nurse', 3);

-- Seed data for department-task associations
INSERT INTO department_tasks (department_id, task_id)
VALUES
  -- Emergency Department tasks
  ('d1e9f45c-9b32-4256-9a0d-3af4e7b9f722', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6'),
  ('d1e9f45c-9b32-4256-9a0d-3af4e7b9f722', '62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7'),
  ('d1e9f45c-9b32-4256-9a0d-3af4e7b9f722', '73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8'),
  ('d1e9f45c-9b32-4256-9a0d-3af4e7b9f722', '84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9'),
  ('d1e9f45c-9b32-4256-9a0d-3af4e7b9f722', 'b7a8b9c0-d1e2-a3f4-a5b6-c7d8e9f0a1b2'),
  
  -- Surgery tasks
  ('c2f8b34d-1e33-412e-8e70-49a8c7b0f641', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6'),
  ('c2f8b34d-1e33-412e-8e70-49a8c7b0f641', '62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7'),
  ('c2f8b34d-1e33-412e-8e70-49a8c7b0f641', '73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8'),
  ('c2f8b34d-1e33-412e-8e70-49a8c7b0f641', '95e6f7a8-b9c0-81d2-e3f4-a5b6c7d8e9f0'),
  
  -- ICU tasks
  ('a5b6c7d8-e9f0-4321-5678-9abcdef01234', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6'),
  ('a5b6c7d8-e9f0-4321-5678-9abcdef01234', '62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7'),
  ('a5b6c7d8-e9f0-4321-5678-9abcdef01234', '84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9'),
  ('a5b6c7d8-e9f0-4321-5678-9abcdef01234', '95e6f7a8-b9c0-81d2-e3f4-a5b6c7d8e9f0'),
  
  -- Radiology tasks
  ('f5e4d3c2-b1a0-8765-5432-1fedcba09876', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6'),
  ('f5e4d3c2-b1a0-8765-5432-1fedcba09876', '62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7'),
  ('f5e4d3c2-b1a0-8765-5432-1fedcba09876', 'a6f7a8b9-c0d1-92e3-f4a5-b6c7d8e9f0a1'),
  
  -- General Medicine tasks
  ('d5e6f7a8-b9c0-12d3-e4f5-a678910bcd12', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6'),
  ('d5e6f7a8-b9c0-12d3-e4f5-a678910bcd12', '73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8'),
  ('d5e6f7a8-b9c0-12d3-e4f5-a678910bcd12', '84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9'),
  ('d5e6f7a8-b9c0-12d3-e4f5-a678910bcd12', '95e6f7a8-b9c0-81d2-e3f4-a5b6c7d8e9f0'),
  
  -- Pediatrics tasks
  ('a9b8c7d6-e5f4-a3b2-c1d0-e9f8a7b6c5d4', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6'),
  ('a9b8c7d6-e5f4-a3b2-c1d0-e9f8a7b6c5d4', '84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9'),
  ('a9b8c7d6-e5f4-a3b2-c1d0-e9f8a7b6c5d4', '95e6f7a8-b9c0-81d2-e3f4-a5b6c7d8e9f0'),
  
  -- Orthopedics tasks
  ('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', '51a2b3c4-d5e6-47a8-b9c0-d1e2f3a4b5c6'),
  ('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', '62b3c4d5-e6f7-58a9-b0c1-d2e3f4a5b6c7'),
  ('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'c8b9c0d1-e2f3-b4a5-b6c7-d8e9f0a1b2c3'),
  
  -- Clinical Trials tasks
  ('f6e5d4c3-b2a1-10f9-e8d7-c6b5a4d3c2b1', '73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8'),
  ('f6e5d4c3-b2a1-10f9-e8d7-c6b5a4d3c2b1', '84d5e6f7-a8b9-70c1-d2e3-f4a5b6c7d8e9'),
  
  -- Laboratory tasks
  ('e9d8c7b6-a5f4-e3d2-c1b0-a9f8e7d6c5b4', '73c4d5e6-f7a8-69b0-c1d2-e3f4a5b6c7d8'),
  ('e9d8c7b6-a5f4-e3d2-c1b0-a9f8e7d6c5b4', 'a6f7a8b9-c0d1-92e3-f4a5-b6c7d8e9f0a1'),
  ('e9d8c7b6-a5f4-e3d2-c1b0-a9f8e7d6c5b4', 'c8b9c0d1-e2f3-b4a5-b6c7-d8e9f0a1b2c3');
