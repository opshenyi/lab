import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, Badge, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Course, Lab, Exam, Grade } from '../../types';
import './Dashboard.css';

const HOME_UI = {
  card: {
    border: 'none',
    borderRadius: 8,
    padding: '24px',
    background: 'var(--surface-2)',
  },
  cardTitle: {
    fontSize: 22, fontWeight: 600 as const, color: 'var(--ink)',
    letterSpacing: '-0.396px', lineHeight: 1.25, marginBottom: 8,
  },
  cardDesc: {
    fontSize: 16, fontWeight: 400 as const, color: 'var(--ink-secondary)',
    lineHeight: 1.44,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 700 as const, color: 'var(--ink)',
    letterSpacing: 0, lineHeight: '24px',
  },
  body: {
    fontSize: 18, fontWeight: 400 as const, color: 'var(--ink-secondary)',
    lineHeight: 1.44,
  },
  label: {
    fontSize: 14, fontWeight: 500 as const, color: 'var(--ink-tertiary)',
  },
};

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [c, l, e, g] = await Promise.all([api.getCourses(), api.getLabs(), api.getExams(), api.getGrades()]);
      setCourses(c); setLabs(l); setExams(e); setGrades(g); setLoading(false);
    };
    load();
  }, []);

  const completedLabs = labs.filter(l => l.status === 'completed').length;
  const upcomingExams = exams.filter(e => e.status === 'published' || e.status === 'active').length;
  const averageGrade = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + g.percentage, 0) / grades.length) : 0;
  const recentLabs = labs.slice(0, 5);
  const upcomingExamsList = exams.filter(e => e.status === 'published' || e.status === 'active').slice(0, 4);
  const nextLab = labs.find(l => l.status === 'in_progress') || labs.find(l => l.status !== 'completed') || labs[0];

  if (loading) return <div><TopNav title="" userName={user?.name} /><Spinner centered /></div>;

  return (
    <div>
      <TopNav title="" userName={user?.name} />
      <div className="page-padding student-home-page">

        <section className="student-home-overview">
          <div className="student-home-heading">
            <div className="student-home-meta" aria-label="学籍信息">
              <span className="student-home-detail">{user?.department}</span>
              <span className="student-home-id">学号 {user?.studentId}</span>
            </div>
            <div className="student-home-actions">
              <button className="student-home-action student-home-action-primary" onClick={() => nextLab && navigate(`/student/labs/${nextLab.id}`)}>
                继续实验
              </button>
              <button className="student-home-action" onClick={() => navigate('/student/exams')}>
                查看考试
              </button>
            </div>
          </div>

          <div className="student-home-stats">
            {[
              { value: courses.length, label: '已选课程', unit: '门' },
              { value: completedLabs, label: '完成实验', unit: '个' },
              { value: upcomingExams, label: '待参加考试', unit: '场' },
              { value: averageGrade, label: '平均成绩', unit: '%' },
            ].map(s => (
              <div className="student-home-stat" key={s.label}>
                <span className="student-home-stat-label">{s.label}</span>
                <span className="student-home-stat-value">
                  {s.value}<span>{s.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ ...HOME_UI.sectionTitle, marginBottom: 24 }}>我的课程</h2>
          <div className="grid-3">
            {courses.slice(0, 3).map(c => (
              <div key={c.id} onClick={() => navigate(`/student/courses/${c.id}`)} style={{
                ...HOME_UI.card, cursor: 'pointer', transition: 'background 0.12s ease',
              }}
              >
                <p style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: 16 }}>{c.code}</p>
                <p style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.396px', lineHeight: 1.25, marginBottom: 12 }}>{c.name}</p>
                <p style={{ ...HOME_UI.cardDesc, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{c.description}</p>
                <p style={{ fontSize: 14, color: 'var(--ink-tertiary)', fontWeight: 500 }}>{c.teacherName} &middot; {c.studentCount} 学生</p>
              </div>
            ))}
          </div>
        </section>

        {/* Labs */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <h2 style={HOME_UI.sectionTitle}>最近实验</h2>
            <span style={{ fontSize: 14, color: 'var(--ink-tertiary)', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate('/student/labs')}>查看全部</span>
          </div>
          {recentLabs.map((lab, i) => (
            <div key={lab.id} onClick={() => navigate(`/student/labs/${lab.id}`)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', cursor: 'pointer',
              margin: '0 -16px 4px',
              borderRadius: 8,
              transition: 'background 0.12s',
            }}
            >
              <div>
                <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.2px' }}>{lab.title}</p>
                <p style={{ fontSize: 14, color: 'var(--ink-tertiary)', marginTop: 4 }}>{lab.templateName} &middot; {lab.estimatedMinutes} 分钟</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Badge variant={lab.status === 'completed' ? 'success' : lab.status === 'in_progress' ? 'info' : 'default'} size="sm">
                  {lab.status === 'completed' ? '已完成' : lab.status === 'in_progress' ? '进行中' : '未开始'}
                </Badge>
              </div>
            </div>
          ))}
        </section>

        {/* Exams */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <h2 style={HOME_UI.sectionTitle}>即将到来的考试</h2>
            <span style={{ fontSize: 14, color: 'var(--ink-tertiary)', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate('/student/exams')}>查看全部</span>
          </div>
          {upcomingExamsList.length === 0 ? (
            <p style={{ ...HOME_UI.body, padding: '24px 0' }}>暂无考试</p>
          ) : upcomingExamsList.map(exam => (
            <div key={exam.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              margin: '0 -16px 4px',
              borderRadius: 8,
            }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.2px' }}>{exam.title}</p>
                <p style={{ fontSize: 14, color: 'var(--ink-tertiary)', marginTop: 4 }}>{exam.courseName} &middot; {exam.durationMinutes} 分钟</p>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{exam.totalPoints} 分</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
