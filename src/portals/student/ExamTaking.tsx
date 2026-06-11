import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopNav, Button, Spinner } from '../../design-system/components';
import { api } from '../../mock/api';
import { useAuthStore } from '../../stores/authStore';
import { useCountdown } from '../../hooks/useCountdown';
import type { Exam, Question } from '../../types';
import './ExamTaking.css';

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
    alert('考试时间已到！你的考试已自动提交。');
    navigate('/student/exams');
  }, [navigate]);

  const { formatted, percentage, start } = useCountdown(
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

  const timerTone = percentage > 50 ? 'steady' : percentage > 20 ? 'warning' : 'danger';

  if (loading) {
    return (
      <div>
        <TopNav title="" userName={user?.name} />
        <Spinner centered />
      </div>
    );
  }

  if (!exam) {
    return (
      <div>
        <TopNav title="" userName={user?.name} />
        <div className="page-padding">
          <p className="student-exam-taking-empty">未找到该考试。</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopNav title="" userName={user?.name} />

      <div className="page-padding student-exam-taking-page">
        <section className="student-exam-taking-overview">
          <div className="student-exam-taking-title">
            <span>{exam.courseName}</span>
            <h1>{exam.title}</h1>
          </div>

          <div className="student-exam-taking-controls">
            <div className="student-exam-taking-progress" aria-label="答题进度">
              <strong>{answeredCount}</strong>
              <span>/ {questions.length} 已答</span>
            </div>

            <div className={`student-exam-taking-timer student-exam-taking-timer-${timerTone}`} aria-label="剩余时间">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>{formatted}</span>
            </div>

            <Button variant="primary" size="sm" onClick={handleSubmit}>
              提交考试
            </Button>
          </div>
        </section>

        <div className="student-exam-taking-layout">
          <aside className="student-exam-question-list" aria-label="题目导航">
            <div className="student-exam-question-list-head">
              <span>题目</span>
              <strong>{currentIndex + 1}/{questions.length}</strong>
            </div>

            <div className="student-exam-question-nav">
              {questions.map((q, i) => {
                const status = getQuestionStatus(q.id);
                const isActive = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`student-exam-question-nav-item${isActive ? ' is-active' : ''}${status === 'answered' ? ' is-answered' : ''}`}
                    onClick={() => setCurrentIndex(i)}
                  >
                    <span className="student-exam-question-number">
                      {status === 'answered' ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="m20 6-11 11-5-5" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className="student-exam-question-nav-copy">
                      <strong>{q.title}</strong>
                      <small>{q.points} 分</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="student-exam-question-panel">
            <div className="student-exam-question-meta">
              <span>第 {currentIndex + 1} 题</span>
              <span>{currentQuestion.points} 分</span>
            </div>

            <div className="student-exam-question-content">
              <h2>{currentQuestion.title}</h2>
              <p>{currentQuestion.content}</p>
            </div>

            <section className="student-exam-answer-section" aria-label="你的答案">
              <span className="student-exam-answer-label">你的答案</span>

              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="student-exam-choice-list">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`student-exam-choice${isSelected ? ' is-selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => setAnswer(currentQuestion.id, opt.id)}
                      >
                        <span className="student-exam-choice-mark" aria-hidden="true" />
                        <span className="student-exam-choice-label">{opt.label}</span>
                        <span className="student-exam-choice-text">{opt.content}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'multi_choice' && currentQuestion.options && (
                <div className="student-exam-choice-list">
                  {currentQuestion.options.map((opt) => {
                    const selected = (answers[currentQuestion.id] as string[]) || [];
                    const isSelected = selected.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`student-exam-choice student-exam-choice-checkbox${isSelected ? ' is-selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => toggleMultiChoice(currentQuestion.id, opt.id)}
                      >
                        <span className="student-exam-choice-mark" aria-hidden="true" />
                        <span className="student-exam-choice-label">{opt.label}</span>
                        <span className="student-exam-choice-text">{opt.content}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'short_answer' && (
                <input
                  className="student-exam-text-input"
                  type="text"
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={e => setAnswer(currentQuestion.id, e.target.value)}
                  placeholder="请在此输入答案"
                />
              )}

              {currentQuestion.type === 'code' && (
                <textarea
                  className="student-exam-code-input"
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={e => setAnswer(currentQuestion.id, e.target.value)}
                  placeholder="请在此编写代码"
                />
              )}
            </section>

            <div className="student-exam-navigation">
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
          </main>
        </div>
      </div>
    </div>
  );
};
