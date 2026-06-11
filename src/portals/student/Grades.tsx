import React, { useState, useEffect } from 'react';
import { TopNav, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Grade } from '../../types';

export const StudentGrades: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await api.getGrades();
      setGrades(data);
      setLoading(false);
    };
    load();
  }, []);

  // Group grades by course
  const grouped = grades.reduce<Record<string, Grade[]>>((acc, grade) => {
    if (!acc[grade.courseName]) acc[grade.courseName] = [];
    acc[grade.courseName].push(grade);
    return acc;
  }, {});

  const getPercentageColor = (pct: number) => {
    if (pct >= 80) return 'var(--success)';
    if (pct >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  const getPercentageBg = (pct: number) => {
    if (pct >= 80) return 'var(--success-muted)';
    if (pct >= 60) return 'var(--warning-muted)';
    return 'var(--error-muted)';
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const overallAverage = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length)
    : 0;

  if (loading) {
    return (
      <div>
        <TopNav title="成绩" subtitle="你的学业表现" userName={user?.name} />
        <Spinner centered />
      </div>
    );
  }

  return (
    <div>
      <TopNav title="成绩" subtitle={`共 ${grades.length} 场已批改考试`} userName={user?.name} />

      <div className="page-padding">
        {/* Summary Card */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-6)',
          padding: '28px 24px',
          border: '1px solid var(--border)',
          borderRadius: 30,
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', marginBottom: 'var(--space-1)' }}>
              总平均分
            </p>
            <p style={{
              fontSize: 48,
              fontWeight: 900,
              color: getPercentageColor(overallAverage),
              letterSpacing: '-2.5px',
              lineHeight: 0.85,
            }}>
              {overallAverage}%
            </p>
          </div>
          <div style={{ width: 1, background: 'var(--border)' }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', marginBottom: 'var(--space-1)' }}>
              已完成考试
            </p>
            <p style={{ fontSize: 48, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-2.5px', lineHeight: 0.85 }}>
              {grades.length}
            </p>
          </div>
          <div style={{ width: 1, background: 'var(--border)' }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', marginBottom: 'var(--space-1)' }}>
              总分
            </p>
            <p style={{ fontSize: 48, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-2.5px', lineHeight: 0.85 }}>
              {grades.reduce((sum, g) => sum + g.score, 0)}/{grades.reduce((sum, g) => sum + g.totalPoints, 0)}
            </p>
          </div>
        </div>

        {/* Grade Tables by Course */}
        {Object.entries(grouped).map(([courseName, courseGrades]) => (
          <div key={courseName} style={{
            marginTop: 64,
            border: '1px solid var(--border)',
            borderRadius: 30,
            overflow: 'hidden',
          }}>
            {/* Course Header */}
            <div style={{
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.396px' }}>
                {courseName}
              </h3>
              <p style={{ fontSize: 16, fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 1.44 }}>
                课程平均分：
                <span style={{
                  fontWeight: 600,
                  color: getPercentageColor(
                    Math.round(courseGrades.reduce((s, g) => s + g.percentage, 0) / courseGrades.length)
                  ),
                }}>
                  {Math.round(courseGrades.reduce((s, g) => s + g.percentage, 0) / courseGrades.length)}%
                </span>
              </p>
            </div>

            {/* Table Header */}
            <div className="table-grid-row table-grid-4col" style={{
              padding: 'var(--space-2) var(--space-5)',
              borderBottom: '1px solid var(--border)',
            }}>
              {['考试', '得分', '百分比', '批改日期'].map((h, idx) => (
                <p key={h} className={idx >= 3 ? 'hide-mobile' : ''} style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {h}
                </p>
              ))}
            </div>

            {/* Table Rows */}
            {courseGrades.map((grade, i) => (
              <div
                key={grade.id}
                className="table-grid-row table-grid-4col"
                style={{
                  padding: 'var(--space-3) var(--space-5)',
                  borderBottom: i < courseGrades.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.12s',
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                  {grade.examTitle}
                </p>
                <p style={{ fontSize: 14, color: 'var(--ink-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {grade.score}<span style={{ color: 'var(--ink-soft)' }}>/{grade.totalPoints}</span>
                </p>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '5px 16px',
                    borderRadius: 9999,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: getPercentageColor(grade.percentage),
                    background: getPercentageBg(grade.percentage),
                  }}>
                    {grade.percentage}%
                  </span>
                </div>
                <p className="hide-mobile" style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                  {formatDate(grade.gradedAt)}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
