<template>
  <BaseFilterCard
    title="Experience Range"
    :subtitle="`Experience: ${experience.min} year${experience.min !== 1 ? 's' : ''} 
                to ${experience.max} year${experience.max !== 1 ? 's' : ''}`"
    :active="isActive"
    @clear="clearFilter"
  >
    <q-range v-model="experience" :min="0" :max="30" :step="1" label-always color="primary" />
  </BaseFilterCard>
</template>

<script>
import { useFilterStore } from 'src/stores/filter-store'
import BaseFilterCard from './BaseFilterCard.vue'

export default {
  name: 'ExperienceFilter',
  components: { BaseFilterCard },
  computed: {
    store() {
      return useFilterStore()
    },
    experience: {
      get() {
        return this.store.experienceRange || { min: 0, max: 30 }
      },
      set(val) {
        this.store.experienceRange = val
      },
    },
    isActive() {
      return this.experience.min > 0 || this.experience.max < 30
    },
  },
  methods: {
    clearFilter() {
      this.experience = { min: 0, max: 30 }
    },
  },
}
</script>

<style scoped>
.experience-wrapper {
  border: 1px solid #dcdcdc;
  padding: 16px;
  background-color: white;
  transition: all 0.2s ease;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.experience-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  height: 140px;
}

.experience-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.experience-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.4;
}

.clear-text {
  font-size: 13px;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}
</style>
