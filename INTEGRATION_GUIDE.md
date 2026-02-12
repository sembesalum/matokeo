# Backend API Integration Guide

This document explains how the frontend is integrated with the backend API.

## Configuration

The API base URL is configured in `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

To change the API URL, create a `.env.local` file in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Authentication

- **Token Storage**: JWT tokens are stored in `localStorage` under the key `matokeo_token`
- **Auto-redirect**: If a 401 error occurs, the user is automatically redirected to `/login`
- **Token Management**: The API client automatically includes the token in all requests via the `Authorization: Bearer <token>` header

## API Client

All API calls are handled through the centralized API client in `lib/api.ts`:

- `authAPI` - Authentication endpoints
- `classesAPI` - Class management
- `studentsAPI` - Student management
- `subjectsAPI` - Subject management
- `gradesAPI` - Grade rules management
- `marksAPI` - Marks entry
- `dashboardAPI` - Dashboard statistics
- `resultsAPI` - Results and rankings
- `exportAPI` - Export functionality

## State Management

The `AppContext` (`contexts/AppContext.tsx`) manages all application state and handles:

- User authentication state
- Classes data
- Loading states
- Error handling
- Automatic data refresh after mutations

## Key Integration Points

### 1. Login/Register
- Pages: `app/login/page.tsx`, `app/register/page.tsx`
- Uses: `authAPI.login()`, `authAPI.register()`
- On success: Token stored, user set in context, redirect to dashboard

### 2. Classes List
- Page: `app/classes/page.tsx`
- Uses: `classesAPI.getAll()` (via `loadClasses()` in context)
- Displays: Lightweight class list with student/subject counts

### 3. Class Workspace
- Page: `app/classes/[id]/page.tsx`
- Uses: `classesAPI.getById()` (via `loadClass()` in context)
- Loads: Full class data including students, subjects, grades, and marks

### 4. Students Tab
- Component: `components/class-workspace/StudentsTab.tsx`
- Uses: `studentsAPI.add()`, `studentsAPI.delete()`
- Auto-refreshes: Class data after add/delete operations

### 5. Subjects Tab
- Component: `components/class-workspace/SubjectsTab.tsx`
- Uses: `subjectsAPI.add()`, `subjectsAPI.delete()`
- Auto-refreshes: Class data after add/delete operations

### 6. Grades Tab
- Component: `components/class-workspace/GradesTab.tsx`
- Uses: `gradesAPI.get()`, `gradesAPI.update()`
- Updates: Grade rules in real-time as user edits

### 7. Marks Tab
- Component: `components/class-workspace/MarksTab.tsx`
- Uses: `marksAPI.update()`
- Updates: Marks optimistically (UI updates immediately, then syncs with server)

### 8. Results Tab
- Component: `components/class-workspace/ResultsTab.tsx`
- Uses: `resultsAPI.getOverall()`, `resultsAPI.getSubject()`
- Calculates: Rankings and grades based on marks and grade rules

## Error Handling

- **API Errors**: Displayed in a red banner at the top of protected routes
- **401 Errors**: Automatically redirect to login and clear token
- **Network Errors**: Caught and displayed to user
- **Validation Errors**: Shown in form fields or error messages

## Loading States

- **Initial Load**: Shows spinner while checking authentication
- **Data Fetching**: Context manages loading state
- **Button States**: Buttons show loading text during async operations

## Data Flow

1. User logs in → Token stored → User data in context
2. App loads → Check token → Load classes list
3. User opens class → Load full class data → Display in workspace
4. User makes changes → API call → Update local state → Refresh if needed
5. User logs out → Clear token → Clear state → Redirect to login

## Testing the Integration

1. **Start Backend**: Ensure backend is running on `http://localhost:8000`
2. **Start Frontend**: Run `npm run dev`
3. **Register/Login**: Create an account or login
4. **Create Class**: Add a new class
5. **Add Students**: Add students to the class
6. **Add Subjects**: Add subjects to the class
7. **Enter Marks**: Enter marks for students
8. **View Results**: Check rankings and grades

## Troubleshooting

### API Connection Issues
- Check that backend is running on the correct port
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check browser console for CORS errors

### Authentication Issues
- Clear localStorage: `localStorage.removeItem('matokeo_token')`
- Check token expiration
- Verify backend authentication endpoint

### Data Not Loading
- Check network tab in browser dev tools
- Verify API responses match expected format
- Check console for error messages

## Next Steps

- [ ] Add retry logic for failed requests
- [ ] Implement request caching
- [ ] Add offline support
- [ ] Optimize bulk operations
- [ ] Add request debouncing for frequent updates
