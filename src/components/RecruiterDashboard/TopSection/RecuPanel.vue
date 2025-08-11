<template>
  <div class="row full-width justify-center">
    <h1 class="text-center q-mb-md">Analytical Records</h1>
  </div>

  <!-- Stats Section -->
  <div class="stats-section q-pa-lg">
    <div class="row q-gutter-md">
      <div class="col" v-for="(card, i) in statCards" :key="i">
        <q-card class="stats-card">
          <q-card-section class="text-center">
            <div :class="['text-h4', card.colorClass]">{{ card.value }}</div>
            <div class="text-caption text-grey-7">{{ card.label }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <q-separator />

  <!-- Analytics Dashboard -->
  <div class="analytics-section q-pa-lg">
    <div class="row q-gutter-lg">
      <!-- Pie Chart for Applicant Status -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Applicant Status Distribution</div>
            <div class="chart-container">
              <canvas ref="pieChartCanvas" width="300" height="300"></canvas>
            </div>
            <div class="chart-legend q-mt-md">
              <div v-for="(item, index) in pieChartData" :key="index" class="legend-item">
                <div
                  class="legend-color"
                  :style="{ backgroundColor: item.color }"
                ></div>
                <span class="legend-label">{{ item.label }}: {{ item.count }} ({{ item.percentage }}%)</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Monthly Application Trend -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Monthly Application Trend - 2025</div>
            <div class="chart-container">
              <canvas ref="trendChartCanvas" width="450" height="300"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Job Posting Analytics -->
    <div class="row q-gutter-lg q-mt-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h6">Job Posting Analytics</div>
              <q-select
                v-model="jobAnalyticsFilter"
                :options="jobFilterOptions"
                label="Filter by"
                dense
                outlined
                style="min-width: 200px"
                emit-value
                map-options
              />
            </div>

            <div class="row q-gutter-md q-mb-lg">
              <div class="col-12 col-sm-3">
                <q-card class="bg-primary text-white">
                  <q-card-section class="text-center">
                    <div class="text-h4">{{ filteredJobStats.totalJobs }}</div>
                    <div class="text-caption">Total Job Posts</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-sm-3">
                <q-card class="bg-secondary text-white">
                  <q-card-section class="text-center">
                    <div class="text-h4">{{ filteredJobStats.totalApplicants }}</div>
                    <div class="text-caption">Total Applicants</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-sm-3">
                <q-card class="bg-accent text-white">
                  <q-card-section class="text-center">
                    <div class="text-h4">{{ filteredJobStats.avgRate }}%</div>
                    <div class="text-caption">Avg Application Rate</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-sm-3">
                <q-card class="bg-positive text-white">
                  <q-card-section class="text-center">
                    <div class="text-h4">{{ filteredJobStats.activeJobs }}</div>
                    <div class="text-caption">Active Jobs</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <q-separator />

  <!-- Main Content Area -->
  <div class="main-content">
    <!-- Top Job Posts -->
    <div class="col-8 q-pa-lg">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">Top Performing Job Posts</div>
        </q-card-section>

        <q-table
          flat
          bordered
          dense
          :rows="topJobPosts"
          :columns="jobPostColumns"
          row-key="title"
          class="responsive-table"
          :grid="$q.screen.xs"
          :card-style="$q.screen.xs ? 'margin-bottom: 8px;' : ''"
        >
          <template v-if="$q.screen.xs" v-slot:item="props">
            <div class="col-12">
              <q-card class="q-ma-sm">
                <q-card-section>
                  <div class="text-weight-bold">{{ props.row.title }}</div>
                  <div class="text-caption q-mt-xs">
                    <div>Applicants: {{ props.row.applicants }}</div>
                    <div>Rate: {{ props.row.rate }}</div>
                    <div>Status: {{ props.row.status }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Chart canvases
const pieChartCanvas = ref(null)
const trendChartCanvas = ref(null)

// Applicants data
const applicants = ref([
  { uid: 1, name: 'Alice Johnson', status: 'pending', appliedDate: '2024-01-15' },
  { uid: 2, name: 'Bob Smith', status: 'accepted', appliedDate: '2024-01-20' },
  { uid: 3, name: 'Charlie Davis', status: 'rejected', appliedDate: '2024-02-10' },
  { uid: 4, name: 'Diana Prince', status: 'pending', appliedDate: '2024-02-15' },
  { uid: 5, name: 'Edward Norton', status: 'accepted', appliedDate: '2024-03-01' },
  { uid: 6, name: 'Fiona Green', status: 'pending', appliedDate: '2024-03-10' },
  { uid: 7, name: 'George Lucas', status: 'rejected', appliedDate: '2024-03-20' },
  { uid: 8, name: 'Helen Troy', status: 'accepted', appliedDate: '2024-04-05' }
])

const loading = ref(false)
const jobAnalyticsFilter = ref('all')

const statusOptions = [
  { label: 'Pending Review', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' }
]

const jobFilterOptions = [
  { label: 'All Jobs', value: 'all' },
  { label: 'Open Only', value: 'open' },
  { label: 'Closed Only', value: 'closed' },
  { label: 'Active (Open + Interviewing)', value: 'active' }
]

// Top Job Posts Data - Top 3 only
const topJobPosts = ref([
  { title: 'Senior Backend Engineer', applicants: 120, rate: '45%', status: 'Interviewing', posted: '2025-01-01' },
  { title: 'Frontend Intern', applicants: 150, rate: '60%', status: 'Open', posted: '2025-02-01' },
  { title: 'DevOps Engineer', applicants: 110, rate: '52%', status: 'Open', posted: '2025-03-01' }
])

// Monthly application trend data for 2025
const monthlyTrend = ref([
  { month: 'Jan', applications: 45, year: 2025 },
  { month: 'Feb', applications: 62, year: 2025 },
  { month: 'Mar', applications: 78, year: 2025 },
  { month: 'Apr', applications: 55, year: 2025 },
  { month: 'May', applications: 89, year: 2025 },
  { month: 'Jun', applications: 95, year: 2025 },
  { month: 'Jul', applications: 102, year: 2025 },
  { month: 'Aug', applications: 87, year: 2025 }
])

// Computed Stats
const totalApplicants = computed(() =>
  topJobPosts.value.reduce((sum, job) => sum + job.applicants, 0)
)

const getStatusCount = status =>
  applicants.value.filter(a => a.status.toLowerCase() === status.toLowerCase()).length

const statCards = computed(() => [
  { label: 'Total Applicants', value: totalApplicants.value, colorClass: 'text-primary' },
  { label: 'Pending Review', value: getStatusCount('pending'), colorClass: 'text-orange' },
  { label: 'Accepted', value: getStatusCount('accepted'), colorClass: 'text-positive' },
  { label: 'Rejected', value: getStatusCount('rejected'), colorClass: 'text-negative' }
])

// Pie Chart Data
const pieChartData = computed(() => {
  const pending = getStatusCount('pending')
  const accepted = getStatusCount('accepted')
  const rejected = getStatusCount('rejected')
  const total = pending + accepted + rejected

  return [
    {
      label: 'Pending',
      count: pending,
      percentage: total > 0 ? Math.round((pending / total) * 100) : 0,
      color: '#ff9800'
    },
    {
      label: 'Accepted',
      count: accepted,
      percentage: total > 0 ? Math.round((accepted / total) * 100) : 0,
      color: '#4caf50'
    },
    {
      label: 'Rejected',
      count: rejected,
      percentage: total > 0 ? Math.round((rejected / total) * 100) : 0,
      color: '#f44336'
    }
  ]
})

// Filtered Job Statistics
const filteredJobStats = computed(() => {
  let jobs = topJobPosts.value

  if (jobAnalyticsFilter.value === 'open') {
    jobs = jobs.filter(job => job.status === 'Open')
  } else if (jobAnalyticsFilter.value === 'closed') {
    jobs = jobs.filter(job => job.status === 'Closed')
  } else if (jobAnalyticsFilter.value === 'active') {
    jobs = jobs.filter(job => job.status === 'Open' || job.status === 'Interviewing')
  }

  const totalJobs = jobs.length
  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0)
  const avgRate = totalJobs > 0 ?
    Math.round(jobs.reduce((sum, job) => sum + parseFloat(job.rate), 0) / totalJobs) : 0
  const activeJobs = jobs.filter(job => job.status === 'Open' || job.status === 'Interviewing').length

  return {
    totalJobs,
    totalApplicants,
    avgRate,
    activeJobs
  }
})

// Job Table Columns
const jobPostColumns = ref([
  { name: 'title', label: 'Job Title', align: 'left', field: 'title' },
  { name: 'applicants', label: '# Applicants', align: 'center', field: 'applicants' },
  { name: 'rate', label: 'Application Rate', align: 'center', field: 'rate' },
  { name: 'status', label: 'Hiring Status', align: 'center', field: 'status' }
])

// Chart Drawing Functions
const drawPieChart = () => {
  const canvas = pieChartCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 20

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let currentAngle = -Math.PI / 2
  const data = pieChartData.value

  data.forEach((slice) => {
    const sliceAngle = (slice.percentage / 100) * 2 * Math.PI

    // Draw slice
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fillStyle = slice.color
    ctx.fill()

    // Draw border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()

    currentAngle += sliceAngle
  })
}

const drawTrendChart = () => {
  const canvas = trendChartCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const padding = 40
  const chartWidth = canvas.width - 2 * padding
  const chartHeight = canvas.height - 2 * padding

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const data = monthlyTrend.value
  const maxValue = Math.max(...data.map(d => d.applications))
  const stepX = chartWidth / (data.length - 1)

  // Draw axes
  ctx.strokeStyle = '#ccc'
  ctx.lineWidth = 1

  // Y-axis
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, padding + chartHeight)
  ctx.stroke()

  // X-axis
  ctx.beginPath()
  ctx.moveTo(padding, padding + chartHeight)
  ctx.lineTo(padding + chartWidth, padding + chartHeight)
  ctx.stroke()

  // Draw line
  ctx.strokeStyle = '#2196f3'
  ctx.lineWidth = 3
  ctx.beginPath()

  data.forEach((point, index) => {
    const x = padding + index * stepX
    const y = padding + chartHeight - (point.applications / maxValue) * chartHeight

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // Draw points
  data.forEach((point, index) => {
    const x = padding + index * stepX
    const y = padding + chartHeight - (point.applications / maxValue) * chartHeight

    ctx.fillStyle = '#2196f3'
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Draw labels
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'

  data.forEach((point, index) => {
    const x = padding + index * stepX
    ctx.fillText(point.month, x, padding + chartHeight + 20)
  })
}

onMounted(async () => {
  await nextTick()
  drawPieChart()
  drawTrendChart()
})
</script>

<style scoped>
.user-panel {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 16px;
  min-height: 94px;
  padding: 16px 24px;
  font-size: 15px;
  transition: box-shadow 0.3s ease;
  background: #94a3b8;
  backdrop-filter: blur(10px);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.analytics-section {
  background: #f8f9fa;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-label {
  font-size: 14px;
  color: #666;
}

.stats-wrapper {
  width: 100%;
}

.responsive-table {
  width: 100%;
  overflow-x: auto;
}

h1 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin: 0;
  color: #1f2937;
  font-weight: 700;
}

.user-panel:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.08);
}

.stat-card {
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color, #3b82f6), var(--accent-light, #60a5fa));
}

/* Color variations for different stat cards */
.total-jobs {
  --accent-color: #3b82f6;
  --accent-light: #60a5fa;
}

.total-applicants {
  --accent-color: #8b5cf6;
  --accent-light: #a78bfa;
}

.accepted {
  --accent-color: #10b981;
  --accent-light: #34d399;
}

.in-review {
  --accent-color: #f97316;
  --accent-light: #fb923c;
}

.rejected {
  --accent-color: #ef4444;
  --accent-light: #f87171;
}

.stat-value {
  color: #1f2937;
  margin-top: 4px;
}

.text-grey {
  color: #6b7280 !important;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.avatar-box {
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}

.avatar-box.clickable {
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-box.clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.main-info .user-name {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
}

.user-skills-placeholder {
  font-size: 13px;
  font-style: italic;
  color: #94a3b8;
  margin-top: 4px;
}

.detail-info {
  font-size: 15px;
  color: #2d3748;
  align-items: center;
}

.info-col {
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.info-block {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 13px;
  color: #94a3b8;
}

.value {
  font-size: 15px;
  color: #232c47;
  margin-top: 2px;
}

.value.strong {
  font-weight: 600;
  color: #242d53;
}

.value.email {
  color: #2382fa;
  word-break: break-word;
}

.vertical-separator {
  height: 48px;
  width: 1px;
  background-color: #e0e0e0;
}

/* Responsive breakpoints */
@media (max-width: 1024px) {
  .user-panel {
    padding: 12px 16px;
  }
}

@media (max-width: 768px) {
  .user-panel {
    padding: 12px;
    border-radius: 12px;
  }

  .stat-card {
    min-height: 70px;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .text-grey {
    font-size: 0.7rem;
  }

  .chart-container {
    min-height: 250px;
  }
}

@media (max-width: 600px) {
  .user-panel {
    padding: 8px;
    border-radius: 8px;
  }

  .stat-card {
    min-height: 60px;
    border-radius: 8px;
  }

  .stat-value {
    font-size: 1rem;
  }

  .text-grey {
    font-size: 0.65rem;
    letter-spacing: 0.3px;
  }

  h1 {
    margin-bottom: 8px;
  }

  .chart-container {
    min-height: 200px;
  }
}

@media (max-width: 480px) {
  .user-panel {
    padding: 6px;
  }

  .stat-card {
    min-height: 55px;
  }

  .text-grey {
    font-size: 0.6rem;
  }
}
</style>
