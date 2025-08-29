<template>
  <BaseFilterCard
    title="Job Types"
    :subtitle="selectedJobTypes.length ? selectedJobTypes.join(', ') : 'Any Type'"
    :active="isActive"
    @clear="clearFilter"
    class="larger-spacing"
  >
    <!-- Checkbox Grid -->
    <div class="row q-col-gutter-lg">
      <!-- First Column: 3 checkboxes -->
      <div class="col-6">
        <div v-for="option in jobTypeOptions.slice(0, 3)" :key="option.value" class="q-mb-lg">
          <q-checkbox
            v-model="selectedJobTypes"
            :label="option.label"
            :val="option.value"
            color="primary"
          />
        </div>
      </div>

      <!-- Second Column: 4th checkbox -->
      <div class="col-6" v-if="jobTypeOptions.length > 3">
        <div class="q-mb-lg">
          <q-checkbox
            v-model="selectedJobTypes"
            :label="jobTypeOptions[3].label"
            :val="jobTypeOptions[3].value"
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
  name: 'JobTypesFilter',
  components: { BaseFilterCard },

  data() {
    return {
      jobTypeOptions: [
        { label: 'Full-time', value: 'Full-time' },
        { label: 'Contract', value: 'Contract' },
        { label: 'Internship', value: 'Internship' },
        { label: 'Co-founder', value: 'Co-founder' },
      ],
    }
  },

  computed: {
    store() {
      return useFilterStore()
    },
    selectedJobTypes: {
      get() {
        return this.store.jobTypes
      },
      set(val) {
        this.store.jobTypes = val
      },
    },
    isActive() {
      return this.selectedJobTypes.length > 0
    },
  },

  methods: {
    clearFilter() {
      this.selectedJobTypes = []
    },
  },
}
</script>

<style scoped>
.larger-spacing {
  padding: 16px !important; /* reduced from 24px */
}

.larger-spacing :deep(.q-card) {
  padding: 12px; /* reduced from 20px */
}

.larger-spacing :deep(.q-card__section) {
  padding: 12px 16px; /* reduced from 16px 24px */
}

.job-types-wrapper {
  border: 1px solid #dcdcdc;
  padding: 12px; /* reduced from 16px */
  background-color: white;
  transition: all 0.2s ease;
}

.job-types-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 12px 16px; /* reduced from 20px */
}

.job-types-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px; /* reduced from 12px */
}

.job-types-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  margin-bottom: 12px; /* reduced from 20px */
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
  margin-bottom: 22px !important; /* smaller space between checkboxes */
}
</style>
