# Backend Integration Guide for `matokeo.co.tz`

This document is for a **backend developer** who will build APIs for the existing **frontend-only Next.js prototype**.

The frontend is already fully interactive using mock data and `localStorage`. Your job is to provide real endpoints that match the current data shapes and behavior so we can later swap the mock layer for real APIs.

---

## 1. Scope & Expectations

- **Single role**: Teacher only (no student/admin portals).
- **Responsibility**: Implement secure, well-documented JSON APIs.
- **Frontend**: Next.js 16, React, TypeScript, Tailwind — already built.
- **Your deliverable**: A backend service (any stack) that exposes the endpoints listed below.

You are free to choose the backend stack: Node (Express/Nest), Laravel, Django, Rails, Go, etc.

---

## 2. Core Data Models (Reference)

These are the shapes the frontend currently uses (defined in `lib/mockData.ts`).

### 2.1 Teacher (User)

```json
{
  "id": "user-1",
  "name": "John Doe",
  "email": "teacher@example.com"
}
```

### 2.2 Class

```json
{
  "id": "class-1",
  "name": "Form 4A",
  "students": [/* Student[] */],
  "subjects": [/* Subject[] */],
  "gradeRules": [/* GradeRule[] */],
  "marks": [/* Mark[] */]
}
```

### 2.3 Student

```json
{
  "id": "s1",
  "name": "Amina Hassan",
  "gender": "Female"
}
```

### 2.4 Subject

```json
{
  "id": "sub1",
  "name": "Mathematics"
}
```

### 2.5 GradeRule (per class)

```json
{
  "id": "g1",
  "fromMark": 80,
  "toMark": 100,
  "grade": "A",
  "points": 5,
  "remark": "Excellent"
}
```

### 2.6 Mark

```json
{
  "studentId": "s1",
  "subjectId": "sub1",
  "mark": 85
}
```

---

## 3. Authentication APIs

You can use sessions or JWT; the frontend just needs a token plus basic user info.

### POST `/auth/register`

**Request**

```json
{
  "name": "John Doe",
  "email": "teacher@example.com",
  "password": "secret123"
}
```

**Response**

```json
{
  "user": {
    "id": "user-1",
    "name": "John Doe",
    "email": "teacher@example.com"
  },
  "token": "JWT_OR_SESSION_TOKEN"
}
```

---

### POST `/auth/login`

**Request**

```json
{
  "email": "teacher@example.com",
  "password": "secret123"
}
```

**Response**

Same as `/auth/register`.

---

### GET `/auth/me`

**Auth**: required (e.g. `Authorization: Bearer <token>`).

**Response**

```json
{
  "id": "user-1",
  "name": "John Doe",
  "email": "teacher@example.com"
}
```

---

## 4. Classes & Dashboard

### GET `/classes`

List all classes for the authenticated teacher.

**Response (lightweight)**

```json
[
  {
    "id": "class-1",
    "name": "Form 4A",
    "studentCount": 10,
    "subjectCount": 5
  }
]
```

> Frontend will call `/classes/:classId` for full detail.

---

### POST `/classes`

Create a new class.

**Request**

```json
{
  "name": "Form 4A"
}
```

**Response**

```json
{
  "id": "class-123",
  "name": "Form 4A"
}
```

---

### GET `/classes/:classId`

Returns the **full class workspace payload**.

**Response**

```json
{
  "id": "class-1",
  "name": "Form 4A",
  "students": [/* Student[] */],
  "subjects": [/* Subject[] */],
  "gradeRules": [/* GradeRule[] */],
  "marks": [/* Mark[] */]
}
```

---

### GET `/dashboard/summary` (optional but recommended)

You can compute these on the backend to keep the frontend simple.

**Response**

```json
{
  "totalClasses": 3,
  "totalStudents": 30,
  "totalSubjects": 12,
  "averagePerformance": 72.5,
  "performancePerClass": [
    { "classId": "class-1", "name": "Form 4A", "average": 75.3 },
    { "classId": "class-2", "name": "Form 3B", "average": 69.1 }
  ],
  "genderDistribution": {
    "Male": 14,
    "Female": 16
  }
}
```

---

## 5. Students APIs

### POST `/classes/:classId/students`

**Request**

```json
{
  "name": "Amina Hassan",
  "gender": "Female"
}
```

**Response**

```json
{
  "id": "s123",
  "name": "Amina Hassan",
  "gender": "Female"
}
```

---

### DELETE `/classes/:classId/students/:studentId`

Behavior:
- Delete the student.
- Cascade delete that student's marks in this class.

**Response**

```json
{ "success": true }
```

---

## 6. Subjects APIs

### POST `/classes/:classId/subjects`

**Request**

```json
{
  "name": "Physics"
}
```

