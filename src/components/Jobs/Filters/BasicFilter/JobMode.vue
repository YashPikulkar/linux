<template>
    <q-select
      outlined
      dense
      class="job-mode-input"
      v-model="selectedJobMode"
      :options="jobModes"
      label="Job Mode"
      emit-value
      map-options
      dropdown-icon="expand_more"
      popup-content-class="custom-dropdown"
    >
      <template v-slot:prepend>
        <q-icon name="location_on" />
      </template>
    </q-select>
  </template>
  
  <script>
  import { useFilterStore } from "src/components/Jobs/Store/FilterStore";
  
  export default {
    name: "JobModeFilter",
  
    data() {
      return {
        store: useFilterStore(),
        jobModes: [
          { label: "Online", value: "Online" },
          { label: "Offline", value: "Offline" },
          { label: "Hybrid", value: "Hybrid" },
        ],
      };
    },
  
    computed: {
      selectedJobMode: {
        get() {
          return this.store.jobMode;
        },
        set(val) {
          this.store.jobMode = val;
        },
      },
    },
  };
  </script>
  
  <style scoped>
  .job-mode-input {
    width: 100%;
    border-radius: 12px;
    font-family: "Inter", sans-serif;
    font-size: 16px;
    min-height: 50px;
  }
  </style>
  