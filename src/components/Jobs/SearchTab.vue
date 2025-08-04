<template>
  <div class="q-card q-pa-md q-mt-sm shadow-2">
    <!-- Job Title -->
    <q-input
      filled
      v-model="filters.jobTitle"
      placeholder="Add a job title"
      class="q-mb-sm"
      dense
    />

    <!-- Location -->
    <q-input
      filled
      v-model="filters.location"
      placeholder="Add a location"
      class="q-mb-sm"
      dense
    />

    <!-- Remote Job Options -->
    <q-option-group
      v-model="filters.remoteOption"
      :options="[
        { label: 'No Remote Jobs', value: 'no' },
        { label: 'Include Remote Jobs', value: 'include' },
        { label: 'Only Remote Jobs', value: 'only' },
      ]"
      type="radio"
      inline
      class="q-mb-sm"
    />

    <!-- Tags (e.g., Python, etc.) -->
    <q-select
      filled
      v-model="filters.tags"
      multiple
      use-chips
      label="Add skills (tags)"
      :options="['Python', 'JavaScript', 'Vue', 'React']"
    />
  </div>
</template>

<script>
export default {
  name: "SearchTab",
  props: {
    filters: {
      type: Object,
      required: true,
    },
  },
};
</script>
