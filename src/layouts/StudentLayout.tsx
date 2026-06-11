import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar, SidebarProvider, ThemeSwitcher } from '../design-system/components';
import type { SidebarItem } from '../design-system/components';
import { useAuthStore } from '../stores/authStore';

const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const LabIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const AssistantIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5c1.14 4.54 4.1 7.5 8.64 8.64.26.07.44.31.44.58s-.18.51-.44.58c-4.54 1.14-7.5 4.1-8.64 8.64-.07.26-.31.44-.58.44s-.51-.18-.58-.44c-1.14-4.54-4.1-7.5-8.64-8.64a.6.6 0 0 1-.44-.58c0-.27.18-.51.44-.58 4.54-1.14 7.5-4.1 8.64-8.64.07-.26.31-.44.58-.44s.51.18.58.44Z"/></svg>;
const GradeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;

const sidebarItems: SidebarItem[] = [
  { key: 'dashboard', label: '仪表盘', path: '/student', icon: <HomeIcon /> },
  { key: 'courses', label: '课程', path: '/student/courses', icon: <BookIcon /> },
  { key: 'labs', label: '实例管理', path: '/student/labs', icon: <LabIcon /> },
  { key: 'assistant', label: '星火 AI助手', path: '/student/assistant', icon: <AssistantIcon /> },
  { key: 'grades', label: '成绩', path: '/student/grades', icon: <GradeIcon /> },
];

export const StudentLayout: React.FC = () => {
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
                <img className="sidebar-logo-img sidebar-logo-img-light" src="/brand/sparklab-wordmark.png?v=pure-wordmark" alt="" aria-hidden="true" />
                <img className="sidebar-logo-img sidebar-logo-img-dark" src="/brand/sparklab-wordmark-dark.png?v=pure-wordmark" alt="" aria-hidden="true" />
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
