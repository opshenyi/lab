import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Badge, Button, Table, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import type { RunningContainer } from '../../types';

const pageStyle: React.CSSProperties = {

};

const pageTitleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: 'var(--ink)',
  letterSpacing: '-0.396px',
};

const pageSubtitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 400,
  color: 'var(--ink-secondary)',
  lineHeight: 1.44,
  marginTop: 'var(--space-1)',
};

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const containerIdStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--ink-muted)',
  background: 'var(--surface-2)',
  padding: '2px 6px',
  borderRadius: 4,
};

const statusDotStyle = (color: string): React.CSSProperties => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: color,
  flexShrink: 0,
});

const statusRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
};

const progressBarContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  minWidth: 140,
};

const progressBarTrackStyle: React.CSSProperties = {
  flex: 1,
  height: 6,
  background: 'var(--canvas-elevated)',
  borderRadius: 3,
};

const progressValueStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--ink-muted)',
  fontFamily: 'var(--font-mono)',
  minWidth: 36,
  textAlign: 'right' as const,
};

const dateTimeStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--ink-soft)',
  fontFamily: 'var(--font-mono)',
};

const uptimeStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--ink-muted)',
  fontFamily: 'var(--font-mono)',
};

const actionsCellStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-2)',
};

const summaryRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-4)',
  alignItems: 'center',
};

const getProgressColor = (percent: number): string => {
  if (percent >= 80) return 'var(--error)';
  if (percent >= 50) return 'var(--warning)';
  return 'var(--accent)';
};

const getStatusColor = (status: RunningContainer['status']): string => {
  const map: Record<RunningContainer['status'], string> = {
    running: 'var(--success)',
    paused: 'var(--warning)',
    stopped: 'var(--ink-soft)',
    error: 'var(--error)',
  };
  return map[status];
};

const getStatusLabel = (status: RunningContainer['status']): string => {
  const map: Record<RunningContainer['status'], string> = {
    running: '运行中',
    paused: '已暂停',
    stopped: '已停止',
    error: '异常',
  };
  return map[status];
};

export const AdminContainers: React.FC = () => {
  const [containers, setContainers] = useState<RunningContainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const data = await api.getContainers();
        setContainers(data);
      } finally {
        setLoading(false);
      }
    };
    fetchContainers();
  }, []);

  const handleStop = (containerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setContainers(prev =>
      prev.map(c => c.containerId === containerId ? { ...c, status: 'stopped' as const } : c)
    );
  };

  const handleRestart = (containerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setContainers(prev =>
      prev.map(c => c.containerId === containerId ? { ...c, status: 'running' as const, cpuUsage: 5.0 } : c)
    );
  };

  const columns = [
    {
      key: 'containerId',
      title: '容器 ID',
      width: '120px',
      render: (_: any, record: RunningContainer) => (
        <span style={containerIdStyle}>{record.containerId}</span>
      ),
    },
    {
      key: 'studentName',
      title: '学生',
      render: (_: any, record: RunningContainer) => (
        <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{record.studentName}</span>
      ),
    },
    {
      key: 'templateName',
      title: '模板',
      render: (_: any, record: RunningContainer) => (
        <span style={{ fontSize: 13, color: 'var(--ink-secondary)' }}>{record.templateName}</span>
      ),
    },
    {
      key: 'labTitle',
      title: '实验',
      render: (_: any, record: RunningContainer) => (
        <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{record.labTitle}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: '120px',
      render: (_: any, record: RunningContainer) => (
        <div style={statusRowStyle}>
          <div style={statusDotStyle(getStatusColor(record.status))} />
          <span style={{
            fontSize: 12,
            color: getStatusColor(record.status),
            fontWeight: 500,
          }}>
            {getStatusLabel(record.status)}
          </span>
        </div>
      ),
    },
    {
      key: 'cpuUsage',
      title: 'CPU',
      width: '160px',
      render: (_: any, record: RunningContainer) => (
        <div style={progressBarContainerStyle}>
          <div style={progressBarTrackStyle}>
            <div style={{
              width: `${Math.min(record.cpuUsage, 100)}%`,
              height: '100%',
              background: getProgressColor(record.cpuUsage),
              borderRadius: 3,
            }} />
          </div>
          <span style={progressValueStyle}>{record.cpuUsage}%</span>
        </div>
      ),
    },
    {
      key: 'memoryUsage',
      title: '内存',
      width: '140px',
      render: (_: any, record: RunningContainer) => {
        const memoryLimitMB = record.memoryLimit.includes('Gi')
          ? parseInt(record.memoryLimit) * 1024
          : parseInt(record.memoryLimit);
        const percent = Math.round((record.memoryUsage / memoryLimitMB) * 100);
        return (
          <div style={progressBarContainerStyle}>
            <div style={progressBarTrackStyle}>
              <div style={{
                width: `${Math.min(percent, 100)}%`,
                height: '100%',
                background: getProgressColor(percent),
                borderRadius: 3,
              }} />
            </div>
            <span style={progressValueStyle}>{record.memoryUsage}MB</span>
          </div>
        );
      },
    },
    {
      key: 'uptime',
      title: '运行时间',
      width: '80px',
      render: (_: any, record: RunningContainer) => (
        <span style={uptimeStyle}>{record.uptime}</span>
      ),
    },
    {
      key: 'startedAt',
      title: '启动时间',
      width: '140px',
      render: (_: any, record: RunningContainer) => (
        <span style={dateTimeStyle}>{new Date(record.startedAt).toLocaleString()}</span>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      width: '130px',
      render: (_: any, record: RunningContainer) => (
        <div style={actionsCellStyle}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStop(record.containerId, e as any)}
            disabled={record.status === 'stopped'}
          >
            停止
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleRestart(record.containerId, e as any)}
            disabled={record.status === 'stopped'}
          >
            重启
          </Button>
        </div>
      ),
    },
  ];

  const runningCount = containers.filter(c => c.status === 'running').length;
  const pausedCount = containers.filter(c => c.status === 'paused').length;
  const stoppedCount = containers.filter(c => c.status === 'stopped').length;

  return (
    <div className="page-padding" style={pageStyle}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={pageTitleStyle}>容器监控</h1>
          <p style={pageSubtitleStyle}>监控和管理运行中的实验容器</p>
        </div>
        <Button variant="secondary">刷新</Button>
      </div>

      <div style={summaryRowStyle}>
        <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
          {containers.length} 个容器
        </span>
        <Badge variant="success" dot>{runningCount} 运行中</Badge>
        <Badge variant="warning" dot>{pausedCount} 已暂停</Badge>
        <Badge variant="default" dot>{stoppedCount} 已停止</Badge>
      </div>

      <Card padding="none"
        style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
      >
        {loading ? (
          <Spinner centered />
        ) : (
          <Table
            columns={columns}
            data={containers}
            rowKey="id"
            emptyText="没有运行中的容器"
          />
        )}
      </Card>
    </div>
  );
};
