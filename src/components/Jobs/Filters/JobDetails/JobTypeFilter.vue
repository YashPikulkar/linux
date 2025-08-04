<template>
  <div class="job-types-wrapper" :class="{ 'active-filter': isActive }">
    <div class="job-types-container q-pa-md q-mb-md">
      <!-- Title and Clear Button -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="job-types-title">Job Types</div>
        <div v-if="isActive" class="clear-text" @click="clearFilter">Clear</div>
      </div>

      <!-- Subtitle -->
      <div class="job-types-subtitle">
        {{ selectedJobTypes.length ? selectedJobTypes.join(", ") : "Any Type" }}
      </div>

      <!-- Checkbox Grid -->
      <div class="row q-col-gutter-sm">
        <div v-for="option in jobTypeOptions" :key="option.value" class="col-6">
          <q-checkbox
            v-model="selectedJobTypes"
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
  name: "JobTypesFilter",

  data() {
    return {
      jobTypeOptions: [
        { label: "Full-time", value: "Full-time" },
        { label: "Contract", value: "Contract" },
        { label: "Internship", value: "Internship" },
        { label: "Co-founder", value: "Co-founder" },
      ],
    };
  },

  computed: {
    store() {
      return useFilterStore();
    },
    selectedJobTypes: {
      get() {
        return this.store.jobTypes;
      },
      set(val) {
        this.store.jobTypes = val;
      },
    },
    isActive() {
      return this.selectedJobTypes.length > 0;
    },
  },

  methods: {
    clearFilter() {
      this.selectedJobTypes = [];
    },
  },
};
</script>

<style scoped>
.job-types-wrapper {
  border: 1px solid #dcdcdc;
  padding: 16px;
  background-color: white;
  transition: all 0.2s ease;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.job-types-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  height: 240px;
}

.job-types-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.job-types-subtitle {
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
