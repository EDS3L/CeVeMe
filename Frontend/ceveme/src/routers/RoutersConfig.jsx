import React from "react";

const RoutersConfig = {
  home: {
    path: "/",
    component: React.lazy(() => import("../features/home/pages/Home")),
    requiredRole: null,
  },
  login: {
    path: "/auth/login",
    component: React.lazy(() => import("../features/auth/pages/Login")),
    requiredRole: null,
  },
  register: {
    path: "/auth/register",
    component: React.lazy(() => import("../features/auth/pages/Register")),
    requiredRole: null,
  },
  main: {
    path: "/offers",
    component: React.lazy(() => import("../features/joboffers/pages/JobsPage")),
    requiredRole: null,
  },
  cv: {
    path: "/cv",
    component: React.lazy(
      () => import("../features/cv/generativeCv/pages/CvEditorPage"),
    ),
    requiredRole: null,
  },
  user: {
    path: "/user",
    component: React.lazy(
      () => import("../features/user/pages/UserProfilePage"),
    ),
    requiredRole: null,
  },
  settings: {
    path: "/settings",
    component: React.lazy(
      () => import("../features/settings/pages/SettingsPage"),
    ),
    requiredRole: null,
  },
  histories: {
    path: "/history",
    component: React.lazy(
      () =>
        import("../features/applicationHistories/pages/ApplicationHistoriesPage"),
    ),
    requiredRole: null,
  },
  cv2: {
    path: "/cv2",
    component: React.lazy(() => import("../features/cv/canvasCv/CvPage")),
    requiredRole: null,
  },
  active: {
    path: "/auth/active",
    component: React.lazy(
      () => import("../features/auth/pages/ActivateAccount"),
    ),
    requiredRole: null,
  },
  forgotPassword: {
    path: "/auth/forgot-password",
    component: React.lazy(
      () => import("../features/auth/pages/ForgotPassword"),
    ),
    requiredRole: null,
  },
  resetPassword: {
    path: "/auth/reset-password/:token",
    component: React.lazy(() => import("../features/auth/pages/ResetPassword")),
    requiredRole: null,
  },
  reports: {
    path: "/reports",
    component: React.lazy(
      () => import("../features/reports/pages/ReportsPage"),
    ),
    requiredRole: null,
  },
  notFound: {
    path: "*",
    component: React.lazy(() => import("../features/home/pages/NotFound")),
    requiredRole: null,
  },
};

export default RoutersConfig;
