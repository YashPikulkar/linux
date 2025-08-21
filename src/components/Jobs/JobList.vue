<template>
  <div class="job-list-wrapper">
    <!-- Loading -->
    <div v-if="jobsStore.loading && jobsStore.jobs.length === 0" class="skeleton-container">
      <JobListSkeleton :count="4" />
    </div>

    <!-- Error -->
    <div v-else-if="jobsStore.error" class="status-msg">Error loading jobs.</div>

    <!-- No Jobs -->
    <div v-else-if="jobsStore.jobs.length === 0" class="no-jobs-container">
      <NoJobsFound />
    </div>

    <!-- Jobs List -->
    <div v-else class="job-list scrollable">
      <JobCard v-for="job in jobsStore.jobs" :key="job.jobid" :job="job" />

      <!-- Load More button (only show if more jobs exist) -->
      <div v-if="jobsStore.lastCount === jobsStore.limit" class="load-more-container">
        <q-btn
          v-if="jobsStore.jobs.length < jobsStore.totalCount"
          label="Load More"
          @click="
            jobsStore.fetchJobs({ page: jobsStore.page + 1, limit: jobsStore.limit, append: true })
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import JobCard from './JobCard.vue'
import NoJobsFound from './NoJobsFound.vue'
import JobListSkeleton from './JobListSkeleton.vue'
import { useJobsStore } from 'src/stores/job-store'
import { useFilterStore } from 'src/stores/filter-store'
import debounce from 'lodash.debounce'

export default {
  name: 'JobList',
  components: { JobCard, NoJobsFound, JobListSkeleton },

  props: {
    similarJobs: { type: Boolean, default: false },
    referenceJobId: { type: String, required: false },
  },

  data() {
    return { debouncedFetchJobs: null }
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

  methods: {
    loadMore() {
      this.jobsStore.fetchJobs({
        append: true,
        page: this.jobsStore.page + 1,
        limit: this.jobsStore.limit,
      })
    },
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

<style scoped>
.job-list-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.status-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 16px;
  color: #666;
}

.skeleton-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.no-jobs-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.scrollable {
  flex: 1;
  overflow-y: auto;
}

/* Center the Load More button */
.load-more-container {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}
</style>
