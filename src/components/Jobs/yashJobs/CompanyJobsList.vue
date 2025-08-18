<template>
  <div class="company-jobs-wrapper">
    <div v-if="jobsStore.loading">Loading jobs...</div>
    <div v-else-if="jobsStore.error">Error loading jobs.</div>
    <div v-else>
      <div v-if="jobsStore.jobs.length === 0">No jobs found.</div>
      <div v-else class="job-list">
        <CompanyJobsCard
          v-for="job in jobsStore.jobs"
          :key="job.jobid"
          :job="job"
          @view-job="handleViewJob"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CompanyJobsCard from './CompanyJobsCard.vue'
import { useJobsStore } from 'src/stores/job-store'

export default {
  name: 'CompanyJobsList',
  components: { CompanyJobsCard },
  computed: {
    jobsStore() {
      return useJobsStore()
    },
  },
  methods: {
    handleViewJob(jobId) {
      console.log('View Job:', jobId)
      // Navigate or open dialog
    },
  },
}
</script>
