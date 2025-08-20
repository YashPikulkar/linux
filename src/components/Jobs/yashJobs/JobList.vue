<template>
  <div class="job-list-wrapper">
    <div v-if="jobsStore.loading">Loading jobs...</div>
    <div v-else-if="jobsStore.error">Error loading jobs.</div>
    <div v-else-if="jobsStore.jobs.length === 0">No jobs found.</div>
    <div v-else class="job-list">
      <JobCard v-for="job in jobsStore.jobs" :key="job.id" :job="job" />
    </div>
  </div>
</template>

<script>
import JobCard from './JobCard.vue'
import { useJobsStore } from 'src/stores/job-store'
import { useFilterStore } from 'src/stores/filter-store'
import debounce from 'lodash.debounce'

export default {
  name: 'JobList',
  components: { JobCard },

  props: {
    similarJobs: {
      type: Boolean,
      default: false, // false = normal jobs, true = similar jobs
    },
    referenceJobId: {
      type: String,
      required: false, // needed if similarJobs = true
    },
  },

  data() {
    return {
      debouncedFetchJobs: null,
    }
  },

  computed: {
    jobsStore() {
      return useJobsStore()
    },
    filterStore() {
      return useFilterStore()
    },
  },

  created() {
    this.debouncedFetchJobs = debounce(() => {
      this.jobsStore.fetchJobs({
        similarJobs: this.similarJobs,
        referenceJobId: this.referenceJobId,
      })
    }, 300)

    // Fetch immediately when component is created
    this.debouncedFetchJobs()
  },

  watch: {
    'filterStore.filtersForApi': {
      handler() {
        // Only watch filters if we are NOT showing similar jobs
        if (!this.similarJobs && this.debouncedFetchJobs) {
          this.debouncedFetchJobs()
        }
      },
      deep: true,
      immediate: false,
    },
  },
}
</script>
