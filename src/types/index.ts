export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  studentId?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  teacherName: string;
  semester: string;
  studentCount: number;
  labCount: number;
  examCount: number;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  coverColor: string;
}

export interface Lab {
  id: string;
  courseId: string;
  title: string;
  description: string;
  templateId: string;
  templateName: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  instructions: string;
  checkpoints: LabCheckpoint[];
  status: 'not_started' | 'in_progress' | 'completed';
  dueDate?: string;
  maxAttempts: number;
  attemptsUsed: number;
}

export interface LabCheckpoint {
  id: string;
  title: string;
  description: string;
  command: string;
  expectedOutput: string;
  completed: boolean;
}

export interface ContainerTemplate {
  id: string;
  name: string;
  description: string;
  dockerfile: string;
  baseImage: string;
  status: 'building' | 'ready' | 'error' | 'deprecated';
  cpuLimit: string;
  memoryLimit: string;
  timeoutMinutes: number;
  environmentVars: Record<string, string>;
  exposedPorts: number[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
}

export type QuestionType = 'choice' | 'multi_choice' | 'code' | 'short_answer' | 'essay';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  content: string;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  templateId?: string;
  templateName?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  courseId: string;
  createdBy: string;
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  content: string;
}

export interface Exam {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  questionIds: string[];
  questions?: Question[];
  totalPoints: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: 'draft' | 'published' | 'active' | 'ended';
  createdBy: string;
  createdAt: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, string | string[]>;
  score?: number;
  totalPoints: number;
  submittedAt: string;
  gradedAt?: string;
  status: 'in_progress' | 'submitted' | 'graded';
}

export interface Grade {
  id: string;
  examId: string;
  examTitle: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  gradedAt: string;
}

export interface RunningContainer {
  id: string;
  containerId: string;
  studentId: string;
  studentName: string;
  templateId: string;
  templateName: string;
  labId: string;
  labTitle: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  cpuUsage: number;
  memoryUsage: number;
  memoryLimit: string;
  uptime: string;
  startedAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalLabs: number;
  totalTemplates: number;
  runningContainers: number;
  containerCapacity: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
}
