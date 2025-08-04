<template>
  <q-select
    outlined
    dense
    class="custom-input"
    v-model="selectedJobTitles"
    :options="jobTitles"
    label="Add a job title"
    emit-value
    map-options
    multiple
    use-chips
    use-input
    fill-input
    popup-content-class="custom-dropdown"
    dropdown-icon="expand_more"
  >
    <template v-slot:prepend>
      <q-icon name="work_outline" />
    </template>
  </q-select>
</template>

<script>
import { useFilterStore } from "src/components/Jobs/Store/FilterStore";

export default {
  name: "JobTitleFilter",

  data() {
    return {
      store: useFilterStore(), // ✅ called once and stored
      jobTitles: [
        { label: "Software Engineer", value: "Software Engineer" },
        { label: "Frontend Developer", value: "Frontend Developer" },
        { label: "Data Analyst", value: "Data Analyst" },
        { label: "Product Manager", value: "Product Manager" },
      ],
    };
  },

  computed: {
    selectedJobTitles: {
      get() {
        return this.store.selectedJobTitles;
      },
      set(val) {
        this.store.selectedJobTitles = val;
      },
    },
  },
};
</script>

<style scoped>
.custom-input {
  width: 100%;
  border-radius: 12px;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  min-height: 50px;
}
</style>
