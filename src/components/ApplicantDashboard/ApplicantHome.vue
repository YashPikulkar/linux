<template>
  <div class="q-pa-md col items-center justify-between">
    <!-- Child Components with refs for refresh -->
    <ApplicantStats ref="analyticsRecordsRef" />
    <ApplicantSkillStats ref="applicantSkillStatsRef" />

    <div class="row items-center justify-between q-mb-md">
      <h2 class="text-h4 text-primary">Recommended Jobs</h2>
      <q-btn label="View All" flat dense no-caps class="text-primary" @click="goToJobs" />
    </div>

    <div v-if="jobsStore.loading" class="text-center q-mt-lg">
      <q-spinner size="md" color="primary" />
    </div>

    <div v-else-if="jobsStore.message !== ''" class="text-grey">
      {{ jobsStore.message }}
    </div>

    <!-- Grid Layout for Job Cards -->
    <div v-if="!jobsStore.loading && jobsStore.jobs.length > 0" class="jobs-grid-container">
      <div class="jobs-grid">
        <JobCard 
          v-for="job in jobsStore.jobs" 
          :key="job.jobid" 
          :job="job" 
          :grid-mode="true"
          class="job-grid-item"
        />
        <JobApplication />
    <JobDetails />
    <CompanyDetails />
      </div>
    </div>

    
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useJobsStore } from 'src/stores/job-store'
import JobCard from '../Jobs/yashJobs/JobCard.vue'
import CompanyDetails from '../Jobs/yashJobs/CompanyDetails.vue'
import JobDetails from '../Jobs/yashJobs/JobDetails.vue'
import JobApplication from '../Jobs/yashJobs/JobApplication.vue'
import ApplicantStats from './TopSection/ApplicantStats.vue'
import ApplicantSkillStats from 'src/components/ApplicantDashboard/TopSection/ApplicantSkillStats.vue'

const $q = useQuasar()
const jobsStore = useJobsStore()
const router = useRouter()

// Refs
const analyticsRecordsRef = ref(null)
const applicantSkillStatsRef = ref(null)

// State
const isRefreshingAll = ref(false)
let refreshIntervalId = null

// Refresh function
const refreshAllData = async () => {
  if (isRefreshingAll.value) return
  isRefreshingAll.value = true

  console.log('🔄 Starting refresh cycle...')

  const successful = []
  const failed = []

  try {
    // Jobs
    try {
      await jobsStore.fetchRecommendedJobs()
      successful.push('Recommended Jobs')
      console.log('✅ Recommended jobs refreshed')
    } catch (err) {
      failed.push('Recommended Jobs')
      console.error('❌ Error refreshing jobs:', err)
    }

    // Analytics
    if (analyticsRecordsRef.value?.refreshData) {
      try {
        await analyticsRecordsRef.value.refreshData()
        successful.push('Analytics Records')
        console.log('✅ Analytics records refreshed')
      } catch (err) {
        failed.push('Analytics Records')
        console.error('❌ Error refreshing Analytics Records:', err)
      }
    }

    // Skills
    if (applicantSkillStatsRef.value?.refreshData) {
      try {
        await applicantSkillStatsRef.value.refreshData()
        successful.push('Skill Stats')
        console.log('✅ Skill stats refreshed')
      } catch (err) {
        failed.push('Skill Stats')
        console.error('❌ Error refreshing Skill Stats:', err)
      }
    }

    // Notify based on outcome
    if (failed.length === 0) {
      $q.notify({
        color: 'positive',
        message: `All ${successful.length} components refreshed successfully!`,
        icon: 'check_circle',
        position: 'top-right',
        timeout: 3000
      })
      console.log('🎉 Refresh success:', successful)
    } else if (successful.length > 0) {
      console.warn('⚠️ Partial refresh:', { successful, failed })
    } else {
      $q.notify({
        color: 'negative',
        message: 'All refreshes failed',
        icon: 'error',
        position: 'top-right',
        timeout: 4000
      })
      console.error('❌ Refresh failed completely:', failed)
    }
  } finally {
    isRefreshingAll.value = false
  }
}

