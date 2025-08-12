<template>
  <q-layout view="lHh Lpr lFf" class="dashboard-layout">

      <q-card class="main-card blur-card">
        <RecruiterNavbar
          :tab="tab"
          @update:tab="tab = $event"
        />

        <Stats v-if="tab === 'Home'" />
        <PostJob v-else-if="tab === 'Post a Job'" />
        <Combine v-else-if="tab === 'Manage Jobs'" />
        <Profile v-else-if="tab === 'Profile'" />
      </q-card>
  </q-layout>
</template>

<script>
import RecruiterNavbar from "src/components/RecruiterDashboard/TopSection/RecuNavbar.vue";
import Stats from "src/components/RecruiterDashboard/Features/stats.vue";
import PostJob from "src/components/RecruiterDashboard/Features/postjob.vue";
import Combine from "src/components/RecruiterDashboard/Features/jobsposted.vue";
import Profile from "src/components/RecruiterDashboard/Features/companyprofile.vue";

export default {
  name: "RecruiterDashboard",
  components: {
    RecruiterNavbar,
    Stats,
    PostJob,
    Combine,
    Profile,
  },
  data() {
    return {
      tab: "Home",
    };
  },
};
</script>


  <style scoped>
  .dashboard-layout {

  backdrop-filter: blur(10px);
  max-height: auto;
  display: flex;
  flex-direction: column;
}

.dashboard-page {
  padding: 64px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow-y: auto;
  box-sizing: border-box;
}

.main-card {
  width: 100%;
  max-width: 1200px; /* you can keep a reasonable max width */
  background: transparent;
  padding: 16px;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 0 40px rgba(0, 153, 255, 0.1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /* Removed the height restrictions */
}

.blur-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

@media (max-width: 900px) {
  .main-card {
    height: auto;
    max-height: none;
    overflow: visible;

    overflow-y: auto;
  }

  .dashboard-page {
    padding: 64px 8px 8px;
  }
}


  </style>
