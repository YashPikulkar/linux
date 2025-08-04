<template>
  <div>
    <div class="text-h6 q-mb-md">Job Listings</div>

    <div class="q-gutter-md">
      <JobCard v-for="job in jobsStore.jobs" :key="job.id" :job="job" />
    </div>
  </div>
</template>

<script setup>
import { useJobsStore } from "src/components/Jobs/Store/jobStore";
import JobCard from "./ListJobs/JobCard.vue";

const jobsStore = useJobsStore();
</script>
