const routes = [
  {
    path: '/',
    component: () => import('layouts/RootLayout.vue'),
    children: [
      { path: '', name: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'login', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/RegisterPage.vue') },
    ],
  },

  // 👇 Applicant Dashboard
  {
    path: '/applicant',
    component: () => import('src/layouts/ApplicantDashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'ApplicantHome',
        component: () => import('src/pages/ApplicantDashboard/ApplicantHome.vue'),
      },
      {
        path: 'application-status',
        name: 'ApplicationStatus',
        component: () => import('pages/ApplicantDashboard/ApplicationStatus.vue'),
      },
      {
        path: 'resumes',
        name: 'Resumes',
        component: () => import('src/pages/ApplicantDashboard/ApplicantResume.vue'),
      },
      {
        path: 'edit-applicant',
        name: 'EditApplicant',
        component: () => import('pages/ApplicantDashboard/EditProfile.vue'),
      },
      {
        path: 'special-feature',
        name: 'SpecialFeature',
        component: () => import('pages/ApplicantDashboard/SpecialFeature.vue'),
      },
    ],
  },

  // 👇 Recruiter Dashboard
  {
    path: '/recruiter',
    component: () => import('src/layouts/RecruiterDashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'RecruiterHome',
        component: () => import('pages/RecruiterDashboard/RecruiterHome.vue'),
      },
      {
        path: 'jobs-posted',
        name: 'JobsPosted',
        component: () => import('pages/RecruiterDashboard/JobsPosted.vue'),
      },
      {
        path: 'create-job',
        name: 'CreateJob',
        component: () => import('pages/RecruiterDashboard/CreateJob.vue'),
      },
      {
        path: 'edit',
        name: 'RecruiterEdit',
        component: () => import('pages/RecruiterDashboard/EditProfile.vue'),
      },
    ],
  },

  {
    path: '/all-jobs',
    component: () => import('layouts/RootLayout.vue'),
    children: [{ path: '', name: 'applicant', component: () => import('pages/JobDashboard.vue') }],
  },

  // Fallback for 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
