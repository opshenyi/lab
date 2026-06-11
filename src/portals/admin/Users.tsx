import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Badge, Button, Table, Input, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import type { User } from '../../types';

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

const searchRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
};

const monoStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--ink-muted)',
  fontFamily: 'var(--font-mono)',
};

const dateStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--ink-soft)',
  fontFamily: 'var(--font-mono)',
};

const nameCellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
};

const avatarStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 9999,
  background: 'var(--accent-muted)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--accent)',
  flexShrink: 0,
};

const getRoleBadge = (role: User['role']) => {
  const map: Record<User['role'], { variant: 'info' | 'success' | 'warning'; label: string }> = {
    student: { variant: 'info', label: '学生' },
    teacher: { variant: 'success', label: '教师' },
    admin: { variant: 'warning', label: '管理员' },
  };
  const { variant, label } = map[role];
  return <Badge variant={variant}>{label}</Badge>;
};

const getInitials = (name: string): string => {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0]?.[0]?.toUpperCase() || '?';
};

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      (user.department || '').toLowerCase().includes(query) ||
      (user.studentId || '').toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      key: 'name',
      title: '姓名',
      render: (_: any, record: User) => (
        <div style={nameCellStyle}>
          <div style={avatarStyle}>{getInitials(record.name)}</div>
          <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13 }}>{record.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      title: '邮箱',
      render: (_: any, record: User) => (
        <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{record.email}</span>
      ),
    },
    {
      key: 'role',
      title: '角色',
      width: '100px',
      render: (_: any, record: User) => getRoleBadge(record.role),
    },
    {
      key: 'department',
      title: '部门',
      render: (_: any, record: User) => (
        <span style={{ fontSize: 13, color: 'var(--ink-secondary)' }}>{record.department || '--'}</span>
      ),
    },
    {
      key: 'studentId',
      title: '学号',
      width: '110px',
      render: (_: any, record: User) => (
        <span style={record.studentId ? monoStyle : { ...monoStyle, color: 'var(--ink-soft)' }}>
          {record.studentId || '--'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: '创建时间',
      width: '110px',
      render: (_: any, record: User) => (
        <span style={dateStyle}>{record.createdAt}</span>
      ),
    },
  ];

  const userCounts = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  return (
    <div className="page-padding" style={pageStyle}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={pageTitleStyle}>用户管理</h1>
          <p style={pageSubtitleStyle}>管理平台用户及其角色</p>
        </div>
        <Button variant="primary">添加用户</Button>
      </div>

      {/* Summary badges */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
          {userCounts.total} 名用户
        </span>
        <Badge variant="info">{userCounts.students} 名学生</Badge>
        <Badge variant="success">{userCounts.teachers} 名教师</Badge>
        <Badge variant="warning">{userCounts.admins} 名管理员</Badge>
      </div>

      <Card padding="none"
        style={{ border: '1px solid var(--border)', borderRadius: 30, padding: '28px 24px' }}
      >
        <div style={{
          padding: 'var(--space-4) var(--space-5)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={searchRowStyle}>
            <Input
              placeholder="按姓名、邮箱、部门或学号搜索..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ maxWidth: 420 }}
            />
            {searchQuery && (
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                {filteredUsers.length} 条结果
              </span>
            )}
          </div>
        </div>
        {loading ? (
          <Spinner centered />
        ) : (
          <Table
            columns={columns}
            data={filteredUsers}
            rowKey="id"
            emptyText="没有匹配的用户"
          />
        )}
      </Card>
    </div>
  );
};
