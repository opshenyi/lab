import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeSwitcher } from '../../design-system/components';
import { useAuthStore } from '../../stores/authStore';
import './AIAssistant.css';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  variant?: 'python-list-examples';
}

interface HistoryItem {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const assistantExitDelay = 860;

const pythonPrompt = '举几个python列表简单的应用实例，最好是实际应用的例子';

const pythonExampleMessages: ChatMessage[] = [
  {
    id: 'history-python-user',
    role: 'user',
    content: pythonPrompt,
  },
  {
    id: 'history-python-assistant',
    role: 'assistant',
    content: '以下是几个贴近实际工作/生活场景的 Python 列表应用实例：',
    variant: 'python-list-examples',
  },
];

const historyItems: HistoryItem[] = [
  {
    id: 'python-list',
    title: 'Python列表应用实例',
    messages: pythonExampleMessages,
  },
  {
    id: 'linux-permission',
    title: 'Linux 文件权限复习',
    messages: [
      { id: 'linux-user', role: 'user', content: '帮我复习 Linux 文件权限' },
      {
        id: 'linux-assistant',
        role: 'assistant',
        content: 'Linux 权限可以先看三组对象：所有者、用户组、其他人。每组三位分别代表读、写、执行，例如 rwx 是 7，r-x 是 5，r-- 是 4。',
      },
    ],
  },
  {
    id: 'docker-debug',
    title: 'Docker 容器启动失败',
    messages: [
      { id: 'docker-user', role: 'user', content: 'Docker 容器启动失败应该怎么排查？' },
      {
        id: 'docker-assistant',
        role: 'assistant',
        content: '先确认镜像、启动命令、端口映射和环境变量，再依次查看容器状态、退出码和日志。定位到报错后，再判断是配置问题、权限问题还是服务本身启动失败。',
      },
    ],
  },
  {
    id: 'shell-loop',
    title: 'Shell 脚本循环',
    messages: [
      { id: 'shell-user', role: 'user', content: 'Shell 里的循环怎么写？' },
      {
        id: 'shell-assistant',
        role: 'assistant',
        content: '可以先掌握 for 和 while。for 适合遍历一组已知内容，while 适合按条件持续执行。写脚本时建议先把命令跑通，再加入变量、判断和循环。',
      },
    ],
  },
  {
    id: 'image-question',
    title: '图片题解答',
    messages: [
      { id: 'image-user', role: 'user', content: '我上传一张题目图片后，你帮我分析思路。' },
      {
        id: 'image-assistant',
        role: 'assistant',
        content: '可以。你把题目截图发上来后，我会先识别题干和条件，再拆解知识点、解题步骤和容易丢分的位置。',
      },
    ],
  },
];

const assistantTools = [
  {
    key: 'course',
    label: '课程问答',
    prompt: '帮我梳理这门课程的重点，并列出我应该先复习的知识点。',
  },
  {
    key: 'lab',
    label: '实验排错',
    prompt: '我的实验运行不起来，请帮我按现象、日志、环境配置一步步排查。',
  },
  {
    key: 'code',
    label: '代码解释',
    prompt: '请用适合课堂学习的方式解释这段代码的逻辑。',
  },
  {
    key: 'plan',
    label: '学习计划',
    prompt: '帮我制定一个本周的课程复习和实验完成计划。',
  },
] as const;

const buildReply = (prompt: string): ChatMessage => {
  const normalized = prompt.trim();

  if (normalized.toLowerCase().includes('python') && normalized.includes('列表')) {
    return {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '以下是几个贴近实际工作/生活场景的 Python 列表应用实例：',
      variant: 'python-list-examples',
    };
  }

  if (normalized.includes('Linux') || normalized.includes('权限')) {
    return {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: 'Linux 权限可以先看三组对象：所有者、用户组、其他人。每组三位分别代表读、写、执行，例如 rwx 是 7，r-x 是 5，r-- 是 4。你可以把题目里的权限按三组拆开，再转成八进制。',
    };
  }

  if (normalized.includes('Docker') || normalized.includes('容器')) {
    return {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '可以把镜像理解成可复用的环境模板，容器是镜像运行后的实例。做实验时，先确认镜像来源、启动命令、端口映射和数据卷，再看容器状态与日志。',
    };
  }

  if (normalized.includes('Shell') || normalized.includes('脚本')) {
    return {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '写 Shell 脚本时先把输入、处理、输出分开。建议先用最小命令跑通，再加入变量、判断和循环，最后补充错误处理。你可以把脚本贴出来，我帮你一起看。',
    };
  }

  return {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content: `我理解你的问题是：“${normalized}”。我们可以先把它拆成概念、步骤和容易出错的地方三部分，再逐个处理。`,
  };
};

const makeTitle = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return 'Spark AI';
  return trimmed.length > 18 ? `${trimmed.slice(0, 18)}...` : trimmed;
};

const SparkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5c1.14 4.54 4.1 7.5 8.64 8.64.26.07.44.31.44.58s-.18.51-.44.58c-4.54 1.14-7.5 4.1-8.64 8.64-.07.26-.31.44-.58.44s-.51-.18-.58-.44c-1.14-4.54-4.1-7.5-8.64-8.64a.6.6 0 0 1-.44-.58c0-.27.18-.51.44-.58 4.54-1.14 7.5-4.1 8.64-8.64.07-.26.31-.44.58-.44s.51.18.58.44Z" />
  </svg>
);

const GeminiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="gemini-avatar-gradient" x1="4" x2="20" y1="20" y2="4" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#5d7cff" />
        <stop offset="0.42" stopColor="#8f6cff" />
        <stop offset="0.72" stopColor="#35b7ff" />
        <stop offset="1" stopColor="#7be0ff" />
      </linearGradient>
    </defs>
    <path
      fill="url(#gemini-avatar-gradient)"
      d="M12 2.4c.96 4.6 3.58 7.22 8.2 8.2.32.07.55.35.55.68s-.23.61-.55.68c-4.62.98-7.24 3.6-8.2 8.2a.7.7 0 0 1-1.38 0c-.98-4.6-3.6-7.22-8.2-8.2a.7.7 0 0 1 0-1.36c4.6-.98 7.22-3.6 8.2-8.2a.7.7 0 0 1 1.38 0Z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8M6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8m6 9c-3.314 0-6 1.79-6 4h12c0-2.21-2.686-4-6-4m-8 4c0-3.59 3.582-6 8-6s8 2.41 8 6v1H4z" clipRule="evenodd" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const RenameIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m7 10 5 5 5-5z" />
  </svg>
);

const ToolIcon: React.FC<{ tool: string }> = ({ tool }) => {
  if (tool === 'course') {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    );
  }

  if (tool === 'lab') {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 3v5l-5 9a3 3 0 0 0 2.6 4.5h10.8A3 3 0 0 0 20 17L15 8V3" />
        <path d="M8 3h8" />
        <path d="M7 15h10" />
      </svg>
    );
  }

  if (tool === 'code') {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 4-4 16" />
      </svg>
    );
  }

  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
};

const CodeBlock: React.FC<{ children: string }> = ({ children }) => (
  <div className="student-ai-code-block">
    <div className="student-ai-code-head">
      <span>Python</span>
      <button type="button" aria-label="复制代码">
        <CopyIcon />
      </button>
    </div>
    <pre><code>{children}</code></pre>
  </div>
);

const PythonExamples = () => (
  <div className="student-ai-rich-response">
    <p>以下是几个贴近实际工作/生活场景的 Python 列表应用实例：</p>
    <div className="student-ai-answer-line" />

    <section>
      <h3>1. 批量重命名文件</h3>
      <CodeBlock>{`import os

files = os.listdir("./photos")  # 获取所有文件名
new_names = []

for i, old_name in enumerate(files, 1):
    ext = old_name.split(".")[-1]
    new_name = f"img_{i:03d}.{ext}"  # img_001.jpg
    new_names.append(new_name)
    os.rename(f"./photos/{old_name}", f"./photos/{new_name}")

print(new_names)`}</CodeBlock>
    </section>

    <section>
      <h3>2. 读取日志文件，提取错误信息</h3>
      <CodeBlock>{`logs = [
    "INFO server started",
    "ERROR database timeout",
    "WARN disk space low",
    "ERROR login failed",
]

errors = []
for line in logs:
    if line.startswith("ERROR"):
        errors.append(line)

print(errors)`}</CodeBlock>
    </section>
  </div>
);

