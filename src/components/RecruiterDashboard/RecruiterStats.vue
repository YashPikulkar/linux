<template>
  <div class="analytics-records-container">
    <!-- Stats Cards Section -->
    <div class="stats-section q-pa-lg">
      <div class="row q-gutter-md">
        <div class="col" v-for="(stat, index) in jobAnalyticsStats" :key="index">
          <q-card class="stat-card-enhanced">
            <q-card-section class="text-center">
              <div class="stat-icon-wrapper q-mb-sm">
                <q-icon :name="stat.icon" size="32px" :color="stat.color" />
                <!-- Optional: Add a small globe icon for global stats -->
                <q-icon
                  v-if="stat.isGlobal"
                  name="public"
                  size="12px"
                  color="grey-5"
                  class="absolute-top-right q-ma-xs"
                >
                  <q-tooltip>Platform-wide metric</q-tooltip>
                </q-icon>
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
                <template v-if="stat.isGlobal">
                  <!-- For global stats, show platform growth -->
                  <q-icon name="trending_up" color="positive" size="16px" />
                  {{ Math.abs(stat.change) }}% platform growth
                </template>
                <template v-else>
                  <!-- For personal stats, show month-over-month change -->
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
                </template>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Analytics Charts and Table Layout -->
  <div class="content-section q-pa-lg">
    <div class="row q-col-gutter-lg">
      <!-- Application Status Pie Chart - Reduced Size -->
      <div class="col-12 col-md-4">
        <q-card class="chart-card-enhanced">
          <q-card-section>
            <div class="chart-header">
              <div class="text-h6">Application Status</div>
              <div class="text-caption text-grey-6">Current applications breakdown</div>
            </div>
            <div class="pie-chart-container">
              <div class="pie-chart-wrapper">
                <!-- Chart is always rendered, but may be hidden during loading -->
                <canvas 
                  ref="pieChartCanvas" 
                  :style="{ visibility: isLoadingPieChart ? 'hidden' : 'visible' }"
                ></canvas>
                <!-- Loading overlay -->
                <div v-if="isLoadingPieChart" class="loading-overlay">
                  <q-spinner-dots size="50px" color="primary" />
                  <div class="text-caption q-mt-sm">Loading application status...</div>
                </div>
                <!-- Total count in center of pie chart -->
                <div 
                  v-if="!isLoadingPieChart && totalApplications > 0" 
                  class="pie-center-text"
                >
            
                </div>
              </div>
              <!-- Custom Legend -->
              <div 
                class="pie-legend q-mt-md" 
                
              >
                <div v-for="(label, index) in pieChartData.labels" :key="label" class="legend-item">
                  <div
                    class="legend-color"
                    :style="{ backgroundColor: pieChartData.colors[index] }"
                  ></div>
                  <span class="legend-text">{{ label }}: {{ pieChartData.counts[index] }}</span>
                </div>
              </div>
              <!-- No data message -->
              <div 
                v-if="!isLoadingPieChart && totalApplications === 0" 
                class="no-data-message"
              >
                <q-icon name="info" size="24px" color="grey-5" />
                <div class="text-caption text-grey-6 q-mt-sm">No application data available</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

        <!-- Top Performing Job Posts - Takes More Space -->
        <div class="col-12 col-md-8">
          <q-card class="table-card-enhanced">
            <q-card-section>
              <div class="table-header q-mb-md">
                <div class="row justify-between items-center">
                  <div>
                    <div class="text-h6">Top Performing Job Posts</div>
                    <div class="text-caption text-grey-6">
                      Live job market data with highest engagement
                    </div>
                  </div>
                  <q-btn
                    flat
                    round
                    icon="refresh"
                    @click="refreshJobData"
                    :loading="isLoadingJobs"
                    color="primary"
                    size="sm"
                  >
                    <q-tooltip>Refresh Job Data</q-tooltip>
                  </q-btn>
                </div>
              </div>

              <q-table
                flat
                bordered
                :rows="topJobPosts"
                :columns="jobPostColumns"
                row-key="title"
                class="enhanced-table"
                :grid="$q.screen.xs"
                :rows-per-page-options="[5, 10, 15]"
                :pagination="{ rowsPerPage: 5 }"
                :loading="isLoadingJobs"
              >
                <!-- Status Badge Template -->
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-badge
                      :color="getStatusColor(props.value)"
                      :label="props.value"
                      class="status-badge"
                    />
                  </q-td>
                </template>

                <!-- Rate with Progress Bar -->
                <template v-slot:body-cell-rate="props">
                  <q-td :props="props">
                    <div class="rate-cell">
                      <span class="rate-text">{{ props.value }}%</span>
                      <q-linear-progress
                        :value="props.value / 100"
                        size="4px"
                        :color="getRateColor(props.value)"
                        class="rate-progress q-mt-xs"
                      />
                    </div>
                  </q-td>
                </template>

                <!-- Company Column -->
                <template v-slot:body-cell-company="props">
                  <q-td :props="props">
                    <div class="company-cell">
                      <q-avatar size="24px" color="primary" text-color="white" class="q-mr-sm">
                        {{ props.value.charAt(0) }}
                      </q-avatar>
                      <span>{{ props.value }}</span>
                    </div>
                  </q-td>
                </template>

                <!-- Mobile Grid Template -->
                <template v-slot:item="props" v-if="$q.screen.xs">
                  <div class="col-12">
                    <q-card class="mobile-job-card q-ma-sm">
                      <q-card-section>
                        <div class="text-weight-bold text-primary">{{ props.row.title }}</div>
                        <div class="text-caption text-grey-7 q-mb-sm">{{ props.row.company }}</div>
                        <div class="row justify-between q-mt-sm">
                          <div class="col">
                            <div class="text-caption text-grey-7">Applicants</div>
                            <div class="text-h6">{{ props.row.applicants }}</div>
                          </div>
                          <div class="col">
                            <div class="text-caption text-grey-7">Success Rate</div>
                            <div class="text-h6">{{ props.row.rate }}%</div>
                          </div>
                          <div class="col">
                            <q-badge
                              :color="getStatusColor(props.row.status)"
                              :label="props.row.status"
                            />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'

