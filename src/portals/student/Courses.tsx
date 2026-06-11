import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, Card, Badge } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Course } from '../../types';

export const StudentCourses: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await api.getCourses();
      setCourses(data);
      setLoading(false);
    };
    load();
  }, []);

  const getStatusVariant = (s: string) => {
    if (s === 'active') return 'success';
    if (s === 'archived') return 'default';
    return 'warning';
  };

  if (loading) {
    return (
      <div>
        <TopNav title="课程" subtitle="你已选的课程" userName={user?.name} />
        <div style={{ padding: 'var(--space-6)', color: 'var(--ink-muted)' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <TopNav title="课程" subtitle={`共 ${courses.length} 门已选课程`} userName={user?.name} />

      <div className="page-padding">
        <div className="grid-3">
          {courses.map((course) => (
            <Card key={course.id} hoverable padding="none" onClick={() => navigate('/student/labs')}
              style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px', transition: 'background 0.12s', cursor: 'pointer' }}
            >
              {/* Cover Band */}
              <div style={{
                height: 4,
                background: course.coverColor,
                borderRadius: '24px 24px 0 0',
              }} />

              <div style={{ padding: 'var(--space-5)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                      {course.code}
                    </p>
                    <h3 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: 0, lineHeight: 1.25, letterSpacing: '-0.396px' }}>
                      {course.name}
                    </h3>
                  </div>
                  <Badge variant={getStatusVariant(course.status)} size="sm">
                    {course.status === 'active' ? '进行中' : course.status === 'archived' ? '已归档' : course.status}
                  </Badge>
                </div>

                {/* Description */}
                <p style={{ fontSize: 16, fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 1.44, marginBottom: 'var(--space-4)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </p>

                {/* Teacher */}
                <p style={{ fontSize: 16, fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 1.44, marginBottom: 'var(--space-4)' }}>
                  {course.teacherName}
                </p>

                {/* Stats Row */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-4)',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border)',
                }}>
                  {[
                    { label: '学生数', value: course.studentCount },
                    { label: '实验数', value: course.labCount },
                    { label: '考试数', value: course.examCount },
                  ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 0.85, color: 'var(--ink)' }}>{stat.value}</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
