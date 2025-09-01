<template>
  <div class="q-pa-lg applicants-section">

    <!-- Jobs List -->
    <div v-if="currentJob == null && component === 'jobs-list'">
      
      <!-- No Jobs Posted Message -->
      <div v-if="!jobs || jobs.length === 0" class="no-jobs-container">
            <div class="no-jobs-content">
              <q-icon name="work_off" size="4rem" class="text-grey-5 q-mb-md" />
              <h5 class="job-title text-grey-6 q-mb-sm">No Jobs Posted</h5>
              <p class="text-grey-5">There are currently no job posted here.</p>
            </div>
      </div>

      <!-- Jobs List -->
      <div v-else>
        <div v-for="job in jobs" :key="job.id">
          <q-card class="job-card q-my-md" flat>

            <!-- Header Section -->
            <q-card-section class="card-header">
              <div class="header-content">
                <div class="title-section">
                  <h5 class="job-title">{{ job.title }}</h5>
                  <div class="job-badges">
                    <q-badge class="job-badge" :label="job.job_type" />
                    <q-badge class="job-badge work-mode" :label="job.mode_of_work" />
                  </div>
                </div>
                <div class="header-actions">
                  <q-btn
                    round
                    flat
                    icon="visibility"
                    class="icon-btn"
                    @click="changeComponent('view-job', job)"
                  >
                    <q-tooltip>View Job</q-tooltip>
                  </q-btn>
                  <q-btn
                    round
                    flat
                    icon="group"
                    class="icon-btn"
                    @click="changeComponent('job-app', job)"
                  >
                    <q-tooltip>View Applications</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>

            <!-- Main Content -->
            <q-card-section class="card-content">
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-icon"><q-icon name="work_history" /></div>
                  <div class="info-content">
                    <div class="info-label">Experience (MAX - MIN)</div>
                    <div class="info-value">{{ job.experience_max - job.experience_min }} years</div>
                  </div>
                </div>

                <div class="info-card">
                  <div class="info-icon"><q-icon name="payments" /></div>
                  <div class="info-content">
                    <div class="info-label">Salary Level</div>
                    <div class="info-value">{{ job.salary_max - job.salary_min }}</div>
                  </div>
                </div>

                <div class="info-card" v-if="job.opening">
                  <div class="info-icon"><q-icon name="mail" /></div>
                  <div class="info-content">
                    <div class="info-label">Openings</div>
                    <div class="info-value">{{ job.opening }} positions</div>
                  </div>
                </div>

                <div class="info-card" v-if="job.popularity_score > 0">
                  <div class="info-icon">
                    <q-icon name="local_fire_department" />
                  </div>
                  <div class="info-content">
                    <div class="info-label">Popularity</div>
                    <div class="info-value">{{ job.popularity_score }} score</div>
                  </div>
                </div>
              </div>
            </q-card-section>

            <!-- Footer -->
            <q-card-section class="card-footer">
              <div class="footer-content">
                <q-icon name="schedule" class="footer-icon" />
                <span class="posted-text">Posted {{ getTimeAgo(job.posted) }}</span>
                <q-space />
                <div class="status-indicator">
                  <div class="status-dot active"></div>
                  <span class="status-text">Active</span>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Job Applicants -->
    <JobApplicants
      v-if="currentJob !== null && component === 'job-app'"
      :job-details="currentJob"
      :go-back="goBack"
    />

    <!-- View Job -->
    <ViewJob
      v-if="currentJob !== null && component === 'view-job'"
      :job="currentJob"
      :go-back="goBack"
      @jobDeleted="handleJobDeleted"
    />

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useJobsStore } from 'src/stores/jobStore'
import ViewJob from 'src/components/RecruiterDashboard/ViewJob.vue'
import JobApplicants from 'src/components/RecruiterDashboard/JobApplicants.vue'

const jobsStore = useJobsStore()
const component = ref('jobs-list')
const currentJob = ref(null)

// 🔥 SOLUTION 2: Use computed to reactively get jobs from store
const jobs = computed(() => jobsStore.recruiterJobs || [])

