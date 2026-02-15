const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://levelstechpro.pythonanywhere.com';

// Get token from localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('matokeo_token');
}

// Set token in localStorage
function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('matokeo_token', token);
}

// Remove token from localStorage
function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('matokeo_token');
}

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers && typeof options.headers === 'object' && !Array.isArray(options.headers) && !(options.headers instanceof Headers)
      ? (options.headers as Record<string, string>)
      : {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - redirect to login
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  async register(name: string, email: string, password: string) {
    const data = await apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setToken(data.token);
    return data;
  },

  async login(email: string, password: string) {
    const data = await apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  async getMe() {
    return apiRequest<any>('/auth/me');
  },

  logout() {
    removeToken();
  },
};

// Normalize class list item (API may return snake_case or wrapper)
function normalizeClassListItem(c: any): any {
  if (!c || typeof c !== 'object') return c;
  return {
    id: c.id,
    name: c.name ?? c.class_name ?? '',
    studentCount: c.studentCount ?? c.student_count ?? 0,
    subjectCount: c.subject_count ?? c.subjectCount ?? 0,
    students: c.students ?? [],
    subjects: c.subjects ?? [],
    gradeRules: c.gradeRules ?? c.grade_rules ?? [],
    marks: c.marks ?? [],
  };
}

// Normalize full class detail (API may return snake_case)
function normalizeClassDetail(c: any): any {
  if (!c || typeof c !== 'object') return c;
  return {
    id: c.id,
    name: c.name ?? c.class_name ?? '',
    studentCount: c.studentCount ?? c.student_count ?? 0,
    subjectCount: c.subject_count ?? c.subjectCount ?? 0,
    students: Array.isArray(c.students) ? c.students : [],
    subjects: Array.isArray(c.subjects) ? c.subjects : [],
    gradeRules: Array.isArray(c.gradeRules) ? c.gradeRules : (Array.isArray(c.grade_rules) ? c.grade_rules : []),
    marks: Array.isArray(c.marks) ? c.marks : [],
  };
}

// Classes API
export const classesAPI = {
  async getAll() {
    const raw = await apiRequest<any>('/classes');
    const list = Array.isArray(raw) ? raw : (raw?.classes ?? raw?.data ?? []);
    return (Array.isArray(list) ? list : []).map(normalizeClassListItem);
  },

  async getById(classId: string | number) {
    const raw = await apiRequest<any>(`/classes/${classId}`);
    return normalizeClassDetail(raw);
  },

  async create(name: string) {
    return apiRequest<{ id: number; name: string }>('/classes', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
};

// Students API
export const studentsAPI = {
  async add(classId: string | number, name: string, gender: 'Male' | 'Female') {
    return apiRequest<{ id: number; name: string; gender: string }>(
      `/classes/${classId}/students`,
      {
        method: 'POST',
        body: JSON.stringify({ name, gender }),
      }
    );
  },

  async delete(classId: string | number, studentId: string | number) {
    return apiRequest<{ success: boolean }>(
      `/classes/${classId}/students/${studentId}`,
      {
        method: 'DELETE',
      }
    );
  },
};

// Subjects API
export const subjectsAPI = {
  async add(classId: string | number, name: string) {
    return apiRequest<{ id: number; name: string }>(
      `/classes/${classId}/subjects`,
      {
        method: 'POST',
        body: JSON.stringify({ name }),
      }
    );
  },

  async delete(classId: string | number, subjectId: string | number) {
    return apiRequest<{ success: boolean }>(
      `/classes/${classId}/subjects/${subjectId}`,
      {
        method: 'DELETE',
      }
    );
  },
};

// Grades API
export const gradesAPI = {
  async get(classId: string | number) {
    return apiRequest<any[]>(`/classes/${classId}/grades`);
  },

  async update(classId: string | number, gradeRules: any[]) {
    const data = await apiRequest<{ gradeRules: any[] }>(
      `/classes/${classId}/grades`,
      {
        method: 'PUT',
        body: JSON.stringify(gradeRules),
      }
    );
    return data.gradeRules;
  },
};

// Marks API
export const marksAPI = {
  async update(classId: string | number, studentId: string | number, subjectId: string | number, mark: number) {
    return apiRequest<{ studentId: number; subjectId: number; mark: number }>(
      `/classes/${classId}/marks`,
      {
        method: 'PUT',
        body: JSON.stringify({ studentId, subjectId, mark }),
      }
    );
  },

  async bulkUpdate(classId: string | number, marks: Array<{ studentId: number; subjectId: number; mark: number }>) {
    const data = await apiRequest<{ marks: any[] }>(
      `/classes/${classId}/marks/bulk`,
      {
        method: 'PUT',
        body: JSON.stringify({ marks }),
      }
    );
    return data.marks;
  },
};

// Dashboard API
export const dashboardAPI = {
  async getSummary() {
    return apiRequest<{
      totalClasses: number;
      totalStudents: number;
      totalSubjects: number;
      averagePerformance: number;
      performancePerClass: Array<{ classId: number; name: string; average: number }>;
      genderDistribution: { Male: number; Female: number };
    }>('/dashboard/summary');
  },
};

// Results API
export const resultsAPI = {
  async getOverall(classId: string | number, gender: 'all' | 'Male' | 'Female' = 'all') {
    const data = await apiRequest<{ results: any[] }>(
      `/classes/${classId}/results/overall?gender=${gender}`
    );
    return data.results;
  },

  async getSubject(classId: string | number, subjectId: string | number, gender: 'all' | 'Male' | 'Female' = 'all') {
    const data = await apiRequest<{ results: any[] }>(
      `/classes/${classId}/results/subject/${subjectId}?gender=${gender}`
    );
    return data.results;
  },
};

// Export API
export const exportAPI = {
  async generate(classId: string | number, type: 'excel' | 'pdf') {
    return apiRequest<{ status: string; type: string; url: string }>(
      `/classes/${classId}/export`,
      {
        method: 'POST',
        body: JSON.stringify({ type }),
      }
    );
  },
};
