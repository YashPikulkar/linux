<template>
  <!-- Job Posting Analytics Header 
  <div class="analytics-header q-pa-lg">
    <div class="row justify-between items-center q-pa-md">
      <div>
        <h4 class="text-h5 q-ma-none text-weight-bold">Job Posting Analytics</h4>
        <p class="text-subtitle2 text-grey-7 q-mt-sm">
          Track and monitor your job posting performance
        </p>
      </div>
      <div class="header-controls row items-center q-gutter-md">
        <q-btn
          round
          color="white"
          text-color="primary"
          icon="refresh"
          @click="refreshAllData"
          :loading="isRefreshingAll"
          :disable="isRefreshingAll"
          size="md"
          class="refresh-all-btn"
        >
          <q-tooltip>Refresh All Data</q-tooltip>
        </q-btn>
      </div>
   </div>
  </div>-->

  <!-- Child Components with refs for refresh -->
  <AnalyticsRecords ref="analyticsRecordsRef" />
  <RecruiterSkillStats ref="recruiterSkillStatsRef" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import AnalyticsRecords from './RecruiterStats.vue'
import RecruiterSkillStats from './Features/RecruiterSkillStats.vue'

const $q = useQuasar()

// Refs for child components
const analyticsRecordsRef = ref(null)
const recruiterSkillStatsRef = ref(null)

// Global refresh state
const isRefreshingAll = ref(false)
let refreshIntervalId = null

// ✅ Working refresh function with notify enabled
const refreshAllData = async () => {
  if (isRefreshingAll.value) return // prevent overlap
  isRefreshingAll.value = true

  console.log('🔄 Starting recruiter dashboard refresh cycle...')

  const successful = []
  const failed = []

  try {
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
    if (recruiterSkillStatsRef.value?.refreshData) {
      try {
        await recruiterSkillStatsRef.value.refreshData()
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
        message: `All components refreshed successfully!`,
        icon: 'check_circle',
        position: 'top-right',
        timeout: 3000
      })
      console.log('🎉 Refresh success:', successful)
    } else if (successful.length > 0) {
      $q.notify({
        color: 'warning',
        message: `${successful.length} components refreshed, ${failed.length} failed`,
        icon: 'warning',
        position: 'top-right',
        timeout: 4000
      })
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

// Expose for parent
defineExpose({ refreshAllData })

// Lifecycle
onMounted(() => {
  // Run once immediately
  refreshAllData()

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
/* Header Styling */
.analytics-header {
position: sticky;
top: 0;
z-index: 100;
  background: linear-gradient(135deg, black 0%, grey 100%);
  color: white;
  margin: -16px -16px 0 -16px;
}

.header-controls {
  align-items: center;
}

.refresh-all-btn {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.refresh-all-btn:hover:not(.q-btn--disable) {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.refresh-all-btn:active:not(.q-btn--disable) {
  transform: translateY(0);
}

/* Loading state styling */
.refresh-all-btn.q-btn--loading {
  pointer-events: none;
}

.refresh-all-btn.q-btn--disable {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .analytics-header {
    text-align: center;
  }

  .analytics-header .row {
    flex-direction: column;
    gap: 1rem;
  }

  .header-controls {
    justify-content: center;
  }
}
</style>