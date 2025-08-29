<template>
  <div class="job-list-wrapper">
    <div v-if="jobsStore.loading">Loading saved jobs...</div>
    <div v-else-if="jobsStore.error">Error: {{ jobsStore.error }}</div>
    <div v-else>
      <!-- ✅ Replace text with NoJobsSaved -->
      <div v-if="jobsStore.getSavedJobs.length === 0" class="no-jobs-container">
        <NoJobsSaved />
      </div>
      <div v-else class="job-list">
        <JobCard v-for="job in jobsStore.getSavedJobs" :key="job.jobid" :job="job" />
      </div>
    </div>
  </div>
</template>

<script>
import JobCard from './JobCard.vue'
import NoJobsSaved from './NoJobsSaved.vue'
import { useJobsStore } from 'src/stores/job-store'

export default {
  name: 'SavedJobList',
  components: { JobCard, NoJobsSaved },

  setup() {
    const jobsStore = useJobsStore()

    // Optionally fetch jobs before showing saved list
    if (jobsStore.jobs.length === 0) {
      jobsStore.fetchJobs()
    }

    return { jobsStore }
  },
}
</script>

<style scoped>
.job-list-wrapper {
  padding: 10px;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ✅ Center the NoJobsSaved component */
.no-jobs-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>
