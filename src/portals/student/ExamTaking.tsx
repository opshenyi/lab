import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopNav, Button, Badge } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import { useCountdown } from '../../hooks/useCountdown';
import type { Exam, Question } from '../../types';

const mockExamQuestions: Question[] = [
  {
    id: 'mq1',
    type: 'choice',
    title: 'Linux 文件权限',
    content: '`rwxr-xr--` 对应的八进制权限表示是什么？',
    options: [
      { id: 'a', label: 'A', content: '754' },
      { id: 'b', label: 'B', content: '755' },
      { id: 'c', label: 'C', content: '644' },
      { id: 'd', label: 'D', content: '744' },
    ],
    points: 10,
    difficulty: 'easy',
    tags: ['linux'],
    courseId: 'c1',
    createdBy: 't1',
    createdAt: '2025-01-20',
  },
  {
    id: 'mq2',
    type: 'short_answer',
    title: '进程管理',
    content: '如果要查找名为 “nginx” 的运行中程序的进程 ID，并优雅终止该进程，应使用哪些命令？',
    points: 10,
    difficulty: 'easy',
    tags: ['linux'],
    courseId: 'c1',
    createdBy: 't1',
    createdAt: '2025-01-25',
  },
  {
    id: 'mq3',
    type: 'code',
    title: 'Shell 脚本：阶乘计算',
    content: '编写一个 Bash 脚本，用于计算给定数字的阶乘。脚本应从命令行参数读取数字。\n\n示例：\n$ ./factorial.sh 5\n120',
    points: 20,
    difficulty: 'medium',
    tags: ['shell'],
    courseId: 'c1',
    createdBy: 't1',
    createdAt: '2025-01-22',
  },
  {
    id: 'mq4',
    type: 'choice',
    title: 'TCP/IP 模型',
    content: 'TCP/IP 模型中负责端到端通信的是哪一层？',
    options: [
      { id: 'a', label: 'A', content: '网络接入层' },
      { id: 'b', label: 'B', content: '网际层' },
      { id: 'c', label: 'C', content: '传输层' },
      { id: 'd', label: 'D', content: '应用层' },
    ],
    points: 10,
    difficulty: 'easy',
    tags: ['networking'],
    courseId: 'c1',
    createdBy: 't1',
    createdAt: '2025-01-20',
  },
];

