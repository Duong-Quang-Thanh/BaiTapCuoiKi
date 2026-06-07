import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',

  routes: [
    {
  path:
    '/admin/majors',
  component:
    '@/pages/Admin/Major',
  },
    {
  path:
    '/student/applications',
  component:
    '@/pages/Student/MyApplications',
    },
    {
  path: '/admin/universities',
  component:
    '@/pages/Admin/University',
    },
    {
      path: '/',
      component: '@/pages/Login',
    },
    {
      path: '/register',
      component: '@/pages/Register',
    },
    {
      path: '/student',
      component: '@/pages/Student',
    },
    {
      path: '/admin',
      component: '@/pages/Admin',
    },
    

    {
  path:
    '/student/applications',
  component:
    '@/pages/Student/MyApplications',
    }
    
  ],
});