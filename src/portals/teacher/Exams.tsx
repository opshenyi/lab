import React, { useState, useEffect } from 'react';
import { TopNav, Card, Badge, Table, Button, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Exam } from '../../types';

const statusConfig: Record<Exam['status'], { label: string; variant: 'default' | 'info' | 'success' }> = {
  draft: { label: '草稿', variant: 'default' },
  published: { label: '已发布', variant: 'info' },
  active: { label: '进行中', variant: 'success' },
  ended: { label: '已结束', variant: 'default' },
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const TeacherExams: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await api.getExams();
      setExams(data);
      setLoading(false);
    };
    load();
  }, []);

  const columns = [
    {
      key: 'title',
      title: '考试标题',
      render: (val: string, record: Exam) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{val}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>
            {record.courseName}
          </div>
        </div>
      ),
    },
    {
      key: 'courseName',
      title: '课程',
      width: '150px',
      render: (val: string) => (
        <span style={{ color: 'var(--ink-secondary)', fontSize: '13px' }}>{val}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: '110px',
      render: (val: Exam['status']) => {
        const config = statusConfig[val];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: 'questionIds',
      title: '题目数',
      width: '100px',
      render: (val: string[]) => (
        <span style={{ color: 'var(--ink)', fontWeight: 500 }}>
          {val.length}
        </span>
      ),
    },
    {
      key: 'totalPoints',
      title: '总分',
      width: '110px',
      render: (val: number) => (
        <span style={{ color: 'var(--ink)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'durationMinutes',
      title: '时长',
      width: '100px',
      render: (val: number) => (
        <span style={{ color: 'var(--ink-secondary)' }}>
          {val} 分钟
        </span>
      ),
    },
    {
      key: 'dateRange',
      title: '日期范围',
      width: '200px',
      render: (_: unknown, record: Exam) => (
        <div style={{ fontSize: '13px' }}>
          <div style={{ color: 'var(--ink-secondary)' }}>
            {formatDate(record.startTime)} {formatTime(record.startTime)}
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: '12px' }}>
            至 {formatDate(record.endTime)} {formatTime(record.endTime)}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: '',
      width: '120px',
      render: () => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="ghost" size="sm">查看</Button>
          <Button variant="ghost" size="sm">编辑</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <TopNav title="考试" subtitle="创建和管理考试" userName={user?.name} />

      <div className="page-padding">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-5)',
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.396px' }}>
              所有考试
            </h2>
            {!loading && (
              <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 'var(--space-1)' }}>
                共 {exams.length} 场考试
              </p>
            )}
          </div>
          <Button variant="primary" size="md">新建考试</Button>
        </div>

        <Card padding="none"
          style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
        >
          {loading ? (
            <Spinner centered />
          ) : (
            <Table
              columns={columns}
              data={exams}
              emptyText="暂无考试"
            />
          )}
        </Card>
      </div>
    </div>
  );
};
