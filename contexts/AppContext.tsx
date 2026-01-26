'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Class, Student, Subject, GradeRule, Mark, User } from '@/lib/mockData';
import { initialMockData } from '@/lib/mockData';

interface AppContextType {
  user: User | null;
  classes: Class[];
  setUser: (user: User | null) => void;
  addClass: (className: string) => void;
  updateClass: (classId: string, updates: Partial<Class>) => void;
  addStudent: (classId: string, student: Student) => void;
  deleteStudent: (classId: string, studentId: string) => void;
  addSubject: (classId: string, subject: Subject) => void;
  deleteSubject: (classId: string, subjectId: string) => void;
  updateGradeRules: (classId: string, rules: GradeRule[]) => void;
  updateMark: (classId: string, mark: Mark) => void;
  getClass: (classId: string) => Class | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('matokeo_user');
    const savedClasses = localStorage.getItem('matokeo_classes');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    } else {
      // Initialize with mock data
      setClasses(initialMockData);
      localStorage.setItem('matokeo_classes', JSON.stringify(initialMockData));
    }
  }, []);

  // Save classes to localStorage whenever they change
  useEffect(() => {
    if (classes.length > 0) {
      localStorage.setItem('matokeo_classes', JSON.stringify(classes));
    }
  }, [classes]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('matokeo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('matokeo_user');
    }
  }, [user]);

  const addClass = (className: string) => {
    const newClass: Class = {
      id: `class-${Date.now()}`,
      name: className,
      students: [],
      subjects: [],
      gradeRules: [
        { id: 'g-default-1', fromMark: 80, toMark: 100, grade: 'A', points: 5, remark: 'Excellent' },
        { id: 'g-default-2', fromMark: 70, toMark: 79, grade: 'B', points: 4, remark: 'Very Good' },
        { id: 'g-default-3', fromMark: 60, toMark: 69, grade: 'C', points: 3, remark: 'Good' },
        { id: 'g-default-4', fromMark: 50, toMark: 59, grade: 'D', points: 2, remark: 'Satisfactory' },
        { id: 'g-default-5', fromMark: 40, toMark: 49, grade: 'E', points: 1, remark: 'Pass' },
        { id: 'g-default-6', fromMark: 0, toMark: 39, grade: 'F', points: 0, remark: 'Fail' },
      ],
      marks: [],
    };
    setClasses([...classes, newClass]);
  };

  const updateClass = (classId: string, updates: Partial<Class>) => {
    setClasses(classes.map(c => c.id === classId ? { ...c, ...updates } : c));
  };

  const addStudent = (classId: string, student: Student) => {
    setClasses(classes.map(c => 
      c.id === classId 
        ? { ...c, students: [...c.students, student] }
        : c
    ));
  };

  const deleteStudent = (classId: string, studentId: string) => {
    setClasses(classes.map(c => 
      c.id === classId 
        ? { 
            ...c, 
            students: c.students.filter(s => s.id !== studentId),
            marks: c.marks.filter(m => m.studentId !== studentId)
          }
        : c
    ));
  };

  const addSubject = (classId: string, subject: Subject) => {
    setClasses(classes.map(c => 
      c.id === classId 
        ? { ...c, subjects: [...c.subjects, subject] }
        : c
    ));
  };

  const deleteSubject = (classId: string, subjectId: string) => {
    setClasses(classes.map(c => 
      c.id === classId 
        ? { 
            ...c, 
            subjects: c.subjects.filter(s => s.id !== subjectId),
            marks: c.marks.filter(m => m.subjectId !== subjectId)
          }
        : c
    ));
  };

  const updateGradeRules = (classId: string, rules: GradeRule[]) => {
    setClasses(classes.map(c => 
      c.id === classId 
        ? { ...c, gradeRules: rules }
        : c
    ));
  };

  const updateMark = (classId: string, mark: Mark) => {
    setClasses(classes.map(c => {
      if (c.id !== classId) return c;
      
      const existingMarkIndex = c.marks.findIndex(
        m => m.studentId === mark.studentId && m.subjectId === mark.subjectId
      );

      if (existingMarkIndex >= 0) {
        const updatedMarks = [...c.marks];
        updatedMarks[existingMarkIndex] = mark;
        return { ...c, marks: updatedMarks };
      } else {
        return { ...c, marks: [...c.marks, mark] };
      }
    }));
  };

  const getClass = (classId: string) => {
    return classes.find(c => c.id === classId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        classes,
        setUser,
        addClass,
        updateClass,
        addStudent,
        deleteStudent,
        addSubject,
        deleteSubject,
        updateGradeRules,
        updateMark,
        getClass,
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