const userStore = useUserStore()
const token = userStore.token || sessionStorage.getItem('token')
const $q = useQuasar()

// Chart refs
const pieChartCanvas = ref(null)

// Chart instances
let pieChartInstance = null

// Import Chart.js library
import Chart from 'chart.js/auto'

// Job posts with API integration
const topJobPosts = ref([])
const isLoadingJobs = ref(false)

// Loading states - separate for different sections
const isLoadingStats = ref(false)
const isLoadingPieChart = ref(false)

// Table columns
const jobPostColumns = [
  {
    name: 'title',
    required: true,
    label: 'TITLE',
    align: 'left',
    field: 'title',
    sortable: true,
  },
  {
    name: 'company',
    label: 'COMPANY',
    align: 'left',
    field: 'company',
    sortable: true,
  },
  {
    name: 'applicants',
    label: 'APPLICANTS',
    align: 'center',
    field: 'applicants',
    sortable: true,
  },
  {
    name: 'rate',
    label: 'RATE',
    align: 'center',
    field: 'rate',
    sortable: true,
  },
  {
    name: 'status',
    label: 'STATUS',
    align: 'center',
    field: 'status',
  },
  {
    name: 'posted',
    label: 'POSTED',
    align: 'center',
    field: 'posted',
    sortable: true,
  },
]

// API Integration for Job Posts
const fetchMockJobData = async () => {
  isLoadingJobs.value = true
  try {
    // Get user data for company names
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const users = await response.json()

    const jobTitles = [
      'Senior Frontend Developer',
      'Backend Engineer',
      'Full Stack Developer',
      'DevOps Engineer',
      'UI/UX Designer',
      'Product Manager',
      'Data Scientist',
      'Software Engineer',
      'Mobile Developer',
      'Cloud Architect',
      'Machine Learning Engineer',
      'QA Engineer',
    ]

    const statuses = ['Open', 'Closed', 'Interviewing']

    topJobPosts.value = jobTitles
      .slice(0, 8)
      .map((title, index) => ({
        title,
        company: users[index]?.company?.name || `Tech Corp ${index + 1}`,
        applicants: Math.floor(Math.random() * 200) + 80,
        rate: Math.floor(Math.random() * 50) + 25,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        posted: new Date(
          2025 - Math.floor(Math.random() * 2),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        )
          .toISOString()
          .split('T')[0],
      }))
      .sort((a, b) => b.applicants - a.applicants)
  } catch (error) {
    console.error('Error fetching mock data:', error)
    // Fallback to static data
    topJobPosts.value = generateFallbackData()
  } finally {
    isLoadingJobs.value = false
  }
}

