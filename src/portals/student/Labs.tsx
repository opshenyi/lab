import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, Button, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Course, Lab, RunningContainer } from '../../types';
import './Labs.css';

const getStatusLabel = (status: RunningContainer['status']) => {
  const labels: Record<RunningContainer['status'], string> = {
    running: '运行中',
    paused: '已暂停',
    stopped: '已停止',
    error: '异常',
  };
  return labels[status];
};

const getMemoryPercent = (container: RunningContainer) => {
  const limit = container.memoryLimit.includes('Gi')
    ? Number.parseInt(container.memoryLimit, 10) * 1024
    : Number.parseInt(container.memoryLimit, 10);

  if (!Number.isFinite(limit) || limit <= 0) return 0;
  return Math.min(100, Math.round((container.memoryUsage / limit) * 100));
};

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const StudentLabs: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [containers, setContainers] = useState<RunningContainer[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [containerData, labData, courseData] = await Promise.all([
        api.getContainers(),
        api.getLabs(),
        api.getCourses(),
      ]);
      setContainers(containerData.filter(container => container.studentId === user?.id));
      setLabs(labData);
      setCourses(courseData);
      setLoading(false);
    };

    load();
  }, [user?.id]);

  const labMap = new Map(labs.map(lab => [lab.id, lab]));
  const courseMap = new Map(courses.map(course => [course.id, course]));
  const runningCount = containers.filter(container => container.status === 'running').length;

  const handleStatusChange = (containerId: string, status: RunningContainer['status']) => {
    setContainers(prev =>
      prev.map(container =>
        container.containerId === containerId ? { ...container, status } : container
      )
    );
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

      <div className="page-padding student-instances-page">
        <section className="student-instances-overview">
          <div className="student-instances-copy">
            <span>课程开启的实例</span>
            <p>查看当前课程实验已启动的运行环境。</p>
          </div>

          <div className="student-instances-summary" aria-label="实例概况">
            <span>
              <strong>{containers.length}</strong>
              全部实例
            </span>
            <span>
              <strong>{runningCount}</strong>
              运行中
            </span>
          </div>
        </section>

        {containers.length === 0 ? (
          <p className="student-instances-empty">暂无已开启的课程实例。</p>
        ) : (
          <div className="student-instance-list">
            {containers.map(container => {
              const lab = labMap.get(container.labId);
              const course = lab ? courseMap.get(lab.courseId) : undefined;
              const memoryPercent = getMemoryPercent(container);

              return (
                <article className="student-instance-card" key={container.id}>
                  <div className="student-instance-main">
                    <div className="student-instance-head">
                      <span className="student-instance-course">
                        {course?.code ?? '--'} · {course?.name ?? '未知课程'}
                      </span>
                      <span className={`student-instance-status student-instance-status-${container.status}`}>
                        {getStatusLabel(container.status)}
                      </span>
                    </div>

                    <h2>{container.labTitle}</h2>

                    <div className="student-instance-meta">
                      <span>{container.templateName}</span>
                      <span>{container.containerId}</span>
                      <span>{formatDateTime(container.startedAt)} 启动</span>
                    </div>
                  </div>

                  <div className="student-instance-metrics" aria-label="实例资源">
                    <span>
                      <small>运行时间</small>
                      <strong>{container.uptime}</strong>
                    </span>
                    <span>
                      <small>CPU</small>
                      <strong>{container.cpuUsage}%</strong>
                    </span>
                    <span>
                      <small>内存</small>
                      <strong>{container.memoryUsage}MB / {container.memoryLimit}</strong>
                      <i style={{ width: `${memoryPercent}%` }} aria-hidden="true" />
                    </span>
                  </div>

                  <div className="student-instance-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={container.status === 'stopped' || container.status === 'error'}
                      onClick={() => navigate(`/student/labs/${container.labId}`)}
                    >
                      进入实例
                    </Button>
                    {container.status === 'running' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusChange(container.containerId, 'paused')}
                      >
                        暂停
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={container.status === 'error'}
                        onClick={() => handleStatusChange(container.containerId, 'running')}
                      >
                        恢复
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
