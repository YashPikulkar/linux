<template>
  <BaseFilterCard
    title="Education"
    :subtitle="subtitleText"
    :is-active="isActive"
    @clear="clearFilter"
    class="larger-spacing"
  >
    <!-- Checkbox Grid -->
    <div class="row q-col-gutter-md">
      <!-- First Column: 3 checkboxes -->
      <div class="col-6">
        <div v-for="option in educationOptions.slice(0, 3)" :key="option.value" class="q-mb-lg">
          <q-checkbox
            v-model="selectedEducations"
            :label="option.label"
            :val="option.value"
            color="primary"
          />
        </div>
      </div>

      <!-- Second Column: remaining 2 checkboxes -->
      <div class="col-6">
        <div v-for="option in educationOptions.slice(3)" :key="option.value" class="q-mb-lg">
          <q-checkbox
            v-model="selectedEducations"
            :label="option.label"
            :val="option.value"
            color="primary"
          />
        </div>
      </div>
    </div>
  </BaseFilterCard>
</template>

<script>
import { useFilterStore } from 'src/stores/filter-store'
import BaseFilterCard from './BaseFilterCard.vue'

export default {
  name: 'EducationFilter',
  components: { BaseFilterCard },

  data() {
    return {
      educationOptions: [
        { label: 'Postgraduate', value: 'Postgraduate' },
        { label: 'Undergraduate', value: 'Undergraduate' },
        { label: 'PhD', value: 'Phd' },
        { label: '10th', value: '10th' },
        { label: '12th', value: '12th' },
      ],
    }
  },

  computed: {
    store() {
      return useFilterStore()
    },
    selectedEducations: {
      get() {
        return this.store.educations
      },
      set(val) {
        this.store.educations = val
      },
    },
    isActive() {
      return this.selectedEducations.length > 0
    },
    subtitleText() {
      return this.selectedEducations.length ? this.selectedEducations.join(', ') : 'Any Education'
    },
  },

  methods: {
    clearFilter() {
      this.selectedEducations = []
    },
  },
}
</script>

<style scoped>
.larger-spacing {
  padding: 20px !important;
}

.larger-spacing :deep(.q-card) {
  padding: 14px;
}

.larger-spacing :deep(.q-card__section) {
  padding: 15px 20px;
}

.education-wrapper {
  border: 1px solid #dcdcdc;
  padding: 12px;
  background-color: white;
  transition: all 0.2s ease;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.education-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 14px 16px;
}

.education-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
}

.education-subtitle {
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

.q-mb-lg {
  margin-bottom: 28px !important;
}
</style>
