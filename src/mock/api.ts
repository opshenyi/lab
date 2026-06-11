import type { User, Course, Lab, Question, Exam, Grade, ContainerTemplate, RunningContainer, SystemStats } from '../types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const mockUsers: User[] = [
  { id: 's1', name: '张伟', email: 'zhangwei@example.edu', role: 'student', studentId: '2024001', department: '计算机科学与技术', createdAt: '2024-09-01' },
  { id: 's2', name: '王芳', email: 'wangfang@example.edu', role: 'student', studentId: '2024002', department: '计算机科学与技术', createdAt: '2024-09-01' },
  { id: 's3', name: '陈宇', email: 'chenyu@example.edu', role: 'student', studentId: '2024003', department: '软件工程', createdAt: '2024-09-01' },
  { id: 's4', name: '刘洋', email: 'liuyang@example.edu', role: 'student', studentId: '2024004', department: '信息安全', createdAt: '2024-09-01' },
  { id: 's5', name: '赵欣', email: 'zhaoxin@example.edu', role: 'student', studentId: '2024005', department: '计算机科学与技术', createdAt: '2024-09-01' },
  { id: 't1', name: '李明教授', email: 'liming@example.edu', role: 'teacher', department: '计算机科学与技术', createdAt: '2023-03-15' },
  { id: 't2', name: '吴杰教授', email: 'wujie@example.edu', role: 'teacher', department: '软件工程', createdAt: '2022-09-01' },
  { id: 'a1', name: '系统管理员', email: 'admin@example.edu', role: 'admin', department: '信息化运维', createdAt: '2023-01-01' },
];

export const mockCourses: Course[] = [
  { id: 'c1', name: 'Linux 系统管理', code: 'CS301', description: '通过在线实验掌握 Linux 命令行、Shell 脚本、系统管理与网络基础。', teacherId: 't1', teacherName: '李明教授', semester: '2025 春季学期', studentCount: 45, labCount: 8, examCount: 3, status: 'active', createdAt: '2025-01-10', coverColor: '#5b6170' },
  { id: 'c2', name: 'Docker 与容器技术', code: 'CS401', description: '学习容器化、Kubernetes 编排与云原生应用部署的核心实践。', teacherId: 't1', teacherName: '李明教授', semester: '2025 春季学期', studentCount: 38, labCount: 6, examCount: 2, status: 'active', createdAt: '2025-01-10', coverColor: '#746f68' },
  { id: 'c3', name: '网络安全基础', code: 'SEC301', description: '学习防火墙、入侵检测、加密与基础渗透测试等网络安全原理。', teacherId: 't2', teacherName: '吴杰教授', semester: '2025 春季学期', studentCount: 32, labCount: 7, examCount: 3, status: 'active', createdAt: '2025-01-12', coverColor: '#7d6c4f' },
  { id: 'c4', name: '数据库管理系统', code: 'CS302', description: '系统学习关系型数据库、SQL、范式设计、索引与事务管理。', teacherId: 't2', teacherName: '吴杰教授', semester: '2025 春季学期', studentCount: 40, labCount: 5, examCount: 2, status: 'active', createdAt: '2025-01-12', coverColor: '#6a6470' },
  { id: 'c5', name: '云计算架构', code: 'CS501', description: '学习分布式系统、微服务、Serverless 与基础设施即代码等云计算主题。', teacherId: 't1', teacherName: '李明教授', semester: '2025 春季学期', studentCount: 28, labCount: 4, examCount: 2, status: 'active', createdAt: '2025-01-15', coverColor: '#555a62' },
];

