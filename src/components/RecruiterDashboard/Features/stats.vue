<!-- AnalyticsRecords.vue -->
<template>

  <!-- Job Posting Analytics -->
  <div class="row q-gutter-lg q-mt-md">
    <div class="col-12">
      <q-card class="minimal-card">
        <q-card-section>
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">Job Posting Analytics</div>
            <q-select
              v-model="jobAnalyticsFilter"
              :options="jobFilterOptions"
              label="Filter by"
              dense
              outlined
              class="filter-select"
              emit-value
              map-options
            />
          </div>

          <div class="row q-gutter-md q-mb-lg">
            <div
              class="col-12 col-sm-3"
              v-for="(stat, index) in jobAnalyticsStats"
              :key="index"
            >
              <q-card class="stat-card-minimal">
                <q-card-section class="text-center">
                  <div class="text-h4 stat-value">{{ stat.value }}</div>
                  <div class="text-caption stat-label">{{ stat.label }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <!-- Analytics Dashboard - Side by Side -->
  <div class="analytics-section q-pa-lg">
    <div class="row q-col-gutter-lg items-stretch">
      <!-- Pie Chart -->
      <div class="col-12 col-md-6">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">Applicant Status Distribution</div>
            <div class="chart-container">
              <canvas ref="pieChartCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Trend Chart -->
      <div class="col-12 col-md-6">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">Monthly Application Trend - 2025</div>
            <div class="chart-container">
              <canvas ref="trendChartCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <q-separator />

  <!-- Top Job Posts -->
  <div class="main-content q-pa-lg">
    <q-card flat bordered class="minimal-card">
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
      >
        <template v-slot:item="props" v-if="$q.screen.xs">
          <div class="col-12">
            <q-card class="q-ma-sm minimal-card">
              <q-card-section>
                <div class="text-weight-bold">{{ props.row.title }}</div>
                <div class="text-caption q-mt-xs">
                  <div>Applicants: {{ props.row.applicants }}</div>
                  <div>Rate: {{ props.row.rate }}%</div>
                  <div>Status: {{ props.row.status }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'

// Import Chart.js components properly
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'

// Register Chart.js components
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

const $q = useQuasar()

// Chart refs
const pieChartCanvas = ref(null)
const trendChartCanvas = ref(null)

// Chart instances
let pieChartInstance = null
let trendChartInstance = null

// Sample data
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

const jobAnalyticsFilter = ref('all')

const jobFilterOptions = [
  { label: 'All Jobs', value: 'all' },
  { label: 'Open Only', value: 'open' },
  { label: 'Closed Only', value: 'closed' },
  { label: 'Active (Open + Interviewing)', value: 'active' }
]

const topJobPosts = ref([
  { title: 'Senior Backend Engineer', applicants: 120, rate: 45, status: 'Interviewing', posted: '2025-01-01' },
  { title: 'Frontend Intern', applicants: 150, rate: 60, status: 'Open', posted: '2025-02-01' },
  { title: 'DevOps Engineer', applicants: 110, rate: 52, status: 'Open', posted: '2025-03-01' }
])

const monthlyTrend = ref([
  { month: 'Jan', applications: 45 },
  { month: 'Feb', applications: 62 },
  { month: 'Mar', applications: 78 },
  { month: 'Apr', applications: 55 },
  { month: 'May', applications: 89 },
  { month: 'Jun', applications: 95 },
  { month: 'Jul', applications: 102 },
  { month: 'Aug', applications: 87 }
])

// Helper functions
const getStatusCount = status =>
  applicants.value.filter(a => a.status.toLowerCase() === status.toLowerCase()).length

// Computed properties
const pieChartData = computed(() => {
  const pending = getStatusCount('pending')
  const accepted = getStatusCount('accepted')
  const rejected = getStatusCount('rejected')

  return {
    labels: ['Pending', 'Accepted', 'Rejected'],
    counts: [pending, accepted, rejected],
    colors: ['#64748b', '#10b981', '#ef4444']
  }
})

const filteredJobs = computed(() => {
  let jobs = [...topJobPosts.value]
  
  switch (jobAnalyticsFilter.value) {
    case 'open':
      return jobs.filter(job => job.status === 'Open')
    case 'closed':
      return jobs.filter(job => job.status === 'Closed')
    case 'active':
      return jobs.filter(job => ['Open', 'Interviewing'].includes(job.status))
    default:
      return jobs
  }
})

const jobAnalyticsStats = computed(() => {
  const jobs = filteredJobs.value
  const totalJobs = jobs.length
  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0)
  const avgRate = totalJobs
    ? Math.round(jobs.reduce((sum, job) => sum + job.rate, 0) / totalJobs)
    : 0
  const activeJobs = jobs.filter(job => ['Open', 'Interviewing'].includes(job.status)).length
  
  return [
    { value: totalJobs, label: 'Total Job Posts' },
    { value: totalApplicants, label: 'Total Applicants' },
    { value: `${avgRate}%`, label: 'Avg Application Rate' },
    { value: activeJobs, label: 'Active Jobs' }
  ]
})

// Table columns
const jobPostColumns = [
  { 
    name: 'title', 
    label: 'Job Title', 
    field: 'title', 
    sortable: true, 
    align: 'left' 
  },
  { 
    name: 'applicants', 
    label: 'Applicants', 
    field: 'applicants', 
    sortable: true, 
    align: 'center' 
  },
  { 
    name: 'rate', 
    label: 'Rate (%)', 
    field: 'rate', 
    sortable: true, 
    align: 'center',
    format: val => `${val}%`
  },
  { 
    name: 'status', 
    label: 'Status', 
    field: 'status', 
    sortable: true, 
    align: 'center' 
  }
]

// Chart creation functions
function createPieChart() {
  console.log('Creating pie chart...')
  
  if (pieChartInstance) {
    pieChartInstance.destroy()
    pieChartInstance = null
  }

  if (!pieChartCanvas.value) {
    console.error('Pie chart canvas ref is null')
    return
  }

  const ctx = pieChartCanvas.value.getContext('2d')
  const data = pieChartData.value

  console.log('Pie chart data:', data)

  pieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.counts,
          backgroundColor: data.colors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverBorderWidth: 3,
          hoverOffset: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12
            },
            color: '#374151'
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((context.parsed / total) * 100)
              return `${context.label}: ${context.parsed} (${percentage}%)`
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        duration: 1200,
        easing: 'easeInOutQuart'
      },
      interaction: {
        intersect: false
      }
    }
  })
  
  console.log('Pie chart created:', pieChartInstance)
}

