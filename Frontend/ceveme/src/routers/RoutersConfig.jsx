import React from 'react';

const RoutersConfig = {
  home: {
    path: '/',
    component: React.lazy(() => import('../features/home/pages/Home')),
    requiredRole: null,
  },
};

export default RoutersConfig;