const generateFallbackData = () => {
  const fallbackJobs = [
    'Senior React Developer',
    'Node.js Engineer',
    'Python Developer',
    'DevOps Specialist',
    'UX Designer',
    'Product Manager',
    'Full Stack Developer',
    'Mobile Developer',
  ]

  return fallbackJobs.map((title, index) => ({
    title,
    company: `Company ${index + 1}`,
    applicants: Math.floor(Math.random() * 150) + 70,
    rate: Math.floor(Math.random() * 40) + 30,
    status: ['Open', 'Interviewing'][Math.floor(Math.random() * 2)],
    posted: new Date(2025, Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split('T')[0],
  }))
}

const getStatusColor = (status) => {
  const colors = {
    Open: 'positive',
    Closed: 'grey',
    Interviewing: 'warning',
    Pending: 'info',
  }
  return colors[status] || 'grey'
}

const getRateColor = (rate) => {
  if (rate >= 60) return 'positive'
  if (rate >= 40) return 'warning'
  return 'negative'
}

// Pie chart data
const piestats = ref({
  pending: 0,
  accepted: 0,
  rejected: 0,
})

// Fetch pie chart data
const fetchPie = async () => {
  console.log('Fetching pie chart data...')
  
  try {
    const response = await fetch('http://localhost:3000/jobs/PieChart', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      piestats.value = {
        pending: data.pending || 0,
        accepted: data.accepted || 0,
        rejected: data.rejected || 0,
      }
      console.log('Updated pie stats:', piestats.value)
    } else {
      console.error('Failed to fetch pie chart data:', response.status)
      // Use fallback data
      piestats.value = {
        pending: 5,
        accepted: 8,
        rejected: 3,
      }
    }
  } catch (error) {
    console.error('Error fetching pie chart data:', error)
    // Use fallback data
    piestats.value = {
      pending: 5,
      accepted: 8,
      rejected: 3,
    }
  }
}

// Computed properties
const pieChartData = computed(() => {
  const pending = piestats.value.pending || 0
  const accepted = piestats.value.accepted || 0
  const rejected = piestats.value.rejected || 0

  return {
    labels: ['Pending', 'Accepted', 'Rejected'],
    counts: [pending, accepted, rejected],
    colors: ['#FF9800', '#4CAF50', '#F44336'],
  }
})

const totalApplications = computed(() => {
  return pieChartData.value.counts.reduce((a, b) => a + b, 0)
})

// API Stats
const apiStats = ref({
  total_jobs: 0,
  jobs_this_month: 0,
  total_recruiters: 0,
  active_jobs: 0,
  jobs_change: 0,
  jobs_this_month_change: 0,
  platform_growth: 0,
  active_jobs_change: 0,
})

const fetchJobStats = async () => {
  console.log('Fetching job stats...')
  
  try {
    const response = await fetch('http://localhost:3000/jobs/getTotalJobsByRecruiter', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      apiStats.value = data.stats || {}
      console.log('Updated stats:', apiStats.value)
    } else {
      console.error('Failed to fetch job stats:', response.status)
      // Use fallback data
      apiStats.value = {
        total_jobs: 15,
        jobs_this_month: 5,
        total_recruiters: 42,
        active_jobs: 8,
        jobs_change: 12,
        jobs_this_month_change: 20,
        platform_growth: 15,
        active_jobs_change: 8,
      }
    }
  } catch (error) {
    console.error('Error fetching job stats:', error)
    // Use fallback data
    apiStats.value = {
      total_jobs: 15,
      jobs_this_month: 5,
      total_recruiters: 42,
      active_jobs: 8,
      jobs_change: 12,
      jobs_this_month_change: 20,
      platform_growth: 15,
      active_jobs_change: 8,
    }
  }
}

const jobAnalyticsStats = computed(() => {
  return [
    {
      value: apiStats.value.total_jobs || 0,
      label: 'Total Job Posts',
      icon: 'work',
      color: 'primary',
      change: apiStats.value.jobs_change || 0,
    },
    {
      value: apiStats.value.jobs_this_month || 0,
      label: 'Jobs This Month',
      icon: 'calendar_today',
      color: 'positive',
      change: apiStats.value.jobs_this_month_change || 0,
    },
    {
      value: apiStats.value.total_recruiters || 0,
      label: 'Platform Recruiters',
      icon: 'people',
      color: 'warning',
      change: apiStats.value.platform_growth || 0,
      isGlobal: true,
    },
    {
      value: apiStats.value.active_jobs || 0,
      label: 'Active Jobs',
      icon: 'play_circle',
      color: 'info',
      change: apiStats.value.active_jobs_change || 0,
    },
  ]
})

// Individual refresh functions
const refreshJobData = async () => {
  try {
    await fetchMockJobData()
    $q.notify({
      color: 'positive',
      message: 'Job data refreshed successfully',
      icon: 'check_circle',
      position: 'top-right',
      timeout: 2000
    })
  } catch (error) {
    console.error('Error refreshing job data:', error)
    $q.notify({
      color: 'negative',
      message: 'Error refreshing job data',
      icon: 'error',
      position: 'top-right',
      timeout: 3000
    })
  }
}

// Set chart size
function setChartSize() {
  if (pieChartCanvas.value) {
    pieChartCanvas.value.width = 220
    pieChartCanvas.value.height = 220
    pieChartCanvas.value.style.width = '220px'
    pieChartCanvas.value.style.height = '220px'
  }
}

// Chart destruction helper
function destroyChart(instance) {
  if (instance && typeof instance.destroy === 'function') {
    try {
      instance.destroy()
    } catch (error) {
      console.warn('Error destroying chart:', error)
    }
  }
  return null
}

// Improved Chart.js Pie Chart creation function
function createPieChart() {
  const data = pieChartData.value
  const total = totalApplications.value

  console.log('Creating pie chart with data:', data, 'Total:', total)

  // Handle null/empty data or total = 0
  if (!pieChartCanvas.value || !data || !data.labels || data.labels.length === 0 || total === 0) {
    return new Chart(pieChartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#f0f0f0'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        cutout: '40%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 600
        }
      }
    })
  }

  // Normal chart
  return new Chart(pieChartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.counts,
          backgroundColor: data.colors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverBackgroundColor: data.colors,
          hoverBorderWidth: 3,
          hoverOffset: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#ffffff',
          borderWidth: 1,
          cornerRadius: 6,
          displayColors: true,
          callbacks: {
            title: (context) => context[0].label,
            label: (context) => {
              const value = context.raw
              const percentage = Math.round((value / total) * 100)
              return `${value} applications (${percentage}%)`
            },
          },
        },
      },
      hover: {
        animationDuration: 300,
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 600,
      },
      cutout: '40%',
    },
  })
}