function createTrendChart() {
  console.log('Creating trend chart...')
  
  if (trendChartInstance) {
    trendChartInstance.destroy()
    trendChartInstance = null
  }

  if (!trendChartCanvas.value) {
    console.error('Trend chart canvas ref is null')
    return
  }

  const ctx = trendChartCanvas.value.getContext('2d')

  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthlyTrend.value.map(d => d.month),
      datasets: [
        {
          label: 'Applications',
          data: monthlyTrend.value.map(d => d.applications),
          fill: false,
          borderColor: '#6366f1',
          backgroundColor: '#6366f1',
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#4f46e5',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 3,
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 20,
            color: '#6b7280',
            font: {
              size: 11
            }
          },
          grid: {
            color: 'rgba(243, 244, 246, 0.8)',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: '#6b7280',
            font: {
              size: 11
            }
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: function(context) {
              return `${context[0].label} 2025`
            },
            label: function(context) {
              return `${context.parsed.y} applications`
            }
          }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeInOutCubic'
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  })
  
  console.log('Trend chart created:', trendChartInstance)
}

// Initialize charts function
const initializeCharts = async () => {
  console.log('Initializing charts...')
  await nextTick()
  
  // Add small delay to ensure DOM is fully rendered
  setTimeout(() => {
    console.log('Canvas elements:', {
      pie: pieChartCanvas.value,
      trend: trendChartCanvas.value
    })
    
    createPieChart()
    createTrendChart()
  }, 300)
}

