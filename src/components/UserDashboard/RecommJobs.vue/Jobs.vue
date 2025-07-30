<template>
    <div class="q-pa-md">
      <div class="row items-center justify-between q-mb-md">
        <h2 class="text-h4 text-primary">Recommended Jobs</h2>
        <q-btn
          label="View All"
          flat
          dense
          no-caps
          class="text-primary"
          @click="goToJobs"
        />
      </div>
  
      <div class="q-gutter-md">
        <JobCard v-for="job in jobsStore.jobs" :key="job.id" :job="job" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useJobsStore } from "src/stores/jobStore";
  import JobCard from 'src/components/Jobs/JobCard.vue';
  
  const jobsStore = useJobsStore();
  const router = useRouter();
  
  const goToJobs = () => {
    router.push('/jobs');
  };
  </script>
  
  <style scoped>
  h2 {
    font-weight: bold;
  }
  </style>
  