import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, Button, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Exam } from '../../types';
import './Exams.css';

const statusMeta: Record<Exam['status'], { label: string; tone: string }> = {
  active: { label: '进行中', tone: 'active' },
  published: { label: '可参加', tone: 'available' },
  draft: { label: '待开放', tone: 'locked' },
  ended: { label: '已结束', tone: 'ended' },
};

const canStart = (exam: Exam) => exam.status === 'published' || exam.status === 'active';

const formatDateTime = (date: string) => new Date(date).toLocaleDateString('zh-CN', {
  month: 'short',
  day: 'numeric',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

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

  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => {
      const aPriority = canStart(a) ? 0 : a.status === 'draft' ? 1 : 2;
      const bPriority = canStart(b) ? 0 : b.status === 'draft' ? 1 : 2;
      return aPriority - bPriority || new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [exams]);

  const availableCount = exams.filter(canStart).length;
  const lockedCount = exams.filter(exam => exam.status === 'draft').length;
  const totalPoints = exams.reduce((sum, exam) => sum + exam.totalPoints, 0);
  const nextExam = sortedExams.find(canStart);

  if (loading) {
    return (
      <div>
        <TopNav title="" userName={user?.name} />
        <Spinner centered />
      </div>
    );
  }

  return (
    <div>
      <TopNav title="" userName={user?.name} />

      <div className="page-padding student-exams-page">
        <section className="student-exams-overview" aria-label="考试概览">
          <div className="student-exams-focus">
            <span>当前测验</span>
            <strong>{nextExam?.title ?? '暂无开放测验'}</strong>
            <p>
              {nextExam
                ? `${nextExam.courseName} · ${formatDateTime(nextExam.startTime)}`
                : '新的课程测验开放后，会在这里优先显示。'}
            </p>
          </div>

          <div className="student-exams-summary" aria-label="测验统计">
            <span>
              <strong>{availableCount}</strong>
              可参加
            </span>
            <span>
              <strong>{lockedCount}</strong>
              待开放
            </span>
            <span>
              <strong>{totalPoints}</strong>
              总分值
            </span>
          </div>
        </section>

        <section className="student-exams-list" aria-label="考试列表">
          {sortedExams.length === 0 ? (
            <p className="student-exams-empty">暂无考试安排。</p>
          ) : sortedExams.map((exam) => {
            const meta = statusMeta[exam.status];
            const startable = canStart(exam);

            return (
              <article className="student-exam-row" key={exam.id}>
                <div className={`student-exam-status student-exam-status-${meta.tone}`}>
                  <i aria-hidden="true" />
                  {meta.label}
                </div>

                <div className="student-exam-main">
                  <span>{exam.courseName}</span>
                  <h2>{exam.title}</h2>
                  <p>{exam.description}</p>
                </div>

                <div className="student-exam-meta" aria-label="考试信息">
                  <span>
                    <small>开始</small>
                    <strong>{formatDateTime(exam.startTime)}</strong>
                  </span>
                  <span>
                    <small>时长</small>
                    <strong>{exam.durationMinutes} 分钟</strong>
                  </span>
                  <span>
                    <small>分值</small>
                    <strong>{exam.totalPoints} 分</strong>
                  </span>
                </div>

                <Button
                  variant={startable ? 'primary' : 'ghost'}
                  size="sm"
                  disabled={!startable}
                  onClick={() => navigate(`/student/exams/${exam.id}`)}
                >
                  {startable ? '进入测验' : exam.status === 'draft' ? '待开放' : '已结束'}
                </Button>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};
