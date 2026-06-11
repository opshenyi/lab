import React, { useState, useEffect } from 'react';
import { TopNav, Card, Badge, Table, Button } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Course } from '../../types';

const statusVariantMap: Record<Course['status'], 'success' | 'default' | 'warning'> = {
  active: 'success',
  archived: 'default',
  draft: 'warning',
};

const statusLabelMap: Record<Course['status'], string> = {
  active: '进行中',
  archived: '已归档',
  draft: '草稿',
};

export const TeacherCourses: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await api.getCourses();
      setCourses(data);
      setLoading(false);
    };
    load();
  }, []);

  const columns = [
    {
      key: 'code',
      title: '课程编号',
      width: '100px',
      render: (val: string) => (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--accent)',
          fontWeight: 500,
        }}>
          {val}
        </span>
      ),
    },
    {
      key: 'name',
      title: '课程名称',
      render: (val: string, record: Course) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{val}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>
            {record.semester}
          </div>
        </div>
      ),
    },
    {
      key: 'semester',
      title: '学期',
      width: '130px',
      render: (val: string) => (
        <span style={{ color: 'var(--ink-secondary)', fontSize: '13px' }}>{val}</span>
      ),
    },
    {
      key: 'studentCount',
      title: '学生数',
      width: '90px',
      render: (val: number) => (
        <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{val}</span>
      ),
    },
    {
      key: 'labCount',
      title: '实验数',
      width: '70px',
      render: (val: number) => (
        <span style={{ color: 'var(--ink-secondary)' }}>{val}</span>
      ),
    },
    {
      key: 'examCount',
      title: '考试数',
      width: '70px',
      render: (val: number) => (
        <span style={{ color: 'var(--ink-secondary)' }}>{val}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: '100px',
      render: (val: Course['status']) => (
        <Badge variant={statusVariantMap[val]}>{statusLabelMap[val]}</Badge>
      ),
    },
    {
      key: 'actions',
      title: '',
      width: '140px',
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
      <TopNav title="课程" subtitle="管理您的课程" userName={user?.name} />

      <div className="page-padding">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-5)',
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.396px' }}>
              全部课程
            </h2>
            <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 'var(--space-1)' }}>
              {loading ? '加载中...' : `共 ${courses.length} 门课程`}
            </p>
          </div>
          <Button variant="primary" size="md">新建课程</Button>
        </div>

        <Card padding="none"
          style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
        >
          <Table
            columns={columns}
            data={courses}
            emptyText="暂无课程"
          />
        </Card>
      </div>
    </div>
  );
};