export const mockTemplates: ContainerTemplate[] = [
  { id: 'tmpl1', name: 'Ubuntu 22.04 基础环境', description: '预装常用开发工具的 Ubuntu 22.04 LTS 标准实验环境。', dockerfile: 'FROM ubuntu:22.04\nRUN apt-get update && apt-get install -y \\\n    vim nano curl wget git \\\n    build-essential python3 python3-pip\nWORKDIR /home/student\nCMD ["/bin/bash"]', baseImage: 'ubuntu:22.04', status: 'ready', cpuLimit: '1.0', memoryLimit: '512Mi', timeoutMinutes: 120, environmentVars: { LANG: 'en_US.UTF-8' }, exposedPorts: [22], createdAt: '2025-01-05', updatedAt: '2025-01-05', createdBy: 'a1', usageCount: 156 },
  { id: 'tmpl2', name: 'CentOS 7 命令行环境', description: '用于传统系统管理练习的 CentOS 7 实验环境。', dockerfile: 'FROM centos:7\nRUN yum -y install vim nano curl wget net-tools iproute\nWORKDIR /home/student\nCMD ["/bin/bash"]', baseImage: 'centos:7', status: 'ready', cpuLimit: '1.0', memoryLimit: '512Mi', timeoutMinutes: 90, environmentVars: {}, exposedPorts: [22], createdAt: '2025-01-05', updatedAt: '2025-01-05', createdBy: 'a1', usageCount: 89 },
  { id: 'tmpl3', name: 'Docker 容器实验环境', description: '用于容器实验的 Docker 环境，包含 Docker CLI 与守护进程。', dockerfile: 'FROM docker:24-dind\nRUN apk add --no-cache bash vim curl git\nWORKDIR /home/student\nCMD ["dockerd-entrypoint.sh"]', baseImage: 'docker:24-dind', status: 'ready', cpuLimit: '2.0', memoryLimit: '1Gi', timeoutMinutes: 180, environmentVars: { DOCKER_TLS_CERTDIR: '' }, exposedPorts: [2375, 2376], createdAt: '2025-01-08', updatedAt: '2025-01-08', createdBy: 'a1', usageCount: 67 },
  { id: 'tmpl4', name: 'Kubernetes 实验节点', description: '预配置 kubectl 的单节点 Kubernetes 实验集群。', dockerfile: 'FROM rancher/k3s:v1.28.4-k3s2\nRUN apk add --no-cache bash vim curl\nWORKDIR /home/student', baseImage: 'rancher/k3s:v1.28.4-k3s2', status: 'ready', cpuLimit: '2.0', memoryLimit: '2Gi', timeoutMinutes: 180, environmentVars: {}, exposedPorts: [6443], createdAt: '2025-01-10', updatedAt: '2025-01-10', createdBy: 'a1', usageCount: 34 },
  { id: 'tmpl5', name: '网络安全工具环境', description: '基于 Kali 的网络分析与安全测试实验环境。', dockerfile: 'FROM kalilinux/kali-rolling\nRUN apt-get update && apt-get install -y \\\n    nmap wireshark-cli tcpdump \\\n    metasploit-framework sqlmap\nWORKDIR /home/student\nCMD ["/bin/bash"]', baseImage: 'kalilinux/kali-rolling', status: 'ready', cpuLimit: '2.0', memoryLimit: '1Gi', timeoutMinutes: 120, environmentVars: {}, exposedPorts: [], createdAt: '2025-01-12', updatedAt: '2025-01-12', createdBy: 'a1', usageCount: 45 },
  { id: 'tmpl6', name: 'Python 数据分析环境', description: '预装 numpy、pandas、matplotlib 与 Jupyter 的 Python 3.11 环境。', dockerfile: 'FROM python:3.11-slim\nRUN pip install numpy pandas matplotlib jupyter\nWORKDIR /home/student\nCMD ["/bin/bash"]', baseImage: 'python:3.11-slim', status: 'building', cpuLimit: '1.0', memoryLimit: '1Gi', timeoutMinutes: 120, environmentVars: {}, exposedPorts: [8888], createdAt: '2025-02-01', updatedAt: '2025-02-01', createdBy: 'a1', usageCount: 12 },
  { id: 'tmpl7', name: 'MySQL 8.0 数据库实验', description: '预置示例数据库的 MySQL 8.0 SQL 练习环境。', dockerfile: 'FROM mysql:8.0\nENV MYSQL_ROOT_PASSWORD=lab123\nENV MYSQL_DATABASE=lab_db\nCOPY init.sql /docker-entrypoint-initdb.d/\nEXPOSE 3306', baseImage: 'mysql:8.0', status: 'ready', cpuLimit: '1.0', memoryLimit: '512Mi', timeoutMinutes: 90, environmentVars: { MYSQL_ROOT_PASSWORD: 'lab123' }, exposedPorts: [3306], createdAt: '2025-01-15', updatedAt: '2025-01-15', createdBy: 'a1', usageCount: 78 },
  { id: 'tmpl8', name: 'Nginx Web 服务环境', description: '用于 Web 服务配置练习的 Nginx 实验环境。', dockerfile: 'FROM nginx:alpine\nRUN apk add --no-cache bash vim curl\nCOPY default.conf /etc/nginx/conf.d/\nEXPOSE 80 443', baseImage: 'nginx:alpine', status: 'deprecated', cpuLimit: '0.5', memoryLimit: '256Mi', timeoutMinutes: 60, environmentVars: {}, exposedPorts: [80, 443], createdAt: '2024-09-01', updatedAt: '2025-01-20', createdBy: 'a1', usageCount: 203 },
];

