export default [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/HomePage.vue"),
      },
      {
        path: "jobs",
        component: () => import("src/pages/JobDashboard.vue"),
      },
      {
        path: "register",
        component: () => import("src/pages/RegisterForm.vue"),
      },
      {
        path: '/userdashboard',
        component: () => import('pages/UserDashboard.vue'),
        children: [
          {
            path: "",
            component: () => import("src/components/UserDashboard/RecommJobs.vue/Jobs.vue"),
          },
          {
            path: 'profile',
            component: () => import("src/components/UserDashboard/Profile/Profile.vue"),
          },
          // You can add more here later like:
          // { path: 'settings', component: () => import('pages/UserSettings.vue') }
        ],
      },
      {
        path: "recruiterdashboard",
        component: () => import("src/pages/RecruiterDashboard.vue"),
      },
      {
        path: "login",
        component: () => import("src/pages/login.vue"),
      },
    ],
  },
];