export const StudentExamTaking: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleTimeUp = useCallback(() => {
    // Auto-submit on time up
    alert('考试时间已到！你的考试已自动提交。');
    navigate('/student/exams');
  }, [navigate]);

  const { formatted, percentage, isRunning, start } = useCountdown(
    (exam?.durationMinutes || 60) * 60,
    handleTimeUp
  );

  useEffect(() => {
    const load = async () => {
      if (!examId) return;
      const data = await api.getExam(examId);
      setExam(data || null);
      setLoading(false);
    };
    load();
  }, [examId]);

  // Auto-start timer when exam loads
  useEffect(() => {
    if (exam && !loading) {
      start();
    }
  }, [exam, loading, start]);

  const questions = mockExamQuestions;
  const currentQuestion = questions[currentIndex];

  const setAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const toggleMultiChoice = (questionId: string, optionId: string) => {
    const current = (answers[questionId] as string[]) || [];
    if (current.includes(optionId)) {
      setAnswer(questionId, current.filter(o => o !== optionId));
    } else {
      setAnswer(questionId, [...current, optionId]);
    }
  };

  const getQuestionStatus = (qId: string) => {
    const ans = answers[qId];
    if (!ans) return 'unanswered';
    if (Array.isArray(ans)) return ans.length > 0 ? 'answered' : 'unanswered';
    return ans.trim() !== '' ? 'answered' : 'unanswered';
  };

  const answeredCount = questions.filter(q => getQuestionStatus(q.id) === 'answered').length;

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      const unanswered = questions.length - answeredCount;
      const proceed = window.confirm(
        `你还有 ${unanswered} 道未答题目，是否确认提交？`
      );
      if (!proceed) return;
    }
    navigate('/student/exams');
  };

  const getDifficultyVariant = (d: string): 'success' | 'warning' | 'error' => {
    if (d === 'easy') return 'success';
    if (d === 'medium') return 'warning';
    return 'error';
  };

  // Timer bar color based on remaining time
  const timerBarColor = percentage > 50 ? 'var(--accent)' : percentage > 20 ? 'var(--warning)' : 'var(--error)';

  if (loading) {
    return (
      <div>
        <TopNav title="考试" userName={user?.name} />
        <div style={{ padding: 'var(--space-6)', color: 'var(--ink-muted)' }}>加载中...</div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div>
        <TopNav title="考试" userName={user?.name} />
        <div style={{ padding: 'var(--space-6)', color: 'var(--ink-muted)' }}>未找到该考试。</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-5)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
            {exam.title}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', margin: 0 }}>
            {exam.courseName}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          {/* Progress */}
          <p style={{ fontSize: 13, color: 'var(--ink-secondary)' }}>
            {answeredCount}/{questions.length} 已答题
          </p>

          {/* Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-1) var(--space-3)',
            background: 'var(--canvas-elevated)',
            borderRadius: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={timerBarColor} strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: timerBarColor }}>
              {formatted}
            </span>
          </div>

          {/* Timer Progress Bar */}
          <div style={{ width: 120, height: 4, background: 'var(--canvas-elevated)', borderRadius: 2 }}>
            <div style={{
              width: `${percentage}%`,
              height: '100%',
              background: timerBarColor,
              borderRadius: 2,
              transition: 'width 1s linear',
            }} />
          </div>

          <Button variant="primary" size="sm" onClick={handleSubmit}>
            提交考试
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Question Navigation Sidebar */}
        <div style={{
          width: 220,
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          <div style={{ padding: 'var(--space-4) var(--space-4)', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              题目
            </p>
          </div>
          <div style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', overflow: 'auto' }}>
            {questions.map((q, i) => {
              const status = getQuestionStatus(q.id);
              const isActive = i === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-2) var(--space-3)',
                    background: isActive ? 'var(--accent-muted)' : 'transparent',
                    border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    background: status === 'answered' ? 'var(--success-muted)' : 'var(--canvas-elevated)',
                    color: status === 'answered' ? 'var(--success)' : 'var(--ink-muted)',
                    border: status === 'answered' ? '1px solid var(--success)' : '1px solid var(--border)',
                    flexShrink: 0,
                  }}>
                    {status === 'answered' ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--ink)' : 'var(--ink-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {q.title}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                      {q.points} 分
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Question Content & Answer Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-8)' }}>
          <div style={{ maxWidth: 720 }}>
            {/* Question Header */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  题目 {currentIndex + 1} / {questions.length}
                </p>
                <Badge variant={getDifficultyVariant(currentQuestion.difficulty)} size="sm">
                  {currentQuestion.difficulty === 'easy' ? '简单' : currentQuestion.difficulty === 'medium' ? '中等' : currentQuestion.difficulty === 'hard' ? '困难' : currentQuestion.difficulty}
                </Badge>
                <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                  {currentQuestion.points} 分值
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--space-3)' }}>
                {currentQuestion.title}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--ink-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {currentQuestion.content}
              </p>
            </div>

            {/* Separator */}
            <div style={{ height: 1, background: 'var(--border)', marginBottom: 'var(--space-6)' }} />

            {/* Answer Area */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-3)' }}>
                你的答案
              </p>

              {/* Choice: Radio Buttons */}
              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <label
                        key={opt.id}
                        onClick={() => setAnswer(currentQuestion.id, opt.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          padding: 'var(--space-3) var(--space-4)',
                          background: isSelected ? 'var(--accent-muted)' : 'var(--canvas-elevated)',
                          border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 8,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {isSelected && (
                            <div style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: 'var(--accent)',
                            }} />
                          )}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-muted)', marginRight: 'var(--space-2)' }}>
                          {opt.label}.
                        </span>
                        <span style={{ fontSize: 14, color: isSelected ? 'var(--ink)' : 'var(--ink-secondary)' }}>
                          {opt.content}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Multi Choice */}
              {currentQuestion.type === 'multi_choice' && currentQuestion.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {currentQuestion.options.map((opt) => {
                    const selected = (answers[currentQuestion.id] as string[]) || [];
                    const isSelected = selected.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        onClick={() => toggleMultiChoice(currentQuestion.id, opt.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          padding: 'var(--space-3) var(--space-4)',
                          background: isSelected ? 'var(--accent-muted)' : 'var(--canvas-elevated)',
                          border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 8,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                          background: isSelected ? 'var(--accent)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-contrast)" strokeWidth="3">
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                          )}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-muted)', marginRight: 'var(--space-2)' }}>
                          {opt.label}.
                        </span>
                        <span style={{ fontSize: 14, color: isSelected ? 'var(--ink)' : 'var(--ink-secondary)' }}>
                          {opt.content}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Short Answer */}
              {currentQuestion.type === 'short_answer' && (
                <input
                  type="text"
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={e => setAnswer(currentQuestion.id, e.target.value)}
                  placeholder="请在此输入答案..."
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--canvas-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    color: 'var(--ink)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              )}

              {/* Code */}
              {currentQuestion.type === 'code' && (
                <textarea
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={e => setAnswer(currentQuestion.id, e.target.value)}
                  placeholder="请在此编写代码..."
                  style={{
                    width: '100%',
                    minHeight: 240,
                    padding: 'var(--space-4)',
                    background: '#0a0a0a',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    color: 'var(--ink)',
                    fontSize: 14,
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 'var(--space-8)',
              paddingTop: 'var(--space-5)',
              borderTop: '1px solid var(--border)',
            }}>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              >
                上一题
              </Button>
              {currentIndex < questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                >
                  下一题
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleSubmit}>
                  提交考试
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
