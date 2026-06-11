import React from 'react';
import { useSidebar } from './Sidebar';
import './TopNav.css';

interface TopNavProps {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  userName?: string;
}

export const TopNav: React.FC<TopNavProps> = ({ title, subtitle, right, userName }) => {
  const { toggle } = useSidebar();

  return (
    <>
      <header className="topnav">
        <div className="topnav-left">
          <button className="topnav-hamburger" onClick={toggle} aria-label="切换导航">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M20 7H4V5h16zm0 6H4v-2h16zM4 19h16v-2H4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="topnav-right">
          {right}

          {userName && (
            <a className="topnav-profile" href="#" aria-label="账户">
              <div className="topnav-avatar-container">
                <div className="topnav-avatar">
                  <svg className="topnav-avatar-icon" width="26" height="26" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8M6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8m6 9c-3.314 0-6 1.79-6 4h12c0-2.21-2.686-4-6-4m-8 4c0-3.59 3.582-6 8-6s8 2.41 8 6v1H4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <span className="topnav-profile-name">{userName}</span>
              <svg className="topnav-chevron" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="m12 9.414 7.293 7.293 1.414-1.414L12.714 7.3a1.01 1.01 0 0 0-1.428 0l-7.993 7.993 1.414 1.414z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </div>
      </header>

      {title && (
        <section className="topnav-page-header">
          <h1 className="topnav-title">{title}</h1>
          {subtitle && <p className="topnav-subtitle">{subtitle}</p>}
        </section>
      )}
    </>
  );
};
