<template>
  <div class="company-size-wrapper" :class="{ 'active-filter': isActive }">
    <div class="company-size-container q-pa-md q-mb-md">
      <!-- Title + Clear -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="company-size-title">Company Size</div>
        <div v-if="isActive" class="clear-text" @click="clearFilter">Clear</div>
      </div>

      <!-- Subtitle -->
      <div class="company-size-subtitle">
        {{
          selectedCompanySizes.length
            ? selectedCompanySizes.join(", ")
            : "Any Size"
        }}
      </div>

      <!-- Checkbox Grid -->
      <div class="row q-col-gutter-sm">
        <div class="col-6" v-for="option in sizeOptions" :key="option.value">
          <q-checkbox
            v-model="selectedCompanySizes"
            :label="option.label"
            :val="option.value"
            color="primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFilterStore } from "src/components/Jobs/Store/FilterStore";

export default {
  name: "CompanySizeFilter",
  data() {
    return {
      sizeOptions: [
        { label: "1–10", value: "1-10" },
        { label: "11–50", value: "11-50" },
        { label: "51–200", value: "51-200" },
        { label: "201–500", value: "201-500" },
        { label: "500+", value: "500+" },
      ],
    };
  },
  computed: {
    store() {
      return useFilterStore();
    },
    selectedCompanySizes: {
      get() {
        return this.store.companySizes;
      },
      set(val) {
        this.store.companySizes = val;
      },
    },
    isActive() {
      return this.selectedCompanySizes.length > 0;
    },
  },
  methods: {
    clearFilter() {
      this.selectedCompanySizes = [];
    },
  },
};
</script>

<style scoped>
.company-size-wrapper {
  border: 1px solid #dcdcdc;
  padding: 16px;
  background-color: white;
  transition: all 0.2s ease;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.company-size-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  height: 240px;
}

/* Title */
.company-size-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* Subtitle */
.company-size-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.4;
}

/* Clear button */
.clear-text {
  font-size: 13px;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}
</style>
