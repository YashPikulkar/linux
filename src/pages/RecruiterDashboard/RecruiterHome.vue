<template>
  <!-- Child Components with refs for refresh -->
  <RecruiterStats ref="analyticsRecordsRef" />
  <RecruiterSkillStats ref="recruiterSkillStatsRef" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import RecruiterStats from 'src/components/RecruiterDashboard/RecruiterStats.vue'
import RecruiterSkillStats from 'src/components/RecruiterDashboard/RecruiterSkillStats.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'

const userStore = useUserStore()
const token = userStore.token || sessionStorage.getItem('token')
const router = useRouter()
const $q = useQuasar()

// Refs for children
const analyticsRecordsRef = ref(null)
const recruiterSkillStatsRef = ref(null)

// Global refresh state
const isRefreshingAll = ref(false)
let refreshIntervalId = null

// Refresh function
const refreshAllData = async () => {
  if (isRefreshingAll.value) return
  isRefreshingAll.value = true

  console.log('🔄 Starting recruiter dashboard refresh cycle...')
  const successful = []
  const failed = []

  try {
    await nextTick()

    // Analytics refresh
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

    // Skills refresh
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

    // Notify outcome
    if (failed.length === 0 && successful.length > 0) {
      $q.notify({
        color: 'positive',
        message: `All components refreshed successfully!`,
        icon: 'check_circle',
        position: 'top-right',
        timeout: 3000
      })
    } else if (successful.length > 0) {
      $q.notify({
        color: 'warning',
        message: `${successful.length} components refreshed, ${failed.length} failed`,
        icon: 'warning',
        position: 'top-right',
        timeout: 4000
      })
    } else {
      $q.notify({
        color: 'negative',
        message: 'All refreshes failed',
        icon: 'error',
        position: 'top-right',
        timeout: 4000
      })
    }
  } catch (err) {
    console.error('❌ Unexpected error during refresh:', err)
    $q.notify({
      color: 'negative',
      message: 'Unexpected error during refresh',
      icon: 'error',
      position: 'top-right',
      timeout: 4000
    })
  } finally {
    isRefreshingAll.value = false
  }
}

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
    color: 'info',
    message: 'Loading analytics data...',
    icon: 'hourglass_empty',
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