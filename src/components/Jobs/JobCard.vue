<template>
  <q-card class="q-pa-sm my-card">
    <!-- Job Title and Company -->
    <q-card-section class="q-pt-none q-pb-xs">
      <div class="text-subtitle1">{{ job.title }}</div>
      <div class="text-caption text-primary">{{ job.company }}</div>
    </q-card-section>

    <!-- Tags: Location, Type, Salary -->
    <q-card-section class="q-gutter-sm q-pa-none q-pb-xs">
      <q-chip dense color="blue-1" text-color="blue-10" icon="location_on">
        {{ job.location }}
      </q-chip>

      <q-chip dense color="green-1" text-color="green-10" icon="work">
        {{ job.jobType }}
      </q-chip>

      <q-chip dense color="grey-1" text-color="grey-8" icon="attach_money">
        {{ job.salary }}
      </q-chip>
    </q-card-section>

    <!-- Description -->
    <q-card-section class="q-pt-xs q-pb-xs">
      <div class="text-caption text-grey-7 ellipsis-2-lines">
        {{ job.description }}
      </div>
    </q-card-section>

    <!-- Skills -->
    <q-card-section class="q-gutter-xs q-pa-none q-pt-xs q-pb-xs">
      <q-chip
        dense
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

    <q-card-actions class="q-py-xs justify-between">
      <div class="text-caption text-grey">
        Posted {{ daysAgo(job.postedAt) }} days ago
      </div>
      <q-btn dense flat label="Apply" color="primary" />
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
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: 0.2s;
  font-size: 13px;
}
.my-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.ellipsis-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

