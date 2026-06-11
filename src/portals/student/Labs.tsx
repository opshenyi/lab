import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, Badge, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Lab, Course } from '../../types';

export const StudentLabs: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [l, c] = await Promise.all([api.getLabs(), api.getCourses()]);
      setLabs(l);
      setCourses(c);
      setLoading(false);
    };
    load();
  }, []);

  const courseMap = new Map(courses.map(c => [c.id, c]));

  const getStatusVariant = (s: string) => {
    if (s === 'completed') return 'success';
    if (s === 'in_progress') return 'info';
    return 'default';
  };

  const formatDate = (d?: string) => {
    if (!d) return '--';
    return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div>
        <TopNav title="实验" subtitle="实验工作台" userName={user?.name} />
        <Spinner centered />
      </div>
    );
  }

  return (
    <div>
      <TopNav title="实验" subtitle={`共 ${labs.length} 个可用实验`} userName={user?.name} />

      <div className="page-padding">
        {/* Table Header */}
        <div style={{
          borderRadius: 30,
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          {/* Header Row */}
          <div className="table-grid-row table-grid-5col" style={{
            padding: 'var(--space-3) var(--space-5)',
            borderBottom: '1px solid var(--border)',
            background: 'var(--canvas-elevated)',
          }}>
            {['实验名称', '课程', '状态', '截止日期', '预计时长'].map((h, idx) => (
              <p key={h} className={idx >= 3 ? 'hide-mobile' : ''} style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {h}
              </p>
            ))}
          </div>

          {/* Data Rows */}
          {labs.map((lab, i) => (
            <div
              key={lab.id}
              onClick={() => navigate(`/student/labs/${lab.id}`)}
              className="table-grid-row table-grid-5col"
              style={{
                padding: 'var(--space-3) var(--space-5)',
                borderBottom: i < labs.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lab.title}
                </p>
                <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lab.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: courseMap.get(lab.courseId)?.coverColor || '#5b6170',
                  flexShrink: 0,
                }} />
                <p style={{ fontSize: 13, color: 'var(--ink-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {courseMap.get(lab.courseId)?.code || '--'}
                </p>
              </div>

              <div>
                <Badge variant={getStatusVariant(lab.status)} size="sm">
                  {lab.status === 'completed' ? '已完成' : lab.status === 'in_progress' ? '进行中' : '未开始'}
                </Badge>
              </div>

              <p className="hide-mobile" style={{ fontSize: 13, color: 'var(--ink-secondary)' }}>
                {formatDate(lab.dueDate)}
              </p>

              <p className="hide-mobile" style={{ fontSize: 13, color: 'var(--ink-secondary)' }}>
                {lab.estimatedMinutes} 分钟
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
