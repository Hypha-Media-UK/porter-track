# Porter Track Application

A Vue.js application for hospital porters to track tasks throughout their shifts.

## Project Setup

```sh
npm install
```

### Environment Variables

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

### Database Setup

Before using the application, you need to set up the database in Supabase:

1. Log in to your Supabase project
2. Go to the SQL Editor
3. Create the database schema by running the SQL from `database/schema.sql`
4. Seed the database with initial data by running the SQL from `database/seed.sql`

### Development Server

```sh
npm run dev
```

## Project Structure

- `src/components/` - Reusable Vue components
  - `common/` - Common UI components
  - `buildings/` - Building-related components
  - `departments/` - Department-related components
  - `tasks/` - Task-related components
  - `task-items/` - Task item-related components
- `src/views/` - Page components
- `src/stores/` - Pinia stores for state management
- `src/services/` - Services for external API communication
- `src/router/` - Vue router configuration
- `database/` - SQL files for database setup

## Features

- Manage buildings and departments
- Create and assign tasks with detailed task items
- Associate tasks with specific departments
- Mobile-optimized UI with Vuetify
