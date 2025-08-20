<template>
  <div class="scrollable-applications">
    <!-- Application Rows -->
    <div
      v-for="app in filteredApplications"
      :key="app.jobid"
      class="application-row"
      :class="getStatusClass(app.status)"
    >
      <!-- Job & Company -->
      <div class="col-job">
        <div class="job-info">
          <h3 class="job-title">{{ app.job_title }}</h3>
          <span class="company-name">{{ app.company_name }}</span>
        </div>
      </div>

      <!-- Status -->
      <div class="col-status">
        <div class="status-badge" :class="getStatusClass(app.status)">
          <q-icon :name="getStatusIcon(app.status)" size="18px" />
          <span class="status-text">{{ app.status }}</span>
        </div>
      </div>

      <!-- Applied Date -->
      <div class="col-date">
        <span class="date-text">{{ formatDate(app.applied) }}</span>
      </div>

      <!-- Actions -->
      <div class="col-actions">
        <q-btn flat dense icon="visibility" class="action-btn view-btn" @click="viewJob(app)">
          <q-tooltip>View Job Details</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="showEmpty" class="empty-state">
      <q-icon name="work_off" size="64px" />
      <h5>No Applications Found</h5>
      <p>
        {{
          selectedFilter === 'all'
            ? "You haven't applied to any jobs yet."
            : `No ${selectedFilter} applications found.`
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useJobsStore } from 'src/stores/job-store'

// ✅ Props
const { filteredApplications, selectedFilter, showEmpty } = defineProps({
  filteredApplications: { type: Array, required: true },
  selectedFilter: { type: String, required: true },
  showEmpty: { type: Boolean, default: false },
})

const jobsStore = useJobsStore()

// ✅ Status Helpers
function getStatusClass(status) {
  const s = status.toLowerCase()
  if (s.includes('accept') || s.includes('approved') || s.includes('hired')) return 'accepted'
  if (s.includes('reject') || s.includes('declined')) return 'rejected'
  return 'pending'
}

function getStatusIcon(status) {
  const c = getStatusClass(status)
  if (c === 'accepted') return 'check_circle'
  if (c === 'rejected') return 'cancel'
  return 'schedule'
}

// ✅ View Job
function viewJob(app) {
  if (!app.jobid) return
  jobsStore.openLearnMoreDialog(app.jobid)
}

// ✅ Format Date
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
</script>

<style scoped>
/* SCROLLABLE CONTAINER */
.scrollable-applications {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  min-height: 0;
}

/* Application Row */
.application-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 120px;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background 0.2s ease;
}

.application-row:last-child {
  border-bottom: none;
}

.application-row:hover {
  background: #fafafa;
}

/* Colored left border for status */
.application-row.accepted {
  border-left: 4px solid #4caf50;
}
.application-row.pending {
  border-left: 4px solid #ff9800;
}
.application-row.rejected {
  border-left: 4px solid #f44336;
}

/* Job Info */
.col-job .job-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.job-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.company-name {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #fff3e0;
  color: #ef6c00;
}
.status-badge.accepted {
  background: #e8f5e8;
  color: #2e7d32;
}
.status-badge.rejected {
  background: #ffebee;
  color: #c62828;
}

.date-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* Actions */
.col-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #666;
}
.action-btn:hover {
  background: #f0f0f0;
  color: #1a1a1a;
}
.view-btn:hover {
  background: #e3f2fd;
  color: #1565c0;
}
.applied-jobs-wrapper {
  flex: 1;
  padding: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  color: #666;
  min-height: 300px;
}

.empty-state h5 {
  margin: 16px 0 8px;
  font-size: 1.2rem;
  color: #1a1a1a;
}
.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

/* Scrollbar */
.scrollable-applications::-webkit-scrollbar {
  width: 8px;
}
.scrollable-applications::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}
.scrollable-applications::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 8px;
}
.scrollable-applications::-webkit-scrollbar-thumb:hover {
  background: #b3b3b3;
}
.scrollable-applications {
  scrollbar-width: thin;
  scrollbar-color: #ccc #f1f1f1;
}

/* Mobile */
@media (max-width: 968px) {
  .application-row {
    display: block;
    padding: 16px 20px;
  }
  .col-job {
    margin-bottom: 12px;
  }
  .col-status,
  .col-date {
    margin-bottom: 8px;
  }
  .col-actions {
    justify-content: flex-start;
    margin-top: 12px;
  }
}
</style>
