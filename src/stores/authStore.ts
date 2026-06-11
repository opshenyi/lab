import { create } from 'zustand';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const mockUsers: Record<UserRole, User> = {
  student: {
    id: 's1',
    name: '张伟',
    email: 'zhangwei@example.edu',
    role: 'student',
    studentId: '2024001',
    department: '计算机科学与技术',
    createdAt: '2024-09-01',
  },
  teacher: {
    id: 't1',
    name: '李明教授',
    email: 'liming@example.edu',
    role: 'teacher',
    department: '计算机科学与技术',
    createdAt: '2023-03-15',
  },
  admin: {
    id: 'a1',
    name: '系统管理员',
    email: 'admin@example.edu',
    role: 'admin',
    department: '信息化运维',
    createdAt: '2023-01-01',
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (role: UserRole) => {
    set({ user: mockUsers[role], isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