// Safely destroy and recreate pie chart
const recreatePieChart = async () => {
  console.log('Recreating pie chart...')
  
  // Safely destroy previous instance
  pieChartInstance = destroyChart(pieChartInstance)

  // Wait for DOM updates
  await nextTick()
  
  // Ensure canvas is ready
  if (!pieChartCanvas.value) {
    console.warn('Pie chart canvas not available')
    return
  }

  // Set chart size
  setChartSize()

  // Small delay to ensure canvas is fully ready
  setTimeout(() => {
    try {
      pieChartInstance = createPieChart()
      console.log('Pie chart recreated successfully')
    } catch (error) {
      console.error('Error creating pie chart:', error)
    }
  }, 150)
}

// Fetch pie data and recreate chart
const fetchAndRecreatePieChart = async () => {
  isLoadingPieChart.value = true
  try {
    await fetchPie()
    await recreatePieChart()
  } catch (error) {
    console.error('Error in fetchAndRecreatePieChart:', error)
  } finally {
    isLoadingPieChart.value = false
  }
}

// Main refresh function exposed to parent component
const refreshData = async () => {
  console.log('AnalyticsRecords: Starting data refresh...')
  
  try {
    // Set loading states
    isLoadingStats.value = true
    
    // Run all refresh functions in parallel
    await Promise.all([
      fetchJobStats(),
      fetchAndRecreatePieChart(),
      fetchMockJobData()
    ])
    
    console.log('AnalyticsRecords: All data refreshed successfully')
    return Promise.resolve()
  } catch (error) {
    console.error('AnalyticsRecords: Error refreshing data:', error)
    $q.notify({
      color: 'negative', 
      message: 'Error refreshing stats data', 
      icon: 'error',
      position: 'top-right',
      timeout: 3000
    })
    throw error
  } finally {
    isLoadingStats.value = false
  }
}

