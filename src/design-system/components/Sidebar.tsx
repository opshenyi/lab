import React, { createContext, useContext, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export interface SidebarItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: { key: string; label: string; path: string }[];
}

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType>({ isOpen: false, toggle: () => {}, close: () => {} });
export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen(v => !v), []);
  const close = useCallback(() => setIsOpen(false), []);
  return <SidebarContext.Provider value={{ isOpen, toggle, close }}>{children}</SidebarContext.Provider>;
};

interface SidebarProps {
  items: SidebarItem[];
  logo?: React.ReactNode;
  bottom?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, logo, bottom }) => {
  const { isOpen, close } = useSidebar();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'sidebar-overlay-visible' : ''}`} onClick={close} />
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          {logo && <div className="sidebar-logo">{logo}</div>}
          <nav className="sidebar-nav">
            {items.map(item => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                end={item.path.split('/').length <= 3}
                onClick={close}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        {bottom && <div className="sidebar-bottom">{bottom}</div>}
      </aside>
    </>
  );
};
