import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Badge, Button, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import type { SystemStats, RunningContainer } from '../../types';

const statCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2)',
};

const statValueStyle: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 900,
  letterSpacing: '-2.5px',
  color: 'var(--ink)',
  lineHeight: 0.85,
  fontFamily: 'var(--font-sans)',
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--ink-tertiary)',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};

const progressBarContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
};

const progressBarTrackStyle: React.CSSProperties = {
  flex: 1,
  height: 6,
  background: 'var(--canvas-elevated)',
  borderRadius: 3,
};

const progressBarLabelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--ink-secondary)',
  minWidth: 100,
};

const progressBarValueStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--ink-muted)',
  minWidth: 48,
  textAlign: 'right' as const,
  fontFamily: 'var(--font-mono)',
};

const gaugeContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: 'var(--space-4) 0',
};

const gaugeLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--ink-muted)',
};

const gaugeValueStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: 'var(--ink)',
  fontFamily: 'var(--font-mono)',
};

const activityItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: 'var(--space-3) 0',
  borderBottom: '1px solid var(--border)',
};

const activityTimeStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--ink-soft)',
  fontFamily: 'var(--font-mono)',
  minWidth: 60,
};

const activityTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--ink-secondary)',
  flex: 1,
};

const gridStyle: React.CSSProperties = {};

const twoColGridStyle: React.CSSProperties = {};

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

const recentListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const iconBoxStyle = (color: string): React.CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  background: `${color}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  flexShrink: 0,
});

const getProgressColor = (percent: number): string => {
  if (percent >= 85) return 'var(--error)';
  if (percent >= 65) return 'var(--warning)';
  return 'var(--accent)';
};

const recentActivity = [
  { time: '2 分钟前', text: '张伟 启动了 Shell 脚本基础实验', variant: 'info' as const },
  { time: '5 分钟前', text: '王芳 启动了 Docker 容器生命周期实验', variant: 'info' as const },
  { time: '12 分钟前', text: '模板"Python 数据科学"开始构建', variant: 'warning' as const },
  { time: '25 分钟前', text: '陈宇 暂停了网络扫描容器', variant: 'default' as const },
  { time: '1 小时前', text: '李明教授 发布了 Docker 基础测验', variant: 'success' as const },
  { time: '2 小时前', text: '系统备份已成功完成', variant: 'success' as const },
];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [containers, setContainers] = useState<RunningContainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, containersData] = await Promise.all([
          api.getSystemStats(),
          api.getContainers(),
        ]);
        setStats(statsData);
        setContainers(containersData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="page-padding" style={pageStyle}>
        <Spinner centered />
      </div>
    );
  }

  const runningCount = containers.filter(c => c.status === 'running').length;

  const statCards = [
    { label: '用户总数', value: stats.totalUsers, color: 'var(--accent)' },
    { label: '运行容器', value: stats.runningContainers, color: 'var(--success)' },
    { label: '模板数', value: stats.totalTemplates, color: 'var(--info)' },
    { label: '课程数', value: stats.totalCourses, color: 'var(--warning)' },
  ];

  return (
    <div className="page-padding" style={pageStyle}>
      <div>
        <h1 style={pageTitleStyle}>系统概览</h1>
        <p style={pageSubtitleStyle}>监控系统健康状况、资源使用情况和近期活动</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4">
        {statCards.map(card => (
          <Card key={card.label}
            style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
          >
            <div style={statCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={iconBoxStyle(card.color)}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.color }} />
                </div>
                <div>
                  <div style={statValueStyle}>{card.value}</div>
                  <div style={statLabelStyle}>{card.label}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid-2">
        {/* Resource Usage */}
        <Card style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}>
          <CardHeader title="资源使用" subtitle="CPU 和内存使用情况" />
          <div style={sectionStyle}>
            <div style={progressBarContainerStyle}>
              <span style={progressBarLabelStyle}>CPU 使用率</span>
              <div style={progressBarTrackStyle}>
                <div style={{
                  width: `${stats.cpuUsagePercent}%`,
                  height: '100%',
                  background: getProgressColor(stats.cpuUsagePercent),
                  borderRadius: 3,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <span style={progressBarValueStyle}>{stats.cpuUsagePercent}%</span>
            </div>
            <div style={progressBarContainerStyle}>
              <span style={progressBarLabelStyle}>内存使用率</span>
              <div style={progressBarTrackStyle}>
                <div style={{
                  width: `${stats.memoryUsagePercent}%`,
                  height: '100%',
                  background: getProgressColor(stats.memoryUsagePercent),
                  borderRadius: 3,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <span style={progressBarValueStyle}>{stats.memoryUsagePercent}%</span>
            </div>
          </div>
        </Card>

        {/* Container Capacity */}
        <Card style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}>
          <CardHeader title="容器容量" subtitle="当前分配与总容量" />
          <div style={gaugeContainerStyle}>
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="var(--accent-contrast)"
                  strokeWidth="10"
                />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="10"
                  strokeDasharray={`${(runningCount / stats.containerCapacity) * 314.16} 314.16`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={gaugeValueStyle}>{runningCount}</span>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>/ {stats.containerCapacity}</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--ink-secondary)' }}>
                {Math.round((runningCount / stats.containerCapacity) * 100)}% 容量使用中
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 'var(--space-1)' }}>
                {stats.containerCapacity - runningCount} 个容器可用
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid-2">
        <Card style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}>
          <CardHeader title="用户分布" />
          <div style={{ display: 'flex', gap: 'var(--space-6)', paddingTop: 'var(--space-2)' }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{stats.totalStudents}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)' }}>学生</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{stats.totalTeachers}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)' }}>教师</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{stats.totalLabs}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)' }}>实验总数</div>
            </div>
          </div>
        </Card>

        <Card style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}>
          <CardHeader title="活跃容器" action={<Badge variant="success" dot>实时</Badge>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
            {containers.slice(0, 3).map(c => (
              <div key={c.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 13,
              }}>
                <span style={{ color: 'var(--ink-secondary)' }}>{c.studentName}</span>
                <Badge
                  variant={c.status === 'running' ? 'success' : c.status === 'paused' ? 'warning' : 'default'}
                  dot
                >
                  {c.templateName}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}>
        <CardHeader title="近期活动" subtitle="最新系统事件" />
        <div style={recentListStyle}>
          {recentActivity.map((item, i) => (
            <div key={i} style={activityItemStyle}>
              <span style={activityTimeStyle}>{item.time}</span>
              <span style={activityTextStyle}>{item.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
