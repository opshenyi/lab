import React, { useEffect, useMemo, useState } from 'react';
import { TopNav, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Grade } from '../../types';
import './Grades.css';

const formatDate = (date: string) => new Date(date).toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const formatPercent = (value: number) => {
  const fixed = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return `${fixed}%`;
};

const getGradeTone = (percentage: number) => {
  if (percentage >= 85) return 'strong';
  if (percentage >= 70) return 'steady';
  return 'watch';
};

export const StudentGrades: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await api.getGrades(user?.id);
      setGrades(data);
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const groupedGrades = useMemo(() => {
    return grades.reduce<Record<string, Grade[]>>((acc, grade) => {
      if (!acc[grade.courseName]) acc[grade.courseName] = [];
      acc[grade.courseName].push(grade);
      return acc;
    }, {});
  }, [grades]);

  const overallAverage = grades.length > 0
    ? grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length
    : 0;
  const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
  const totalPoints = grades.reduce((sum, grade) => sum + grade.totalPoints, 0);
  const courseCount = Object.keys(groupedGrades).length;

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

      <div className="page-padding student-grades-page">
        <section className="student-grades-overview" aria-label="成绩概览">
          <div className="student-grades-lead">
            <span>学习表现</span>
            <p>已批改的课程测验会按课程归档，方便你快速回看表现。</p>
          </div>

          <div className={`student-grades-average student-grades-average-${getGradeTone(overallAverage)}`}>
            <small>平均成绩</small>
            <strong>{grades.length > 0 ? formatPercent(overallAverage) : '--'}</strong>
          </div>

          <div className="student-grades-summary" aria-label="成绩统计">
            <span>
              <strong>{grades.length}</strong>
              已批改
            </span>
            <span>
              <strong>{courseCount}</strong>
              课程
            </span>
            <span>
              <strong>{totalPoints > 0 ? `${totalScore}/${totalPoints}` : '--'}</strong>
              累计得分
            </span>
          </div>
        </section>

        {grades.length === 0 ? (
          <p className="student-grades-empty">暂无已批改成绩。</p>
        ) : (
          <section className="student-grades-courses" aria-label="课程成绩">
            {Object.entries(groupedGrades).map(([courseName, courseGrades]) => {
              const courseAverage = courseGrades.reduce((sum, grade) => sum + grade.percentage, 0) / courseGrades.length;

              return (
                <article className="student-grade-course" key={courseName}>
                  <div className="student-grade-course-head">
                    <span>
                      <small>课程</small>
                      <strong>{courseName}</strong>
                    </span>
                    <em className={`student-grade-course-average student-grade-tone-${getGradeTone(courseAverage)}`}>
                      {formatPercent(courseAverage)}
                    </em>
                  </div>

                  <div className="student-grade-list">
                    {courseGrades.map((grade) => (
                      <div className="student-grade-row" key={grade.id}>
                        <div className="student-grade-info">
                          <strong>{grade.examTitle}</strong>
                          <small>{formatDate(grade.gradedAt)} 批改</small>
                        </div>

                        <div className="student-grade-progress" aria-hidden="true">
                          <i style={{ width: `${Math.min(100, Math.max(0, grade.percentage))}%` }} />
                        </div>

                        <div className="student-grade-result">
                          <strong>
                            {grade.score}
                            <span>/{grade.totalPoints}</span>
                          </strong>
                          <em className={`student-grade-percent student-grade-tone-${getGradeTone(grade.percentage)}`}>
                            {formatPercent(grade.percentage)}
                          </em>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};
