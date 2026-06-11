import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, Card, Badge, Button, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Exam } from '../../types';

export const StudentExams: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await api.getExams();
      setExams(data);
      setLoading(false);
    };
    load();
  }, []);

  const getStatusVariant = (s: string) => {
    if (s === 'active') return 'success';
    if (s === 'published') return 'info';
    if (s === 'ended') return 'default';
    return 'warning';
  };

  const formatDateTime = (d: string) => {
    return new Date(d).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canStart = (exam: Exam) => {
    return exam.status === 'published' || exam.status === 'active';
  };

  if (loading) {
    return (
      <div>
        <TopNav title="考试" subtitle="你的考试" userName={user?.name} />
        <Spinner centered />
      </div>
    );
  }

  return (
    <div>
      <TopNav title="考试" subtitle={`共 ${exams.length} 场考试`} userName={user?.name} />

      <div className="page-padding">
        {exams.map((exam) => (
          <Card key={exam.id} padding="none"
            style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px', marginBottom: 'var(--space-4)', transition: 'background 0.12s' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-5)',
            }}>
              {/* Left accent bar */}
              <div style={{
                width: 4,
                height: 48,
                borderRadius: 2,
                background: canStart(exam) ? 'var(--accent)' : 'var(--border)',
                flexShrink: 0,
              }} />

              {/* Exam Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                  <h3 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.396px', lineHeight: 1.25 }}>
                    {exam.title}
                  </h3>
                  <Badge variant={getStatusVariant(exam.status)} size="sm">
                    {exam.status === 'active' ? '进行中' : exam.status === 'published' ? '已发布' : exam.status === 'ended' ? '已结束' : exam.status === 'draft' ? '草稿' : exam.status}
                  </Badge>
                </div>
                <p style={{ fontSize: 16, fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 1.44, marginBottom: 'var(--space-2)' }}>
                  {exam.description}
                </p>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)' }}>
                  {exam.courseName}
                </p>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', gap: 'var(--space-6)', flexShrink: 0, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
                    开始时间
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--ink-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {formatDateTime(exam.startTime)}
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
                    时长
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--ink-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {exam.durationMinutes} 分钟
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
                    分值
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--ink-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {exam.totalPoints}
                  </p>
                </div>

                {canStart(exam) ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/student/exams/${exam.id}`)}
                  >
                    开始
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" disabled>
                    {exam.status === 'draft' ? '暂不可用' : '已结束'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
