import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hoverable = false,
  onClick,
  style,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className={`card card-pad-${padding} ${hoverable ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => (
  <div className="card-header">
    <div>
      <h3 className="card-title">{title}</h3>
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
    </div>
    {action && <div className="card-action">{action}</div>}
  </div>
);
