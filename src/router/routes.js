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
        component: () => import("src/components/Register/RegisterForm.vue"),
      },
      {
        path: "login",
        component: () => import("src/pages/LoginPage.vue"),
      },
      {
        path: "applicant",
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
        path: "recruiter",
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

           {
            path: "applications/:jobId",
            name: "job-applications",
            component: () =>
              import("src/components/RecruiterDashboard/Features/JobApplicants.vue"),
            props: true
          },
        ],
      },
    ],
  },
];