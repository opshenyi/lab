import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  inline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  centered = false,
  inline = false,
  className = '',
  style,
  label = 'Loading',
}) => {
  const classes = [
    'spark-spinner-frame',
    `spark-spinner-frame-${size}`,
    centered ? 'spark-spinner-frame-centered' : '',
    inline ? 'spark-spinner-frame-inline' : '',
    className,
  ].filter(Boolean).join(' ');

  const spinner = (
    <>
      <span className={`spark-spinner spark-spinner-${size}`} aria-hidden="true" />
      <span className="spark-spinner-sr">{label}</span>
    </>
  );

  if (inline) {
    return (
      <span className={classes} style={style} role="status" aria-live="polite">
        {spinner}
      </span>
    );
  }

  return (
    <div className={classes} style={style} role="status" aria-live="polite">
      {spinner}
    </div>
  );
};
