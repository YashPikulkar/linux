// src/router/routes.js

import jobsRoutes from "./jobsRoutes";

export default [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/HomePage.vue"),
      },
      ...jobsRoutes, // 👈 Inject job routes here

      {
        path: "register",
        component: () => import("src/pages/RegisterForm.vue"),
      },
      {
        path: "login",
        component: () => import("src/pages/login.vue"),
      },
      {
        path: "userdashboard",
        component: () => import("pages/UserDashboard.vue"),
        children: [
          {
            path: "",
            component: () =>
              import("src/components/UserDashboard/RecommJobs.vue/Jobs.vue"),
          },
          {
            path: "profile",
            component: () =>
              import("src/components/UserDashboard/Profile/Profile.vue"),
          },
        ],
      },
      {
        path: "recruiterdashboard",
        component: () => import("src/pages/RecruiterDashboard.vue"),
        children: [
          {
            path: "",
            component: () =>
              import("src/components/RecruiterDashboard/Profile.vue"),
          },
          {
            path: "profile",
            component: () =>
              import("src/components/RecruiterDashboard/Profile.vue"),
          },
          {
            path: "feature2",
            component: () =>
              import("src/components/RecruiterDashboard/Feature1/Feature1.vue"),
          },
        ],
      },
    ],
  },
];
