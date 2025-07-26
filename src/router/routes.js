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
        component: () => import("src/pages/JobDashboard.vue"), // 👈 new route
      },

      {
        path: "register",
        component: () => import("src/pages/RegisterForm.vue"), // 👈 new route
      },
      {
        path: "/userdashboard",
        component: () => import("src/pages/UserDashboard.vue"),
      },
      {
        path: "/recruiterdashboard",
        component: () => import("src/pages/RecruiterDashboard.vue"),
      },
    ],
  },
];
