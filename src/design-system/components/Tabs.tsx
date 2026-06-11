import React, { useState } from 'react';
import './Tabs.css';

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeKey?: string;
  onChange?: (key: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeKey, onChange }) => {
  const [internalKey, setInternalKey] = useState(tabs[0]?.key || '');
  const current = activeKey ?? internalKey;

  const handleChange = (key: string) => {
    if (!activeKey) setInternalKey(key);
    onChange?.(key);
  };

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`tab ${current === tab.key ? 'tab-active' : ''}`}
          onClick={() => handleChange(tab.key)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};
