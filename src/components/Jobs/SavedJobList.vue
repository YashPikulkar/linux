<template>
  <div class="job-list-wrapper">
    <div v-if="jobsStore.loading">Loading saved jobs...</div>
    <div v-else-if="jobsStore.error">Error: {{ jobsStore.error }}</div>
    <div v-else>
      <div v-if="jobsStore.getSavedJobs.length === 0">No saved jobs yet.</div>
      <div v-else class="job-list">
        <JobCard v-for="job in jobsStore.getSavedJobs" :key="job.jobid" :job="job" />
      </div>
    </div>
  </div>
</template>

<script>
import JobCard from './JobCard.vue'
import { useJobsStore } from 'src/stores/job-store'

export default {
  name: 'SavedJobList',
  components: { JobCard },

  setup() {
    const jobsStore = useJobsStore()

    // Optionally ensure jobs are fetched before showing saved list
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
</style>
