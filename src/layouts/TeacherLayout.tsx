import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar, SidebarProvider, ThemeSwitcher } from '../design-system/components';
import type { SidebarItem } from '../design-system/components';
import { useAuthStore } from '../stores/authStore';

const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const QuestionIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const ExamIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>;
const GradeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;

const sidebarItems: SidebarItem[] = [
  { key: 'dashboard', label: '仪表盘', path: '/teacher', icon: <HomeIcon /> },
  { key: 'courses', label: '课程', path: '/teacher/courses', icon: <BookIcon /> },
  { key: 'questions', label: '题库', path: '/teacher/questions', icon: <QuestionIcon /> },
  { key: 'exams', label: '考试', path: '/teacher/exams', icon: <ExamIcon /> },
  { key: 'grades', label: '成绩管理', path: '/teacher/grades', icon: <GradeIcon /> },
];

const brandBaseUrl = `${import.meta.env.BASE_URL}brand/`;

export const TeacherLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <SidebarProvider>
      <div className="page-layout">
        <div className="column-layout">
          <Sidebar
            items={sidebarItems}
            logo={
              <span className="sidebar-logo-art" aria-label="SparkLab">
                <img className="sidebar-logo-img sidebar-logo-img-light" src={`${brandBaseUrl}sparklab-wordmark.png?v=pure-wordmark`} alt="" aria-hidden="true" />
                <img className="sidebar-logo-img sidebar-logo-img-dark" src={`${brandBaseUrl}sparklab-wordmark-dark.png?v=pure-wordmark`} alt="" aria-hidden="true" />
              </span>
            }
            bottom={<ThemeSwitcher />}
          />
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
