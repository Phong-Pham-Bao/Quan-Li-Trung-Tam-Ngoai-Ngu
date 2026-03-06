import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, Building2, 
  DollarSign, BarChart3, ClipboardCheck, Calendar,
  User, Bell, FolderOpen, Award, CreditCard, X, Languages
} from 'lucide-react';

const adminMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, page: 'AdminDashboard' },
  { label: 'Teachers', icon: Users, page: 'TeacherManagement' },
  { label: 'Students', icon: GraduationCap, page: 'StudentManagement' },
  { label: 'Courses', icon: BookOpen, page: 'CourseManagement' },
  { label: 'Subjects', icon: Languages, page: 'SubjectManagement' },
  { label: 'Classrooms', icon: Building2, page: 'ClassroomManagement' },
  { label: 'Tuition & Fees', icon: DollarSign, page: 'TuitionManagement' },
  { label: 'Attendance', icon: ClipboardCheck, page: 'AttendanceManagement' },
  { label: 'Statistics', icon: BarChart3, page: 'Statistics' },
];

const teacherMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, page: 'TeacherDashboard' },
  { label: 'My Schedule', icon: Calendar, page: 'TeacherSchedule' },
  { label: 'My Students', icon: GraduationCap, page: 'TeacherStudents' },
  { label: 'Grade Entry', icon: Award, page: 'GradeEntry' },
  { label: 'Materials', icon: FolderOpen, page: 'TeacherMaterials' },
  { label: 'My Profile', icon: User, page: 'Profile' },
];

const studentMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, page: 'StudentDashboard' },
  { label: 'My Courses', icon: BookOpen, page: 'StudentCourses' },
  { label: 'Timetable', icon: Calendar, page: 'StudentTimetable' },
  { label: 'My Grades', icon: Award, page: 'StudentGrades' },
  { label: 'Tuition', icon: CreditCard, page: 'StudentTuition' },
  { label: 'Materials', icon: FolderOpen, page: 'StudentMaterials' },
  { label: 'Notifications', icon: Bell, page: 'StudentNotifications' },
  { label: 'My Profile', icon: User, page: 'Profile' },
];

export default function Sidebar({ role, currentPage, isOpen, onClose }) {
  const menu = role === 'admin' ? adminMenu : role === 'teacher' ? teacherMenu : studentMenu;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Languages className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">LinguaCenter</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {role}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menu.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="px-3 py-2.5 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Language Center</p>
            <p className="text-xs font-semibold text-foreground mt-0.5">Management System</p>
          </div>
        </div>
      </aside>
    </>
  );
}