<template>
  <BaseFilterCard
    title="Equity Range"
    :subtitle="`Equity: ${equity.min}% to ${equity.max}%`"
    :active="isActive"
    @clear="clearFilter"
  >
    <q-range v-model="equity" :min="0" :max="2" :step="0.1" label-always color="primary" />
  </BaseFilterCard>
</template>

<script>
import { useFilterStore } from 'src/stores/filter-store'
import BaseFilterCard from './BaseFilterCard.vue'

export default {
  name: 'EquityFilter',
  components: { BaseFilterCard },
  computed: {
    store() {
      return useFilterStore()
    },
    equity: {
      get() {
        return this.store.equity || { min: 0, max: 2 }
      },
      set(val) {
        this.store.equity = val
      },
    },
    isActive() {
      return this.equity.min > 0 || this.equity.max < 2
    },
  },
  methods: {
    clearFilter() {
      this.equity = { min: 0, max: 2 }
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
