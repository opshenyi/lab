import React, { useState, useEffect, useMemo } from 'react';
import { TopNav, Card, Badge, Table, Select } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Grade, Course, Exam } from '../../types';

export const TeacherGrades: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [g, c, e] = await Promise.all([
        api.getGrades(),
        api.getCourses(),
        api.getExams(),
      ]);
      setGrades(g);
      setCourses(c);
      setExams(e);
      setLoading(false);
    };
    load();
  }, []);

  const courseOptions = useMemo(() => [
    { value: '', label: '所有课程' },
    ...courses.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` })),
  ], [courses]);

  const examOptions = useMemo(() => {
    const filtered = selectedCourse
      ? exams.filter(e => e.courseId === selectedCourse)
      : exams;
    return [
      { value: '', label: '所有考试' },
      ...filtered.map(e => ({ value: e.id, label: e.title })),
    ];
  }, [exams, selectedCourse]);

  const filtered = useMemo(() => {
    let result = grades;
    if (selectedCourse) {
      result = result.filter(g => g.courseId === selectedCourse);
    }
    if (selectedExam) {
      result = result.filter(g => g.examId === selectedExam);
    }
    return result;
  }, [grades, selectedCourse, selectedExam]);

  const averageScore = useMemo(() => {
    if (filtered.length === 0) return null;
    const sum = filtered.reduce((acc, g) => acc + g.percentage, 0);
    return sum / filtered.length;
  }, [filtered]);

  const highestScore = useMemo(() => {
    if (filtered.length === 0) return null;
    return Math.max(...filtered.map(g => g.percentage));
  }, [filtered]);

  const lowestScore = useMemo(() => {
    if (filtered.length === 0) return null;
    return Math.min(...filtered.map(g => g.percentage));
  }, [filtered]);

  const passRate = useMemo(() => {
    if (filtered.length === 0) return null;
    const passing = filtered.filter(g => g.percentage >= 60).length;
    return (passing / filtered.length) * 100;
  }, [filtered]);

  const columns = [
    {
      key: 'studentName',
      title: '学生',
      render: (val: string) => (
        <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{val}</span>
      ),
    },
    {
      key: 'examTitle',
      title: '考试',
      render: (val: string, record: Grade) => (
        <div>
          <div style={{ color: 'var(--ink)', fontSize: '13px' }}>{val}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>
            {record.courseName}
          </div>
        </div>
      ),
    },
    {
      key: 'score',
      title: '得分',
      width: '120px',
      render: (_: unknown, record: Grade) => (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: 'var(--ink)',
        }}>
          {record.score}{' / '}{record.totalPoints}
        </span>
      ),
    },
    {
      key: 'percentage',
      title: '百分比',
      width: '120px',
      render: (val: number) => {
        const variant = val >= 90 ? 'success' : val >= 70 ? 'info' : val >= 60 ? 'warning' : 'error';
        return <Badge variant={variant}>{val.toFixed(1)}%</Badge>;
      },
    },
    {
      key: 'gradedAt',
      title: '批改日期',
      width: '140px',
      render: (val: string) => (
        <span style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>{val}</span>
      ),
    },
  ];

  return (
    <div>
      <TopNav title="成绩" subtitle="查看和分析学生成绩" userName={user?.name} />

      <div className="page-padding">
        {/* Summary cards */}
        <div className="grid-4" style={{ marginBottom: 'var(--space-5)' }}>
          <Card padding="md"
            style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', marginBottom: 'var(--space-1)' }}>
              平均分
            </p>
            <p style={{ fontWeight: 900, letterSpacing: '-2.5px', fontSize: 48, color: 'var(--ink)', lineHeight: 0.85 }}>
              {loading || averageScore === null ? '--' : `${averageScore.toFixed(1)}%`}
            </p>
          </Card>
          <Card padding="md"
            style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', marginBottom: 'var(--space-1)' }}>
              最高分
            </p>
            <p style={{ fontWeight: 900, letterSpacing: '-2.5px', fontSize: 48, color: 'var(--success)', lineHeight: 0.85 }}>
              {loading || highestScore === null ? '--' : `${highestScore.toFixed(1)}%`}
            </p>
          </Card>
          <Card padding="md"
            style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', marginBottom: 'var(--space-1)' }}>
              最低分
            </p>
            <p style={{ fontWeight: 900, letterSpacing: '-2.5px', fontSize: 48, color: 'var(--error)', lineHeight: 0.85 }}>
              {loading || lowestScore === null ? '--' : `${lowestScore.toFixed(1)}%`}
            </p>
          </Card>
          <Card padding="md"
            style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', marginBottom: 'var(--space-1)' }}>
              及格率
            </p>
            <p style={{ fontWeight: 900, letterSpacing: '-2.5px', fontSize: 48, color: 'var(--accent)', lineHeight: 0.85 }}>
              {loading || passRate === null ? '--' : `${passRate.toFixed(1)}%`}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
          alignItems: 'flex-end',
        }}>
          <div style={{ minWidth: '260px' }}>
            <Select
              label="课程"
              options={courseOptions}
              value={selectedCourse}
              onChange={e => {
                setSelectedCourse(e.target.value);
                setSelectedExam('');
              }}
            />
          </div>
          <div style={{ minWidth: '260px' }}>
            <Select
              label="考试"
              options={examOptions}
              value={selectedExam}
              onChange={e => setSelectedExam(e.target.value)}
            />
          </div>
        </div>

        {/* Grades table */}
        <Card padding="none"
          style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
        >
          <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.396px' }}>
              成绩结果
            </span>
            <span style={{ fontSize: 13, color: 'var(--ink-muted)', marginLeft: 'var(--space-2)' }}>
              ({filtered.length} 条记录)
            </span>
          </div>
          <Table
            columns={columns}
            data={filtered}
            emptyText="暂无符合筛选条件的成绩"
          />
        </Card>
      </div>
    </div>
  );
};
