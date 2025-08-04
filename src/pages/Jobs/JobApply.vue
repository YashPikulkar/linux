<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-lg">
      <div v-if="job">
        <div class="text-h5 text-bold q-mb-sm">{{ job.title }}</div>
        <div class="text-subtitle1 q-mb-md">{{ job.company.name }}</div>

        <div class="text-caption text-grey-7 q-mb-md">
          {{ job.location }} • ₹{{ job.salary }}L • {{ job.jobType }}
        </div>

        <q-separator spaced />

        <div class="q-mt-md">
          <div class="text-body1 q-mb-sm text-bold">Description</div>
          <div class="description-text">{{ job.description }}</div>
        </div>

        <div class="q-mt-md">
          <div class="text-body1 q-mb-sm text-bold">Required Skills</div>
          <q-chip
            v-for="(skill, index) in job.skills"
            :key="index"
            color="blue-1"
            text-color="primary"
            class="q-mr-sm q-mb-sm"
            size="sm"
          >
            {{ skill }}
          </q-chip>
        </div>

        <q-separator spaced />

        <div class="q-mt-lg">
          <q-btn label="Apply Now" color="primary" class="full-width" />
        </div>
      </div>
      <div v-else class="text-negative">Job not found.</div>
    </q-card>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { useJobsStore } from "src/stores/appStore";

export default {
  name: "JobApply",

  data() {
    return {
      job: null,
    };
  },

  mounted() {
    const route = useRoute();
    const jobsStore = useJobsStore();

    const jobId = Number(route.params.id);
    this.job = jobsStore.jobs.find((j) => j.id === jobId);
  },
};
</script>

<style scoped>
.description-text {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
}
</style>
