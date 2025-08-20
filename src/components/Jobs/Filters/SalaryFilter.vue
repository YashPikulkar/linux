<template>
  <BaseFilterCard
    title="Salary"
    :subtitle="computedSalaryLabel"
    :active="isActive"
    @clear="clearFilter"
  >
    <div class="row items-center justify-start q-col-gutter-sm">
      <div class="col">
        <q-input outlined dense type="number" label="Min Salary" v-model.number="minSalary" />
      </div>

      <div class="dash-separator">—</div>

      <div class="col">
        <q-input
          outlined
          dense
          type="number"
          label="Max Salary (optional)"
          v-model.number="maxSalary"
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
        this.store.salary.min = val
      },
    },
    maxSalary: {
      get() {
        return this.store.salary.max
      },
      set(val) {
        this.store.salary.max = val
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