export const mockLabs: Lab[] = [
  { id: 'l1', courseId: 'c1', title: 'Linux 文件系统导航', description: '使用基础命令练习 Linux 文件系统导航。', templateId: 'tmpl1', templateName: 'Ubuntu 22.04 基础环境', difficulty: 'beginner', estimatedMinutes: 30, instructions: '# 实验：Linux 文件系统导航\n\n## 目标\n- 使用 `cd`、`pwd`、`ls` 浏览目录\n- 理解绝对路径与相对路径\n- 使用 `find` 和 `locate` 查找文件\n\n## 任务\n\n### 任务 1：基础导航\n运行 `pwd` 查看当前目录，然后进入 `/etc` 并列出目录内容。\n\n### 任务 2：文件查找\n使用 `find / -name "*.conf" -type f 2>/dev/null | head -10` 查找配置文件。\n\n### 任务 3：权限理解\n使用 `ls -la /etc/passwd` 查看文件权限，并说明输出含义。', checkpoints: [{ id: 'cp1', title: '检查当前目录', description: '运行 pwd 命令', command: 'pwd', expectedOutput: '/home/student', completed: false }, { id: 'cp2', title: '列出 /etc 内容', description: '进入 /etc 并列出文件', command: 'ls /etc', expectedOutput: '', completed: false }], status: 'not_started', dueDate: '2025-03-15', maxAttempts: 3, attemptsUsed: 0 },
  { id: 'l2', courseId: 'c1', title: 'Shell 脚本基础', description: '编写基础 Shell 脚本完成自动化任务。', templateId: 'tmpl1', templateName: 'Ubuntu 22.04 基础环境', difficulty: 'beginner', estimatedMinutes: 45, instructions: '# 实验：Shell 脚本基础\n\n## 目标\n- 创建并执行 Shell 脚本\n- 使用变量、条件判断和循环\n- 处理命令行参数\n\n## 任务\n\n### 任务 1：问候脚本\n创建 `hello.sh`，输出 “你好，SparkLab！”。\n\n### 任务 2：备份脚本\n编写脚本，将指定目录备份为带时间戳的 tar.gz 文件。', checkpoints: [], status: 'in_progress', dueDate: '2025-03-20', maxAttempts: 5, attemptsUsed: 1 },
  { id: 'l3', courseId: 'c1', title: '用户与用户组管理', description: '管理 Linux 系统中的用户、用户组与权限。', templateId: 'tmpl1', templateName: 'Ubuntu 22.04 基础环境', difficulty: 'intermediate', estimatedMinutes: 60, instructions: '# 实验：用户与用户组管理\n\n## 目标\n- 创建并管理用户账号\n- 配置用户组成员关系\n- 设置文件权限与所有者', checkpoints: [], status: 'not_started', dueDate: '2025-03-25', maxAttempts: 3, attemptsUsed: 0 },
  { id: 'l4', courseId: 'c2', title: 'Docker 容器生命周期', description: '学习创建、运行、停止与管理 Docker 容器。', templateId: 'tmpl3', templateName: 'Docker 容器实验环境', difficulty: 'beginner', estimatedMinutes: 45, instructions: '# 实验：Docker 容器生命周期\n\n## 目标\n- 从 Docker Hub 拉取镜像\n- 创建并运行容器\n- 管理容器生命周期\n- 查看容器详情', checkpoints: [], status: 'not_started', dueDate: '2025-03-18', maxAttempts: 3, attemptsUsed: 0 },
  { id: 'l5', courseId: 'c2', title: '自定义 Docker 镜像构建', description: '编写 Dockerfile 并构建自定义容器镜像。', templateId: 'tmpl3', templateName: 'Docker 容器实验环境', difficulty: 'intermediate', estimatedMinutes: 60, instructions: '# 实验：自定义 Docker 镜像构建\n\n## 目标\n- 编写多阶段 Dockerfile\n- 优化镜像体积\n- 合理使用构建缓存', checkpoints: [], status: 'completed', dueDate: '2025-03-20', maxAttempts: 3, attemptsUsed: 2 },
  { id: 'l6', courseId: 'c3', title: 'Nmap 网络扫描', description: '使用 Nmap 发现网络中的主机与服务。', templateId: 'tmpl5', templateName: '网络安全工具环境', difficulty: 'intermediate', estimatedMinutes: 60, instructions: '# 实验：Nmap 网络扫描\n\n## 目标\n- 执行主机发现\n- 扫描开放端口\n- 识别服务版本\n- 使用 NSE 脚本完成安全检查', checkpoints: [], status: 'not_started', dueDate: '2025-03-22', maxAttempts: 3, attemptsUsed: 0 },
  { id: 'l7', courseId: 'c4', title: 'SQL 查询基础', description: '练习 SELECT、JOIN 与聚合等 SQL 基础查询。', templateId: 'tmpl7', templateName: 'MySQL 8.0 数据库实验', difficulty: 'beginner', estimatedMinutes: 45, instructions: '# 实验：SQL 查询基础\n\n## 目标\n- 编写带 WHERE 条件的 SELECT 查询\n- 使用 JOIN 关联多张表\n- 使用 GROUP BY 完成聚合统计', checkpoints: [], status: 'completed', dueDate: '2025-03-15', maxAttempts: 5, attemptsUsed: 3 },
];

