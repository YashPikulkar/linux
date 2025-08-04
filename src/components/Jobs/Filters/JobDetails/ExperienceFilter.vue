<template>
  <div class="experience-wrapper" :class="{ 'active-filter': isActive }">
    <div class="experience-container q-pa-md q-mb-md">
      <!-- Header: Title + Clear -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="experience-title">Experience</div>
        <div v-if="isActive" class="clear-text" @click="clearFilter">Clear</div>
      </div>

      <!-- Subtitle -->
      <div class="experience-subtitle">
        Minimum Experience: {{ selectedExperience }} year<span
          v-if="selectedExperience !== 1"
          >s</span
        >
      </div>

      <!-- Slider -->
      <q-slider
        v-model="selectedExperience"
        :min="0"
        :max="15"
        :step="1"
        label-always
        color="primary"
      />
    </div>
  </div>
</template>

<script>
import { useFilterStore } from "src/components/Jobs/Store/FilterStore";

export default {
  name: "ExperienceFilter",

  computed: {
    store() {
      return useFilterStore();
    },

    selectedExperience: {
      get() {
        return this.store.experience;
      },
      set(val) {
        this.store.experience = val;
      },
    },

    isActive() {
      return this.selectedExperience > 0;
    },
  },

  methods: {
    clearFilter() {
      this.selectedExperience = 0;
    },
  },
};
</script>

<style scoped>
.experience-wrapper {
  border: 1px solid #dcdcdc;
  padding: 16px;
  background-color: white;
  transition: all 0.2s ease;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.experience-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  height: 240px;
}

.experience-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.experience-subtitle {
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
