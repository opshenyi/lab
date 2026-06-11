import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudentLayout } from './layouts/StudentLayout';
import { TeacherLayout } from './layouts/TeacherLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Login } from './portals/Login';
import { StudentDashboard } from './portals/student/Dashboard';
import { StudentCourses } from './portals/student/Courses';
import { StudentCourseDetail } from './portals/student/CourseDetail';
import { StudentLabs } from './portals/student/Labs';
import { StudentLabWorkspace } from './portals/student/LabWorkspace';
import { StudentExams } from './portals/student/Exams';
import { StudentExamTaking } from './portals/student/ExamTaking';
import { StudentGrades } from './portals/student/Grades';
import { TeacherDashboard } from './portals/teacher/Dashboard';
import { TeacherCourses } from './portals/teacher/Courses';
import { TeacherQuestions } from './portals/teacher/Questions';
import { TeacherExams } from './portals/teacher/Exams';
import { TeacherGrades } from './portals/teacher/Grades';
import { AdminDashboard } from './portals/admin/Dashboard';
import { AdminTemplates } from './portals/admin/Templates';
import { AdminUsers } from './portals/admin/Users';
import { AdminContainers } from './portals/admin/Containers';
import { AdminSystem } from './portals/admin/System';
import { useThemeStore } from './stores/themeStore';

const App: React.FC = () => {
  useThemeStore(state => state.resolvedTheme);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/:courseId" element={<StudentCourseDetail />} />
          <Route path="labs" element={<StudentLabs />} />
          <Route path="labs/:labId" element={<StudentLabWorkspace />} />
          <Route path="exams" element={<StudentExams />} />
          <Route path="exams/:examId" element={<StudentExamTaking />} />
          <Route path="grades" element={<StudentGrades />} />
        </Route>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="questions" element={<TeacherQuestions />} />
          <Route path="exams" element={<TeacherExams />} />
          <Route path="grades" element={<TeacherGrades />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="templates" element={<AdminTemplates />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="containers" element={<AdminContainers />} />
          <Route path="system" element={<AdminSystem />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