export const mockQuestions: Question[] = [
  { id: 'q1', type: 'choice', title: 'Linux 文件权限', content: '`rwxr-xr--` 对应的八进制权限表示是什么？', options: [{ id: 'a', label: 'A', content: '754' }, { id: 'b', label: 'B', content: '755' }, { id: 'c', label: 'C', content: '644' }, { id: 'd', label: 'D', content: '744' }], correctAnswer: 'a', points: 10, difficulty: 'easy', tags: ['linux', '权限'], courseId: 'c1', createdBy: 't1', createdAt: '2025-01-20' },
  { id: 'q2', type: 'choice', title: 'Docker 网络', content: '哪一种 Docker 网络驱动可以让不同主机上的容器互相通信？', options: [{ id: 'a', label: 'A', content: 'bridge' }, { id: 'b', label: 'B', content: 'host' }, { id: 'c', label: 'C', content: 'overlay' }, { id: 'd', label: 'D', content: 'none' }], correctAnswer: 'c', points: 10, difficulty: 'medium', tags: ['docker', '网络'], courseId: 'c2', createdBy: 't1', createdAt: '2025-01-20' },
  { id: 'q3', type: 'code', title: 'Shell 脚本：阶乘计算', content: '编写一个 Bash 脚本，用于计算给定数字的阶乘。脚本应从命令行参数读取数字。', templateId: 'tmpl1', templateName: 'Ubuntu 22.04 基础环境', points: 20, difficulty: 'medium', tags: ['shell', '脚本'], courseId: 'c1', createdBy: 't1', createdAt: '2025-01-22' },
  { id: 'q4', type: 'code', title: 'Dockerfile：Node.js 应用', content: '为一个 Node.js 应用编写 Dockerfile，要求：\n1. 使用 node:18-alpine 作为基础镜像\n2. 复制 package.json 并执行 npm install\n3. 复制应用代码\n4. 暴露 3000 端口\n5. 使用 node app.js 启动', templateId: 'tmpl3', templateName: 'Docker 容器实验环境', points: 25, difficulty: 'medium', tags: ['docker', 'dockerfile'], courseId: 'c2', createdBy: 't1', createdAt: '2025-01-25' },
  { id: 'q5', type: 'choice', title: 'TCP/IP 模型', content: 'TCP/IP 模型中负责端到端通信的是哪一层？', options: [{ id: 'a', label: 'A', content: '网络接入层' }, { id: 'b', label: 'B', content: '网际层' }, { id: 'c', label: 'C', content: '传输层' }, { id: 'd', label: 'D', content: '应用层' }], correctAnswer: 'c', points: 10, difficulty: 'easy', tags: ['网络', 'tcp-ip'], courseId: 'c3', createdBy: 't2', createdAt: '2025-01-20' },
  { id: 'q6', type: 'code', title: 'SQL：复杂连接查询', content: '已知表 `students(id, name, dept_id)` 与 `departments(id, dept_name)`，请编写 SQL 查询，找出“计算机科学与技术”专业的全部学生，并按姓名排序。', templateId: 'tmpl7', templateName: 'MySQL 8.0 数据库实验', points: 15, difficulty: 'medium', tags: ['sql', '数据库'], courseId: 'c4', createdBy: 't2', createdAt: '2025-01-22' },
  { id: 'q7', type: 'short_answer', title: '进程管理', content: '如果要查找名为 “nginx” 的运行中程序的进程 ID，并优雅终止该进程，应使用哪些命令？', points: 10, difficulty: 'easy', tags: ['linux', '进程'], courseId: 'c1', createdBy: 't1', createdAt: '2025-01-25' },
  { id: 'q8', type: 'multi_choice', title: 'Docker Compose 编排', content: '以下哪些是 Docker Compose 文件中常见且有效的顶层配置项？（可多选）', options: [{ id: 'a', label: 'A', content: 'version' }, { id: 'b', label: 'B', content: 'services' }, { id: 'c', label: 'C', content: 'volumes' }, { id: 'd', label: 'D', content: 'containers' }], correctAnswer: ['a', 'b', 'c'], points: 15, difficulty: 'medium', tags: ['docker', 'compose'], courseId: 'c2', createdBy: 't1', createdAt: '2025-01-28' },
  { id: 'q9', type: 'code', title: 'iptables 防火墙规则', content: '请编写 iptables 规则，满足：\n1. 允许入站 SSH（22 端口）\n2. 允许入站 HTTP（80 端口）\n3. 拒绝其他所有入站流量', templateId: 'tmpl5', templateName: '网络安全工具环境', points: 20, difficulty: 'hard', tags: ['安全', '防火墙'], courseId: 'c3', createdBy: 't2', createdAt: '2025-02-01' },
  { id: 'q10', type: 'choice', title: 'Kubernetes Pod', content: 'Kubernetes 中最小的可部署单元是什么？', options: [{ id: 'a', label: 'A', content: '容器' }, { id: 'b', label: 'B', content: 'Pod' }, { id: 'c', label: 'C', content: '服务' }, { id: 'd', label: 'D', content: '部署' }], correctAnswer: 'b', points: 10, difficulty: 'easy', tags: ['kubernetes', '容器'], courseId: 'c5', createdBy: 't1', createdAt: '2025-02-01' },
];

