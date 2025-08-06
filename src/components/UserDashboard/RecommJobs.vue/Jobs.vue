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

    <div v-if="jobsStore.loading" class="text-center q-mt-lg">
      <q-spinner size="md" color="primary" />
    </div>

    <div v-else-if="jobsStore.error" class="text-negative">
      {{ jobsStore.error }}
    </div>

    <div v-else-if="jobsStore.jobs.length === 0" class="text-grey">
      No recommended jobs found.
    </div>

    <div class="q-gutter-md">
      <JobCard v-for="job in jobsStore.jobs" :key="job.jobid" :job="job" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJobsStore } from "src/components/Jobs/Store/jobStore";
import JobCard from "src/components/Jobs/ListJobs/JobCard.vue";

const jobsStore = useJobsStore();
const router = useRouter();

onMounted(() => {
  jobsStore.fetchRecommendedJobs();
});

const goToJobs = () => {
  router.push("/jobs");
};
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
