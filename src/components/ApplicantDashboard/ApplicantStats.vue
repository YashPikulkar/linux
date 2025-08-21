<template>
  <div class="stats-section q-px-lg">
    <div class="row q-gutter-md">
      <div class="col" v-for="(stat, index) in statsDisplay" :key="index">
        <q-card class="stat-card-enhanced">
          <q-card-section class="text-center">
            <div class="stat-icon-wrapper q-mb-sm">
              <q-icon :name="stat.icon" size="32px" :color="stat.color" />
            </div>

            <!-- Loading skeleton or actual value -->
            <div v-if="isLoadingStats" class="text-h3 stat-value-enhanced">
              <q-skeleton type="text" width="60px" height="40px" />
            </div>
            <div v-else class="text-h3 stat-value-enhanced" :class="`text-${stat.color}`">
              {{ stat.value }}
            </div>

            <div class="text-body2 stat-label-enhanced">{{ stat.label }}</div>

            <!-- Enhanced change display -->
            <div
              class="text-caption text-grey-6 q-mt-xs"
              v-if="stat.change !== undefined && !isLoadingStats"
            >
              <q-icon
                :name="
                  stat.change > 0
                    ? 'trending_up'
                    : stat.change < 0
                      ? 'trending_down'
                      : 'trending_flat'
                "
                :color="stat.change > 0 ? 'positive' : stat.change < 0 ? 'negative' : 'grey'"
                size="16px"
              />
              <span v-if="stat.change !== 0">{{ Math.abs(stat.change) }}% from last month</span>
              <span v-else>No change from last month</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'

// Initialize stores
const userStore = useUserStore()
const $q = useQuasar()

// Get user token - consistent with first code pattern
const token = userStore.token || sessionStorage.getItem('token')

const isLoadingStats = ref(false)

// Application statistics
const applicationStats = ref({
  totalApplications: 0,
  applicationsThisMonth: 0,
  totalCompaniesApplied: 0,
  offersReceived: 0,
  totalApplicationsChange: 0,
  applicationsThisMonthChange: 0,
  totalCompaniesChange: 0,
  offersReceivedChange: 0,
})