export const mockExams: Exam[] = [
  { id: 'e1', courseId: 'c1', courseName: 'Linux 系统管理', title: 'Linux 基础期中考试', description: '覆盖文件系统、权限、Shell 基础与进程管理。', questionIds: ['q1', 'q3', 'q7'], totalPoints: 40, durationMinutes: 60, startTime: '2025-04-01T09:00:00', endTime: '2025-04-01T10:00:00', status: 'published', createdBy: 't1', createdAt: '2025-03-15' },
  { id: 'e2', courseId: 'c2', courseName: 'Docker 与容器技术', title: 'Docker 基础测验', description: '围绕 Docker 概念、网络与镜像管理的快速测验。', questionIds: ['q2', 'q4', 'q8'], totalPoints: 50, durationMinutes: 45, startTime: '2025-04-05T14:00:00', endTime: '2025-04-05T14:45:00', status: 'draft', createdBy: 't1', createdAt: '2025-03-20' },
  { id: 'e3', courseId: 'c3', courseName: '网络安全基础', title: '网络安全概念期末考试', description: '综合考查 TCP/IP、防火墙与基础渗透测试知识。', questionIds: ['q5', 'q9'], totalPoints: 30, durationMinutes: 90, startTime: '2025-05-10T09:00:00', endTime: '2025-05-10T10:30:00', status: 'published', createdBy: 't2', createdAt: '2025-04-01' },
];

export const mockGrades: Grade[] = [
  { id: 'g1', examId: 'e1', examTitle: 'Linux 基础期中考试', courseId: 'c1', courseName: 'Linux 系统管理', studentId: 's1', studentName: '张伟', score: 35, totalPoints: 40, percentage: 87.5, gradedAt: '2025-04-02' },
  { id: 'g2', examId: 'e1', examTitle: 'Linux 基础期中考试', courseId: 'c1', courseName: 'Linux 系统管理', studentId: 's2', studentName: '王芳', score: 38, totalPoints: 40, percentage: 95.0, gradedAt: '2025-04-02' },
  { id: 'g3', examId: 'e1', examTitle: 'Linux 基础期中考试', courseId: 'c1', courseName: 'Linux 系统管理', studentId: 's3', studentName: '陈宇', score: 28, totalPoints: 40, percentage: 70.0, gradedAt: '2025-04-02' },
  { id: 'g4', examId: 'e1', examTitle: 'Linux 基础期中考试', courseId: 'c1', courseName: 'Linux 系统管理', studentId: 's4', studentName: '刘洋', score: 32, totalPoints: 40, percentage: 80.0, gradedAt: '2025-04-02' },
  { id: 'g5', examId: 'e1', examTitle: 'Linux 基础期中考试', courseId: 'c1', courseName: 'Linux 系统管理', studentId: 's5', studentName: '赵欣', score: 40, totalPoints: 40, percentage: 100.0, gradedAt: '2025-04-02' },
];

