// src/router/routes/jobRoutes.js

export default [
  {
    path: "/jobs",
    name: "JobsDashboard",
    component: () => import("src/pages/Jobs/JobDashboard.vue"),
  },
  {
    path: "/jobs/:id",
    name: "JobApply",
    component: () => import("src/pages/Jobs/JobApply.vue"),
    props: true,
  },
];
