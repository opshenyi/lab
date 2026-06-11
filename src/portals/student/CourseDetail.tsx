import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopNav, Badge, Button, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Course, Exam, Lab } from '../../types';
import './CourseDetail.css';

const labStatusLabel: Record<Lab['status'], string> = {
  completed: '已完成',
  in_progress: '进行中',
  not_started: '未开始',
};

const examStatusLabel: Record<Exam['status'], string> = {
  draft: '未发布',
  published: '可参加',
  active: '进行中',
  ended: '已结束',
};

const getLabStatusVariant = (status: Lab['status']) => {
  if (status === 'completed') return 'success';
  if (status === 'in_progress') return 'info';
  return 'default';
};

const getExamStatusVariant = (status: Exam['status']) => {
  if (status === 'active') return 'success';
  if (status === 'published') return 'info';
  if (status === 'draft') return 'warning';
  return 'default';
};

const formatDate = (date?: string) => {
  if (!date) return '--';
  return new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

const getCourseVideos = (course: Course) => {
  const videoCount = course.labCount === 0 ? 2 : Math.min(4, Math.max(2, Math.ceil(course.labCount / 2)));
  const videos = [
    { title: '课程导学', duration: 12, description: `了解 ${course.name} 的学习路径与考核安排。` },
    { title: '核心概念讲解', duration: 24, description: '梳理本课程的关键知识点和常见问题。' },
    { title: '实验演示', duration: 18, description: '跟随教师演示完成典型实验任务。' },
    { title: '复习与答疑', duration: 16, description: '回顾课程重点，并讲解常见易错点。' },
  ];
  return videos.slice(0, videoCount);
};

export const StudentCourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [course, setCourse] = useState<Course | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!courseId) return;
      setLoading(true);
      const [courseData, labData, examData] = await Promise.all([
        api.getCourse(courseId),
        api.getLabs(courseId),
        api.getExams(courseId),
      ]);
      setCourse(courseData ?? null);
      setLabs(labData);
      setExams(examData);
      setLoading(false);
    };
    load();
  }, [courseId]);

  if (loading) {
    return (
      <div>
        <TopNav title="" userName={user?.name} />
        <Spinner centered />
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <TopNav title="" userName={user?.name} />
        <div className="page-padding">
          <button className="student-course-detail-back" type="button" onClick={() => navigate('/student/courses')}>
            返回课程
          </button>
          <p className="student-course-detail-empty">未找到该课程。</p>
        </div>
      </div>
    );
  }

  const courseVideos = getCourseVideos(course);

  return (
    <div>
      <TopNav title="" userName={user?.name} />

      <div className="page-padding student-course-detail-page">
        <button className="student-course-detail-back" type="button" onClick={() => navigate('/student/courses')}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5 7 10l5 5" />
          </svg>
          返回课程
        </button>

        <section className="student-course-detail-head">
          <div className="student-course-detail-head-main">
            <h1>{course.name}</h1>
            <p>{course.description}</p>
          </div>

          <div className="student-course-detail-stats" aria-label="课程概况">
            <span className="student-course-detail-teacher">
              <small>小组老师</small>
              <strong>{course.teacherName}</strong>
            </span>
          </div>
        </section>

        <section className="student-course-detail-section" id="course-labs">
          <div className="student-course-detail-section-head">
            <h2>课程实验</h2>
            <span>{labs.length} 个</span>
          </div>

          <div className="student-course-detail-list">
            {labs.length === 0 ? (
              <p className="student-course-detail-empty">暂无实验。</p>
            ) : labs.map(lab => (
              <button
                key={lab.id}
                type="button"
                className="student-course-detail-row"
                onClick={() => navigate(`/student/labs/${lab.id}`)}
              >
                <span>
                  <strong>{lab.title}</strong>
                  <small>{lab.templateName} · {lab.estimatedMinutes} 分钟</small>
                </span>
                <Badge variant={getLabStatusVariant(lab.status)} size="sm">
                  {labStatusLabel[lab.status]}
                </Badge>
              </button>
            ))}
          </div>
        </section>

        <section className="student-course-detail-section" id="course-exams">
          <div className="student-course-detail-section-head">
            <h2>课程考试</h2>
            <span>{exams.length} 场</span>
          </div>

          <div className="student-course-detail-list">
            {exams.length === 0 ? (
              <p className="student-course-detail-empty">暂无考试。</p>
            ) : exams.map(exam => {
              const canStart = exam.status === 'published' || exam.status === 'active';
              return (
                <div key={exam.id} className="student-course-detail-row">
                  <span>
                    <strong>{exam.title}</strong>
                    <small>{formatDate(exam.startTime)} · {exam.durationMinutes} 分钟 · {exam.totalPoints} 分</small>
                  </span>
                  <span className="student-course-detail-row-actions">
                    <Badge variant={getExamStatusVariant(exam.status)} size="sm">
                      {examStatusLabel[exam.status]}
                    </Badge>
                    <Button
                      variant={canStart ? 'primary' : 'ghost'}
                      size="sm"
                      disabled={!canStart}
                      onClick={() => navigate(`/student/exams/${exam.id}`)}
                    >
                      进入
                    </Button>
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="student-course-detail-section" id="course-videos">
          <div className="student-course-detail-section-head">
            <h2>课程视频</h2>
            <span>{courseVideos.length} 个</span>
          </div>

          <div className="student-course-video-list">
            {courseVideos.map(video => (
              <button key={video.title} type="button" className="student-course-video-row">
                <span className="student-course-video-play" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 5.6v8.8L14 10z" />
                  </svg>
                </span>
                <span>
                  <strong>{video.title}</strong>
                  <small>{video.description}</small>
                </span>
                <span className="student-course-video-duration">{video.duration} 分钟</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
