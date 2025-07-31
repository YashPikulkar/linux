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
            path: "profile", // 👈 renamed to lowercase
            component: () =>
              import("src/components/RecruiterDashboard/Profile.vue"),
          },
          {
            path: "feature2",
            component: () =>
              import("src/components/RecruiterDashboard/Feature1/Feature1.vue")
          },
        ],
      },
      {
        path: "login",
        component: () => import("src/pages/login.vue"),
      },
    ],
  },
];