**Response**

```json
{
  "id": "sub123",
  "name": "Physics"
}
```

---

### DELETE `/classes/:classId/subjects/:subjectId`

Behavior:
- Delete subject.
- Cascade delete marks for that subject in this class.

**Response**

```json
{ "success": true }
```

---

## 7. Grade Rules APIs

### GET `/classes/:classId/grades`

**Response**

```json
[
  {
    "id": "g1",
    "fromMark": 80,
    "toMark": 100,
    "grade": "A",
    "points": 5,
    "remark": "Excellent"
  }
]
```

---

### PUT `/classes/:classId/grades`

Replace the full set of grade rules for a class.

**Request**

```json
[
  { "id": "g1", "fromMark": 80, "toMark": 100, "grade": "A", "points": 5, "remark": "Excellent" },
  { "id": "g2", "fromMark": 70, "toMark": 79, "grade": "B", "points": 4, "remark": "Very Good" }
]
```

**Server-side validation**

- Ranges must be within `0–100`.
- Ranges must **not overlap**:
  - For any two rules A and B, ensure `A.toMark < B.fromMark` or vice versa.

**Response**

```json
{
  "gradeRules": [/* validated GradeRule[] */]
}
```

Return appropriate error messages if validation fails.

---

## 8. Marks APIs

The UI updates marks **per cell**, so a simple upsert endpoint is fine.

### PUT `/classes/:classId/marks`

**Request**

```json
{
  "studentId": "s1",
  "subjectId": "sub1",
  "mark": 85
}
```

Behavior:
- If a row with `(studentId, subjectId)` exists → update.
- Else → insert.

**Response**

```json
{
  "studentId": "s1",
  "subjectId": "sub1",
  "mark": 85
}
```

---

### PUT `/classes/:classId/marks/bulk` (optional)

If you prefer bulk updates:

**Request**

```json
{
  "marks": [
    { "studentId": "s1", "subjectId": "sub1", "mark": 85 },
    { "studentId": "s1", "subjectId": "sub2", "mark": 78 }
  ]
}
```

**Response**

```json
{
  "marks": [/* updated Mark[] */]
}
```

---

## 9. Results APIs (Ranking & Grades)

The frontend can compute rankings itself, but having backend endpoints makes it easier to keep logic centralized.

### 9.1 Overall Results

`GET /classes/:classId/results/overall?gender=all|Male|Female`

**Response**

```json
{
  "results": [
    {
      "position": 1,
      "student": { "id": "s1", "name": "Amina Hassan", "gender": "Female" },
      "totalMarks": 420,
      "average": 84.0,
      "overallGrade": "A",
      "remark": "Excellent"
    }
  ]
}
```

You calculate:
- Total marks across all subjects.
- Average mark.
- Overall grade & remark using the class grade rules.
- Position based on average (descending).

---

### 9.2 Subject Results

`GET /classes/:classId/results/subject/:subjectId?gender=all|Male|Female`

**Response**

```json
{
  "results": [
    {
      "position": 1,
      "student": { "id": "s1", "name": "Amina Hassan", "gender": "Female" },
      "mark": 92,
      "grade": "A",
      "remark": "Excellent"
    }
  ]
}
```

Positions are based on `mark` (descending).

---

## 10. Export APIs

UI already simulates export; you just need to provide a real endpoint to plug in later.

### POST `/classes/:classId/export`

**Request**

```json
{
  "type": "excel"  // or "pdf"
}
```

**Response (proposal)**

```json
{
  "status": "success",
  "type": "excel",
  "url": "https://your-storage.com/exports/class-1-results.xlsx"
}
```

The frontend will:
- Show a success toast.
- Optionally open/download the URL.

---

## 11. Integration Notes for the Frontend Team

When your APIs are ready, the frontend will:

- Replace `localStorage` reads/writes in `contexts/AppContext.tsx` with API calls.
- On login/register:
  - Call `/auth/login` or `/auth/register`.
  - Store the returned token and teacher object.
- On app load:
  - Call `/auth/me` to rehydrate the session.
- On dashboard:
  - Call `/dashboard/summary` and/or `/classes`.
- On class workspace:
  - Call `/classes/:classId` once, then keep data in React Context.
- On any mutation (add student, add subject, update mark, update grade rules, etc.):
  - Call the relevant endpoint.
  - Update local frontend state using the API response.

If you keep the response shapes compatible with the interfaces above, the integration will be straightforward.

---

## 12. Non‑Goals (Backend)

You **do not** need to implement:

- School-wide admin features.
- Multi-role permissions (only Teacher).
- File uploads for Excel imports.
- Payments or billing.
- Student login portal.

Focus only on powering the teacher’s results workflow: **classes → students/subjects → grades → marks → results → export**.

