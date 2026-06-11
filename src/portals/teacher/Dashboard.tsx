import React, { useState, useEffect } from 'react';
import { TopNav, Card, Badge, Table, Button } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Course, Question, Grade } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [c, q, g] = await Promise.all([
        api.getCourses(),
        api.getQuestions(),
        api.getGrades(),
      ]);
      setCourses(c);
      setQuestions(q);
      setGrades(g);
      setLoading(false);
    };
    load();
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + c.studentCount, 0);
  const pendingGrading = grades.filter(g => !g.gradedAt || g.percentage === 0).length;

  const statCards = [
    { label: '课程总数', value: courses.length, color: 'var(--accent)' },
    { label: '学生总数', value: totalStudents, color: 'var(--success)' },
    { label: '待批改', value: pendingGrading, color: 'var(--warning)' },
    { label: '题目数量', value: questions.length, color: 'var(--info)' },
  ];

  const recentSubmissions = grades.slice(0, 5);

  const submissionColumns = [
    { key: 'studentName', title: '学生' },
    { key: 'examTitle', title: '考试' },
    { key: 'courseName', title: '课程' },
    {
      key: 'score',
      title: '得分',
      render: (_: unknown, record: Grade) => (
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
          {record.score}/{record.totalPoints}
        </span>
      ),
    },
    {
      key: 'percentage',
      title: '百分比',
      render: (_: unknown, record: Grade) => {
        const p = record.percentage;
        const variant = p >= 90 ? 'success' : p >= 70 ? 'info' : p >= 60 ? 'warning' : 'error';
        return <Badge variant={variant}>{p.toFixed(1)}%</Badge>;
      },
    },
    {
      key: 'gradedAt',
      title: '批改时间',
      render: (val: string) => (
        <span style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>{val}</span>
      ),
    },
  ];

  return (
    <div>
      <TopNav title="仪表盘" subtitle="教学活动概览" userName={user?.name} />

      <div className="page-padding">
        {/* Welcome banner */}
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 30,
          padding: '28px 24px',
          marginBottom: 64,
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--space-1)', letterSpacing: '-0.396px', lineHeight: 1.25 }}>
            欢迎回来，{user?.name || '教师'}
          </h2>
          <p style={{ fontSize: 16, fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 1.44 }}>
            以下是您本学期的教学活动概览。当前有 {courses.length} 门活跃课程，题库中有 {questions.length} 道题目。
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid-4" style={{ marginBottom: 64 }}>
          {statCards.map((stat) => (
            <Card key={stat.label} padding="md"
              style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: 8,
                  height: 40,
                  borderRadius: 8,
                  background: stat.color,
                  flexShrink: 0,
                }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', marginBottom: 'var(--space-1)' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontWeight: 900, letterSpacing: '-2.5px', fontSize: 48, color: 'var(--ink)', lineHeight: 0.85 }}>
                    {loading ? '--' : stat.value}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent submissions */}
        <Card padding="none"
          style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
        >
          <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.396px' }}>
                最近提交
              </h3>
              <Button variant="ghost" size="sm">查看全部</Button>
            </div>
          </div>
          <Table
            columns={submissionColumns}
            data={recentSubmissions}
            emptyText="暂无最近提交"
          />
        </Card>
      </div>
    </div>
  );
};
