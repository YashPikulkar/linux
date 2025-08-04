<template>
  <div class="company-type-wrapper" :class="{ 'active-filter': isActive }">
    <div class="company-type-container q-pa-md q-mb-md">
      <!-- Title + Clear -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="company-type-title">Company Type</div>
        <div v-if="isActive" class="clear-text" @click="clearFilter">Clear</div>
      </div>

      <!-- Subtitle -->
      <div class="company-type-subtitle">
        {{
          selectedCompanyTypes.length
            ? selectedCompanyTypes.join(", ")
            : "Any Type"
        }}
      </div>

      <!-- Checkbox Grid -->
      <div class="row q-col-gutter-sm">
        <div class="col-6" v-for="option in typeOptions" :key="option.value">
          <q-checkbox
            v-model="selectedCompanyTypes"
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
  name: "CompanyTypeFilter",

  data() {
    return {
      typeOptions: [
        { label: "Startup", value: "Startup" },
        { label: "MNC", value: "MNC" },
        { label: "Product-Based", value: "Product" },
        { label: "Service-Based", value: "Service" },
        { label: "Government", value: "Government" },
      ],
    };
  },

  computed: {
    store() {
      return useFilterStore();
    },
    selectedCompanyTypes: {
      get() {
        return this.store.companyTypes;
      },
      set(val) {
        this.store.companyTypes = val;
      },
    },
    isActive() {
      return this.selectedCompanyTypes.length > 0;
    },
  },

  methods: {
    clearFilter() {
      this.selectedCompanyTypes = [];
    },
  },
};
</script>

<style scoped>
.company-type-wrapper {
  border: 1px solid #dcdcdc;
  padding: 16px;
  background-color: white;
  transition: all 0.2s ease;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.company-type-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  height: 240px;
}

/* Title */
.company-type-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* Subtitle */
.company-type-subtitle {
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
