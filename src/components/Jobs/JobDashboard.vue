<template>
  <div class="q-mx-auto" style="padding-top: 10px; width: 80vw">
    <JobHeader />
    <!-- Add padding/margin below SavedSearchSection -->
    <div class="q-mb-md">
      <SavedSearchSection />
    </div>

    <JobFilterCard v-model="showFilter" />
    <JobList />

    <!-- This will render JobDialog when /jobs/:id is active -->
    <router-view />

    <!-- Add the ApplicationDialog here -->
    <JobApplication />

    <!-- Add the TwoCardDialog here for job detail dialog -->
    <JobDetails />
    <CompanyDetails />
  </div>
</template>

<script>
import JobFilterCard from './yashJobs/JobFilterCard.vue'
import JobHeader from './yashJobs/JobHeader.vue'
import JobList from './yashJobs/JobList.vue'
import SavedSearchSection from './yashJobs/SavedSearchSection.vue'
import JobApplication from './yashJobs/JobApplication.vue'
import JobDetails from './yashJobs/JobDetails.vue'
import CompanyDetails from './yashJobs/CompanyDetails.vue'
import { useJobsStore } from 'src/stores/job-store'

export default {
  name: 'JobDashboard',
  components: {
    JobFilterCard,
    JobList,
    SavedSearchSection,
    JobHeader,
    JobApplication,
    JobDetails,
    CompanyDetails,
  },
  data() {
    return {
      showFilter: false,
    }
  },
  onMounted() {
    const jobsStore = useJobsStore()
    jobsStore.jobs = []
  },
}
</script>
