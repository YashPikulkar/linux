<template>
  <div class="job-list-wrapper">
    <!-- Loading -->
    <div v-if="jobsStore.loading && jobSource.length === 0" class="skeleton-container">
      <JobListSkeleton :count="4" />
    </div>

    <!-- Error -->
    <div v-else-if="jobsStore.error" class="status-msg">Error loading jobs.</div>

    <!-- No Jobs / No Recommended Jobs -->
    <div v-else-if="jobSource.length === 0" class="no-jobs-container">
      <component
        :is="listType === 'recommended' ? 'NoRecommendedJobsFound' : 'NoJobsFound'"
        @add-skills="handleAddSkills"
      />
    </div>

    <!-- Jobs List -->
    <div
      v-else
      class="job-list scrollable"
      :class="{ 'grid-layout': gridMode, 'list-layout': !gridMode }"
    >
      <!-- Grid Mode: Use JobCardGrid -->
      <template v-if="gridMode">
        <JobCardGrid v-for="job in jobSource" :key="job.jobid" :job="job" />
      </template>

      <!-- List Mode: Use JobCard -->
      <template v-else>
        <JobCard v-for="job in jobSource" :key="job.jobid" :job="job" />
      </template>
    </div>

    <!-- Load More (only for default jobs) -->
    <div
      v-if="listType === 'default' && jobsStore.lastCount === jobsStore.limit"
      class="load-more-container"
    >
      <q-btn
        v-if="jobsStore.jobs.length < jobsStore.totalCount"
        outline
        color="primary"
        class="text-weight-medium"
        icon-right="expand_more"
        label="Load More"
        @click="loadMore"
      />
    </div>
  </div>
</template>

<script>
import JobCard from './JobCard.vue'
import JobCardGrid from './JobCardGrid.vue'
import NoJobsFound from './NoJobsFound.vue'
import NoRecommendedJobsFound from './NoRecommendedJobsFound.vue'
import JobListSkeleton from './JobListSkeleton.vue'
import { useJobsStore } from 'src/stores/job-store'
import { useFilterStore } from 'src/stores/filter-store'
import debounce from 'lodash.debounce'

export default {
  name: 'JobList',
  components: {
    JobCard,
    JobCardGrid,
    NoJobsFound,
    NoRecommendedJobsFound,
    JobListSkeleton,
  },

  props: {
    listType: {
      type: String,
      default: 'default', // "default" | "recommended" | "company"
    },
    companyId: {
      type: String,
      required: false,
    },
    gridMode: {
      type: Boolean,
      default: false, // 👈 controls grid vs list
    },
  },

  data() {
    return { debouncedFetch: null }
  },

  computed: {
    jobsStore() {
      return useJobsStore()
    },
    filterStore() {
      return useFilterStore()
    },
    jobSource() {
      switch (this.listType) {
        case 'recommended':
          return this.jobsStore.recommendedJobs || []
        case 'company':
          return this.jobsStore.companyJobs || []
        default:
          return this.jobsStore.jobs || []
      }
    },
  },

  created() {
    this.debouncedFetch = debounce(() => {
      this.fetchJobs()
    }, 300)

    this.debouncedFetch()
  },

  methods: {
    fetchJobs() {
      if (this.listType === 'recommended') {
        this.jobsStore.fetchRecommendedJobs()
      } else if (this.listType === 'company' && this.companyId) {
        this.jobsStore.fetchCompanyJobs(this.companyId)
      } else {
        this.jobsStore.fetchJobs()
      }
    },

    loadMore() {
      if (this.listType === 'default') {
        this.jobsStore.fetchJobs({
          append: true,
          page: this.jobsStore.page + 1,
          limit: this.jobsStore.limit,
        })
      }
    },

    handleAddSkills() {
      console.log('[JobList] User clicked "Add Skills"')
      // Navigate to profile skills page or open modal
      this.$router.push({ name: 'ProfileSkills' })
    },
  },

  watch: {
    'filterStore.filtersForApi': {
      handler() {
        if (this.listType === 'default' && this.debouncedFetch) {
          this.debouncedFetch()
        }
      },
      deep: true,
    },
    companyId(newId) {
      if (this.listType === 'company' && newId) {
        this.fetchJobs()
      }
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
  padding-right: 8px;
}

.list-layout {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.grid-layout > * {
  transition: border 0.2s ease-in-out;
  border: 2px solid transparent;
  border-radius: 8px; /* adjust as needed */
}

.grid-layout > *:hover {
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

@media (max-width: 1200px) {
  .grid-layout {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }
}

@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .grid-layout {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .scrollable {
    padding-right: 4px;
  }
}
</style>