// Fetch user application statistics
const fetchApplicationStats = async () => {
  isLoadingStats.value = true
  try {
    // ✅ Proper log outside headers
    console.log(
      'Fetching application stats with token:',
      token ? `Token available: ${token}` : 'No token',
    )

    const response = await fetch('http://localhost:3000/application/getUserStats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // ✅ correct header
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch application stats: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()
    console.log('Application stats API raw response:', data)

    // ✅ handle nested payloads like { data: {...} }
    const stats = data.data || data

    applicationStats.value = {
      totalApplications: stats.totalApplications || 0,
      applicationsThisMonth: stats.applicationsThisMonth || 0,
      totalCompaniesApplied: stats.totalCompaniesApplied || 0,
      offersReceived: stats.offersReceived || 0,
      totalApplicationsChange: stats.totalApplicationsChange || 0,
      applicationsThisMonthChange: stats.applicationsThisMonthChange || 0,
      totalCompaniesChange: stats.totalCompaniesChange || 0,
      offersReceivedChange: stats.offersReceivedChange || 0,
    }

    // ✅ snapshot log so you see real values (not Vue Proxy)
    console.log('Application stats updated:', JSON.parse(JSON.stringify(applicationStats.value)))
  } catch (error) {
    console.error('Error fetching application stats:', error)

    // ✅ Fallback/mock data
    applicationStats.value = {
      totalApplications: 25,
      applicationsThisMonth: 8,
      totalCompaniesApplied: 15,
      offersReceived: 3,
      totalApplicationsChange: 12,
      applicationsThisMonthChange: 25,
      totalCompaniesChange: 8,
      offersReceivedChange: 50,
    }

    $q.notify({
      color: 'warning',
      message: 'Using sample data - unable to fetch live statistics',
      icon: 'warning',
      position: 'top-right',
      timeout: 4000,
    })
  } finally {
    isLoadingStats.value = false
  }
}

// Computed property for stats display - With change tracking
const statsDisplay = computed(() => {
  return [
    {
      value: applicationStats.value.totalApplications || 0,
      label: 'Total Applications',
      icon: 'work',
      color: 'primary',
      change: applicationStats.value.totalApplicationsChange || 0,
    },
    {
      value: applicationStats.value.applicationsThisMonth || 0,
      label: 'Applications This Month',
      icon: 'calendar_today',
      color: 'positive',
      change: applicationStats.value.applicationsThisMonthChange || 0,
    },
    {
      value: applicationStats.value.totalCompaniesApplied || 0,
      label: 'Total Companies Applied',
      icon: 'business',
      color: 'warning',
      change: applicationStats.value.totalCompaniesChange || 0,
    },
    {
      value: applicationStats.value.offersReceived || 0,
      label: 'Offers Received',
      icon: 'card_giftcard',
      color: 'info',
      change: applicationStats.value.offersReceivedChange || 0,
    },
  ]
})

const refreshData = async () => {
  try {
    $q.notify({
      color: 'info',
      message: 'Refreshing analytics data...',
      icon: 'refresh',
      position: 'top-right',
      timeout: 1000,
    })

    await Promise.all([fetchApplicationStats()])

    console.log('All data refreshed successfully')

    $q.notify({
      color: 'positive',
      message: 'Analytics data refreshed successfully',
      icon: 'check_circle',
      position: 'top-right',
      timeout: 2000,
    })

    return Promise.resolve()
  } catch (error) {
    console.error('Error refreshing data:', error)

    $q.notify({
      color: 'negative',
      message: 'Error refreshing analytics data',
      icon: 'error',
      position: 'top-right',
      timeout: 3000,
    })

    throw error
  }
}

// Lifecycle hooks
onMounted(async () => {
  if (!token) {
    $q.notify({
      type: 'warning',
      message: 'Please log in to view analytics',
      position: 'top-right',
      actions: [
        {
          label: 'Login',
          color: 'white',
          handler: () => {
            console.log('Redirect to login')
          },
        },
      ],
    })
    return
  }

  $q.notify({
    color: 'info',
    message: 'Loading analytics data...',
    icon: 'hourglass_empty',
    position: 'top-right',
    timeout: 1000,
  })

  await fetchApplicationStats()

  console.log('Analytics component initialized successfully')
})

onBeforeUnmount(() => {
  console.log('AnalyticsRecords unmounting, cleaning up...')

  // Clean up chart instance
  pieChartInstance = destroyChart(pieChartInstance)
  isChartBeingCreated.value = false
})
// Expose methods to parent component
defineExpose({
  refreshData,
  fetchApplicationStats,
})
</script>

<style scoped>
/* Enhanced Stats Cards */
.stats-section {
  background: #f8fafc;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.stat-card-enhanced {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  min-height: 160px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.stat-card-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.stat-card-enhanced:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.stat-value-enhanced {
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1;
  margin: 0.5rem 0;
}

.stat-label-enhanced {
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Content Section */
.content-section {
  background: white;
}

/* Chart Cards */
.chart-card-enhanced {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
}

.chart-card-enhanced:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.chart-header {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

/* Pie Chart Container */
.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  position: relative;
}

.pie-chart-container canvas {
  max-width: 220px !important;
  max-height: 220px !important;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 220px;
  color: #64748b;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-text {
  font-size: 12px;
  color: #666;
}

.pie-chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 220px;
  margin: 0 auto;
}

.pie-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.total-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.total-label {
  font-size: 0.75rem;
  color: #666;
  margin-top: 2px;
}

/* Enhanced Table */
.table-card-enhanced {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
}

.table-header {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
}

.enhanced-table {
  border: none;
}

.enhanced-table >>> .q-table__top {
  background: #f8fafc;
}

.enhanced-table >>> .q-table thead th {
  background: #f1f5f9;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 12px 8px;
  border-bottom: 2px solid #e2e8f0;
}

.enhanced-table >>> .q-table tbody tr {
  transition: background-color 0.2s;
}

.enhanced-table >>> .q-table tbody tr:hover {
  background: #f8fafc;
}

.enhanced-table >>> .q-table tbody td {
  padding: 10px 8px;
  border-bottom: 1px solid #f1f5f9;
}

.status-badge {
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.company-cell {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.mobile-application-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-application-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stat-value-enhanced {
    font-size: 2rem;
  }

  .pie-chart-container canvas {
    max-width: 200px !important;
    max-height: 200px !important;
  }
}

@media (max-width: 768px) {
  .stat-card-enhanced {
    min-height: 140px;
  }

  .stat-value-enhanced {
    font-size: 1.8rem;
  }

  .pie-chart-container {
    padding: 5px;
  }

  .pie-chart-container canvas {
    max-width: 180px !important;
    max-height: 180px !important;
  }
}

@media (max-width: 599px) {
  .content-section .row {
    flex-direction: column;
  }

  .stat-card-enhanced {
    min-height: 120px;
  }

  .stat-value-enhanced {
    font-size: 1.5rem;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .pie-chart-container canvas {
    max-width: 150px !important;
    max-height: 150px !important;
  }
}
</style>
