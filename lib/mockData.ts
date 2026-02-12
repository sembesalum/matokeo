export interface Student {
  id: string | number;
  name: string;
  gender: 'Male' | 'Female';
}

export interface Subject {
  id: string | number;
  name: string;
}

export interface GradeRule {
  id: string | number;
  fromMark: number;
  toMark: number;
  grade: string;
  points: number;
  remark: string;
}

export interface Mark {
  studentId: string | number;
  subjectId: string | number;
  mark: number;
}

export interface Class {
  id: string | number;
  name: string;
  students: Student[];
  subjects: Subject[];
  gradeRules: GradeRule[];
  marks: Mark[];
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: 'TEACHER' | 'ADMIN';
}

// Mock data
export const initialMockData: Class[] = [
  {
    id: 'class-1',
    name: 'Form 4A',
    students: [
      { id: 's1', name: 'Amina Hassan', gender: 'Female' },
      { id: 's2', name: 'John Mwangi', gender: 'Male' },
      { id: 's3', name: 'Fatuma Juma', gender: 'Female' },
      { id: 's4', name: 'Peter Kimani', gender: 'Male' },
      { id: 's5', name: 'Sarah Ochieng', gender: 'Female' },
      { id: 's6', name: 'David Otieno', gender: 'Male' },
      { id: 's7', name: 'Mary Wanjiku', gender: 'Female' },
      { id: 's8', name: 'James Kipchoge', gender: 'Male' },
      { id: 's9', name: 'Grace Akinyi', gender: 'Female' },
      { id: 's10', name: 'Michael Omondi', gender: 'Male' },
    ],
    subjects: [
      { id: 'sub1', name: 'Mathematics' },
      { id: 'sub2', name: 'English' },
      { id: 'sub3', name: 'Kiswahili' },
      { id: 'sub4', name: 'Physics' },
      { id: 'sub5', name: 'Chemistry' },
    ],
    gradeRules: [
      { id: 'g1', fromMark: 80, toMark: 100, grade: 'A', points: 5, remark: 'Excellent' },
      { id: 'g2', fromMark: 70, toMark: 79, grade: 'B', points: 4, remark: 'Very Good' },
      { id: 'g3', fromMark: 60, toMark: 69, grade: 'C', points: 3, remark: 'Good' },
      { id: 'g4', fromMark: 50, toMark: 59, grade: 'D', points: 2, remark: 'Satisfactory' },
      { id: 'g5', fromMark: 40, toMark: 49, grade: 'E', points: 1, remark: 'Pass' },
      { id: 'g6', fromMark: 0, toMark: 39, grade: 'F', points: 0, remark: 'Fail' },
    ],
    marks: [
      { studentId: 's1', subjectId: 'sub1', mark: 85 },
      { studentId: 's1', subjectId: 'sub2', mark: 78 },
      { studentId: 's1', subjectId: 'sub3', mark: 82 },
      { studentId: 's1', subjectId: 'sub4', mark: 88 },
      { studentId: 's1', subjectId: 'sub5', mark: 90 },
      { studentId: 's2', subjectId: 'sub1', mark: 72 },
      { studentId: 's2', subjectId: 'sub2', mark: 75 },
      { studentId: 's2', subjectId: 'sub3', mark: 68 },
      { studentId: 's2', subjectId: 'sub4', mark: 70 },
      { studentId: 's2', subjectId: 'sub5', mark: 73 },
      { studentId: 's3', subjectId: 'sub1', mark: 65 },
      { studentId: 's3', subjectId: 'sub2', mark: 70 },
      { studentId: 's3', subjectId: 'sub3', mark: 72 },
      { studentId: 's3', subjectId: 'sub4', mark: 68 },
      { studentId: 's3', subjectId: 'sub5', mark: 66 },
      { studentId: 's4', subjectId: 'sub1', mark: 55 },
      { studentId: 's4', subjectId: 'sub2', mark: 58 },
      { studentId: 's4', subjectId: 'sub3', mark: 52 },
      { studentId: 's4', subjectId: 'sub4', mark: 56 },
      { studentId: 's4', subjectId: 'sub5', mark: 54 },
      { studentId: 's5', subjectId: 'sub1', mark: 92 },
      { studentId: 's5', subjectId: 'sub2', mark: 88 },
      { studentId: 's5', subjectId: 'sub3', mark: 90 },
      { studentId: 's5', subjectId: 'sub4', mark: 85 },
      { studentId: 's5', subjectId: 'sub5', mark: 91 },
      { studentId: 's6', subjectId: 'sub1', mark: 45 },
      { studentId: 's6', subjectId: 'sub2', mark: 48 },
      { studentId: 's6', subjectId: 'sub3', mark: 42 },
      { studentId: 's6', subjectId: 'sub4', mark: 46 },
      { studentId: 's6', subjectId: 'sub5', mark: 44 },
      { studentId: 's7', subjectId: 'sub1', mark: 78 },
      { studentId: 's7', subjectId: 'sub2', mark: 82 },
      { studentId: 's7', subjectId: 'sub3', mark: 80 },
      { studentId: 's7', subjectId: 'sub4', mark: 75 },
      { studentId: 's7', subjectId: 'sub5', mark: 79 },
      { studentId: 's8', subjectId: 'sub1', mark: 62 },
      { studentId: 's8', subjectId: 'sub2', mark: 65 },
      { studentId: 's8', subjectId: 'sub3', mark: 60 },
      { studentId: 's8', subjectId: 'sub4', mark: 64 },
      { studentId: 's8', subjectId: 'sub5', mark: 63 },
      { studentId: 's9', subjectId: 'sub1', mark: 88 },
      { studentId: 's9', subjectId: 'sub2', mark: 85 },
      { studentId: 's9', subjectId: 'sub3', mark: 87 },
      { studentId: 's9', subjectId: 'sub4', mark: 90 },
      { studentId: 's9', subjectId: 'sub5', mark: 89 },
      { studentId: 's10', subjectId: 'sub1', mark: 35 },
      { studentId: 's10', subjectId: 'sub2', mark: 38 },
      { studentId: 's10', subjectId: 'sub3', mark: 32 },
      { studentId: 's10', subjectId: 'sub4', mark: 36 },
      { studentId: 's10', subjectId: 'sub5', mark: 34 },
    ],
  },
  {
    id: 'class-2',
    name: 'Form 3B',
    students: [
      { id: 's11', name: 'Hassan Ali', gender: 'Male' },
      { id: 's12', name: 'Ruth Muthoni', gender: 'Female' },
      { id: 's13', name: 'Daniel Kariuki', gender: 'Male' },
      { id: 's14', name: 'Esther Njeri', gender: 'Female' },
      { id: 's15', name: 'Brian Ochieng', gender: 'Male' },
      { id: 's16', name: 'Joyce Wanjala', gender: 'Female' },
      { id: 's17', name: 'Kevin Mutua', gender: 'Male' },
      { id: 's18', name: 'Mercy Chebet', gender: 'Female' },
      { id: 's19', name: 'Paul Njoroge', gender: 'Male' },
      { id: 's20', name: 'Lilian Atieno', gender: 'Female' },
      { id: 's21', name: 'Samuel Kiprotich', gender: 'Male' },
      { id: 's22', name: 'Nancy Achieng', gender: 'Female' },
    ],
    subjects: [
      { id: 'sub6', name: 'Mathematics' },
      { id: 'sub7', name: 'English' },
      { id: 'sub8', name: 'Kiswahili' },
      { id: 'sub9', name: 'Biology' },
    ],
    gradeRules: [
      { id: 'g7', fromMark: 80, toMark: 100, grade: 'A', points: 5, remark: 'Excellent' },
      { id: 'g8', fromMark: 70, toMark: 79, grade: 'B', points: 4, remark: 'Very Good' },
      { id: 'g9', fromMark: 60, toMark: 69, grade: 'C', points: 3, remark: 'Good' },
      { id: 'g10', fromMark: 50, toMark: 59, grade: 'D', points: 2, remark: 'Satisfactory' },
      { id: 'g11', fromMark: 40, toMark: 49, grade: 'E', points: 1, remark: 'Pass' },
      { id: 'g12', fromMark: 0, toMark: 39, grade: 'F', points: 0, remark: 'Fail' },
    ],
    marks: [
      { studentId: 's11', subjectId: 'sub6', mark: 76 },
      { studentId: 's11', subjectId: 'sub7', mark: 74 },
      { studentId: 's11', subjectId: 'sub8', mark: 78 },
      { studentId: 's11', subjectId: 'sub9', mark: 75 },
      { studentId: 's12', subjectId: 'sub6', mark: 89 },
      { studentId: 's12', subjectId: 'sub7', mark: 87 },
      { studentId: 's12', subjectId: 'sub8', mark: 91 },
      { studentId: 's12', subjectId: 'sub9', mark: 88 },
      { studentId: 's13', subjectId: 'sub6', mark: 58 },
      { studentId: 's13', subjectId: 'sub7', mark: 62 },
      { studentId: 's13', subjectId: 'sub8', mark: 60 },
      { studentId: 's13', subjectId: 'sub9', mark: 59 },
      { studentId: 's14', subjectId: 'sub6', mark: 82 },
      { studentId: 's14', subjectId: 'sub7', mark: 85 },
      { studentId: 's14', subjectId: 'sub8', mark: 83 },
      { studentId: 's14', subjectId: 'sub9', mark: 84 },
      { studentId: 's15', subjectId: 'sub6', mark: 48 },
      { studentId: 's15', subjectId: 'sub7', mark: 45 },
      { studentId: 's15', subjectId: 'sub8', mark: 50 },
      { studentId: 's15', subjectId: 'sub9', mark: 47 },
      { studentId: 's16', subjectId: 'sub6', mark: 71 },
      { studentId: 's16', subjectId: 'sub7', mark: 73 },
      { studentId: 's16', subjectId: 'sub8', mark: 69 },
      { studentId: 's16', subjectId: 'sub9', mark: 72 },
      { studentId: 's17', subjectId: 'sub6', mark: 64 },
      { studentId: 's17', subjectId: 'sub7', mark: 67 },
      { studentId: 's17', subjectId: 'sub8', mark: 65 },
      { studentId: 's17', subjectId: 'sub9', mark: 66 },
      { studentId: 's18', subjectId: 'sub6', mark: 93 },
      { studentId: 's18', subjectId: 'sub7', mark: 90 },
      { studentId: 's18', subjectId: 'sub8', mark: 92 },
      { studentId: 's18', subjectId: 'sub9', mark: 94 },
      { studentId: 's19', subjectId: 'sub6', mark: 56 },
      { studentId: 's19', subjectId: 'sub7', mark: 54 },
      { studentId: 's19', subjectId: 'sub8', mark: 58 },
      { studentId: 's19', subjectId: 'sub9', mark: 55 },
      { studentId: 's20', subjectId: 'sub6', mark: 79 },
      { studentId: 's20', subjectId: 'sub7', mark: 81 },
      { studentId: 's20', subjectId: 'sub8', mark: 77 },
      { studentId: 's20', subjectId: 'sub9', mark: 80 },
      { studentId: 's21', subjectId: 'sub6', mark: 42 },
      { studentId: 's21', subjectId: 'sub7', mark: 44 },
      { studentId: 's21', subjectId: 'sub8', mark: 40 },
      { studentId: 's21', subjectId: 'sub9', mark: 43 },
      { studentId: 's22', subjectId: 'sub6', mark: 68 },
      { studentId: 's22', subjectId: 'sub7', mark: 70 },
      { studentId: 's22', subjectId: 'sub8', mark: 66 },
      { studentId: 's22', subjectId: 'sub9', mark: 69 },
    ],
  },
  {
    id: 'class-3',
    name: 'Form 2C',
    students: [
      { id: 's23', name: 'Irene Wambui', gender: 'Female' },
      { id: 's24', name: 'Tom Mboya', gender: 'Male' },
      { id: 's25', name: 'Patience Nyambura', gender: 'Female' },
      { id: 's26', name: 'Collins Ouma', gender: 'Male' },
      { id: 's27', name: 'Diana Kamau', gender: 'Female' },
      { id: 's28', name: 'Victor Ochieng', gender: 'Male' },
      { id: 's29', name: 'Faith Njoki', gender: 'Female' },
      { id: 's30', name: 'Edwin Kipchoge', gender: 'Male' },
    ],
    subjects: [
      { id: 'sub10', name: 'Mathematics' },
      { id: 'sub11', name: 'English' },
      { id: 'sub12', name: 'Kiswahili' },
      { id: 'sub13', name: 'Geography' },
      { id: 'sub14', name: 'History' },
    ],
    gradeRules: [
      { id: 'g13', fromMark: 80, toMark: 100, grade: 'A', points: 5, remark: 'Excellent' },
      { id: 'g14', fromMark: 70, toMark: 79, grade: 'B', points: 4, remark: 'Very Good' },
      { id: 'g15', fromMark: 60, toMark: 69, grade: 'C', points: 3, remark: 'Good' },
      { id: 'g16', fromMark: 50, toMark: 59, grade: 'D', points: 2, remark: 'Satisfactory' },
      { id: 'g17', fromMark: 40, toMark: 49, grade: 'E', points: 1, remark: 'Pass' },
      { id: 'g18', fromMark: 0, toMark: 39, grade: 'F', points: 0, remark: 'Fail' },
    ],
    marks: [
      { studentId: 's23', subjectId: 'sub10', mark: 81 },
      { studentId: 's23', subjectId: 'sub11', mark: 84 },
      { studentId: 's23', subjectId: 'sub12', mark: 79 },
      { studentId: 's23', subjectId: 'sub13', mark: 83 },
      { studentId: 's23', subjectId: 'sub14', mark: 82 },
      { studentId: 's24', subjectId: 'sub10', mark: 55 },
      { studentId: 's24', subjectId: 'sub11', mark: 58 },
      { studentId: 's24', subjectId: 'sub12', mark: 52 },
      { studentId: 's24', subjectId: 'sub13', mark: 56 },
      { studentId: 's24', subjectId: 'sub14', mark: 54 },
      { studentId: 's25', subjectId: 'sub10', mark: 72 },
      { studentId: 's25', subjectId: 'sub11', mark: 75 },
      { studentId: 's25', subjectId: 'sub12', mark: 70 },
      { studentId: 's25', subjectId: 'sub13', mark: 73 },
      { studentId: 's25', subjectId: 'sub14', mark: 74 },
      { studentId: 's26', subjectId: 'sub10', mark: 67 },
      { studentId: 's26', subjectId: 'sub11', mark: 69 },
      { studentId: 's26', subjectId: 'sub12', mark: 65 },
      { studentId: 's26', subjectId: 'sub13', mark: 68 },
      { studentId: 's26', subjectId: 'sub14', mark: 66 },
      { studentId: 's27', subjectId: 'sub10', mark: 90 },
      { studentId: 's27', subjectId: 'sub11', mark: 88 },
      { studentId: 's27', subjectId: 'sub12', mark: 92 },
      { studentId: 's27', subjectId: 'sub13', mark: 89 },
      { studentId: 's27', subjectId: 'sub14', mark: 91 },
      { studentId: 's28', subjectId: 'sub10', mark: 46 },
      { studentId: 's28', subjectId: 'sub11', mark: 48 },
      { studentId: 's28', subjectId: 'sub12', mark: 44 },
      { studentId: 's28', subjectId: 'sub13', mark: 47 },
      { studentId: 's28', subjectId: 'sub14', mark: 45 },
      { studentId: 's29', subjectId: 'sub10', mark: 77 },
      { studentId: 's29', subjectId: 'sub11', mark: 79 },
      { studentId: 's29', subjectId: 'sub12', mark: 75 },
      { studentId: 's29', subjectId: 'sub13', mark: 78 },
      { studentId: 's29', subjectId: 'sub14', mark: 76 },
      { studentId: 's30', subjectId: 'sub10', mark: 61 },
      { studentId: 's30', subjectId: 'sub11', mark: 63 },
      { studentId: 's30', subjectId: 'sub12', mark: 59 },
      { studentId: 's30', subjectId: 'sub13', mark: 62 },
      { studentId: 's30', subjectId: 'sub14', mark: 60 },
    ],
  },
];
