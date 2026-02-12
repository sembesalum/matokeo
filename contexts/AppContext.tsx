'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Class, Student, Subject, GradeRule, Mark, User } from '@/lib/mockData';
import * as api from '@/lib/api';

interface AppContextType {
  user: User | null;
  classes: Class[];
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  loadClasses: () => Promise<void>;
  loadClass: (classId: string | number) => Promise<Class | null>;
  addClass: (className: string) => Promise<void>;
  addStudent: (classId: string | number, student: Omit<Student, 'id'>) => Promise<void>;
  deleteStudent: (classId: string | number, studentId: string | number) => Promise<void>;
  addSubject: (classId: string | number, subject: Omit<Subject, 'id'>) => Promise<void>;
  deleteSubject: (classId: string | number, subjectId: string | number) => Promise<void>;
  updateGradeRules: (classId: string | number, rules: GradeRule[]) => Promise<void>;
  updateMark: (classId: string | number, mark: Mark) => Promise<void>;
  getClass: (classId: string | number) => Class | undefined;
  refreshClass: (classId: string | number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('matokeo_token') : null;
      if (token) {
        const userData = await api.authAPI.getMe();
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
        await loadClasses();
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Auth check failed:', err);
      api.authAPI.logout();
      setUser(null);
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      // First load the list of classes for this teacher
      const classesData = await api.classesAPI.getAll();
      const summaryList = Array.isArray(classesData) ? classesData : [];

      if (summaryList.length === 0) {
        setClasses([]);
        return;
      }

      // Then load full details for each class in parallel
      const detailedList = await Promise.all(
        summaryList.map(async (c) => {
          try {
            // This returns full workspace: students, subjects, gradeRules, marks
            return await api.classesAPI.getById(c.id);
          } catch (err) {
            console.error('Failed to load class details for', c.id, err);
            // Fallback to summary if detail fails
            return c;
          }
        })
      );

      setClasses(detailedList);
    } catch (err: any) {
      setError(err.message || 'Failed to load classes');
      console.error('Failed to load classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClass = async (classId: string | number): Promise<Class | null> => {
    try {
      setError(null);
      const classData = await api.classesAPI.getById(classId);
      
      // Update in classes array
      setClasses(prev => {
        const index = prev.findIndex(c => String(c.id) === String(classId));
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = classData;
          return updated;
        }
        return [...prev, classData];
      });
      
      return classData;
    } catch (err: any) {
      setError(err.message || 'Failed to load class');
      console.error('Failed to load class:', err);
      return null;
    }
  };

  const addClass = async (className: string) => {
    try {
      setError(null);
      const newClass = await api.classesAPI.create(className);
      
      // Load the full class data
      const fullClass = await api.classesAPI.getById(newClass.id);
      setClasses(prev => [...prev, fullClass]);
    } catch (err: any) {
      setError(err.message || 'Failed to create class');
      throw err;
    }
  };

  const addStudent = async (classId: string | number, student: Omit<Student, 'id'>) => {
    try {
      setError(null);
      const newStudent = await api.studentsAPI.add(classId, student.name, student.gender);
      
      // Refresh the class to get updated data
      await refreshClass(classId);
    } catch (err: any) {
      setError(err.message || 'Failed to add student');
      throw err;
    }
  };

  const deleteStudent = async (classId: string | number, studentId: string | number) => {
    try {
      setError(null);
      await api.studentsAPI.delete(classId, studentId);
      
      // Refresh the class to get updated data
      await refreshClass(classId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
      throw err;
    }
  };

  const addSubject = async (classId: string | number, subject: Omit<Subject, 'id'>) => {
    try {
      setError(null);
      await api.subjectsAPI.add(classId, subject.name);
      
      // Refresh the class to get updated data
      await refreshClass(classId);
    } catch (err: any) {
      setError(err.message || 'Failed to add subject');
      throw err;
    }
  };

  const deleteSubject = async (classId: string | number, subjectId: string | number) => {
    try {
      setError(null);
      await api.subjectsAPI.delete(classId, subjectId);
      
      // Refresh the class to get updated data
      await refreshClass(classId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete subject');
      throw err;
    }
  };

  const updateGradeRules = async (classId: string | number, rules: GradeRule[]) => {
    try {
      setError(null);
      const updatedRules = await api.gradesAPI.update(classId, rules);
      
      // Update local state
      setClasses(prev => prev.map(c => 
        String(c.id) === String(classId) 
          ? { ...c, gradeRules: updatedRules }
          : c
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update grade rules');
      throw err;
    }
  };

  const updateMark = async (classId: string | number, mark: Mark) => {
    try {
      setError(null);
      await api.marksAPI.update(classId, mark.studentId, mark.subjectId, mark.mark);
      
      // Update local state optimistically
      setClasses(prev => prev.map(c => {
        if (String(c.id) !== String(classId)) return c;
        
        const existingMarkIndex = c.marks.findIndex(
          m => String(m.studentId) === String(mark.studentId) && 
               String(m.subjectId) === String(mark.subjectId)
        );

        if (existingMarkIndex >= 0) {
          const updatedMarks = [...c.marks];
          updatedMarks[existingMarkIndex] = mark;
          return { ...c, marks: updatedMarks };
        } else {
          return { ...c, marks: [...c.marks, mark] };
        }
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to update mark');
      throw err;
    }
  };

  const refreshClass = async (classId: string | number) => {
    await loadClass(classId);
  };

  const getClass = (classId: string | number) => {
    return classes.find(c => String(c.id) === String(classId));
  };

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      loadClasses();
    } else {
      api.authAPI.logout();
      setClasses([]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        classes,
        loading,
        error,
        setUser: handleSetUser,
        loadClasses,
        loadClass,
        addClass,
        addStudent,
        deleteStudent,
        addSubject,
        deleteSubject,
        updateGradeRules,
        updateMark,
        getClass,
        refreshClass,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
