<template>
  <div class="equity-wrapper" :class="{ 'active-filter': isActive }">
    <div class="equity-container q-pa-md q-mb-md">
      <!-- Header with Title + Clear -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="equity-title">Equity</div>
        <div v-if="isActive" class="clear-text" @click="clearFilter">Clear</div>
      </div>

      <!-- Subtitle -->
      <div class="equity-subtitle">
        Minimum Equity: {{ equity.toFixed(1) }}%
      </div>

      <!-- Slider -->
      <q-slider v-model="equity" :min="0" :max="2" :step="0.1" label-always />
    </div>
  </div>
</template>

<script>
import { useFilterStore } from "src/components/Jobs/Store/FilterStore";

export default {
  name: "EquityFilter",

  computed: {
    store() {
      return useFilterStore();
    },

    equity: {
      get() {
        return this.store.equity;
      },
      set(val) {
        this.store.equity = val;
      },
    },

    isActive() {
      return this.equity > 0;
    },
  },

  methods: {
    clearFilter() {
      this.equity = 0;
    },
  },
};
</script>

<style scoped>
.equity-wrapper {
  border: 1px solid #dcdcdc;
  padding: 16px;
  background-color: white;
  transition: all 0.2s ease;
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

.clear-text {
  font-size: 13px;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}
</style>
