import React, { useState } from 'react';
import { Card, CardHeader, Button, Input } from '../../design-system/components';

const pageStyle: React.CSSProperties = {

};

const pageTitleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: 'var(--ink)',
  letterSpacing: '-0.396px',
};

const pageSubtitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 400,
  color: 'var(--ink-secondary)',
  lineHeight: 1.44,
  marginTop: 'var(--space-1)',
};

const sectionGridStyle: React.CSSProperties = {};

const formGridStyle: React.CSSProperties = {};

const fullWidthStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
};

const toggleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--space-3) 0',
};

const toggleLabelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-1)',
};

const toggleTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--ink)',
};

const toggleDescStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--ink-soft)',
};

const toggleTrackStyle = (enabled: boolean): React.CSSProperties => ({
  width: 40,
  height: 22,
  borderRadius: 11,
  background: enabled ? 'var(--accent)' : 'var(--border)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  flexShrink: 0,
});

const toggleThumbStyle = (enabled: boolean): React.CSSProperties => ({
  width: 18,
  height: 18,
  borderRadius: '50%',
  background: 'var(--ink)',
  position: 'absolute',
  top: 2,
  left: enabled ? 20 : 2,
  transition: 'left 0.2s ease',
});

const footerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 'var(--space-3)',
  paddingTop: 'var(--space-4)',
  borderTop: '1px solid var(--border)',
};

const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <div style={toggleTrackStyle(enabled)} onClick={onToggle}>
    <div style={toggleThumbStyle(enabled)} />
  </div>
);

export const AdminSystem: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T0EXAMPLE/B0EXAMPLE/xxxxxxxxxxxx');

  const handleSave = () => {
    // Mock save action
  };

  return (
    <div className="page-padding" style={pageStyle}>
      <div>
        <h1 style={pageTitleStyle}>系统设置</h1>
        <p style={pageSubtitleStyle}>配置平台全局设置和集成</p>
      </div>

      <div className="grid-2">
        {/* Docker Registry */}
        <Card style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}>
          <CardHeader title="Docker 仓库" subtitle="容器镜像仓库配置" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <Input
              label="仓库地址"
              defaultValue="registry.sparklab.internal:5000"
              readOnly
            />
            <Input
              label="用户名"
              defaultValue="admin"
              readOnly
            />
            <Input
              label="密码"
              type="password"
              defaultValue="********"
              readOnly
            />
            <Input
              label="命名空间"
              defaultValue="sparklab"
              readOnly
            />
          </div>
        </Card>

        {/* Resource Quotas */}
        <Card style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}>
          <CardHeader title="资源配额" subtitle="学生容器的默认限制" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <div className="grid-2">
              <Input
                label="默认 CPU 限制"
                defaultValue="1.0"
                readOnly
              />
              <Input
                label="默认内存限制"
                defaultValue="512Mi"
                readOnly
              />
            </div>
            <Input
              label="每学生最大容器数"
              defaultValue="3"
              readOnly
            />
            <Input
              label="容器超时时间（分钟）"
              defaultValue="120"
              readOnly
            />
            <Input
              label="每容器最大存储空间"
              defaultValue="5Gi"
              readOnly
            />
          </div>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}>
        <CardHeader title="通知设置" subtitle="配置告警和通知" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', marginTop: 'var(--space-2)' }}>
          <div style={toggleRowStyle}>
            <div style={toggleLabelStyle}>
              <span style={toggleTitleStyle}>邮件通知</span>
              <span style={toggleDescStyle}>通过邮件发送系统告警和报告</span>
            </div>
            <Toggle enabled={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
            <div style={{ maxWidth: 480 }}>
              <Input
                label="Slack Webhook 地址"
                value={slackWebhook}
                onChange={e => setSlackWebhook(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
            <div style={{ marginTop: 'var(--space-3)' }}>
              <Button variant="secondary" size="sm">测试 Webhook</Button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
            <div className="grid-2">
              <div style={toggleRowStyle}>
                <div style={toggleLabelStyle}>
                  <span style={toggleTitleStyle}>容器异常告警</span>
                  <span style={toggleDescStyle}>容器进入异常状态时发送通知</span>
                </div>
                <Toggle enabled={true} onToggle={() => {}} />
              </div>
              <div style={toggleRowStyle}>
                <div style={toggleLabelStyle}>
                  <span style={toggleTitleStyle}>容量预警</span>
                  <span style={toggleDescStyle}>使用率超过 80% 时发出警告</span>
                </div>
                <Toggle enabled={true} onToggle={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Footer */}
      <div style={footerStyle}>
        <Button variant="secondary">恢复默认</Button>
        <Button variant="primary" onClick={handleSave}>保存设置</Button>
      </div>
    </div>
  );
};
