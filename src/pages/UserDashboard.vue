<template>
  <q-layout view="lHh Lpr lFf" class="dashboard-layout">
    <q-page class="flex flex-center" style="padding-top: 64px;">

      <q-card class="main-card blur-card">
      
        <TopSection v-model:tab="tab" />

        <Content v-if="tab === 'Details'" />
        <ApplicationStatus v-else-if="tab === 'Application Status'" />
        <Combine v-else-if="tab === 'Resumes & Links'" />
     
      </q-card>
    </q-page>
  </q-layout>
</template>

<script>
import TopSection from "src/components/UserDashboard/TopSection/TopSection.vue";
import Content from "src/components/UserDashboard/Details/Content.vue";
import Combine from "src/components/UserDashboard/Resume/Combine.vue";
import ApplicationStatus from "src/components/UserDashboard/ApplicationStatus/ApplicationStatus.vue";


export default {
  name: "UserDashboard",
  components: {
    TopSection,
    Content,
    ApplicationStatus,
    Combine,
  },
  data() {
    return {
      tab: "Details", 
    };
  },
};
</script>
<style scoped>
.dashboard-layout {
  background: radial-gradient(circle at 30% 30%, rgba(180, 255, 230, 0.4), transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(100, 255, 230, 0.3), transparent 60%),
              linear-gradient(135deg, #dfffe5, #d3f7f7);
  backdrop-filter: blur(10px);
  min-height: 100vh;
}

.main-card {
  width: 90vw;
  height: 90vh;
  background: transparent;
  padding: 16px;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 0 40px rgba(0, 153, 255, 0.1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

.blur-card {
  background: rgba(255, 255, 255, 0.05); /* Very subtle translucent white */
  backdrop-filter: blur(10px);          /* Blur the background behind it */
  -webkit-backdrop-filter: blur(10px);  /* For Safari */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Optional light border */
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); /* Optional depth */
}




@media (max-width: 900px) {
  .main-card {
    height: auto;
    max-height: none;
    overflow: visible;
  }

  .q-page {
    overflow-y: auto;
  }
}


</style>
