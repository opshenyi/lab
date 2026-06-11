import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar, SidebarProvider, ThemeSwitcher, TopNav } from '../design-system/components';
import type { SidebarItem } from '../design-system/components';
import { useAuthStore } from '../stores/authStore';

const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;
const TemplateIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const UsersIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
const ContainerIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
const SettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;

const sidebarItems: SidebarItem[] = [
  { key: 'dashboard', label: '仪表盘', path: '/admin', icon: <HomeIcon /> },
  { key: 'templates', label: '容器模板', path: '/admin/templates', icon: <TemplateIcon /> },
  { key: 'users', label: '用户管理', path: '/admin/users', icon: <UsersIcon /> },
  { key: 'containers', label: '容器监控', path: '/admin/containers', icon: <ContainerIcon /> },
  { key: 'system', label: '系统设置', path: '/admin/system', icon: <SettingsIcon /> },
];

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
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
            <TopNav userName={user?.name} />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
