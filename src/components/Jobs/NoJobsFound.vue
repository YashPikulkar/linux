<template>
  <div class="no-jobs-container">
    <q-card class="no-jobs-card" flat>
      <q-card-section class="text-center">
        <!-- Icon -->
        <q-icon name="work_off" size="4rem" color="grey-5" class="q-mb-md" />

        <!-- Main Message -->
        <div class="text-h6 text-grey-8 q-mb-sm">
          {{ title }}
        </div>

        <!-- Description -->
        <div class="text-body2 text-grey-6 q-mb-lg">
          {{ description }}
        </div>

        <!-- Action Buttons -->
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'NoJobsFound',

  props: {
    title: {
      type: String,
      default: 'No Jobs Found',
    },
    description: {
      type: String,
      default:
        "We couldn't find any jobs matching your criteria. Try adjusting your search filters or refresh.",
    },
    showRefreshButton: {
      type: Boolean,
      default: true,
    },
    showClearFiltersButton: {
      type: Boolean,
      default: true,
    },
    refreshButtonText: {
      type: String,
      default: 'Try Again',
    },
    clearFiltersButtonText: {
      type: String,
      default: 'Clear Filters',
    },
  },

  emits: ['refresh', 'clear-filters'],

  methods: {
    handleRefresh() {
      this.$emit('refresh')
    },

    handleClearFilters() {
      this.$emit('clear-filters')
    },
  },
}
</script>

<style lang="scss" scoped>
.no-jobs-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1; /* take full available height */
  width: 100%;
  min-height: 100%; /* match job list area */
  padding: 20px;
}

.no-jobs-card {
  width: 100%;
  height: 100%;
  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-icon {
  margin-right: 8px;
}

@media (max-width: 600px) {
  .action-buttons {
    flex-direction: column;
    align-items: center;

    .q-btn {
      width: 100%;
      max-width: 200px;
    }
  }
}
</style>
