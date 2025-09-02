<template>
  <BaseFilterCard
    title="Equity Range"
    :subtitle="`Equity: ${equity.min}% to ${equity.max}%`"
    :active="isActive"
    @clear="clearFilter"
    class="larger-equity-card"
  >
    <div class="equity-range-wrapper">
      <q-range
        v-model="equity"
        :min="0"
        :max="2"
        :step="0.1"
        label-always
        color="primary"
        class="larger-range"
      />
    </div>
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
.larger-equity-card :deep(.q-card__section) {
  padding: 20px; /* extra padding for taller card */
}

.equity-range-wrapper {
  height: 60px; /* increase container height */
  display: flex;
  align-items: center; /* center slider vertically */
}

.larger-range {
  height: 40px; /* taller slider track */
}

/* Optional: bigger thumb for better UX */
.larger-range :deep(.q-slider__thumb) {
  width: 16px;
  height: 20px;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}
</style>
