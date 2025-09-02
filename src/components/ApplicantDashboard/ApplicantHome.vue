<template>
  <div class="q-pa-md col items-center justify-between">
    <TopSection />
    <RecruiterSkillStats />

    <div class="row items-center justify-between q-mb-md">
      <h2 class="text-h4 text-primary">Recommended Jobs</h2>
      <q-btn label="View All" flat dense no-caps class="text-primary" @click="goToJobs" />
    </div>

    <div v-if="jobsStore.loading" class="text-center q-mt-lg">
      <q-spinner size="md" color="primary" />
    </div>

    <div v-else-if="jobsStore.message !== ''" class="text-grey">
      {{ jobsStore.message }}
    </div>

    <div>
      <JobCard v-for="job in jobsStore.jobs" :key="job.jobid" :job="job" />
      <JobApplication />
      <JobDetails />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from 'src/stores/job-store'
import JobCard from '../Jobs/JobCard.vue'

import RecruiterSkillStats from '../RecruiterDashboard/RecruiterSkillStats.vue'

import JobDetails from '../Jobs/JobDetails.vue'
import JobApplication from '../Jobs/JobApplication.vue'

const jobsStore = useJobsStore()
const router = useRouter()

onMounted(() => {
  jobsStore.fetchRecommendedJobs
})

const goToJobs = () => {
  router.push('/all-jobs')
}
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
