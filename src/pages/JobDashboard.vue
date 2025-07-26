<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Job Dashboard</div>

    <!-- Job list section -->
    <div class="row q-col-gutter-md q-row-gutter-md">
      <div
        class="col-xs-12 col-sm-6 col-md-4"
        v-for="job in jobsStore.jobs"
        :key="job.id"
      >
        <JobCard :job="job" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useJobsStore } from "src/stores/jobStore";
import JobCard from "src/components/Jobs/JobCard.vue";

const jobsStore = useJobsStore();
</script>
