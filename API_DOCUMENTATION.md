# Matokeo API Documentation

Complete API reference for frontend integration. All endpoints use **localhost** for development.

**Base URL:** `http://localhost:8000`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Teacher Endpoints](#teacher-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Error Handling](#error-handling)
5. [Data Models](#data-models)

---

## Authentication

All protected endpoints require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your-token-here>
```

### POST `/auth/register`

Register a new teacher account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "teacher@example.com",
  "password": "secret123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "teacher@example.com",
    "role": "TEACHER"
  },
  "token": "abc123xyz..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing fields or email already exists
- `400 Bad Request` - Invalid email format

---

### POST `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "teacher@example.com",
  "password": "secret123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "teacher@example.com",
    "role": "TEACHER"
  },
  "token": "abc123xyz..."
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid email or password

---

### GET `/auth/me`

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "teacher@example.com",
  "role": "TEACHER"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token

---

## Teacher Endpoints

All teacher endpoints require authentication. The token must belong to a user with role `TEACHER` (or `ADMIN`).

---

### Classes & Dashboard

#### GET `/classes`

List all classes for the authenticated teacher.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Form 4A",
    "studentCount": 10,
    "subjectCount": 5
  },
  {
    "id": 2,
    "name": "Form 3B",
    "studentCount": 8,
    "subjectCount": 4
  }
]
```

---

#### POST `/classes`

Create a new class.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Form 4A"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Form 4A"
}
```

**Error Responses:**
- `400 Bad Request` - Missing `name` field
- `401 Unauthorized` - Invalid or missing token

---

#### GET `/classes/:classId`

Get full class workspace with all students, subjects, grade rules, and marks.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Form 4A",
  "students": [
    {
      "id": 1,
      "name": "Amina Hassan",
      "gender": "Female"
    }
  ],
  "subjects": [
    {
      "id": 1,
      "name": "Mathematics"
    }
  ],
  "gradeRules": [
    {
      "id": 1,
      "fromMark": 80,
      "toMark": 100,
      "grade": "A",
      "points": 5,
      "remark": "Excellent"
    }
  ],
  "marks": [
    {
      "studentId": 1,
      "subjectId": 1,
      "mark": 85
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Class not found or doesn't belong to teacher
- `401 Unauthorized` - Invalid or missing token

---

#### GET `/dashboard/summary`

Get dashboard summary statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "totalClasses": 3,
  "totalStudents": 30,
  "totalSubjects": 12,
  "averagePerformance": 72.5,
  "performancePerClass": [
    {
      "classId": 1,
      "name": "Form 4A",
      "average": 75.3
    },
    {
      "classId": 2,
      "name": "Form 3B",
      "average": 69.1
    }
  ],
  "genderDistribution": {
    "Male": 14,
    "Female": 16
  }
}
```

---

### Students

#### POST `/classes/:classId/students`

Add a new student to a class.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Amina Hassan",
  "gender": "Female"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Amina Hassan",
  "gender": "Female"
}
```

**Error Responses:**
- `400 Bad Request` - Missing `name` or `gender` field
- `400 Bad Request` - Invalid gender (must be "Male" or "Female")
- `404 Not Found` - Class not found or doesn't belong to teacher

---

#### DELETE `/classes/:classId/students/:studentId`

Delete a student from a class. This will also delete all marks for this student in this class.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
- `404 Not Found` - Student or class not found
- `403 Forbidden` - Student doesn't belong to this class

---

### Subjects

#### POST `/classes/:classId/subjects`

Add a new subject to a class.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Physics"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Physics"
}
```

**Error Responses:**
- `400 Bad Request` - Missing `name` field
- `404 Not Found` - Class not found or doesn't belong to teacher

---

#### DELETE `/classes/:classId/subjects/:subjectId`

Delete a subject from a class. This will also delete all marks for this subject in this class.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
- `404 Not Found` - Subject or class not found
- `403 Forbidden` - Subject doesn't belong to this class

---

### Grade Rules

#### GET `/classes/:classId/grades`

Get all grade rules for a class.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "fromMark": 80,
    "toMark": 100,
    "grade": "A",
    "points": 5,
    "remark": "Excellent"
  },
  {
    "id": 2,
    "fromMark": 70,
    "toMark": 79,
    "grade": "B",
    "points": 4,
    "remark": "Very Good"
  }
]
```

