<template>
  <div class="education-wrapper" :class="{ 'active-filter': isActive }">
    <div class="education-container q-pa-md q-mb-md">
      <!-- Title + Clear -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="education-title">Education</div>
        <div v-if="isActive" class="clear-text" @click="clearFilter">Clear</div>
      </div>

      <!-- Subtitle -->
      <div class="education-subtitle">
        {{
          selectedEducation.length ? selectedEducation.join(", ") : "Any Degree"
        }}
      </div>

      <!-- Checkbox Grid (2 per row) -->
      <div class="row q-col-gutter-sm">
        <div
          class="col-6"
          v-for="option in educationOptions"
          :key="option.value"
        >
          <q-checkbox
            v-model="selectedEducation"
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
  name: "EducationFilter",

  data() {
    return {
      educationOptions: [
        { label: "Undergraduate", value: "Undergraduate" },
        { label: "Postgraduate", value: "Postgraduate" },
        { label: "Diploma", value: "Diploma" },
        { label: "10th", value: "10th" },
        { label: "12th", value: "12th" },
        { label: "PhD", value: "PhD" },
      ],
    };
  },

  computed: {
    store() {
      return useFilterStore();
    },
    selectedEducation: {
      get() {
        return this.store.education;
      },
      set(val) {
        this.store.education = val;
      },
    },
    isActive() {
      return this.selectedEducation.length > 0;
    },
  },

  methods: {
    clearFilter() {
      this.selectedEducation = [];
    },
  },
};
</script>

<style scoped>
.education-wrapper {
  border: 1px solid #dcdcdc;
  padding: 16px;
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
  height: 240px;
}

.education-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
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
</style>
