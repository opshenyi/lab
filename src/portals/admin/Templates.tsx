import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Badge, Button, Table, Input, Textarea, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import type { ContainerTemplate } from '../../types';

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

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const editorContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};

const codeEditorStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 280,
  background: 'var(--surface-2)',
  color: 'var(--ink)',
  border: '1px solid var(--border)',
  borderRadius: 24,
  padding: 'var(--space-4)',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  lineHeight: 1.6,
  resize: 'vertical' as const,
  outline: 'none',
  tabSize: 2,
};

const editorHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const editorTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--ink)',
};

const editorHintStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--ink-soft)',
  fontFamily: 'var(--font-mono)',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
};

const limitStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--ink-muted)',
  fontFamily: 'var(--font-mono)',
};

const dateStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--ink-soft)',
  fontFamily: 'var(--font-mono)',
};

const getTemplateStatusBadge = (status: ContainerTemplate['status']) => {
  const map: Record<ContainerTemplate['status'], { variant: 'success' | 'warning' | 'error' | 'default'; label: string }> = {
    ready: { variant: 'success', label: '就绪' },
    building: { variant: 'warning', label: '构建中' },
    error: { variant: 'error', label: '错误' },
    deprecated: { variant: 'default', label: '已弃用' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
};

export const AdminTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<ContainerTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ContainerTemplate | null>(null);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await api.getTemplates();
        setTemplates(data);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleRowClick = (template: ContainerTemplate) => {
    setSelectedTemplate(template);
    setEditorContent(template.dockerfile);
  };

  const columns = [
    {
      key: 'name',
      title: '名称',
    },
    {
      key: 'description',
      title: '描述',
      width: '240px',
      render: (_: any, record: ContainerTemplate) => (
        <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{record.description}</span>
      ),
    },
    {
      key: 'baseImage',
      title: '基础镜像',
      render: (_: any, record: ContainerTemplate) => (
        <span style={limitStyle}>{record.baseImage}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
    },
    {
      key: 'cpuLimit',
      title: 'CPU 限制',
      width: '80px',
      render: (_: any, record: ContainerTemplate) => (
        <span style={limitStyle}>{record.cpuLimit} 核</span>
      ),
    },
    {
      key: 'memoryLimit',
      title: '内存限制',
      width: '80px',
      render: (_: any, record: ContainerTemplate) => (
        <span style={limitStyle}>{record.memoryLimit}</span>
      ),
    },
    {
      key: 'usageCount',
      title: '使用次数',
      width: '70px',
      render: (_: any, record: ContainerTemplate) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-secondary)' }}>{record.usageCount}</span>
      ),
    },
    {
      key: 'createdAt',
      title: '创建时间',
      width: '100px',
      render: (_: any, record: ContainerTemplate) => (
        <span style={dateStyle}>{record.createdAt}</span>
      ),
    },
  ];

  return (
    <div className="page-padding" style={pageStyle}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={pageTitleStyle}>容器模板</h1>
          <p style={pageSubtitleStyle}>管理实验环境的 Docker 容器模板</p>
        </div>
        <Button variant="primary">新建模板</Button>
      </div>

      <Card padding="none"
        style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
      >
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border)' }}>
          <Input placeholder="搜索模板..." style={{ maxWidth: 320 }} />
        </div>
        {loading ? (
          <Spinner centered />
        ) : (
          <Table
            columns={columns}
            data={templates}
            rowKey="id"
            onRowClick={handleRowClick}
          />
        )}
      </Card>

      {/* Template Editor */}
      <Card style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}>
        <div style={editorContainerStyle}>
          <div style={editorHeaderStyle}>
            <div>
              <div style={editorTitleStyle}>
                模板编辑器
                {selectedTemplate && (
                  <span style={{ fontWeight: 400, color: 'var(--ink-muted)', marginLeft: 'var(--space-2)' }}>
                    -- {selectedTemplate.name}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 'var(--space-1)' }}>
                {selectedTemplate
                  ? '正在编辑所选模板的 Dockerfile'
                  : '点击上方模板行以加载其 Dockerfile'}
              </div>
            </div>
            <div style={editorHintStyle}>
              {selectedTemplate ? `基础镜像: ${selectedTemplate.baseImage}` : '未选择模板'}
            </div>
          </div>
          <textarea
            style={codeEditorStyle}
            value={editorContent}
            onChange={e => setEditorContent(e.target.value)}
            placeholder="选择模板以查看或编辑其 Dockerfile 内容..."
            spellCheck={false}
          />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => { setSelectedTemplate(null); setEditorContent(''); }}>
              清空
            </Button>
            <Button variant="primary" disabled={!selectedTemplate}>
              保存更改
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