const loadJobs = async () => {
  try {
    await jobsStore.fetchJobByRecruiter()
    console.log('Jobs loaded:', jobsStore.recruiterJobs)
  } catch (error) {
    console.error('Error loading jobs:', error)
  }
}

function getTimeAgo(dateString) {
  const now = new Date()
  const posted = new Date(dateString)
  const diffTime = Math.abs(now - posted)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  return `${Math.ceil(diffDays / 30)} months ago`
}

function changeComponent(val, curr) {
  component.value = val
  currentJob.value = curr
}

function goBack() {
  currentJob.value = null
  component.value = 'jobs-list'
}

// 🔥 SOLUTION 1: Handle deletion event from child
function handleJobDeleted() {
  // Since we're using computed from store, the list will update automatically
  // But we can also manually reload if needed:
  // loadJobs()
  goBack()
}

onMounted(() => {
  loadJobs()
})
</script>


<style scoped>
:root {
  --q-primary: #b87333; /* Copper */
  --q-primary-rgb: 184, 115, 51;
}

/* Section */
.applicants-section {
  width: 100%;
}

.q-item {
  border-radius: 8px;
  color: white;
}

.q-item:hover {
  background-color: var(--q-primary);
  color: white;
}

/* Job Card */
.job-card {
  border-radius: 20px;
  border: 1px solid #ddd;
  background: #fff; /* Card base is white */
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  color: #333; /* Text default dark */
}

.job-card:hover {
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  transform: translateY(-4px);
  border-color: var(--q-primary);
}
/* No Jobs Styling */
.no-jobs-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  width: 100%;
}

.no-jobs-content {
  text-align: center;
  padding: 40px 20px;
}

.no-jobs-content .job-title {
  color: #7a7a7a !important;
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 600;
}

.no-jobs-content p {
  font-size: 1rem;
  color: #999;
  margin: 0;
}
/* Header Section */
.card-header {
  background: linear-gradient(135deg, #000000 0%, var(--q-primary) 100%);
  padding: 16px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.title-section {
  flex: 1;
}

.job-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  margin: 0 0 10px 0;
  line-height: 1.3;
  letter-spacing: 0.3px;
}

.job-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.job-badge {
  background: rgba(var(--q-primary-rgb), 0.15);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid var(--q-primary);
  backdrop-filter: blur(10px);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  transition: all 0.3s ease;
}

.job-badge:hover {
  background: var(--q-primary);
  color: white;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* Action buttons in header */
.icon-btn {
  background: #f0f0f0;
  color: var(--q-primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: var(--q-primary);
  color: white;
  transform: scale(1.1);
}

/* Main Content Grid (White background) */
.card-content {
  padding: 16px;
  background: #ffffff;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
  color: #333;
}

.info-card:hover {
  background: var(--q-primary);
  border-color: var(--q-primary);
  transform: translateY(-2px);
  color: white;
}

/* Info card icons */
.info-icon {
  width: 36px;
  height: 36px;
  background: #f0f0f0;
  color: var(--q-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.info-card:hover .info-icon {
  background: white;
  color: var(--q-primary);
  box-shadow: 0 0 6px rgba(0,0,0,0.15);
}


.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.75rem;
  color: #7a7a7a;;
  font-weight: 600;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.info-card:hover .info-label {
  color: white;
}

.info-value {
  font-size: 1rem;
  color: #1c1c1c;
  font-weight: 700;
  line-height: 1.4;
}

/* Footer Section (White background) */
.card-footer {
  padding: 12px 16px;
  background: #ffffff;
  border-top: 1px solid #ddd;
  color: #333;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-icon {
  color: #7a7a7a;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.footer-icon:hover {
  color: var(--q-primary);
}

.posted-text {
  color: #666;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
}

.status-dot.active {
  background: #28a745;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.status-text {
  color: #28a745;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    align-self: flex-end;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .job-title {
    font-size: 1.5rem;
  }

  .card-content {
    padding: 24px 16px;
  }

  .card-header {
    padding: 20px 16px;
  }

  .card-footer {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .info-card {
    padding: 16px;
  }

  .info-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .footer-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .status-indicator {
    align-self: flex-end;
  }
}


</style>