// Router nav
const goToJobs = () => {
  try {
    router.push('/all-jobs')
    console.log('➡️ Navigated to jobs page')
  } catch (error) {
    console.error('❌ Error navigating to jobs:', error)
    $q.notify({
      color: 'negative',
      message: 'Error navigating to jobs page',
      icon: 'error',
      position: 'top-right',
      timeout: 3000
    })
  }
}

// Expose for external use
defineExpose({
  refreshAllData
})

// Lifecycle
onMounted(async () => {
  try {
    await jobsStore.fetchRecommendedJobs()
    console.log('✅ Initial recommended jobs fetched')
  } catch (error) {
    console.error('❌ Error fetching jobs on mount:', error)
  }

  // Auto-refresh every 5 minutes
  refreshIntervalId = setInterval(refreshAllData, 300000)
  console.log('⏱️ Auto-refresh interval started (5 minutes)')
})

onUnmounted(() => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    console.log('🛑 Auto-refresh interval cleared')
  }
})
</script>

<style scoped>
/* Jobs Grid Layout - Max 4 Columns */
/* Enhanced Jobs Grid Layout - Dynamic Responsive Gaps */
.jobs-grid-container {
  width: 100%;
  padding: 0 clamp(8px, 2vw, 24px); /* Dynamic horizontal padding */
  box-sizing: border-box;
  max-width: none; /* Remove max-width to ensure 100% usage */
  margin: 0;
}

.jobs-grid {
  display: grid;
  gap: clamp(12px, 2.5vw, 32px); /* Dynamic gap based on viewport */
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Auto-fit columns */
}

.job-grid-item {
  height: fit-content;
  min-height: clamp(180px, 25vh, 280px); /* Dynamic height */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
}

.job-grid-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Breakpoint-based Grid Columns with Dynamic Gaps */

/* Extra Large Screens (1600px+) - Up to 5 Columns */
@media (min-width: 1600px) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: clamp(20px, 3vw, 40px);
    max-grid-columns: 5;
  }
}

/* Very Large Screens (1400px - 1599px) - Up to 4 Columns */
@media (max-width: 1599px) and (min-width: 1400px) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: clamp(18px, 2.8vw, 36px);
  }
}

/* Large Screens (1200px - 1399px) - Up to 4 Columns */
@media (max-width: 1399px) and (min-width: 1200px) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(16px, 2.5vw, 32px);
  }
}

/* Medium-Large Screens (992px - 1199px) - Up to 3 Columns */
@media (max-width: 1199px) and (min-width: 992px) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: clamp(15px, 2.2vw, 28px);
  }
}

/* Medium Screens (768px - 991px) - Up to 3 Columns */
@media (max-width: 991px) and (min-width: 768px) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: clamp(14px, 2vw, 24px);
  }
  
  .job-grid-item {
    min-height: clamp(160px, 22vh, 220px);
  }
}

/* Small-Medium Screens (600px - 767px) - Up to 2 Columns */
@media (max-width: 767px) and (min-width: 600px) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(12px, 1.8vw, 20px);
  }
  
  .jobs-grid-container {
    padding: 0 clamp(12px, 2vw, 20px);
  }
  
  .job-grid-item {
    min-height: clamp(150px, 20vh, 200px);
  }
  
  .job-grid-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
}

/* Small Screens (480px - 599px) - 1-2 Columns Flexible */
@media (max-width: 599px) and (min-width: 480px) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: clamp(10px, 1.5vw, 18px);
  }
  
  .jobs-grid-container {
    padding: 0 clamp(10px, 1.5vw, 18px);
  }
  
  .job-grid-item {
    min-height: clamp(140px, 18vh, 180px);
  }
}

