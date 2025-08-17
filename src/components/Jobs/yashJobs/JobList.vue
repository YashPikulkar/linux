<template>
  <div class="job-list-wrapper">
    <div v-if="jobsStore.loading">Loading jobs...</div>
    <div v-else-if="jobsStore.error">Error loading jobs.</div>
    <div v-else>
      <div v-if="filteredJobs.length === 0">No jobs found.</div>
      <div v-else class="job-list">
        <JobCard v-for="job in filteredJobs" :key="job.jobid" :job="job" />
      </div>
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
    filterType: {
      type: String,
      default: 'browse', // 'browse' | 'saved' | 'hidden'
    },
    similarJobs: {
      type: Boolean,
      default: false,
    },
    referenceJobId: {
      type: String,
      required: false,
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
    filteredJobs() {
      if (this.filterType === 'saved') return this.jobsStore.savedJobs
      if (this.filterType === 'hidden') return this.jobsStore.hiddenJobs
      // Browse: exclude hidden jobs
      return this.jobsStore.jobs.filter(
        (job) => !this.jobsStore.hiddenJobs.some((h) => h.jobid === job.jobid),
      )
    },
  },

  created() {
    this.debouncedFetchJobs = debounce(() => {
      if (!this.similarJobs) {
        this.jobsStore.fetchJobs()
      } else if (this.referenceJobId) {
        this.jobsStore.fetchJobs({
          similarJobs: true,
          referenceJobId: this.referenceJobId,
        })
      }
    }, 300)

    this.debouncedFetchJobs()
  },

  watch: {
    'filterStore.filtersForApi': {
      handler() {
        if (!this.similarJobs && this.debouncedFetchJobs) {
          this.debouncedFetchJobs()
        }
      },
      deep: true,
    },
  },
}
</script>