export const mockContainers: RunningContainer[] = [
  { id: 'rc1', containerId: 'cnt-a3f2b1', studentId: 's1', studentName: '张伟', templateId: 'tmpl1', templateName: 'Ubuntu 22.04 基础环境', labId: 'l2', labTitle: 'Shell 脚本基础', status: 'running', cpuUsage: 23.5, memoryUsage: 128, memoryLimit: '512Mi', uptime: '1 小时 23 分钟', startedAt: '2025-04-10T10:30:00' },
  { id: 'rc2', containerId: 'cnt-b4c3d2', studentId: 's2', studentName: '王芳', templateId: 'tmpl3', templateName: 'Docker 容器实验环境', labId: 'l4', labTitle: 'Docker 容器生命周期', status: 'running', cpuUsage: 45.2, memoryUsage: 340, memoryLimit: '1Gi', uptime: '45 分钟', startedAt: '2025-04-10T11:08:00' },
  { id: 'rc3', containerId: 'cnt-c5d4e3', studentId: 's3', studentName: '陈宇', templateId: 'tmpl5', templateName: '网络安全工具环境', labId: 'l6', labTitle: 'Nmap 网络扫描', status: 'paused', cpuUsage: 0, memoryUsage: 85, memoryLimit: '1Gi', uptime: '2 小时 10 分钟', startedAt: '2025-04-10T09:43:00' },
  { id: 'rc4', containerId: 'cnt-d6e5f4', studentId: 's5', studentName: '赵欣', templateId: 'tmpl7', templateName: 'MySQL 8.0 数据库实验', labId: 'l7', labTitle: 'SQL 查询基础', status: 'running', cpuUsage: 15.8, memoryUsage: 210, memoryLimit: '512Mi', uptime: '30 分钟', startedAt: '2025-04-10T11:23:00' },
];

export const mockSystemStats: SystemStats = {
  totalUsers: 8,
  totalStudents: 5,
  totalTeachers: 2,
  totalCourses: 5,
  totalLabs: 7,
  totalTemplates: 8,
  runningContainers: 3,
  containerCapacity: 50,
  cpuUsagePercent: 42,
  memoryUsagePercent: 58,
};

export const api = {
  getCurrentUser: async () => { await delay(200); return mockUsers[0]; },
  getCourses: async () => { await delay(300); return mockCourses; },
  getCourse: async (id: string) => { await delay(200); return mockCourses.find(c => c.id === id); },
  getLabs: async (courseId?: string) => { await delay(300); return courseId ? mockLabs.filter(l => l.courseId === courseId) : mockLabs; },
  getLab: async (id: string) => { await delay(200); return mockLabs.find(l => l.id === id); },
  getQuestions: async (courseId?: string) => { await delay(300); return courseId ? mockQuestions.filter(q => q.courseId === courseId) : mockQuestions; },
  getQuestion: async (id: string) => { await delay(200); return mockQuestions.find(q => q.id === id); },
  getExams: async (courseId?: string) => { await delay(300); return courseId ? mockExams.filter(e => e.courseId === courseId) : mockExams; },
  getExam: async (id: string) => { await delay(200); return mockExams.find(e => e.id === id); },
  getGrades: async (studentId?: string) => { await delay(300); return studentId ? mockGrades.filter(g => g.studentId === studentId) : mockGrades; },
  getTemplates: async () => { await delay(300); return mockTemplates; },
  getTemplate: async (id: string) => { await delay(200); return mockTemplates.find(t => t.id === id); },
  getContainers: async () => { await delay(300); return mockContainers; },
  getUsers: async () => { await delay(300); return mockUsers; },
  getSystemStats: async () => { await delay(300); return mockSystemStats; },
};