/* Extra Small Screens (320px - 479px) - 1 Column */
@media (max-width: 479px) and (min-width: 320px) {
  .jobs-grid {
    grid-template-columns: 1fr;
    gap: clamp(8px, 1.2vw, 16px);
  }
  
  .jobs-grid-container {
    padding: 0 clamp(8px, 1.2vw, 16px);
  }
  
  .job-grid-item {
    min-height: clamp(130px, 16vh, 170px);
    max-width: none; /* Ensure full width usage */
  }
  
  .job-grid-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
}

/* Very Small Screens (below 320px) - 1 Column */
@media (max-width: 319px) {
  .jobs-grid {
    grid-template-columns: 1fr;
    gap: clamp(6px, 1vw, 12px);
  }
  
  .jobs-grid-container {
    padding: 0 clamp(6px, 1vw, 12px);
  }
  
  .job-grid-item {
    min-height: clamp(120px, 15vh, 160px);
  }
}

/* Advanced Responsive Features */

/* Container Queries (for modern browsers) */
@container (min-width: 1200px) {
  .jobs-grid {
    gap: clamp(20px, 2.5cqw, 40px);
  }
}

@container (max-width: 800px) {
  .jobs-grid {
    gap: clamp(12px, 2cqw, 24px);
  }
}

/* Aspect Ratio Control for Ultra-Wide Screens */
@media (min-aspect-ratio: 21/9) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(24px, 3vw, 48px);
  }
}

/* Portrait Mobile Optimization */
@media (orientation: portrait) and (max-width: 768px) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(calc(50vw - 20px), 1fr));
    gap: clamp(8px, 1.5vw, 16px);
  }
}

/* Landscape Mobile Optimization */
@media (orientation: landscape) and (max-height: 600px) {
  .jobs-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: clamp(10px, 1.8vw, 20px);
  }
  
  .job-grid-item {
    min-height: clamp(120px, 15vh, 160px);
  }
}

/* High DPI Screens */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .jobs-grid {
    gap: clamp(14px, 2.2vw, 28px);
  }
}

/* Dynamic Grid Density Classes */
.jobs-grid--auto-dense {
  grid-auto-flow: row dense;
}

.jobs-grid--fluid {
  grid-template-columns: repeat(auto-fill, minmax(clamp(250px, 30vw, 400px), 1fr));
}

/* Responsive Typography Scaling */
@media (max-width: 768px) {
  .job-grid-item {
    font-size: clamp(0.875rem, 2vw, 1rem);
  }
}

/* Accessibility and Performance */
@media (prefers-reduced-motion: reduce) {
  .job-grid-item {
    transition: none;
  }
  
  .job-grid-item:hover {
    transform: none;
  }
}

/* Focus and Interaction States */
.job-grid-item:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: clamp(2px, 0.5vw, 4px);
}

/* Print Optimization */
@media print {
  .jobs-grid-container {
    padding: 0;
  }
  
  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .job-grid-item {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
  }
}

/* Fallback for older browsers */
@supports not (display: grid) {
  .jobs-grid {
    display: flex;
    flex-wrap: wrap;
    margin: calc(-1 * clamp(6px, 1.5vw, 16px));
  }
  
  .job-grid-item {
    flex: 1 1 clamp(250px, 30vw, 400px);
    margin: clamp(6px, 1.5vw, 16px);
    min-width: 0;
  }
}

/* Enhanced Utility Classes */
.jobs-grid--extra-dense {
  gap: clamp(6px, 1vw, 12px);
}

.jobs-grid--extra-sparse {
  gap: clamp(24px, 4vw, 56px);
}

.jobs-grid--uniform-height .job-grid-item {
  height: clamp(200px, 25vh, 300px);
}

/* Responsive Grid Debugging (remove in production) */
.jobs-grid[data-debug="true"]::before {
  content: "Columns: " attr(data-columns) " | Gap: " attr(data-gap);
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 4px;
  z-index: 9999;
}
</style>