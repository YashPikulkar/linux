<template>
  <div class="q-pa-md col items-center justify-between">
    <!-- Child Components with refs for refresh -->
    <ApplicantStats ref="analyticsRecordsRef" />
    <ApplicantSkillStats ref="applicantSkillStatsRef" />

    <!-- Recommended Jobs Header -->
    <div class="row items-center justify-between q-mb-md">
      <h2 class="text-h4 text-primary">Recommended Jobs</h2>
      <q-btn label="View All" flat dense no-caps class="text-primary" @click="goToJobs" />
    </div>

    <!-- ✅ JobList fetches its own recommended jobs -->
    <!-- Pass gridMode here -->
    <JobList list-type="recommended" :grid-mode="true" />

    <!-- Keep Job Details & Application mounted globally -->
    <JobApplication />
    <JobDetails />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, QSpinner } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import JobList from 'src/components/Jobs/JobList.vue'
import JobDetails from 'src/components/Jobs/JobDetails.vue'
import JobApplication from 'src/components/Jobs/JobApplication.vue'
import ApplicantStats from 'src/components/ApplicantDashboard/ApplicantStats.vue'
import ApplicantSkillStats from 'src/components/ApplicantDashboard/ApplicantSkillStats.vue'

const $q = useQuasar()
const router = useRouter()
const userStore = useUserStore()
const token = userStore.token || sessionStorage.getItem('token')

// Refs
const analyticsRecordsRef = ref(null)
const applicantSkillStatsRef = ref(null)

// State
const isRefreshingAll = ref(false)
let refreshIntervalId = null

// 🔄 Refresh function (no job refresh here anymore)
const refreshAllData = async () => {
  if (isRefreshingAll.value) return
  isRefreshingAll.value = true

  console.log('🔄 Starting refresh cycle...')

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
        timeout: 3000,
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
        timeout: 4000,
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
    router.push({ name: 'Jobs' }) // navigate to jobs page
    console.log('➡️ Navigated to Applicant Jobs page')
  } catch (error) {
    console.error('❌ Error navigating to jobs:', error)
    $q.notify({
      color: 'negative',
      message: 'Error navigating to jobs page',
      icon: 'error',
      position: 'top-right',
      timeout: 3000,
    })
  }
}

// Expose refresh method
defineExpose({
  refreshAllData,
})

// Lifecycle
onMounted(async () => {
  console.log('🚀 Parent mounted, starting first load...')

  // Token check
  if (!token) {
    $q.notify({
      type: 'warning',
      message: 'Please log in to view analytics',
      position: 'top-right',
      actions: [
        {
          label: 'Login',
          color: 'white',
          handler: () => router.push('/login')
        }
      ]
    })
    return
  }

  // First refresh immediately (before showing children)
    $q.notify({
  spinner: QSpinner,
  spinnerColor: 'white',
  color: 'info',
  message: 'Loading analytics data...',
  position: 'top-right',
  timeout: 1000
})

  await refreshAllData()

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
