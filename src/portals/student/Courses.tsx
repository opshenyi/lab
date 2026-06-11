import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, Badge, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Course } from '../../types';
import './Courses.css';

const statusLabelMap: Record<Course['status'], string> = {
  active: '进行中',
  archived: '已归档',
  draft: '草稿',
};

const getCourseVideoCount = (course: Course) => {
  if (course.labCount === 0) return 2;
  return Math.min(4, Math.max(2, Math.ceil(course.labCount / 2)));
};

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
        <TopNav title="" userName={user?.name} />
        <Spinner centered />
      </div>
    );
  }

  return (
    <div>
      <TopNav title="" userName={user?.name} />

      <div className="page-padding">
        <div className="student-courses-page">
          <div className="student-courses-toolbar">
            <div className="student-courses-summary" aria-label="课程概况">
              <span>已选 {courses.length} 门课程</span>
            </div>
          </div>

          <div className="student-courses-grid">
            {courses.map((course) => (
              <button
                key={course.id}
                type="button"
                className="student-course-card"
                onClick={() => navigate(`/student/courses/${course.id}`)}
              >
                <span className="student-course-card-head">
                  <span className="student-course-code">{course.code}</span>
                  <Badge variant={getStatusVariant(course.status)} size="sm">
                    {statusLabelMap[course.status] ?? course.status}
                  </Badge>
                </span>

                <span className="student-course-card-body">
                  <span className="student-course-title">{course.name}</span>
                  <span className="student-course-teacher">{course.teacherName}</span>
                  <span className="student-course-desc">
                    {course.description}
                  </span>
                </span>

                <span className="student-course-card-foot">
                  <span>
                    <strong>{course.labCount}</strong>
                    实验
                  </span>
                  <span>
                    <strong>{course.examCount}</strong>
                    考试
                  </span>
                  <span>
                    <strong>{getCourseVideoCount(course)}</strong>
                    视频
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
