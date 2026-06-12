import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../types';

export const Login: React.FC = () => {
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const handleLogin = (role: UserRole) => { login(role); navigate(`/${role}`); };
  const isDesktopStudentClient = import.meta.env.MODE === 'desktop';

  const roles = [
    { key: 'student' as UserRole, title: '学生', desc: '访问课程，完成实验，参加考试' },
    { key: 'teacher' as UserRole, title: '教师', desc: '管理课程与题库，创建实验和考试' },
    { key: 'admin' as UserRole, title: '管理员', desc: '管理容器模板，监控资源，配置系统' },
  ].filter(role => !isDesktopStudentClient || role.key === 'student');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <h1 style={{
          fontSize: 'clamp(56px, 10vw, 96px)', fontWeight: 900, color: 'var(--ink)',
          letterSpacing: '-4px', lineHeight: 0.85, marginBottom: 24,
        }}>
          Spark<wbr />Lab
        </h1>
        <p style={{ fontSize: 18, color: 'var(--ink-secondary)', lineHeight: 1.44, marginBottom: 56 }}>
          基于 Docker 的在线实验学习平台
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 56 }}>
          {roles.map(role => (
            <button key={role.key} onClick={() => handleLogin(role.key)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px',
              border: '1px solid var(--border)', borderRadius: 24,
              cursor: 'pointer', transition: 'background 0.12s ease',
              textAlign: 'left', fontFamily: 'inherit', background: 'transparent', gap: 16,
            }}
            >
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.4px', marginBottom: 4 }}>{role.title}</p>
                <p style={{ fontSize: 14, color: 'var(--ink-tertiary)' }}>{role.desc}</p>
              </div>
              <svg style={{ color: 'var(--ink-muted)', flexShrink: 0 }} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 10h12M12 5l5 5-5 5"/></svg>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'var(--ink-muted)', textAlign: 'center' }}>SparkLab v1.0</p>
      </div>
    </div>
  );
};
