<template>
  <q-card class="q-pa-md my-card">
    <!-- Job Title and Company -->
    <q-card-section class="q-pt-none">
      <div class="text-h6">{{ job.title }}</div>
      <div class="text-subtitle2 text-primary">{{ job.company }}</div>
    </q-card-section>

    <!-- Tags: Location, Type, Salary -->
    <q-card-section class="q-gutter-sm q-pa-none">
      <q-chip color="blue-2" text-color="primary" icon="location_on">
        {{ job.location }}
      </q-chip>

      <q-chip color="green-2" text-color="green-10" icon="work">
        {{ job.jobType }}
      </q-chip>

      <q-chip color="grey-2" text-color="grey-8" icon="attach_money">
        {{ job.salary }}
      </q-chip>
    </q-card-section>

    <!-- Description -->
    <q-card-section class="q-pt-sm">
      <div class="text-body2 text-grey-8 ellipsis-2-lines">
        {{ job.description }}
      </div>
    </q-card-section>

    <!-- Skills -->
    <q-card-section class="q-gutter-xs q-pa-none">
      <q-chip
        v-for="(skill, index) in job.skills"
        :key="index"
        color="indigo-1"
        text-color="indigo-9"
        icon="check_circle"
        size="sm"
      >
        {{ skill }}
      </q-chip>
    </q-card-section>

    <!-- Footer -->
    <q-separator />

    <q-card-actions class="q-pt-sm q-pb-none justify-between">
      <div class="text-caption text-grey">
        Posted {{ daysAgo(job.postedAt) }} days ago
      </div>
      <q-btn flat label="Apply" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
defineProps({
  job: {
    type: Object,
    required: true,
  },
});

const daysAgo = (postedDate) => {
  const posted = new Date(postedDate);
  const today = new Date();
  const diffTime = today - posted;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
</script>

<style scoped>
.my-card {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}
.my-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}
.ellipsis-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;

  -webkit-box-orient: vertical;
}
</style>
