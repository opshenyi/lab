import React, { useMemo, useState } from 'react';
import { TopNav } from '../../design-system/components';
import { useAuthStore } from '../../stores/authStore';
import './AIAssistant.css';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: '你好，我是星火。可以帮你梳理课程重点、解释实验报错，或者一起拆解一道题。',
  },
];

const suggestions = [
  '帮我复习 Linux 文件权限',
  '解释一下 Docker 镜像和容器',
  '帮我检查 Shell 脚本思路',
];

const buildReply = (prompt: string) => {
  const normalized = prompt.trim();

  if (!normalized) return '';

  if (normalized.includes('Linux') || normalized.includes('权限')) {
    return 'Linux 权限可以先看三组对象：所有者、用户组、其他人。每组三位分别代表读、写、执行，例如 rwx 是 7，r-x 是 5，r-- 是 4。你可以把题目里的权限按三组拆开，再转成八进制。';
  }

  if (normalized.includes('Docker') || normalized.includes('容器')) {
    return '可以把镜像理解成可复用的环境模板，容器是镜像运行后的实例。做实验时，先确认镜像来源、启动命令、端口映射和数据卷，再看容器状态与日志。';
  }

  if (normalized.includes('Shell') || normalized.includes('脚本')) {
    return '写 Shell 脚本时先把输入、处理、输出分开。建议先用最小命令跑通，再加入变量、判断和循环，最后补充错误处理。你可以把脚本贴出来，我帮你一起看。';
  }

  return `我理解你的问题是：“${normalized}”。我们可以先把它拆成概念、步骤和容易出错的地方三部分，再逐个处理。`;
};

export const StudentAIAssistant: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');

  const canSend = draft.trim().length > 0;
  const hasOnlyWelcome = messages.length === 1;

  const currentTime = useMemo(() => {
    return new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const sendMessage = (content: string) => {
    const text = content.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: buildReply(text),
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setDraft('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <div>
      <TopNav title="" userName={user?.name} />

      <div className="page-padding student-ai-page">
        <section className="student-ai-shell" aria-label="星火 AI助手">
          <div className="student-ai-thread">
            <div className="student-ai-thread-head">
              <span>星火 AI助手</span>
              <small>{currentTime}</small>
            </div>

            <div className="student-ai-messages">
              {messages.map(message => (
                <article
                  key={message.id}
                  className={`student-ai-message student-ai-message-${message.role}`}
                >
                  <div className="student-ai-avatar" aria-hidden="true">
                    {message.role === 'assistant' ? 'S' : '你'}
                  </div>
                  <p>{message.content}</p>
                </article>
              ))}
            </div>

            {hasOnlyWelcome && (
              <div className="student-ai-suggestions" aria-label="常用问题">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="student-ai-composer" onSubmit={handleSubmit}>
            <textarea
              value={draft}
              onChange={event => setDraft(event.target.value)}
              placeholder="向星火提问"
              rows={1}
            />
            <button type="submit" disabled={!canSend} aria-label="发送">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
