<template>
  <!-- Job Posting Analytics Header -->
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
  </div>

  <!-- Child Components with refs for refresh -->
  <AnalyticsRecords ref="analyticsRecordsRef" />
  <RecruiterSkillStats ref="recruiterSkillStatsRef" />
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import AnalyticsRecords from 'RecruiterStats.vue'
import RecruiterSkillStats from './Features/RecruiterSkillStats.vue'

const $q = useQuasar()

// Refs for child components
const analyticsRecordsRef = ref(null)
const recruiterSkillStatsRef = ref(null)

// Global refresh state
const isRefreshingAll = ref(false)

// Enhanced refresh function with better error handling and synchronization
const refreshAllData = async () => {
  if (isRefreshingAll.value) return // Prevent multiple simultaneous refreshes
  
  isRefreshingAll.value = true
  
  // Show loading notification
  const loadingNotify = $q.notify({
    color: 'info',
    message: 'Refreshing all components...',
    icon: 'refresh',
    position: 'top-right',
    timeout: 0, // Don't auto-dismiss
    spinner: true
  })
  
  try {
    // Create array of refresh promises with component tracking
    const refreshTasks = []
    const componentNames = []
    
    // Add AnalyticsRecords refresh
    if (analyticsRecordsRef.value?.refreshData) {
      refreshTasks.push({
        name: 'Analytics Records',
        promise: analyticsRecordsRef.value.refreshData(),
        ref: analyticsRecordsRef
      })
    }
    
    // Add RecruiterSkillStats refresh
    if (recruiterSkillStatsRef.value?.refreshData) {
      refreshTasks.push({
        name: 'Skill Stats',
        promise: recruiterSkillStatsRef.value.refreshData(),
        ref: recruiterSkillStatsRef
      })
    }
    
    console.log('Starting refresh for components:', refreshTasks.map(t => t.name))
    
    if (refreshTasks.length === 0) {
      loadingNotify()
      $q.notify({
        color: 'warning',
        message: 'No components available for refresh',
        icon: 'warning',
        position: 'top-right',
        timeout: 3000
      })
      return
    }
    
    // Execute all refresh operations in parallel
    const results = await Promise.allSettled(refreshTasks.map(task => task.promise))
    
    // Dismiss loading notification
    loadingNotify()
    
    // Analyze results
    const successful = []
    const failed = []
    
    results.forEach((result, index) => {
      const taskName = refreshTasks[index].name
      if (result.status === 'fulfilled') {
        successful.push(taskName)
      } else {
        failed.push({ name: taskName, error: result.reason })
        console.error(`Error refreshing ${taskName}:`, result.reason)
      }
    })
    
    // Show result notifications
    if (failed.length === 0) {
      // All successful
      $q.notify({
        color: 'positive',
        message: `All ${successful.length} components refreshed successfully!`,
        icon: 'check_circle',
        position: 'top-right',
        timeout: 3000
      })
      console.log('All components refreshed successfully:', successful)
    } else if (successful.length > 0) {
      // Partial success
      $q.notify({
        color: 'warning',
        message: `${successful.length} components refreshed, ${failed.length} failed`,
        icon: 'warning',
        position: 'top-right',
        timeout: 4000
      })
      console.warn('Partial refresh success:', { successful, failed })
    } else {
      // All failed
      $q.notify({
        color: 'negative',
        message: 'Failed to refresh components',
        icon: 'error',
        position: 'top-right',
        timeout: 4000
      })
      console.error('All components failed to refresh:', failed)
    }
    
  } catch (error) {
    // Dismiss loading notification if still active
    loadingNotify()
    
    console.error('Unexpected error in refreshAllData:', error)
    $q.notify({
      color: 'negative',
      message: 'Unexpected error occurred while refreshing',
      icon: 'error',
      position: 'top-right',
      timeout: 4000
    })
  } finally {
    isRefreshingAll.value = false
  }
}

// Expose refresh method for external use
defineExpose({
  refreshAllData
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