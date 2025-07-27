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
        component: () => import("pages/JobDashboard.vue"),
      },
      {
        path: "register",
        component: () => import("pages/RegisterForm.vue"),
      },
      {
        path: "userdashboard",
        component: () => import("pages/UserDashboard.vue"),
      },
      {
        path: "recruiterdashboard",
        component: () => import("pages/RecruiterDashboard.vue"),
      },
      {
        path: "login",
        component: () => import("pages/login.vue"),
      },

      // ✅ Separate Candidate Settings Page
      /*{
        path: "settings/candidate",
        component: () => import("pages/settings/candidate/Settings.vue"),
      },*/

      // ✅ Separate Recruiter Settings Page
      {
        path: "recruiter/settings",
        component: () => import("src/components/RecruiterDashboard/settings/settings.vue"),
      },
    ],
  },
];