export const StudentAIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [activeTool, setActiveTool] = useState<string>('course');
  const [activeHistory, setActiveHistory] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>(historyItems);
  const [conversationTitle, setConversationTitle] = useState('Spark AI');
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const titleMenuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const exitTimerRef = useRef<number | null>(null);

  const canSend = draft.trim().length > 0;
  const hasMessages = messages.length > 0;

  const resetConversation = () => {
    setMessages([]);
    setDraft('');
    setActiveTool('course');
    setActiveHistory(null);
    setConversationTitle('Spark AI');
    setChatMenuOpen(false);
    setIsRenaming(false);
    setRenameDraft('');
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        resetConversation();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const closeTitleMenu = (event: MouseEvent) => {
      if (!titleMenuRef.current || titleMenuRef.current.contains(event.target as Node)) return;
      setChatMenuOpen(false);
      setIsRenaming(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setChatMenuOpen(false);
      setIsRenaming(false);
    };

    document.addEventListener('mousedown', closeTitleMenu);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', closeTitleMenu);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isRenaming) return;

    const frameId = window.requestAnimationFrame(() => {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isRenaming]);

  const loadHistory = (history: HistoryItem) => {
    setMessages(history.messages);
    setDraft('');
    setActiveHistory(history.id);
    setConversationTitle(history.title);
    setChatMenuOpen(false);
    setIsRenaming(false);
  };

  const sendMessage = (content: string) => {
    const text = content.trim();
    if (!text) return;

    const timestamp = Date.now();
    const userMessage: ChatMessage = {
      id: `user-${timestamp}`,
      role: 'user',
      content: text,
    };
    const assistantMessage = buildReply(text);

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setConversationTitle(prev => (prev === 'Spark AI' ? makeTitle(text) : prev));
    setActiveHistory(null);
    setDraft('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const handleComposerKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;

    event.preventDefault();
    sendMessage(draft);
  };

  const handleToolClick = (tool: typeof assistantTools[number]) => {
    setActiveTool(tool.key);
    setDraft(tool.prompt);
  };

  const handleAttach = () => {
    setDraft(value => value || '请根据我接下来粘贴的课程资料，帮我提炼重点：');
  };

  const toggleTitleMenu = () => {
    setRenameDraft(conversationTitle);
    setChatMenuOpen(open => !open);
    setIsRenaming(false);
  };

  const startRename = () => {
    setRenameDraft(conversationTitle);
    setIsRenaming(true);
  };

  const commitRename = () => {
    const nextTitle = renameDraft.trim() || conversationTitle;
    setConversationTitle(nextTitle);
    if (activeHistory) {
      setChatHistory(prev => prev.map(history => (
        history.id === activeHistory ? { ...history, title: nextTitle } : history
      )));
    }
    setChatMenuOpen(false);
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitRename();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setChatMenuOpen(false);
      setIsRenaming(false);
    }
  };

  const deleteCurrentConversation = () => {
    if (activeHistory) {
      setChatHistory(prev => prev.filter(history => history.id !== activeHistory));
    }
    resetConversation();
  };

  const handleExit = () => {
    if (isExiting) return;

    setIsExiting(true);
    exitTimerRef.current = window.setTimeout(() => {
      navigate('/student', { state: { fromAssistant: true } });
    }, assistantExitDelay);
  };

  const renderMessage = (message: ChatMessage) => (
    <article
      key={message.id}
      className={`student-ai-message student-ai-message-${message.role}`}
    >
      {message.role === 'assistant' && (
        <div className="student-ai-avatar student-ai-avatar-gemini" aria-hidden="true">
          <GeminiIcon />
        </div>
      )}
      <div className="student-ai-message-body">
        {message.variant === 'python-list-examples' ? <PythonExamples /> : <p>{message.content}</p>}
      </div>
    </article>
  );

  return (
    <div className={`student-ai-route${isExiting ? ' student-ai-route-exit' : ''}`}>
      <aside className="student-ai-sidebar" aria-label="Spark AI 导航">
        <div className="student-ai-sidebar-top">
          <button className="student-ai-sidebar-return" type="button" onClick={handleExit}>
            <span className="student-ai-button-icon"><BackIcon /></span>
            <span>返回平台</span>
          </button>

          <button className="student-ai-new-chat" type="button" onClick={resetConversation}>
            <span className="student-ai-button-icon"><PlusIcon /></span>
            <span>新建会话</span>
            <kbd>Ctrl</kbd>
            <kbd>K</kbd>
          </button>

          <nav className="student-ai-sidebar-nav" aria-label="Spark AI 工具">
            {assistantTools.map(tool => (
              <button
                key={tool.key}
                className={activeTool === tool.key ? 'student-ai-nav-active' : ''}
                type="button"
                onClick={() => handleToolClick(tool)}
              >
                <span className="student-ai-button-icon"><ToolIcon tool={tool.key} /></span>
                <span>{tool.label}</span>
              </button>
            ))}
          </nav>

          <section className="student-ai-history" aria-label="历史会话">
            <div className="student-ai-history-title">历史会话</div>
            <div className="student-ai-history-list">
              {chatHistory.map(history => (
                <button
                  key={history.id}
                  className={activeHistory === history.id ? 'student-ai-history-active' : ''}
                  type="button"
                  onClick={() => loadHistory(history)}
                >
                  {history.title}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="student-ai-sidebar-bottom">
          <ThemeSwitcher />
          <div className="student-ai-user-card">
            <span className="student-ai-user-avatar"><UserIcon /></span>
            <span className="student-ai-user-text">
              <strong>{user?.name ?? '学生'}</strong>
              <small>学生账号</small>
            </span>
          </div>
        </div>
      </aside>

      <main className={`student-ai-main${hasMessages ? ' student-ai-main-chat' : ''}`}>
        {hasMessages && (
          <header className="student-ai-chat-header">
            <div className="student-ai-chat-title-menu" ref={titleMenuRef}>
              <button
                className="student-ai-chat-title-button"
                type="button"
                aria-haspopup="menu"
                aria-expanded={chatMenuOpen}
                onClick={toggleTitleMenu}
              >
                <span>{conversationTitle}</span>
                <ChevronDownIcon />
              </button>

              {chatMenuOpen && (
                <div className="student-ai-chat-menu" role="menu">
                  {!isRenaming ? (
                    <>
                      <button type="button" role="menuitem" onClick={startRename}>
                        <RenameIcon />
                        <span>修改名称</span>
                      </button>
                      <button className="student-ai-chat-menu-danger" type="button" role="menuitem" onClick={deleteCurrentConversation}>
                        <TrashIcon />
                        <span>删除</span>
                      </button>
                    </>
                  ) : (
                    <div className="student-ai-chat-rename">
                      <input
                        ref={renameInputRef}
                        value={renameDraft}
                        onChange={event => setRenameDraft(event.target.value)}
                        onFocus={event => event.currentTarget.select()}
                        onKeyDown={handleRenameKeyDown}
                        autoFocus
                        aria-label="修改对话名称"
                      />
                      <button type="button" onClick={commitRename}>保存</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>
        )}

        <section className={`student-ai-center${hasMessages ? ' student-ai-center-chatting' : ''}`} aria-label="Spark AI">
          {!hasMessages ? (
            <div className="student-ai-home">
              <span className="student-ai-home-logo" aria-label="SparkLab">
                <img className="student-ai-home-logo-light" src="/brand/sparklab-wordmark.png?v=pure-wordmark" alt="" aria-hidden="true" />
                <img className="student-ai-home-logo-dark" src="/brand/sparklab-wordmark-dark.png?v=pure-wordmark" alt="" aria-hidden="true" />
              </span>
              <form className="student-ai-composer student-ai-composer-home" onSubmit={handleSubmit}>
                <textarea
                  value={draft}
                  onChange={event => setDraft(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  placeholder="尽管问..."
                  rows={1}
                />
                <div className="student-ai-composer-tools">
                  <button className="student-ai-tool" type="button" aria-label="添加资料" onClick={handleAttach}>
                    <PlusIcon />
                  </button>
                  <span className="student-ai-model-pill">
                    <SparkIcon />
                    Spark AI
                  </span>
                  <button className="student-ai-send" type="submit" disabled={!canSend} aria-label="发送">
                    <ArrowIcon />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="student-ai-chat-scroll">
                <div className="student-ai-chat-thread">
                  {messages.map(renderMessage)}
                </div>
              </div>

              <div className="student-ai-composer-dock">
                <form className="student-ai-composer" onSubmit={handleSubmit}>
                  <textarea
                    value={draft}
                    onChange={event => setDraft(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="尽管问，带图也行"
                    rows={1}
                  />
                  <div className="student-ai-composer-tools">
                    <button className="student-ai-tool" type="button" aria-label="添加资料" onClick={handleAttach}>
                      <PlusIcon />
                    </button>
                    <span className="student-ai-model-pill">K2.6 快速</span>
                    <button className="student-ai-send" type="submit" disabled={!canSend} aria-label="发送">
                      <ArrowIcon />
                    </button>
                  </div>
                </form>
                <p>内容由AI生成，请仔细甄别</p>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};
