<!-- AnalyticsRecords.vue -->
<template>
  <!-- Compact Job Posting Analytics Header -->
  <div class="analytics-header-compact">
    <div class="row justify-between items-center">
      <div class="header-content">
        <h4 class="header-title">Job Posting Analytics</h4>
        <p class="header-subtitle">Track and monitor your job posting performance</p>
      </div>
      <q-select
        v-model="jobAnalyticsFilter"
        :options="jobFilterOptions"
        label="Filter by"
        dense
        outlined
        class="filter-select-compact"
        emit-value
        map-options
      />
    </div>
  </div>

  <!-- Compact Job Posting Stats Cards -->
  <div class="stats-section-compact">
    <!-- Optional refresh button -->
    <div class="row justify-end q-mb-sm">
      <q-btn
        flat
        round
        icon="refresh"
        @click="refreshStats"
        :loading="isLoadingStats"
        color="primary"
        size="sm"
      >
        <q-tooltip>Refresh Stats</q-tooltip>
      </q-btn>
    </div>

    <div class="row q-gutter-sm">
      <div class="col" v-for="(stat, index) in jobAnalyticsStats" :key="index">
        <q-card class="stat-card-compact">
          <q-card-section class="stat-card-content">
            <div class="stat-icon-compact">
              <q-icon :name="stat.icon" size="24px" :color="stat.color" />
              <q-icon
                v-if="stat.isGlobal"
                name="public"
                size="10px"
                color="grey-5"
                class="global-indicator"
              >
                <q-tooltip>Platform-wide metric</q-tooltip>
              </q-icon>
            </div>

            <!-- Loading skeleton or actual value -->
            <div v-if="isLoadingStats" class="stat-value-compact">
              <q-skeleton type="text" width="40px" height="28px" />
            </div>
            <div v-else class="stat-value-compact" :class="`text-${stat.color}`">
              {{ stat.value }}
            </div>

            <div class="stat-label-compact">{{ stat.label }}</div>

            <!-- Compact change display -->
            <div class="stat-change-compact" v-if="stat.change !== undefined && !isLoadingStats">
              <q-icon
                :name="
                  stat.change > 0
                    ? 'trending_up'
                    : stat.change < 0
                      ? 'trending_down'
                      : 'trending_flat'
                "
                :color="stat.change > 0 ? 'positive' : stat.change < 0 ? 'negative' : 'grey'"
                size="12px"
              />
              <span>{{ Math.abs(stat.change) }}%</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <!-- Compact Analytics Charts and Table Layout -->
  <div class="content-section-compact">
    <div class="row q-col-gutter-md">
      <!-- Application Status Pie Chart - Compact -->
      <div class="col-12 col-md-4">
        <q-card class="chart-card-compact">
          <q-card-section class="chart-section-compact">
            <div class="chart-header-compact">
              <div class="chart-title">Application Status</div>
              <div class="chart-subtitle">Current applications breakdown</div>
            </div>
            <div class="pie-chart-container-compact">
              <canvas ref="pieChartCanvas"></canvas>
              <!-- Compact Legend -->
              <div class="pie-legend-compact">
                <div
                  v-for="(label, index) in pieChartData.labels"
                  :key="label"
                  class="legend-item-compact"
                >
                  <div
                    class="legend-color-compact"
                    :style="{ backgroundColor: pieChartData.colors[index] }"
                  ></div>
                  <span class="legend-text-compact"
                    >{{ label }}: {{ pieChartData.counts[index] }}</span
                  >
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Top Performing Job Posts - Compact -->
      <div class="col-12 col-md-8">
        <q-card class="table-card-compact">
          <q-card-section class="table-section-compact">
            <div class="table-header-compact">
              <div class="row justify-between items-center">
                <div>
                  <div class="table-title">Top Performing Job Posts</div>
                  <div class="table-subtitle">Live job market data with highest engagement</div>
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
              :rows="filteredJobs"
              :columns="jobPostColumns"
              row-key="title"
              class="compact-table"
              :grid="$q.screen.xs"
              :rows-per-page-options="[5, 10, 15]"
              :pagination="{ rowsPerPage: 5 }"
            >
              <!-- Status Badge Template -->
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    :color="getStatusColor(props.value)"
                    :label="props.value"
                    class="status-badge-compact"
                  />
                </q-td>
              </template>

              <!-- Rate with Progress Bar -->
              <template v-slot:body-cell-rate="props">
                <q-td :props="props">
                  <div class="rate-cell-compact">
                    <span class="rate-text-compact">{{ props.value }}%</span>
                    <q-linear-progress
                      :value="props.value / 100"
                      size="3px"
                      :color="getRateColor(props.value)"
                      class="rate-progress-compact"
                    />
                  </div>
                </q-td>
              </template>

              <!-- Company Column -->
              <template v-slot:body-cell-company="props">
                <q-td :props="props">
                  <div class="company-cell-compact">
                    <q-avatar size="20px" color="primary" text-color="white" class="company-avatar">
                      {{ props.value.charAt(0) }}
                    </q-avatar>
                    <span>{{ props.value }}</span>
                  </div>
                </q-td>
              </template>

              <!-- Mobile Grid Template -->
              <template v-slot:item="props" v-if="$q.screen.xs">
                <div class="col-12">
                  <q-card class="mobile-job-card-compact">
                    <q-card-section class="mobile-card-content">
                      <div class="mobile-title">{{ props.row.title }}</div>
                      <div class="mobile-company">{{ props.row.company }}</div>
                      <div class="row justify-between mobile-stats">
                        <div class="col">
                          <div class="mobile-stat-label">Applicants</div>
                          <div class="mobile-stat-value">{{ props.row.applicants }}</div>
                        </div>
                        <div class="col">
                          <div class="mobile-stat-label">Success Rate</div>
                          <div class="mobile-stat-value">{{ props.row.rate }}%</div>
                        </div>
                        <div class="col">
                          <q-badge
                            :color="getStatusColor(props.row.status)"
                            :label="props.row.status"
                            class="status-badge-compact"
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

