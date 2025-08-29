<template>
  <BaseFilterCard
    title="Salary"
    :subtitle="computedSalaryLabel"
    :active="isActive"
    @clear="clearFilter"
  >
    <div class="row items-center justify-start q-col-gutter-sm">
      <div class="col">
        <q-input
          outlined
          dense
          type="number"
          label="Min Salary"
          v-model.number="minSalary"
          :error="minSalaryError"
          :error-message="minSalaryErrorMessage"
        />
      </div>

      <div class="dash-separator">—</div>

      <div class="col">
        <q-input
          outlined
          dense
          type="number"
          label="Max Salary (optional)"
          v-model.number="maxSalary"
          :error="maxSalaryError"
          :error-message="maxSalaryErrorMessage"
        />
      </div>
    </div>
  </BaseFilterCard>
</template>

<script>
import { useFilterStore } from 'src/stores/filter-store'
import BaseFilterCard from './BaseFilterCard.vue'

export default {
  name: 'SalaryFilter',
  components: { BaseFilterCard },

  computed: {
    store() {
      return useFilterStore()
    },
    minSalary: {
      get() {
        return this.store.salary.min
      },
      set(val) {
        // prevent negative value
        this.store.salary.min = val >= 0 ? val : 0
      },
    },
    maxSalary: {
      get() {
        return this.store.salary.max
      },
      set(val) {
        // prevent negative value
        this.store.salary.max = val >= 0 ? val : 0
      },
    },
    isActive() {
      return !!this.minSalary || !!this.maxSalary
    },
    computedSalaryLabel() {
      if (!this.minSalary && !this.maxSalary) return 'Any salary'
      if (this.minSalary && !this.maxSalary) return `₹${this.minSalary}+`
      if (!this.minSalary && this.maxSalary) return `Up to ₹${this.maxSalary}`
      return `₹${this.minSalary} - ₹${this.maxSalary}`
    },
    minSalaryError() {
      return this.minSalary < 0
    },
    minSalaryErrorMessage() {
      return this.minSalaryError ? 'Salary cannot be negative' : ''
    },
    maxSalaryError() {
      return this.maxSalary < 0
    },
    maxSalaryErrorMessage() {
      return this.maxSalaryError ? 'Salary cannot be negative' : ''
    },
  },

  methods: {
    clearFilter() {
      this.minSalary = ''
      this.maxSalary = ''
    },
  },
}
</script>

<style scoped>
.dash-separator {
  font-size: 20px;
  color: #6b7280;
  margin: 0 8px;
  user-select: none;
}
</style>
