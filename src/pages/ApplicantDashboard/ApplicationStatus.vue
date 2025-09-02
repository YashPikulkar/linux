<template>
  <div class="applications-container">
    <!-- Fixed Header + Filters -->
    <div class="header-filters">
      <div class="section-header">
        <div class="header-title">
          <q-icon name="work" size="28px" />
          <h4>My Job Applications</h4>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div v-if="store.applications.length" class="filter-tabs">
        <button
          class="filter-tab total"
          :class="{ active: selectedFilter === 'all' }"
          @click="selectedFilter = 'all'"
        >
          All ({{ store.applications.length }})
        </button>
        <button
          class="filter-tab pending"
          :class="{ active: selectedFilter === 'pending' }"
          @click="selectedFilter = 'pending'"
        >
          Pending ({{ getPendingCount() }})
        </button>
        <button
          class="filter-tab accepted"
          :class="{ active: selectedFilter === 'accepted' }"
          @click="selectedFilter = 'accepted'"
        >
          Accepted ({{ getAcceptedCount() }})
        </button>
        <button
          class="filter-tab rejected"
          :class="{ active: selectedFilter === 'rejected' }"
          @click="selectedFilter = 'rejected'"
        >
          Rejected ({{ getRejectedCount() }})
        </button>
      </div>
    </div>
    <JobDetails />
    <!-- Applications Card Container -->
    <div class="applications-card">
      <!-- Fixed List Header -->
      <div v-if="filteredApplications.length" class="list-header">
        <div class="col-job">Job & Company</div>
        <div class="col-status">Status</div>
        <div class="col-date">Applied</div>
        <div class="col-actions">Actions</div>
      </div>

      <!-- Scrollable Applied Jobs List -->
      <div class="applied-jobs-wrapper">
        <AppliedJobs
          :filtered-applications="filteredApplications"
          :selected-filter="selectedFilter"
          :show-empty="filteredApplications.length === 0"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApplicantStore } from 'src/stores/applicant-store'
import AppliedJobs from 'src/components/ApplicantDashboard/AppliedJobs.vue'
import JobDetails from 'src/components/Jobs/JobDetails.vue'

const store = useApplicantStore()
const selectedFilter = ref('all')

const filteredApplications = computed(() => {
  if (selectedFilter.value === 'all') return store.applications
  return store.applications.filter((app) => getStatusClass(app.status) === selectedFilter.value)
})

onMounted(() => {
  store.fetchApplications()
})

function getStatusClass(status) {
  const s = status.toLowerCase()
  if (s.includes('accept') || s.includes('approved') || s.includes('hired')) return 'accepted'
  if (s.includes('reject') || s.includes('declined')) return 'rejected'
  return 'pending'
}

function getPendingCount() {
  return store.applications.filter((app) => getStatusClass(app.status) === 'pending').length
}

function getAcceptedCount() {
  return store.applications.filter((app) => getStatusClass(app.status) === 'accepted').length
}

function getRejectedCount() {
  return store.applications.filter((app) => getStatusClass(app.status) === 'rejected').length
}
</script>

<style scoped>
.applications-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #f9f9f9;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;
}

/* ✅ Fixed header inside right card */
.header-filters {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #f9f9f9;
  margin-bottom: 24px;
  padding-top: 8px;
}

/* Applications card container */
.applications-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ✅ Fixed list header */
.list-header {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 120px;
  gap: 16px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 5;
}

/* Scrollable AppliedJobs wrapper */
.applied-jobs-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* Header Section */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title h4 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
}

.quick-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-item.total {
  background: #e3f2fd;
  color: #1565c0;
}

.stat-item.pending {
  background: #fff3e0;
  color: #ef6c00;
}

.stat-item.accepted {
  background: #e8f5e8;
  color: #2e7d32;
}

.stat-item.rejected {
  background: #ffebee;
  color: #c62828;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

/* Match stat-item colors */
.filter-tab.total {
  background: #e3f2fd;
  color: #1565c0;
}

.filter-tab.pending {
  background: #fff3e0;
  color: #ef6c00;
}

.filter-tab.accepted {
  background: #e8f5e8;
  color: #2e7d32;
}

.filter-tab.rejected {
  background: #ffebee;
  color: #c62828;
}

/* Active state = stronger solid color */
.filter-tab.active.total {
  background: #1565c0;
  color: white;
}

.filter-tab.active.pending {
  background: #ef6c00;
  color: white;
}

.filter-tab.active.accepted {
  background: #2e7d32;
  color: white;
}

.filter-tab.active.rejected {
  background: #c62828;
  color: white;
}

/* Responsive Design */
@media (max-width: 968px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .quick-stats {
    width: 100%;
    justify-content: space-between;
  }
  .stat-item {
    flex: 1;
    text-align: center;
    min-width: 0;
    font-size: 0.8rem;
    padding: 6px 8px;
  }
  .list-header {
    display: none;
  }
}

@media (max-width: 640px) {
  .applications-container {
    padding: 16px;
  }
  .filter-tabs {
    overflow-x: auto;
    padding-bottom: 4px;
  }
  .filter-tab {
    white-space: nowrap;
    flex-shrink: 0;
  }
  .quick-stats {
    flex-direction: column;
    gap: 8px;
  }
  .stat-item {
    text-align: left;
  }
}
</style>
