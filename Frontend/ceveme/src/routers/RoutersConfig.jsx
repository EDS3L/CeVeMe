import React from 'react';

const RoutersConfig = {
  home: {
    path: '/',
    component: React.lazy(() => import('../features/home/pages/Home')),
    requiredRole: null,
  },
  login: {
    path: '/auth/login',
    component: React.lazy(() => import('../features/auth/pages/Login')),
    requiredRole: null,
  },
  register: {
    path: '/auth/register',
    component: React.lazy(() => import('../features/auth/pages/Register')),
    requiredRole: null,
  },
  main: {
    path: '/offers',
    component: React.lazy(() => import('../features/joboffers/pages/JobsPage')),
    requiredRole: null,
  },
  cv: {
    path: '/cv',
    component: React.lazy(() => import('../features/cv/pages/CvEditorPage')),
    requiredRole: null,
  },
  user: {
    path: '/user',
    component: React.lazy(() =>
      import('../features/user/pages/UserProfilePage')
    ),
    requiredRole: null,
  },
};

export default RoutersConfig;
