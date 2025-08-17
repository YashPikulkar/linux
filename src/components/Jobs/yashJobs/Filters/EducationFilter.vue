<template>
  <BaseFilterCard
    title="Education"
    :subtitle="subtitleText"
    :is-active="isActive"
    @clear="clearFilter"
  >
    <!-- Checkbox Grid -->
    <div class="row q-col-gutter-sm">
      <div v-for="option in pagedOptions" :key="option.value" class="col-6">
        <q-checkbox
          v-model="selectedEducations"
          :label="option.label"
          :val="option.value"
          color="primary"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div class="row justify-center q-mt-md">
      <q-btn
        flat
        dense
        icon="chevron_left"
        @click="prevPage"
        :disable="currentPage === 0"
        class="q-mr-sm"
      />
      <q-btn
        flat
        dense
        icon="chevron_right"
        @click="nextPage"
        :disable="currentPage >= totalPages - 1"
      />
    </div>
  </BaseFilterCard>
</template>

<script>
import { useFilterStore } from 'src/stores/filter-store'
import BaseFilterCard from './BaseFilterCard.vue'

export default {
  name: 'EducationFilter',
  components: { BaseFilterCard },

  data() {
    return {
      currentPage: 0,
      pageSize: 4, // only 5 values, smaller page size
      educationOptions: [
        { label: 'Postgraduate', value: 'Postgraduate' },
        { label: 'Undergraduate', value: 'Undergraduate' },
        { label: 'PhD', value: 'Phd' },
        { label: '10th', value: '10th' },
        { label: '12th', value: '12th' },
      ],
    }
  },

  computed: {
    store() {
      return useFilterStore()
    },

    selectedEducations: {
      get() {
        return this.store.educations
      },
      set(val) {
        this.store.educations = val
      },
    },

    isActive() {
      return this.selectedEducations.length > 0
    },

    subtitleText() {
      return this.selectedEducations.length ? this.selectedEducations.join(', ') : 'Any Education'
    },

    totalPages() {
      return Math.ceil(this.educationOptions.length / this.pageSize)
    },

    pagedOptions() {
      const start = this.currentPage * this.pageSize
      return this.educationOptions.slice(start, start + this.pageSize)
    },
  },

  methods: {
    clearFilter() {
      this.selectedEducations = []
      this.currentPage = 0
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) this.currentPage++
    },
    prevPage() {
      if (this.currentPage > 0) this.currentPage--
    },
  },
}
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
  margin-bottom: 25px;
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
