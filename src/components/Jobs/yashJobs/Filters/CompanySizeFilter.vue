<template>
  <BaseFilterCard
    title="Company Size"
    :subtitle="subtitleText"
    :is-active="isActive"
    @clear="clearFilter"
  >
    <!-- Checkbox Grid -->
    <div class="row q-col-gutter-sm">
      <div v-for="option in pagedOptions" :key="option.value" class="col-6">
        <q-checkbox
          v-model="selectedCompanySizes"
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
  name: 'CompanySizeFilter',
  components: { BaseFilterCard },

  data() {
    return {
      currentPage: 0,
      pageSize: 6,
      sizeOptions: [
        { label: '1–10', value: '1-10' },
        { label: '11–50', value: '11-50' },
        { label: '51–200', value: '51-200' },
        { label: '201–500', value: '201-500' },
        { label: '501–1000', value: '501-1000' },
        { label: '1001–5000', value: '1001-5000' },
        { label: '5001–10000', value: '5001-10000' },
        { label: '10000+', value: '10000+' },
      ],
    }
  },

  computed: {
    store() {
      return useFilterStore()
    },

    selectedCompanySizes: {
      get() {
        return this.store.companySizes
      },
      set(val) {
        this.store.companySizes = val
      },
    },

    isActive() {
      return this.selectedCompanySizes.length > 0
    },

    subtitleText() {
      return this.selectedCompanySizes.length ? this.selectedCompanySizes.join(', ') : 'Any Size'
    },

    totalPages() {
      return Math.ceil(this.sizeOptions.length / this.pageSize)
    },

    pagedOptions() {
      const start = this.currentPage * this.pageSize
      return this.sizeOptions.slice(start, start + this.pageSize)
    },
  },

  methods: {
    clearFilter() {
      this.selectedCompanySizes = []
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
}

.company-size-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.company-size-subtitle {
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
