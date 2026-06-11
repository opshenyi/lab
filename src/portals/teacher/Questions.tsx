import React, { useState, useEffect, useMemo } from 'react';
import { TopNav, Card, Badge, Table, Button, Tabs, Input } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import type { Question, QuestionType } from '../../types';

const typeTabs = [
  { key: 'all', label: '全部' },
  { key: 'choice', label: '选择题' },
  { key: 'code', label: '代码题' },
  { key: 'short_answer', label: '简答题' },
];

const typeBadgeMap: Record<QuestionType, { label: string; variant: 'accent' | 'info' | 'warning' | 'success' | 'default' }> = {
  choice: { label: '选择题', variant: 'accent' },
  multi_choice: { label: '多选题', variant: 'accent' },
  code: { label: '代码题', variant: 'info' },
  short_answer: { label: '简答题', variant: 'warning' },
  essay: { label: '论述题', variant: 'default' },
};

const difficultyVariantMap: Record<string, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

export const TeacherQuestions: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<{ id: string; name: string; code: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [q, c] = await Promise.all([api.getQuestions(), api.getCourses()]);
      setQuestions(q);
      setCourses(c);
      setLoading(false);
    };
    load();
  }, []);

  const courseMap = useMemo(() => {
    const m: Record<string, { name: string; code: string }> = {};
    courses.forEach(c => { m[c.id] = { name: c.name, code: c.code }; });
    return m;
  }, [courses]);

  const filtered = useMemo(() => {
    let result = questions;
    if (activeTab !== 'all') {
      result = result.filter(q => q.type === activeTab);
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(q =>
        q.title.toLowerCase().includes(term) ||
        q.tags.some(t => t.toLowerCase().includes(term))
      );
    }
    return result;
  }, [questions, activeTab, search]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: questions.length };
    questions.forEach(q => {
      counts[q.type] = (counts[q.type] || 0) + 1;
    });
    return counts;
  }, [questions]);

  const tabs = typeTabs.map(t => ({
    ...t,
    count: tabCounts[t.key] || 0,
  }));

  const columns = [
    {
      key: 'title',
      title: '标题',
      render: (val: string) => (
        <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{val}</span>
      ),
    },
    {
      key: 'type',
      title: '类型',
      width: '120px',
      render: (val: QuestionType) => {
        const info = typeBadgeMap[val] || { label: val, variant: 'default' as const };
        return <Badge variant={info.variant}>{info.label}</Badge>;
      },
    },
    {
      key: 'difficulty',
      title: '难度',
      width: '110px',
      render: (val: string) => (
        <Badge variant={difficultyVariantMap[val] || 'default'}>
          {val === 'easy' ? '简单' : val === 'medium' ? '中等' : val === 'hard' ? '困难' : val}
        </Badge>
      ),
    },
    {
      key: 'points',
      title: '分值',
      width: '80px',
      render: (val: number) => (
        <span style={{ color: 'var(--ink)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'tags',
      title: '标签',
      width: '180px',
      render: (val: string[]) => (
        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
          {val.map(tag => (
            <span key={tag} style={{
              fontSize: '11px',
              color: 'var(--ink-muted)',
              background: 'var(--surface-3)',
              padding: '2px 8px',
              borderRadius: 9999,
              border: '1px solid var(--hairline)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'courseId',
      title: '课程',
      width: '140px',
      render: (val: string) => {
        const c = courseMap[val];
        return (
          <span style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
            {c ? c.code : val}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <TopNav title="题库" subtitle="管理您的题目库" userName={user?.name} />

      <div className="page-padding">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-5)',
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.396px' }}>
              题目
            </h2>
            <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 'var(--space-1)' }}>
              {loading ? '加载中...' : `共 ${filtered.length} 道题目`}
            </p>
          </div>
          <Button variant="primary" size="md">新建题目</Button>
        </div>

        {/* Filters */}
        <Card padding="md"
          style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-5)',
            flexWrap: 'wrap',
          }}>
            <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
            <div style={{ marginLeft: 'auto', minWidth: '240px' }}>
              <Input
                placeholder="按标题或标签搜索..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Table */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Card padding="none"
            style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
          >
            <Table
              columns={columns}
              data={filtered}
              emptyText="暂无符合条件的题目"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
