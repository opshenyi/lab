import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopNav, Button, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import { useTerminal } from '../../hooks/useTerminal';
import type { Lab } from '../../types';

export const StudentLabWorkspace: React.FC = () => {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [lab, setLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [containerRunning, setContainerRunning] = useState(true);
  const { containerRef } = useTerminal();

  useEffect(() => {
    const load = async () => {
      if (!labId) return;
      const data = await api.getLab(labId);
      setLab(data || null);
      setLoading(false);
    };
    load();
  }, [labId]);

  // Elapsed timer
  useEffect(() => {
    if (!containerRunning) return;
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [containerRunning]);

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div>
        <TopNav title="实例管理" userName={user?.name} />
        <Spinner centered />
      </div>
    );
  }

  if (!lab) {
    return (
      <div>
        <TopNav title="实例管理" userName={user?.name} />
        <div style={{ padding: 'var(--space-6)', color: 'var(--ink-muted)' }}>未找到该实验。</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-5)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button
            onClick={() => navigate('/student/labs')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ink-muted)',
              cursor: 'pointer',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
            返回实例
          </button>

          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
              {lab.title}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', margin: 0 }}>
              {lab.templateName}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {/* Container Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: containerRunning ? 'var(--success)' : 'var(--error)',
              boxShadow: containerRunning ? '0 0 6px rgba(91, 97, 112, 0.24)' : 'none',
            }} />
            <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              {containerRunning ? '运行中' : '已停止'}
            </span>
          </div>

          {/* Timer */}
          <div style={{
            padding: 'var(--space-1) var(--space-3)',
            background: 'var(--canvas-elevated)',
            borderRadius: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--ink-secondary)',
          }}>
            {formatElapsed(elapsed)}
          </div>

          {/* Actions */}
          <Button variant="secondary" size="sm" onClick={() => setContainerRunning(r => !r)}>
            {containerRunning ? '暂停' : '恢复'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setContainerRunning(true); setElapsed(0); }}>
            重置
          </Button>
          <Button variant="primary" size="sm">
            提交
          </Button>
        </div>
      </div>

      {/* Main Content: Terminal + Instructions */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Terminal */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
        }}>
          <div style={{
            padding: 'var(--space-2) var(--space-4)',
            borderBottom: '1px solid var(--border)',
            background: 'var(--canvas-elevated)',
          }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              终端
            </p>
          </div>
          <div
            ref={containerRef}
            style={{
              flex: 1,
              background: '#0a0a0a',
              minHeight: 400,
              padding: 'var(--space-2)',
              overflow: 'hidden',
            }}
          />
        </div>

        {/* Right: Instructions */}
        <div style={{
          width: '40%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: 'var(--space-2) var(--space-4)',
            borderBottom: '1px solid var(--border)',
            background: 'var(--canvas-elevated)',
          }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              说明
            </p>
          </div>
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: 'var(--space-5)',
            background: 'var(--canvas-elevated)',
          }}>
            <pre style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--ink-secondary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
            }}>
              {lab.instructions}
            </pre>

            {/* Checkpoints */}
            {lab.checkpoints.length > 0 && (
              <div style={{ marginTop: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--space-3)' }}>
                  检查点
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {lab.checkpoints.map((cp) => (
                    <div
                      key={cp.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-2) var(--space-3)',
                        background: 'var(--canvas-elevated)',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: `2px solid ${cp.completed ? 'var(--success)' : 'var(--border)'}`,
                        background: cp.completed ? 'var(--success)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {cp.completed && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent-contrast)" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{cp.title}</p>
                        <p style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{cp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