---

#### PUT `/classes/:classId/grades`

Replace all grade rules for a class. The server validates:
- All marks must be between 0-100
- `fromMark` must be <= `toMark`
- Ranges must not overlap

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
[
  {
    "id": 1,
    "fromMark": 80,
    "toMark": 100,
    "grade": "A",
    "points": 5,
    "remark": "Excellent"
  },
  {
    "id": 2,
    "fromMark": 70,
    "toMark": 79,
    "grade": "B",
    "points": 4,
    "remark": "Very Good"
  }
]
```

**Response (200 OK):**
```json
{
  "gradeRules": [
    {
      "id": 1,
      "fromMark": 80,
      "toMark": 100,
      "grade": "A",
      "points": 5,
      "remark": "Excellent"
    },
    {
      "id": 2,
      "fromMark": 70,
      "toMark": 79,
      "grade": "B",
      "points": 4,
      "remark": "Very Good"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Invalid grade rules (overlapping ranges, out of bounds, etc.)
- `400 Bad Request` - Missing required fields
- `404 Not Found` - Class not found

---

### Marks

#### PUT `/classes/:classId/marks`

Create or update a single mark. If a mark for this student+subject combination exists, it will be updated. Otherwise, a new mark will be created.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "studentId": 1,
  "subjectId": 1,
  "mark": 85
}
```

**Response (200 OK):**
```json
{
  "studentId": 1,
  "subjectId": 1,
  "mark": 85
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `400 Bad Request` - Invalid mark value
- `404 Not Found` - Student or subject not found in this class

---

#### PUT `/classes/:classId/marks/bulk`

Create or update multiple marks at once.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "marks": [
    {
      "studentId": 1,
      "subjectId": 1,
      "mark": 85
    },
    {
      "studentId": 1,
      "subjectId": 2,
      "mark": 78
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "marks": [
    {
      "studentId": 1,
      "subjectId": 1,
      "mark": 85
    },
    {
      "studentId": 1,
      "subjectId": 2,
      "mark": 78
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Missing `marks` array or invalid data
- `404 Not Found` - Student or subject not found in this class

---

### Results

#### GET `/classes/:classId/results/overall?gender=all|Male|Female`

Get overall results (ranking by total marks/average) for all students in a class.

**Query Parameters:**
- `gender` (optional): Filter by gender. Default: `all`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "position": 1,
      "student": {
        "id": 1,
        "name": "Amina Hassan",
        "gender": "Female"
      },
      "totalMarks": 420,
      "average": 84.0,
      "overallGrade": "A",
      "remark": "Excellent"
    },
    {
      "position": 2,
      "student": {
        "id": 2,
        "name": "John Smith",
        "gender": "Male"
      },
      "totalMarks": 380,
      "average": 76.0,
      "overallGrade": "B",
      "remark": "Very Good"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Class not found
- `400 Bad Request` - Invalid gender filter

---

#### GET `/classes/:classId/results/subject/:subjectId?gender=all|Male|Female`

Get subject-specific results (ranking by mark in that subject).

**Query Parameters:**
- `gender` (optional): Filter by gender. Default: `all`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "position": 1,
      "student": {
        "id": 1,
        "name": "Amina Hassan",
        "gender": "Female"
      },
      "mark": 92,
      "grade": "A",
      "remark": "Excellent"
    },
    {
      "position": 2,
      "student": {
        "id": 2,
        "name": "John Smith",
        "gender": "Male"
      },
      "mark": 85,
      "grade": "A",
      "remark": "Excellent"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Class or subject not found
- `400 Bad Request` - Invalid gender filter

---

### Export

#### POST `/classes/:classId/export`

Generate export file (Excel or PDF) for class results.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "excel"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "type": "excel",
  "url": "https://example.com/exports/class-1-results.xlsx"
}
```

**Note:** Currently returns a placeholder URL. File generation can be implemented later.

**Error Responses:**
- `400 Bad Request` - Invalid type (must be "excel" or "pdf")
- `404 Not Found` - Class not found

---

## Admin Endpoints

Admin endpoints require authentication with a user that has role `ADMIN`.

---

### GET `/admin-api/users`

List all users in the system.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "teacher@example.com",
    "role": "TEACHER",
    "dateJoined": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN",
    "dateJoined": "2024-01-10T08:00:00Z"
  }
]
```

**Error Responses:**
- `403 Forbidden` - User is not an admin
- `401 Unauthorized` - Invalid or missing token

---

### GET `/admin-api/activity`

Get activity log of all user operations (up to 500 most recent entries).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "teacher@example.com"
    },
    "action": "CREATE_CLASS",
    "description": "Created class: Form 4A",
    "createdAt": "2024-01-20T14:30:00Z"
  },
  {
    "id": 2,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "teacher@example.com"
    },
    "action": "ADD_STUDENT",
    "description": "Added student: Amina Hassan to class Form 4A",
    "createdAt": "2024-01-20T15:00:00Z"
  }
]
```

**Error Responses:**
- `403 Forbidden` - User is not an admin
- `401 Unauthorized` - Invalid or missing token

---

### GET `/admin/classes`

List all classes across all teachers.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Form 4A",
    "teacher": {
      "id": 1,
      "name": "John Doe",
      "email": "teacher@example.com"
    },
    "studentCount": 10,
    "subjectCount": 5
  },
  {
    "id": 2,
    "name": "Form 3B",
    "teacher": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "studentCount": 8,
    "subjectCount": 4
  }
]
```

**Error Responses:**
- `403 Forbidden` - User is not an admin
- `401 Unauthorized` - Invalid or missing token

---

## Error Handling

All endpoints return JSON responses. Error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request data or validation error
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User doesn't have permission (e.g., not an admin)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Common Error Scenarios

1. **Missing Token:**
   ```json
   {
     "error": "Authentication required"
   }
   ```

2. **Invalid Token:**
   ```json
   {
     "error": "Invalid or expired token"
   }
   ```

3. **Not Admin:**
   ```json
   {
     "error": "Admin access required"
   }
   ```

4. **Resource Not Found:**
   ```json
   {
     "error": "Class not found"
   }
   ```

5. **Validation Error:**
   ```json
   {
     "error": "Grade rules have overlapping ranges"
   }
   ```

---

## Data Models

### User
```typescript
{
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER";
}
```

### Class (Lightweight)
```typescript
{
  id: number;
  name: string;
  studentCount: number;
  subjectCount: number;
}
```

### Class (Full)
```typescript
{
  id: number;
  name: string;
  students: Student[];
  subjects: Subject[];
  gradeRules: GradeRule[];
  marks: Mark[];
}
```

### Student
```typescript
{
  id: number;
  name: string;
  gender: "Male" | "Female";
}
```

### Subject
```typescript
{
  id: number;
  name: string;
}
```

### GradeRule
```typescript
{
  id: number;
  fromMark: number;  // 0-100
  toMark: number;    // 0-100
  grade: string;     // e.g., "A", "B", "C"
  points: number;
  remark: string;
}
```

### Mark
```typescript
{
  studentId: number;
  subjectId: number;
  mark: number;  // 0-100
}
```

### Overall Result
```typescript
{
  position: number;
  student: Student;
  totalMarks: number;
  average: number;
  overallGrade: string;
  remark: string;
}
```

### Subject Result
```typescript
{
  position: number;
  student: Student;
  mark: number;
  grade: string;
  remark: string;
}
```

---

## Integration Tips

1. **Store Token:** After login/register, store the token in localStorage or your state management:
   ```javascript
   localStorage.setItem('token', response.token);
   ```

2. **Add to Requests:** Include the token in all protected requests:
   ```javascript
   fetch('http://localhost:8000/classes', {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   });
   ```

3. **Handle 401:** If you get a 401, redirect to login:
   ```javascript
   if (response.status === 401) {
     localStorage.removeItem('token');
     router.push('/login');
   }
   ```

4. **Check on App Load:** Call `/auth/me` on app initialization to verify token and get user info.

5. **Error Handling:** Always check response status and parse error messages from the `error` field.

---

## Quick Start Example

```javascript
// 1. Register/Login
const response = await fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'teacher@example.com',
    password: 'secret123'
  })
});

const { user, token } = await response.json();
localStorage.setItem('token', token);

// 2. Get Classes
const classesResponse = await fetch('http://localhost:8000/classes', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const classes = await classesResponse.json();

// 3. Get Full Class Details
const classResponse = await fetch(`http://localhost:8000/classes/${classes[0].id}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const classData = await classResponse.json();
```

---

**Base URL:** `http://localhost:8000`

For questions or issues, contact the backend team.
