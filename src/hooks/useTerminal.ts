import { useEffect, useRef, useCallback } from 'react';

interface UseTerminalOptions {
  onData?: (data: string) => void;
}

export function useTerminal({ onData }: UseTerminalOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const lineBuffer = useRef('');

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { Terminal } = await import('xterm');
      const { FitAddon } = await import('xterm-addon-fit');
      // @ts-ignore
      await import('xterm/css/xterm.css');

      if (!mounted || !containerRef.current) return;

      const term = new Terminal({
        theme: {
          background: '#0a0a0a',
          foreground: '#f7f8f8',
          cursor: '#5b6170',
          cursorAccent: '#0a0a0a',
          selectionBackground: 'rgba(91, 97, 112, 0.28)',
          black: '#0a0a0a',
          red: '#e5484d',
          green: '#5b6170',
          yellow: '#7d6c4f',
          blue: '#646a76',
          magenta: '#6a6470',
          cyan: '#746f68',
          white: '#f7f8f8',
          brightBlack: '#62666d',
          brightRed: '#f07178',
          brightGreen: '#878d99',
          brightYellow: '#a08f70',
          brightBlue: '#8b91a0',
          brightMagenta: '#918996',
          brightCyan: '#98928a',
          brightWhite: '#ffffff',
        },
        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', monospace",
        fontSize: 14,
        lineHeight: 1.4,
        cursorBlink: true,
        cursorStyle: 'bar',
        allowTransparency: true,
        scrollback: 5000,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(containerRef.current);
      fitAddon.fit();

      termRef.current = term;

      const writePrompt = () => {
        term.write('\r\n\x1b[38;2;91;97;112mstudent\x1b[0m\x1b[38;2;138;143;152m@\x1b[0m\x1b[38;2;100;106;118msparklab\x1b[0m\x1b[38;2;138;143;152m:\x1b[0m\x1b[38;2;91;97;112m~\x1b[0m$ ');
      };

      const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) {
          writePrompt();
          return;
        }

        const commands: Record<string, string> = {
          'whoami': 'student',
          'hostname': 'sparklab-lab01',
          'pwd': '/home/student',
          'date': new Date().toString(),
          'uname -a': 'Linux sparklab 5.15.0-generic #1 SMP x86_64 GNU/Linux',
          'ls': '\x1b[34mlabs  \x1b[36mscripts  \x1b[0mREADME.md  notes.txt',
          'ls -la': 'total 24\ndrwxr-xr-x 4 student student 4096 Apr 10 10:30 .\ndrwxr-xr-x 3 root    root    4096 Apr 10 10:00 ..\n-rw-r--r-- 1 student student  220 Apr 10 10:00 .bash_logout\n-rw-r--r-- 1 student student 3771 Apr 10 10:00 .bashrc\ndrwxr-xr-x 2 student student 4096 Apr 10 10:30 labs\ndrwxr-xr-x 2 student student 4096 Apr 10 10:30 scripts\n-rw-r--r-- 1 student student   53 Apr 10 10:15 README.md\n-rw-r--r-- 1 student student  128 Apr 10 10:20 notes.txt',
          'cat README.md': '# SparkLab 实验环境\n欢迎使用您的实验环境。\n输入 "help" 查看可用命令。',
          'cat notes.txt': '实验二: Shell 脚本基础\n状态: 进行中\n截止日期: 2025-03-20\n\n待完成:\n- 创建 hello.sh\n- 使用 chmod +x 添加执行权限\n- 使用 ./hello.sh 测试运行',
          'help': '可用内置命令:\n  help          显示帮助信息\n  clear         清空终端\n  whoami        显示当前用户\n  pwd           显示当前目录\n  ls            列出目录内容\n  cat <file>    显示文件内容\n  echo <text>   输出文本\n  uname         系统信息\n  date          当前日期时间\n  history       命令历史记录',
          'clear': '__CLEAR__',
        };

        if (trimmed === 'clear') {
          term.clear();
          writePrompt();
          return;
        }

        const output = commands[trimmed] || commands[trimmed.split(' ')[0] + ' ' + trimmed.split(' ').slice(1).join(' ')] || null;

        if (output) {
          const lines = output.split('\n');
          for (const line of lines) {
            term.write('\r\n' + line);
          }
        } else if (trimmed.startsWith('echo ')) {
          term.write('\r\n' + trimmed.slice(5));
        } else if (trimmed.startsWith('cat ')) {
          term.write('\r\n\x1b[31mcat: ' + trimmed.slice(4) + ': 没有那个文件或目录\x1b[0m');
        } else {
          term.write('\r\n\x1b[31m' + trimmed.split(' ')[0] + ': 未找到命令\x1b[0m');
        }

        writePrompt();
      };

      writePrompt();

      term.onData((data: string) => {
        if (data === '\r') {
          handleCommand(lineBuffer.current);
          lineBuffer.current = '';
        } else if (data === '\x7f') {
          if (lineBuffer.current.length > 0) {
            lineBuffer.current = lineBuffer.current.slice(0, -1);
            term.write('\b \b');
          }
        } else if (data >= ' ') {
          lineBuffer.current += data;
          term.write(data);
        }
        onData?.(data);
      });

      const resizeObserver = new ResizeObserver(() => fitAddon.fit());
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    };

    init();

    return () => {
      mounted = false;
      termRef.current?.dispose();
    };
  }, []);

  return { containerRef, terminal: termRef.current };
}
