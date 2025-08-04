
<template>
  <div class="job-list-wrapper">
    <div v-if="jobsStore.loading">Loading jobs...</div>
    <div v-else-if="jobsStore.error">Error loading jobs.</div>
    <div v-else-if="jobsStore.jobs.length === 0">No jobs found.</div>
    <div v-else class="job-list">
      <JobCard
        v-for="job in jobsStore.jobs"
        :key="job.id"
        :job="job"
      />
    </div>
  </div>
</template>

<script>
import { watch, onMounted } from "vue";
import { useJobsStore } from "src/components/Jobs/Store/jobStore";
import { useFilterStore } from "src/components/Jobs/Store/FilterStore";
import JobCard from "./JobCard.vue";

export default {
  name: "JobList",

  components: {
    JobCard,
  },

  setup() {
    const jobsStore = useJobsStore();
    const filterStore = useFilterStore();

    const loadJobsWithFilters = () => {
      const filters = filterStore.getActiveFilters(); // ✅ using store action
      jobsStore.fetchJobs(filters); // ✅ filter-aware job fetching
    };

    onMounted(() => {
      loadJobsWithFilters(); // ✅ initial fetch with filters
    });

    watch(
      () => filterStore.computedTags,
      () => {
        loadJobsWithFilters(); // ✅ refetch on filter change
      },
      { deep: true }
    );

    return {
      jobsStore,
    };
  },
};
</script>
