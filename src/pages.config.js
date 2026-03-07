/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminDashboard from './pages/AdminDashboard';
import TeacherManagement from './pages/TeacherManagement';
import StudentManagement from './pages/StudentManagement';
import CourseManagement from './pages/CourseManagement';
import SubjectManagement from './pages/SubjectManagement';
import ClassroomManagement from './pages/ClassroomManagement';
import TuitionManagement from './pages/TuitionManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import Statistics from './pages/Statistics';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherSchedule from './pages/TeacherSchedule';
import TeacherStudents from './pages/TeacherStudents';
import GradeEntry from './pages/GradeEntry';
import TeacherMaterials from './pages/TeacherMaterials';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourses from './pages/StudentCourses';
import StudentTimetable from './pages/StudentTimetable';
import StudentGrades from './pages/StudentGrades';
import StudentTuition from './pages/StudentTuition';
import StudentMaterials from './pages/StudentMaterials';
import StudentNotifications from './pages/StudentNotifications';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import __Layout from './Layout.jsx';


export const PAGES = {
    "login": Login,
    "register": Register,
    "LandingPage": LandingPage,
    "AdminDashboard": AdminDashboard,
    "TeacherManagement": TeacherManagement,
    "StudentManagement": StudentManagement,
    "CourseManagement": CourseManagement,
    "SubjectManagement": SubjectManagement,
    "ClassroomManagement": ClassroomManagement,
    "TuitionManagement": TuitionManagement,
    "AttendanceManagement": AttendanceManagement,
    "Statistics": Statistics,
    "TeacherDashboard": TeacherDashboard,
    "TeacherSchedule": TeacherSchedule,
    "TeacherStudents": TeacherStudents,
    "GradeEntry": GradeEntry,
    "TeacherMaterials": TeacherMaterials,
    "StudentDashboard": StudentDashboard,
    "StudentCourses": StudentCourses,
    "StudentTimetable": StudentTimetable,
    "StudentGrades": StudentGrades,
    "StudentTuition": StudentTuition,
    "StudentMaterials": StudentMaterials,
    "StudentNotifications": StudentNotifications,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "LandingPage",
    Pages: PAGES,
    Layout: __Layout,
};