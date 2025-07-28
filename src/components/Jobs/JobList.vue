<template>
  <div class="q-gutter-md">
    <JobCard v-for="job in jobsStore.jobs" :key="job.id" :job="job" />
  </div>
</template>

<script setup>
import { useJobsStore } from "src/stores/jobStore";
import JobCard from "./JobCard.vue";

const jobsStore = useJobsStore();
</script>
