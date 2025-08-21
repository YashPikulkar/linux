<template>
  <div class="q-mx-auto job-dashboard-container">
    <div class="job-dashboard-wrapper">
      <h4 class="text-h4 text-weight-bold">Search for jobs</h4>

      <!-- Wrapper prevents jumps -->
      <div class="jobs-page-container">
        <keep-alive>
          <JobsPage v-model:activeTab="activeTab" />
        </keep-alive>
      </div>
    </div>

    <!-- JobFilterCard for filters -->
    <JobFilterCard v-model="showFilter" />

    <!-- Dialogs -->
    <JobApplication />
    <JobDetails />
  </div>
</template>

<script>
import JobFilterCard from 'src/components/Jobs/JobFilterCard.vue'
import JobsPage from 'src/components/Jobs/JobsPage.vue'
import JobApplication from 'src/components/Jobs/JobApplication.vue'
import JobDetails from 'src/components/Jobs/JobDetails.vue'

export default {
  name: 'JobDashboard',
  components: {
    JobsPage,
    JobFilterCard,
    JobApplication,
    JobDetails,
  },
  data() {
    return {
      showFilter: false,
      activeTab: 'browse', // controls JobsPage tabs
    }
  },
}
</script>

<style scoped>
.job-dashboard-container {
  padding-top: 10px;
  width: 80vw;
}

.job-dashboard-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px; /* stable spacing */
}

/* Prevents page jump when tabs change */
.jobs-page-container {
  min-height: 70vh; /* adjust depending on design */
  display: flex;
  flex-direction: column;
}
</style>