// Expose refresh method to parent component
defineExpose({
  refreshData,
  // Also expose individual refresh functions for granular control
  refreshStats: fetchJobStats,
  refreshPieChart: fetchAndRecreatePieChart,
  refreshJobData: refreshJobData
})

// Initialize charts function
const initializeCharts = async () => {
  console.log('Initializing pie chart...')
  await nextTick()
  
  // Initial pie chart creation
  await fetchAndRecreatePieChart()
}

// Watchers - recreate chart when data changes
watch(
  pieChartData,
  async () => {
    if (!isLoadingPieChart.value) {
      console.log('Pie chart data changed, recreating chart...')
      await recreatePieChart()
    }
  },
  { deep: true }
)

// Lifecycle hooks
onMounted(async () => {
  console.log('AnalyticsRecords mounted, initializing...')
await initializeCharts()
    console.log('Analytics component initialized successfully')
  // Fetch initial stats and mock job data
  /*isLoadingStats.value = true
  try {
    await Promise.all([
      fetchJobStats(),
      fetchMockJobData(),
    ])
  } catch (error) {
    console.error('Error during initial data fetch:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to load analytics data',
      icon: 'error',
      position: 'top-right',
      timeout: 5000
    })
  } finally {
    isLoadingStats.value = false
  }*/

  // Initialize charts once data is loaded
  /*try {
    await initializeCharts()
    console.log('Analytics component initialized successfully')
  } catch (chartError) {
    console.error('Error initializing charts:', chartError)
    $q.notify({
      color: 'negative',
      message: 'Failed to initialize charts',
      icon: 'error',
      position: 'top-right',
      timeout: 5000
    })
  }

  // Auto-refresh job data every 60 seconds
  setInterval(() => {
    if (!isLoadingJobs.value) {
      fetchMockJobData()
    }
  }, 300000)*/
})

onBeforeUnmount(() => {
  console.log('AnalyticsRecords unmounting, cleaning up...')
  
  // Clean up chart instance
  pieChartInstance = destroyChart(pieChartInstance)
})
</script>

<style scoped>
.analytics-records-container {
  min-height: 100vh;
  background: #f8fafc;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #64748b;
}

/* Enhanced Stats Cards - Fully Responsive */
.stats-section {
  background: #f8fafc;
  padding: 1rem 0.5rem;
}

.stat-card-enhanced {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  min-height: 140px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem auto;
  flex-shrink: 0;
}

.stat-value-enhanced {
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 1;
  margin: 0.25rem 0;
}

.stat-label-enhanced {
  color: #64748b;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
}

/* Content Section - Responsive */
.content-section {
  background: white;
  padding: 1rem 0.5rem;
}

/* Responsive Pie Chart Styling */
.chart-card-enhanced {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 350px;
  margin-bottom: 1rem;
}

.chart-card-enhanced:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.chart-header {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  text-align: center;
}

.chart-header .text-h6 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.chart-header .text-caption {
  font-size: 0.75rem;
}

/* Fully Responsive Pie Chart Container */
.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  position: relative;
  min-height: 280px;
  width: 100%;
}

.pie-chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 250px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-chart-container canvas {
  max-width: 100% !important;
  max-height: 100% !important;
  width: auto !important;
  height: auto !important;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  color: #64748b;
  z-index: 10;
  border-radius: 8px;
}

.loading-overlay .q-spinner {
  margin-bottom: 12px;
}

.loading-overlay .text-caption {
  font-weight: 500;
  opacity: 0.8;
  font-size: 0.75rem;
}

/* Responsive Legend */
.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  margin-top: 1rem;
  width: 100%;
  max-width: 250px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  font-size: 0.75rem;
  color: #666;
  flex: 1;
}

.pie-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  z-index: 5;
}

.total-number {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
}

.total-label {
  font-size: 0.625rem;
  color: #666;
  margin-top: 2px;
}

.no-data-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  z-index: 5;
}

.no-data-message .q-icon {
  margin-bottom: 8px;
  opacity: 0.6;
}

.no-data-message .text-caption {
  font-weight: 500;
  opacity: 0.8;
}

