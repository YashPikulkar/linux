<template>
  <q-card class="company-card column items-center q-pa-md">
    <q-img
      :src="company.logo"
      :alt="company.name"
      class="company-logo"
      contain
    />

    <q-card-section class="text-center q-pa-none q-mt-md">
      <div class="text-h6">{{ company.name }}</div>

      <!-- Rating & reviews -->
      <div
        class="q-mt-xs text-caption text-grey-7 row items-center justify-center"
      >
        <q-icon name="star" color="orange" size="16px" class="q-mr-xs" />
        <span class="q-mr-sm">{{ company.rating }}</span>
        <span>{{ company.reviews }}</span>
      </div>

      <!-- Description -->
      <div class="text-caption text-grey-8 q-mt-sm">
        {{ company.description }}
      </div>
    </q-card-section>

    <!-- View Jobs Button -->
    <div class="q-mt-md">
      <q-btn label="View jobs" color="primary" flat class="view-jobs-btn" />
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  company: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.company-card {
  background: white;
  border-radius: 16px; /* rounded corners */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  text-align: center;
  transition: transform 0.3s ease;
}

.company-card:hover {
  transform: scale(1.05);
}

.company-logo {
  height: 100px;
  max-width: 100px;
  border-radius: 8px;
  background: #fff;
}

.view-jobs-btn {
  background-color: #edf3ff;
  color: #1a73e8;
  font-weight: 500;
  border-radius: 8px;
  text-transform: none;
}
</style>
