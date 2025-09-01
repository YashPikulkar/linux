<template>
  <BaseFilterCard
    title="Job Mode"
    :subtitle="store.jobMode || 'Select a job mode'"
    :active="isActive"
    @clear="clearFilter"
  >
    <q-option-group
      v-model="jobMode"
      :options="jobModes"
      type="radio"
      color="primary"
      inline
      dense
    />
  </BaseFilterCard>
</template>

<script>
import { useFilterStore } from 'src/stores/filter-store'
import BaseFilterCard from './BaseFilterCard.vue'

export default {
  name: 'JobModeFilter',
  components: { BaseFilterCard },

  computed: {
    store() {
      return useFilterStore()
    },

    jobMode: {
      get() {
        return this.store.jobMode
      },
      set(val) {
        this.store.jobMode = val
      },
    },

    jobModes() {
      return [
        { label: 'Onsite', value: 'Onsite' },
        { label: 'Remote', value: 'Remote' },
        { label: 'Hybrid', value: 'Hybrid' },
      ]
    },

    isActive() {
      return this.jobMode !== ''
    },
  },

  methods: {
    clearFilter() {
      this.jobMode = ''
    },
  },
}
</script>

<style scoped>
.equity-wrapper {
  border: 1px solid #dcdcdc;
  background-color: white;
  transition: all 0.2s ease;
  padding: 16px;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.equity-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  height: 140px;
}

.equity-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.equity-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.4;
}

.dash-separator {
  font-size: 20px;
  color: #6b7280;
  margin: 0 8px;
  user-select: none;
}

.clear-text {
  font-size: 13px;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}
</style>