/* Fully Responsive Enhanced Table */
.table-card-enhanced {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  min-height: 350px;
}

.table-header {
  border-bottom: 1px solid #f1f5f9;
  padding: 0.75rem 1rem;
}

.table-header .text-h6 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.table-header .text-caption {
  font-size: 0.75rem;
}

.enhanced-table {
  border: none;
}

.enhanced-table >>> .q-table__top {
  background: #f8fafc;
  padding: 0.5rem;
}

.enhanced-table >>> .q-table thead th {
  background: #f1f5f9;
  color: #374151;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 8px 4px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.enhanced-table >>> .q-table tbody tr {
  transition: background-color 0.2s;
}

.enhanced-table >>> .q-table tbody tr:hover {
  background: #f8fafc;
}

.enhanced-table >>> .q-table tbody td {
  padding: 8px 4px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.75rem;
}

.status-badge {
  font-size: 0.625rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.rate-cell {
  min-width: 60px;
}

.rate-text {
  font-weight: 600;
  color: #374151;
  font-size: 0.75rem;
}

.rate-progress {
  width: 40px;
  margin-top: 2px;
}

.company-cell {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  gap: 0.5rem;
}

.company-cell .q-avatar {
  font-size: 0.625rem;
}

/* Mobile Job Cards - Enhanced Responsive */
.mobile-job-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin: 0.25rem 0;
}

.mobile-job-card .q-card-section {
  padding: 0.75rem;
}