const jobAnalyticsFilter = ref('all')

const jobFilterOptions = [
  { label: 'All Jobs', value: 'all' },
  { label: 'Open Only', value: 'open' },
  { label: 'Closed Only', value: 'closed' },
  { label: 'Active (Open + Interviewing)', value: 'active' },
]

// Job posts with API integration
const topJobPosts = ref([])
const isLoadingJobs = ref(false)

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

const refreshJobData = () => {
  fetchMockJobData()
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

const piestats = ref({
  pending: 0,
  accepted: 0,
  rejected: 0,
})

// Fetch pie chart data
const fetchPie = async () => {
  isLoadingStats.value = true
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
        pending: data.pending,
        accepted: data.accepted,
        rejected: data.rejected,
      }
      console.log('Updated pie stats:', piestats.value)

      await nextTick()
      createPieChart()
    } else {
      console.error('Failed to fetch pie chart data:', response.status)
    }
  } catch (error) {
    console.error('Error fetching pie chart data:', error)
  } finally {
    isLoadingStats.value = false
  }
}

// Computed properties
const pieChartData = computed(() => {
  const pending = piestats.value.pending
  const accepted = piestats.value.accepted
  const rejected = piestats.value.rejected

  return {
    labels: ['Pending', 'Accepted', 'Rejected'],
    counts: [pending, accepted, rejected],
    colors: ['#D2691E', '#228B22', '#8B4513'],
  }
})

