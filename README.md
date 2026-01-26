# Matokeo - Teacher Results Management Tool

A fully interactive frontend-only prototype for managing student results, built with Next.js, React, and Tailwind CSS.

## Features

### Authentication
- Login and Register pages (UI only, uses localStorage)
- Fake authentication that accepts any credentials

### Dashboard
- Overview cards showing:
  - Total Classes
  - Total Students
  - Total Subjects
  - Overall Average Performance
- Performance charts:
  - Performance per class
  - Gender distribution

### Classes Management
- View all classes in a card-based layout
- Create new classes
- Each class shows:
  - Number of students
  - Number of subjects

### Class Workspace
Each class has a comprehensive workspace with 6 tabs:

#### 1. Students Tab
- Add new students (name, gender)
- List all students in a table
- Delete students
- Import Excel button (UI only)

#### 2. Subjects Tab
- Add new subjects
- List all subjects
- Delete subjects

#### 3. Grades Tab
- Define grading rules per class
- Configure:
  - Mark ranges (From/To)
  - Grade letters
  - Points
  - Remarks
- Prevent overlapping ranges
- Preview grade for any mark

#### 4. Marks Tab
- Spreadsheet-style interface
- Rows: Students
- Columns: Subjects
- Input marks (0-100)
- Auto-calculate grades based on rules
- Real-time updates

#### 5. Results Tab
- Overall Results:
  - Position ranking
  - Total marks
  - Average percentage
  - Overall grade
  - Remarks
  - Highlight top 3 students
- Subject-specific results
- Gender filtering
- Sorting by performance

#### 6. Export Tab
- Export to Excel (UI simulation)
- Export to PDF (UI simulation)
- Preview modal
- Success notifications

## Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **localStorage** - Data persistence (frontend only)

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo Data

The application comes pre-loaded with realistic mock data:
- 3 classes (Form 4A, Form 3B, Form 2C)
- 8-15 students per class
- 3-5 subjects per class
- Pre-filled marks and grades
- Realistic grading rules

## Project Structure

```
matokeo/
├── app/
│   ├── login/          # Login page
│   ├── register/       # Register page
│   ├── dashboard/      # Dashboard page
│   ├── classes/        # Classes list and workspace
│   └── layout.tsx      # Root layout with AppProvider
├── components/
│   ├── Navbar.tsx      # Navigation bar
│   ├── ProtectedRoute.tsx  # Route protection
│   └── class-workspace/    # Class workspace tabs
├── contexts/
│   └── AppContext.tsx  # Global state management
└── lib/
    └── mockData.ts     # Mock data and types
```

## Notes

- This is a **frontend-only prototype**
- All data is stored in localStorage
- No backend integration
- Authentication is simulated
- Export functions are UI-only (no actual file generation)

## Future Enhancements

Ready for backend integration:
- Replace localStorage with API calls
- Implement real authentication
- Add actual file export functionality
- Add data persistence to database
