import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',

  routes: [
    // Public routes
    {
      path: '/',
      component: '@/pages/Login',
    },
    {
      path: '/register',
      component: '@/pages/Register',
    },
    {
      path: '/universities',
      component: '@/pages/Universities',
    },
    
    // Student routes
    {
      path: '/student',
      component: '@/pages/Student',
    },
    {
      path: '/student/applications',
      component: '@/pages/Student/MyApplications',
    },
    {
      path: '/student/application-form',
      component: '@/pages/Student/ApplicationForm',
    },
    
    // Admin routes
    {
      path: '/admin',
      component: '@/pages/Admin',
      access: 'admin'
    },
    {
      path: '/admin/applications',
      component: '@/pages/Admin/Applications',
      access: 'admin'
    },
    {
      path: '/admin/universities',
      component: '@/pages/Admin/University',
      access: 'admin'
    },
    {
      path: '/admin/majors',
      component: '@/pages/Admin/Major',
      access: 'admin'
    },
    {
      path: '/admin/statistics',
      component: '@/pages/Admin/Statistics',
      access: 'admin'
    }
  ],
});