const filteredJobs = computed(() => {
  let jobs = [...topJobPosts.value]

  switch (jobAnalyticsFilter.value) {
    case 'open':
      return jobs.filter((job) => job.status === 'Open')
    case 'closed':
      return jobs.filter((job) => job.status === 'Closed')
    case 'active':
      return jobs.filter((job) => ['Open', 'Interviewing'].includes(job.status))
    default:
      return jobs
  }
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

const isLoadingStats = ref(false)

const fetchJobStats = async () => {
  isLoadingStats.value = true
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
      apiStats.value = data.stats
      console.log('Updated stats:', data.stats)
    } else {
      console.error('Failed to fetch job stats:', response.status)
    }
  } catch (error) {
    console.error('Error fetching job stats:', error)
  } finally {
    isLoadingStats.value = false
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

const refreshStats = () => {
  fetchJobStats()
  fetchPie()
}

// Enhanced pie chart with better styling
function createPieChart() {
  if (!pieChartCanvas.value) return

  const canvas = pieChartCanvas.value
  const ctx = canvas.getContext('2d')
  const data = pieChartData.value

  // Set canvas size - smaller for compact layout
  canvas.width = 180
  canvas.height = 180

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 25

  const total = data.counts.reduce((sum, count) => sum + count, 0)

  if (total === 0) {
    // Draw empty state
    ctx.fillStyle = '#f0f0f0'
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = '#666'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('No Data', centerX, centerY)
    return
  }

  let currentAngle = -Math.PI / 2

  // Draw pie slices with shadow effect
  data.counts.forEach((count, index) => {
    if (count > 0) {
      const sliceAngle = (count / total) * 2 * Math.PI

      // Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = data.colors[index]
      ctx.fill()

      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // White border
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      currentAngle += sliceAngle
    }
  })

  // Draw center circle for donut effect
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  ctx.stroke()

  // Center text
  ctx.fillStyle = '#333'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(total.toString(), centerX, centerY - 3)
  ctx.font = '10px Arial'
  ctx.fillText('Total', centerX, centerY + 10)
}

// Initialize charts
const initializeCharts = async () => {
  await nextTick()
  setTimeout(() => {
    createPieChart()
  }, 100)
}

pieChartInstance

// Watchers
watch(
  pieChartData,
  () => {
    createPieChart()
  },
  { deep: true },
)

// Lifecycle hooks
onMounted(() => {
  fetchJobStats()
  fetchPie()
  fetchMockJobData()
  initializeCharts()

  // Auto-refresh job data every 60 seconds
  setInterval(() => {
    if (!isLoadingJobs.value) {
      fetchMockJobData()
    }
  }, 60000)
})

onBeforeUnmount(() => {
  pieChartInstance = null
})
</script>

<style scoped>
.analytics-header-compact {
  background: linear-gradient(135deg, #7ddf91 0%, #d5ddd3 100%);
  color: black;
  margin: -16px -16px 0 -16px;
  padding: 18px 20px; /* Increased from 12px */
}

.header-content {
  margin: 0;
}

.header-title {
  font-size: 1.75rem; /* Increased from 1.5rem */
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.header-subtitle {
  font-size: 0.95rem; /* Increased from 0.875rem */
  color: #164607(255, 255, 255, 0.85);
  margin: 4px 0 0 0; /* Increased margin */
  line-height: 1.3;
}

.filter-select-compact {
  min-width: 160px;
}

.filter-select-compact >>> .q-field__control {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  min-height: 36px;
}

.filter-select-compact >>> .q-field__native {
  color: white;
}

/* Compact Stats Section */
.stats-section-compact {
  background: linear-gradient(135deg, #f8fffe 0%, #f0f7f0 100%);
  padding: 16px 20px; /* Reduced padding */
}

.stat-card-compact {
  border: 1px solid #e8f5e8;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: white;
  min-height: 120px; /* Reduced from 160px */
  box-shadow: 0 2px 8px rgba(210, 105, 30, 0.08);
}

.stat-card-compact::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #d2691e, #228b22);
}

.stat-card-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(210, 105, 30, 0.12);
  border-color: #d4e6d4;
}

.stat-card-content {
  text-align: center;
  padding: 12px 8px; /* Reduced padding */
}

.stat-icon-compact {
  width: 48px; /* Reduced from 64px */
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(210, 105, 30, 0.1), rgba(34, 139, 34, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  position: relative;
}

.global-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
}

.stat-value-compact {
  font-weight: 700;
  font-size: 2rem; /* Reduced from 2.5rem */
  line-height: 1;
  margin: 8px 0; /* Reduced margin */
  color: #2d5016;
}

.stat-label-compact {
  color: #4a6741;
  font-weight: 500;
  font-size: 0.8rem; /* Slightly smaller */
  line-height: 1.2;
}

.stat-change-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 4px;
}

/* Compact Content Section */
.content-section-compact {
  background: white;
  padding: 16px 20px; /* Reduced padding */
}

/* Compact Chart Card */
.chart-card-compact {
  border: 1px solid #e8f5e8;
  border-radius: 12px;
  transition: all 0.2s ease;
  height: 100%;
  box-shadow: 0 2px 8px rgba(210, 105, 30, 0.05);
}

.chart-card-compact:hover {
  box-shadow: 0 6px 16px rgba(210, 105, 30, 0.08);
  border-color: #d4e6d4;
}

.chart-section-compact {
  padding: 16px; /* Reduced padding */
}

.chart-header-compact {
  border-bottom: 1px solid #f0f7f0;
  padding-bottom: 8px;
  margin-bottom: 12px;
  text-align: center;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d5016;
  margin: 0;
}

.chart-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 2px 0 0 0;
}

.pie-chart-container-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}

