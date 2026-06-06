import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',

  routes: [
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
  ],
});