.mobile-job-card .text-weight-bold {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.mobile-job-card .text-caption {
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.mobile-job-card .text-h6 {
  font-size: 1rem;
}

/* Responsive Breakpoints */

/* Large Desktop (1200px+) */
@media (min-width: 1200px) {
  .stats-section {
    padding: 2rem 1rem;
  }
  
  .content-section {
    padding: 1.5rem 1rem;
  }
  
  .stat-card-enhanced {
    min-height: 180px;
  }
  
  .stat-icon-wrapper {
    width: 64px;
    height: 64px;
  }
  
  .stat-value-enhanced {
    font-size: 2.5rem;
  }
  
  .stat-label-enhanced {
    font-size: 0.875rem;
  }
  
  .pie-chart-wrapper {
    max-width: 280px;
  }
  
  .enhanced-table >>> .q-table thead th {
    font-size: 0.875rem;
    padding: 12px 8px;
  }
  
  .enhanced-table >>> .q-table tbody td {
    font-size: 0.875rem;
    padding: 10px 8px;
  }
}

/* Desktop (992px - 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .stat-card-enhanced {
    min-height: 160px;
  }
  
  .stat-value-enhanced {
    font-size: 2rem;
  }
  
  .pie-chart-wrapper {
    max-width: 240px;
  }
}

/* Tablet (768px - 991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .stats-section {
    padding: 1.5rem 0.75rem;
  }
  
  .content-section {
    padding: 1rem 0.75rem;
  }
  
  .stat-card-enhanced {
    min-height: 140px;
    margin-bottom: 0.75rem;
  }
  
  .stat-value-enhanced {
    font-size: 1.75rem;
  }
  
  .pie-chart-wrapper {
    max-width: 200px;
  }
  
  .chart-card-enhanced {
    min-height: 320px;
  }
  
  .table-card-enhanced {
    min-height: 320px;
  }
}

/* Large Mobile (576px - 767px) */
@media (min-width: 576px) and (max-width: 767px) {
  .stats-section {
    padding: 1rem 0.5rem;
  }
  
  .content-section {
    padding: 0.75rem 0.5rem;
  }
  
  .content-section .row {
    flex-direction: column;
  }
  
  .stat-card-enhanced {
    min-height: 120px;
    margin-bottom: 0.5rem;
  }
  
  .stat-value-enhanced {
    font-size: 1.5rem;
  }
  
  .stat-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .pie-chart-wrapper {
    max-width: 180px;
  }
  
  .chart-card-enhanced,
  .table-card-enhanced {
    min-height: 300px;
    margin-bottom: 1rem;
  }
  
  .total-number {
    font-size: 1rem;
  }
  
  .total-label {
    font-size: 0.5rem;
  }
}

/* Small Mobile (up to 575px) */
@media (max-width: 575px) {
  .analytics-records-container {
    padding: 0;
  }
  
  .stats-section {
    padding: 0.75rem 0.25rem;
  }
  
  .content-section {
    padding: 0.5rem 0.25rem;
  }
  
  .content-section .row {
    flex-direction: column;
    margin: 0;
  }
  
  .stat-card-enhanced {
    min-height: 100px;
    margin-bottom: 0.5rem;
    border-radius: 12px;
  }
  
  .stat-value-enhanced {
    font-size: 1.25rem;
  }
  
  .stat-label-enhanced {
    font-size: 0.625rem;
  }
  
  .stat-icon-wrapper {
    width: 36px;
    height: 36px;
    margin-bottom: 0.25rem;
  }
  
  .chart-card-enhanced,
  .table-card-enhanced {
    min-height: 280px;
    margin-bottom: 0.75rem;
    border-radius: 12px;
  }
  
  .pie-chart-container {
    min-height: 240px;
    padding: 0.25rem;
  }
  
  .pie-chart-wrapper {
    max-width: 160px;
  }
  
  .chart-header .text-h6 {
    font-size: 1rem;
  }
  
  .chart-header .text-caption {
    font-size: 0.625rem;
  }
  
  .table-header {
    padding: 0.5rem 0.75rem;
  }
  
  .table-header .text-h6 {
    font-size: 1rem;
  }
  
  .table-header .text-caption {
    font-size: 0.625rem;
  }
  
  .enhanced-table >>> .q-table thead th {
    font-size: 0.625rem;
    padding: 6px 2px;
  }
  
  .enhanced-table >>> .q-table tbody td {
    font-size: 0.625rem;
    padding: 6px 2px;
  }
  
  .status-badge {
    font-size: 0.5rem;
    padding: 1px 6px;
  }
  
  .rate-progress {
    width: 30px;
  }
  
  .company-cell .q-avatar {
    width: 20px;
    height: 20px;
    font-size: 0.5rem;
  }
  
  .mobile-job-card .q-card-section {
    padding: 0.5rem;
  }
  
  .mobile-job-card .text-weight-bold {
    font-size: 0.75rem;
  }
  
  .mobile-job-card .text-caption {
    font-size: 0.625rem;
  }
  
  .mobile-job-card .text-h6 {
    font-size: 0.875rem;
  }
  
  .legend-text {
    font-size: 0.625rem;
  }
  
  .legend-color {
    width: 10px;
    height: 10px;
  }
  
  .total-number {
    font-size: 0.875rem;
  }
  
  .total-label {
    font-size: 0.5rem;
  }
}

/* Extra Small Mobile (up to 375px) */
@media (max-width: 375px) {
  .stat-card-enhanced {
    min-height: 90px;
  }
  
  .stat-value-enhanced {
    font-size: 1.125rem;
  }
  
  .stat-icon-wrapper {
    width: 32px;
    height: 32px;
  }
  
  .pie-chart-wrapper {
    max-width: 140px;
  }
  
  .chart-card-enhanced,
  .table-card-enhanced {
    min-height: 260px;
  }
  
  .pie-chart-container {
    min-height: 220px;
  }
}

/* Print Styles */
@media print {
  .analytics-records-container {
    background: white;
  }
  
  .stat-card-enhanced,
  .chart-card-enhanced,
  .table-card-enhanced {
    border: 1px solid #ccc;
    box-shadow: none;
    break-inside: avoid;
  }
  
  .enhanced-table >>> .q-table tbody tr:hover {
    background: transparent;
  }
}

/* High DPI Displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .pie-chart-container canvas {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .stat-card-enhanced,
  .chart-card-enhanced:hover,
  .enhanced-table >>> .q-table tbody tr {
    transition: none;
  }
  
  .stat-card-enhanced:hover {
    transform: none;
  }
}

/* Dark Mode Support (if needed) */
@media (prefers-color-scheme: dark) {
  .analytics-records-container {
    background: #1a1a1a;
  }
  
  .stat-card-enhanced,
  .chart-card-enhanced,
  .table-card-enhanced {
    background: #2d2d2d;
    border-color: #444;
    color: #fff;
  }
  
  .chart-header,
  .table-header {
    border-color: #444;
  }
  
  .enhanced-table >>> .q-table thead th {
    background: #333;
    color: #fff;
  }
  
  .enhanced-table >>> .q-table tbody tr:hover {
    background: #333;
  }
}
</style>