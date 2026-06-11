import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
}) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${dot ? 'badge-dot' : ''}`}>
      {dot && <span className="badge-dot-indicator" />}
      {children}
    </span>
  );
};
