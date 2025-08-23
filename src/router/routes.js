// routes.js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'login', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/RegisterPage.vue') },
    ],
  },

  // 👇 Applicant Dashboard
  {
    path: '/applicant',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { role: 'applicant' },
    children: [
      {
        path: '',
        name: 'ApplicantHome',
        component: () => import('pages/ApplicantDashboard/ApplicantHome.vue'),
      },
      {
        path: 'application-status',
        name: 'ApplicationStatus',
        component: () => import('pages/ApplicantDashboard/ApplicationStatus.vue'),
      },
      {
        path: 'resumes',
        name: 'Resumes',
        component: () => import('pages/ApplicantDashboard/ApplicantResume.vue'),
      },
      {
        path: 'edit-applicant',
        name: 'EditApplicant',
        component: () => import('pages/ApplicantDashboard/EditProfile.vue'),
      },
    ],
  },

  // 👇 Recruiter Dashboard
  {
    path: '/recruiter',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { role: 'recruiter' },
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

  // 👇 Guest/Public Jobs
  {
    path: '/all-jobs',
    component: () => import('layouts/LayoutResolver.vue'),
    children: [
      { path: '', name: 'Jobs', component: () => import('pages/JobDashboard.vue') },
      {
        path: 'company/:cid',
        name: 'company-details',
        component: () => import('components/Jobs/CompanyDetails.vue'),
        props: true,
      },
    ],
  },

  // 👇 Special Feature
  {
    path: '/special-feature',
    component: () => import('layouts/LayoutResolver.vue'),
    children: [
      {
        path: '',
        name: 'SpecialFeature',
        component: () => import('components/SpecialFeature/SpecialFeature.vue'),
      },
    ],
  },

  // Fallback 404
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
]

export default routes
