<template>
  <div class="company-jobs-wrapper">
    <div v-if="jobsStore.loading">Loading jobs...</div>
    <div v-else-if="jobsStore.error">Error loading jobs.</div>
    <div v-else>
      <div v-if="jobsStore.companyJobs.length === 0">No jobs found.</div>
      <div v-else class="job-list">
        <CompanyJobsCard v-for="job in jobsStore.companyJobs" :key="job.jobid" :job="job" />
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
    selectedCompanyId() {
      // ✅ Use cid instead of id
      return this.jobsStore.selectedCompany?.cid || null
    },
  },

  watch: {
    selectedCompanyId: {
      immediate: true,
      handler(newId, oldId) {
        console.log('Watcher triggered - old:', oldId, 'new:', newId)
        console.log('📦 selectedCompany object:', this.jobsStore.selectedCompany) // 👈 log the full object

        if (newId === null) {
          console.warn('⚠️ No company selected (newId is null)')
          return
        }

        if (typeof newId === 'undefined') {
          console.warn('⚠️ selectedCompanyId is undefined')
          return
        }

        console.log('✅ Fetching jobs for companyId (cid):', newId)
        this.jobsStore.fetchCompanyJobs(newId)
      },
    },
  },

  mounted() {
    console.log('🔍 Mounted — selectedCompany is:', this.jobsStore.selectedCompany)
  },
}
</script>