.pie-chart-container-compact canvas {
  max-width: 100%;
}

.pie-legend-compact {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  margin-top: 12px;
}

.legend-item-compact {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color-compact {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-text-compact {
  font-size: 0.75rem;
  color: #4a6741;
  font-weight: 500;
}

/* Compact Table */
.table-card-compact {
  border: 1px solid #e8f5e8;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 2px 8px rgba(210, 105, 30, 0.05);
}

.table-section-compact {
  padding: 16px; /* Reduced padding */
}

.table-header-compact {
  border-bottom: 1px solid #f0f7f0;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.table-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d5016;
  margin: 0;
}

.table-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 2px 0 0 0;
}

.compact-table {
  border: none;
}

.compact-table >>> .q-table__top {
  background: #f8fffe;
}

.compact-table >>> .q-table thead th {
  background: linear-gradient(135deg, #f0f7f0, #e8f5e8);
  color: #2d5016;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 8px 6px; /* Reduced padding */
  border-bottom: 2px solid #d4e6d4;
}

.compact-table >>> .q-table tbody tr {
  transition: background-color 0.2s;
}

.compact-table >>> .q-table tbody tr:hover {
  background: #f8fffe;
}

.compact-table >>> .q-table tbody td {
  padding: 8px 6px; /* Reduced padding */
  border-bottom: 1px solid #f0f7f0;
  font-size: 0.85rem;
}

.status-badge-compact {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.rate-cell-compact {
  min-width: 60px;
}

.rate-text-compact {
  font-weight: 600;
  color: #2d5016;
  font-size: 0.8rem;
}

.rate-progress-compact {
  width: 40px;
  margin-top: 2px;
}

.company-cell-compact {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  gap: 6px;
}

.company-avatar {
  font-size: 0.7rem;
}

.mobile-job-card-compact {
  border: 1px solid #e8f5e8;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(210, 105, 30, 0.05);
}

.mobile-card-content {
  padding: 12px;
}

.mobile-title {
  font-weight: 600;
  color: #d2691e;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.mobile-company {
  color: #6b7280;
  font-size: 0.75rem;
  margin-bottom: 8px;
}

.mobile-stats {
  margin-top: 8px;
}

.mobile-stat-label {
  color: #6b7280;
  font-size: 0.7rem;
  margin-bottom: 2px;
}

.mobile-stat-value {
  font-weight: 600;
  font-size: 1rem;
  color: #2d5016;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .analytics-header-compact {
    padding: 10px 16px;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .stat-value-compact {
    font-size: 1.8rem;
  }

  .pie-chart-container-compact canvas {
    width: 160px !important;
    height: 160px !important;
  }
}

@media (max-width: 768px) {
  .analytics-header-compact .row {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .filter-select-compact {
    min-width: 140px;
  }

  .stat-card-compact {
    min-height: 100px;
  }

  .stat-value-compact {
    font-size: 1.6rem;
  }

  .stat-icon-compact {
    width: 40px;
    height: 40px;
  }

  .stats-section-compact,
  .content-section-compact {
    padding: 12px 16px;
  }
}

@media (max-width: 599px) {
  .analytics-header-compact {
    padding: 8px 12px;
  }

  .header-title {
    font-size: 1.2rem;
  }

  .header-subtitle {
    font-size: 0.8rem;
  }

  .content-section-compact .row {
    flex-direction: column;
  }

  .stat-card-compact {
    min-height: 90px;
  }

  .stat-value-compact {
    font-size: 1.4rem;
  }

  .stat-icon-compact {
    width: 36px;
    height: 36px;
  }

  .pie-chart-container-compact canvas {
    width: 140px !important;
    height: 140px !important;
  }

  .chart-section-compact,
  .table-section-compact {
    padding: 12px;
  }
}

/* Custom Color Overrides for Copper/Green Theme */
.text-primary {
  color: #d2691e !important;
}

.text-positive {
  color: #228b22 !important;
}

.text-warning {
  color: #8b4513 !important;
}

.text-info {
  color: #2f4f4f !important;
}

/* Button and Interactive Element Colors */
.compact-table >>> .q-btn--flat.text-primary {
  color: #d2691e !important;
}

.compact-table >>> .q-linear-progress__track {
  background: rgba(210, 105, 30, 0.1) !important;
}
</style>