// Watchers
watch(pieChartData, () => {
  console.log('Pie chart data changed, recreating chart...')
  createPieChart()
}, { deep: true })

watch(jobAnalyticsFilter, () => {
  console.log('Filter changed:', jobAnalyticsFilter.value)
})

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
  initializeCharts()
})

onBeforeUnmount(() => {
  console.log('Component unmounting, destroying charts...')
  if (pieChartInstance) {
    pieChartInstance.destroy()
    pieChartInstance = null
  }
  if (trendChartInstance) {
    trendChartInstance.destroy()
    trendChartInstance = null
  }
})
</script>

<style scoped>
/* All your existing CSS styles remain the same */
.minimal-card {
  border: 1px solid #e5e7eb;
  box-shadow: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.minimal-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.stat-card-minimal {
  border: 1px solid #f3f4f6;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-height: 80px;
  cursor: pointer;
}

.stat-card-minimal:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-value {
  color: #374151;
  font-weight: 600;
  font-size: 1.8rem;
  line-height: 1.2;
}

.stat-label {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-card {
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.chart-card:hover {
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.full-height {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.full-height .q-card__section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-container {
  width: 100%;
  height: 320px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 10px;
}

.filter-select {
  min-width: 200px;
  max-width: 250px;
}

.filter-select .q-field__control {
  border-radius: 6px;
}

.analytics-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  margin: 0 16px;
}

.responsive-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.responsive-table .q-table__top {
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
}

.responsive-table .q-table thead tr {
  background: #f8fafc;
}

.responsive-table .q-table thead th {
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px 12px;
}

.responsive-table .q-table tbody tr {
  transition: all 0.2s ease;
}

.responsive-table .q-table tbody tr:hover {
  background: #f8fafc;
}

.responsive-table .q-table tbody td {
  padding: 12px;
  color: #4b5563;
  font-size: 0.875rem;
}

.main-content {
  background: #ffffff;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .chart-container {
    height: 280px;
  }
  
  .analytics-section {
    margin: 0 8px;
  }
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
  
  .stat-card-minimal {
    min-height: 70px;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .filter-select {
    min-width: 150px;
  }
  
  .analytics-section {
    margin: 0;
    border-radius: 8px;
  }
}

@media (max-width: 599px) {
  .chart-container {
    height: 220px;
    padding: 5px;
  }
  
  .stat-card-minimal {
    min-height: 60px;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.6875rem;
  }
  
  .filter-select {
    min-width: 140px;
  }
  
  .q-pa-lg {
    padding: 12px !important;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 200px;
  }
  
  .responsive-table .q-table thead th,
  .responsive-table .q-table tbody td {
    padding: 8px 6px;
    font-size: 0.8125rem;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card-minimal {
  animation: fadeInUp 0.6s ease-out;
}

.stat-card-minimal:nth-child(1) { animation-delay: 0.1s; }
.stat-card-minimal:nth-child(2) { animation-delay: 0.2s; }
.stat-card-minimal:nth-child(3) { animation-delay: 0.3s; }
.stat-card-minimal:nth-child(4) { animation-delay: 0.4s; }

.chart-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.chart-container.loading::before {
  opacity: 1;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.stat-card-minimal:focus {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.chart-card:focus-within {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

@media print {
  .analytics-section {
    background: none !important;
    box-shadow: none !important;
  }
  
  .chart-card,
  .minimal-card,
  .stat-card-minimal {
    box-shadow: none !important;
    border: 1px solid #000 !important;
  }
  
  .chart-container {
    height: 300px !important;
  }
}
</style>