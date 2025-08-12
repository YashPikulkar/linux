<!-- AnalyticsRecords.vue -->
<template>
  <!-- Job Posting Analytics Header -->
  <div class="analytics-header q-pa-lg">
    <div class="row justify-between items-center">
      <div>
        <h4 class="text-h4 q-ma-none text-weight-bold">Job Posting Analytics</h4>
        <p class="text-subtitle1 text-grey-7 q-mt-sm">Track and monitor your job posting performance</p>
      </div>
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
  </div>

  <!-- Job Posting Stats Cards - All in one row -->
  <div class="stats-section q-px-lg">
    <div class="row q-gutter-md">
      <div
        class="col"
        v-for="(stat, index) in jobAnalyticsStats"
        :key="index"
      >
        <q-card class="stat-card-enhanced">
          <q-card-section class="text-center">
            <div class="stat-icon-wrapper q-mb-sm">
              <q-icon :name="stat.icon" size="32px" :color="stat.color" />
            </div>
            <div class="text-h3 stat-value-enhanced" :class="`text-${stat.color}`">
              {{ stat.value }}
            </div>
            <div class="text-body2 stat-label-enhanced">{{ stat.label }}</div>
            <div class="text-caption text-grey-6 q-mt-xs" v-if="stat.change">
              <q-icon 
                :name="stat.change > 0 ? 'trending_up' : 'trending_down'" 
                :color="stat.change > 0 ? 'positive' : 'negative'"
                size="16px"
              />
              {{ Math.abs(stat.change) }}% from last month
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <!-- Analytics Charts - Side by Side -->
  <div class="charts-section q-pa-lg">
    <div class="row q-col-gutter-lg">
      <!-- Application Status Pie Chart -->
      <div class="col-12 col-md-6">
        <q-card class="chart-card-enhanced">
          <q-card-section>
            <div class="chart-header">
              <div class="text-h6">Application Status Distribution</div>
              <div class="text-caption text-grey-6">Current job applications breakdown</div>
            </div>
            <div class="chart-container">
              <canvas ref="pieChartCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Monthly Trend Line Chart -->
      <div class="col-12 col-md-6">
        <q-card class="chart-card-enhanced">
          <q-card-section>
            <div class="chart-header">
              <div class="text-h6">Job Posting Performance Trend</div>
              <div class="text-caption text-grey-6">Monthly applications received in 2025</div>
            </div>
            <div class="chart-container">
              <canvas ref="trendChartCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <!-- Skills Analytics Charts - Side by Side -->
  <div class="skills-section q-pa-lg">
    <div class="row q-col-gutter-lg">
      <!-- Job Skills Required Chart -->
      <div class="col-12 col-md-6">
        <q-card class="chart-card-enhanced">
          <q-card-section>
            <div class="chart-header">
              <div class="text-h6">Job Skills Required</div>
              <div class="text-caption text-grey-6">Skills demand in job postings (All Time)</div>
            </div>
            <div class="skills-chart-container">
              <canvas ref="jobSkillsChartCanvas"></canvas>
            </div>
            <div class="skills-legend q-mt-md">
              <div class="row justify-center">
                <div class="legend-item">
                  <div class="legend-color job-skills"></div>
                  <span class="text-caption">Job Skills Required (%)</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Applicant Skills Available Chart -->
      <div class="col-12 col-md-6">
        <q-card class="chart-card-enhanced">
          <q-card-section>
            <div class="chart-header">
              <div class="text-h6">Applicant Skills Available</div>
              <div class="text-caption text-grey-6">Skills competency among applicants (All Time)</div>
            </div>
            <div class="skills-chart-container">
              <canvas ref="applicantSkillsChartCanvas"></canvas>
            </div>
            <div class="skills-legend q-mt-md">
              <div class="row justify-center">
                <div class="legend-item">
                  <div class="legend-color applicant-skills"></div>
                  <span class="text-caption">Applicant Skills Available (%)</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <!-- Top Performing Job Posts -->
  <div class="table-section q-pa-lg">
    <q-card class="table-card-enhanced">
      <q-card-section>
        <div class="table-header q-mb-md">
          <div class="text-h6">Top Performing Job Posts</div>
          <div class="text-caption text-grey-6">Jobs with highest application rates and engagement</div>
        </div>

        <q-table
          flat
          bordered
          :rows="topJobPosts"
          :columns="jobPostColumns"
          row-key="title"
          class="enhanced-table"
          :grid="$q.screen.xs"
          :rows-per-page-options="[10, 20, 50]"
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

          <!-- Mobile Grid Template -->
          <template v-slot:item="props" v-if="$q.screen.xs">
            <div class="col-12">
              <q-card class="mobile-job-card q-ma-sm">
                <q-card-section>
                  <div class="text-weight-bold text-primary">{{ props.row.title }}</div>
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
</template>

<script setup>
// Reference: Chart.js documentation https://www.chartjs.org/docs/latest/
// Chart.js is used for rendering all line and pie charts in this component.
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Chart refs
const pieChartCanvas = ref(null)
const trendChartCanvas = ref(null)
const jobSkillsChartCanvas = ref(null)
const applicantSkillsChartCanvas = ref(null)

// Import Chart.js library
import Chart from 'chart.js/auto'
let applicantSkillsChartInstance = null
let jobSkillsChartInstance = null
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

// Skills data - Only "all time" data
const skillsData = ref({
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git'],
  jobDemand: [88, 80, 82, 76, 72, 68, 55, 86],
  applicantSkills: [78, 70, 72, 73, 62, 50, 45, 81]
})

const jobAnalyticsFilter = ref('all')

const jobFilterOptions = [
  { label: 'All Jobs', value: 'all' },
  { label: 'Open Only', value: 'open' },
  { label: 'Closed Only', value: 'closed' },
  { label: 'Active (Open + Interviewing)', value: 'active' }
]

const topJobPosts = ref([
  { title: 'Senior Backend Engineer', applicants: 120, rate: 45, status: 'Interviewing', posted: '2025-01-01' },
  { title: 'Frontend Developer', applicants: 150, rate: 60, status: 'Open', posted: '2025-02-01' },
  { title: 'DevOps Engineer', applicants: 110, rate: 52, status: 'Open', posted: '2025-03-01' },
  { title: 'UI/UX Designer', applicants: 89, rate: 38, status: 'Closed', posted: '2025-01-15' },
  { title: 'Product Manager', applicants: 95, rate: 42, status: 'Interviewing', posted: '2025-02-20' }
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

const getStatusColor = (status) => {
  const colors = {
    'Open': 'positive',
    'Closed': 'grey',
    'Interviewing': 'warning',
    'Pending': 'info'
  }
  return colors[status] || 'grey'
}

const getRateColor = (rate) => {
  if (rate >= 60) return 'positive'
  if (rate >= 40) return 'warning'
  return 'negative'
}

// Computed properties
const pieChartData = computed(() => {
  const pending = getStatusCount('pending')
  const accepted = getStatusCount('accepted')
  const rejected = getStatusCount('rejected')

  return {
    labels: ['Pending', 'Accepted', 'Rejected'],
    counts: [pending, accepted, rejected],
    colors: ['#FF9800', '#4CAF50', '#F44336']
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
    { 
      value: totalJobs, 
      label: 'Total Job Posts', 
      icon: 'work',
      color: 'primary',
      change: 12 
    },
    { 
      value: totalApplicants, 
      label: 'Total Applicants', 
      icon: 'people',
      color: 'positive',
      change: 8 
    },
    { 
      value: `${avgRate}%`, 
      label: 'Avg Success Rate', 
      icon: 'trending_up',
      color: 'warning',
      change: -3 
    },
    { 
      value: activeJobs, 
      label: 'Active Jobs', 
      icon: 'play_circle',
      color: 'info',
      change: 5 
    }
  ]
})

// Table columns
const jobPostColumns = [
  { 
    name: 'title', 
    label: 'Job Title', 
    field: 'title', 
    sortable: true, 
    align: 'left',
    style: 'width: 40%'
  },
  { 
    name: 'applicants', 
    label: 'Applicants', 
    field: 'applicants', 
    sortable: true, 
    align: 'center',
    style: 'width: 20%'
  },
  { 
    name: 'rate', 
    label: 'Success Rate', 
    field: 'rate', 
    sortable: true, 
    align: 'center',
    style: 'width: 20%'
  },
  { 
    name: 'status', 
    label: 'Status', 
    field: 'status', 
    sortable: true, 
    align: 'center',
    style: 'width: 20%'
  }
]

// Chart creation functions using native Canvas API for compatibility
function createPieChart() {
  if (!pieChartCanvas.value) return

  const canvas = pieChartCanvas.value
  const ctx = canvas.getContext('2d')
  const data = pieChartData.value
  
  // Set canvas size
  canvas.width = 350
  canvas.height = 350
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 80
  
  const total = data.counts.reduce((sum, count) => sum + count, 0)
  let currentAngle = -Math.PI / 2 // Start from top
  
  const slices = []
  
  // Draw pie slices and store slice data
  data.counts.forEach((count, index) => {
    if (count > 0) {
      const sliceAngle = (count / total) * 2 * Math.PI
      
      // Store slice data for hover detection
      slices.push({
        startAngle: currentAngle,
        endAngle: currentAngle + sliceAngle,
        color: data.colors[index],
        label: data.labels[index],
        value: count,
        percentage: ((count / total) * 100).toFixed(1)
      })
      
      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = data.colors[index]
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.stroke()
      
      // Draw value labels inside slices
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(count.toString(), labelX, labelY)
      
      currentAngle += sliceAngle
    }
  })
  
  // Draw legend
  const legendX = centerX + radius + 20
  let legendY = centerY - (data.labels.length * 25) / 2
  
  data.labels.forEach((label, index) => {
    if (data.counts[index] > 0) {
      // Legend color box
      ctx.fillStyle = data.colors[index]
      ctx.fillRect(legendX, legendY - 8, 16, 16)
      
      // Legend text
      ctx.fillStyle = '#333'
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${label}: ${data.counts[index]} (${((data.counts[index] / total) * 100).toFixed(1)}%)`, legendX + 24, legendY)
      
      legendY += 25
    }
  })
  
  // Add hover functionality
  canvas.onmousemove = (event) => {
    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance <= radius) {
      let angle = Math.atan2(dy, dx) + Math.PI / 2
      if (angle < 0) angle += 2 * Math.PI
      
      const hoveredSlice = slices.find(slice => 
        angle >= slice.startAngle && angle <= slice.endAngle
      )
      
      if (hoveredSlice) {
        canvas.style.cursor = 'pointer'
        canvas.title = `${hoveredSlice.label}: ${hoveredSlice.value} (${hoveredSlice.percentage}%)`
      } else {
        canvas.style.cursor = 'default'
        canvas.title = ''
      }
    } else {
      canvas.style.cursor = 'default'
      canvas.title = ''
    }
  }
}

function createTrendChart() {
  if (!trendChartCanvas.value) return

  // Destroy previous instance if exists
  if (trendChartInstance) {
    trendChartInstance.destroy()
  }

  const data = monthlyTrend.value
  trendChartInstance = new Chart(trendChartCanvas.value, {
    type: 'line',
    data: {
      labels: data.map(d => d.month),
      datasets: [
        {
          label: 'Applications',
          data: data.map(d => d.applications),
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25,118,210,0.2)',
          tension: 0.4,
          pointBackgroundColor: '#1976D2',
          pointBorderColor: '#fff',
          pointRadius: 6,
          pointHoverRadius: 10,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: 'Job Posting Performance Trend' },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          title: { display: true, text: 'Applications' },
          beginAtZero: true
        },
        x: {
          title: { display: true, text: 'Month' }
        }
      }
    }
  })
}

function createJobSkillsChart() {
  if (!jobSkillsChartCanvas.value) return

  // Destroy previous instance if exists
  if (jobSkillsChartInstance) {
    jobSkillsChartInstance.destroy()
  }

  const data = skillsData.value
  jobSkillsChartInstance = new Chart(jobSkillsChartCanvas.value, {
    type: 'line',
    data: {
      labels: data.skills,
      datasets: [
        {
          label: 'Job Skills Required (%)',
          data: data.jobDemand,
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25,118,210,0.2)',
          tension: 0.4,
          pointBackgroundColor: '#1976D2',
          pointBorderColor: '#fff',
          pointRadius: 5,
          pointHoverRadius: 8,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: 'Job Skills Required' },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          title: { display: true, text: 'Demand (%)' },
          beginAtZero: true
        },
        x: {
          title: { display: true, text: 'Skills' }
        }
      }
    }
  })
}

function createApplicantSkillsChart() {
  if (!applicantSkillsChartCanvas.value) return

  // Destroy previous instance if exists
  if (applicantSkillsChartInstance) {
    applicantSkillsChartInstance.destroy()
  }

  const data = skillsData.value
  applicantSkillsChartInstance = new Chart(applicantSkillsChartCanvas.value, {
    type: 'line',
    data: {
      labels: data.skills,
      datasets: [
        {
          label: 'Applicant Skills Available (%)',
          data: data.applicantSkills,
          borderColor: '#FF6B35',
          backgroundColor: 'rgba(255,107,53,0.2)',
          tension: 0.4,
          pointBackgroundColor: '#FF6B35',
          pointBorderColor: '#fff',
          pointRadius: 5,
          pointHoverRadius: 8,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: 'Applicant Skills Available' },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          title: { display: true, text: 'Available (%)' },
          beginAtZero: true
        },
        x: {
          title: { display: true, text: 'Skills' }
        }
      }
    }
  })
}

// Initialize charts function
const initializeCharts = async () => {
  await nextTick()
  setTimeout(() => {
    createPieChart()
    createTrendChart()
    createJobSkillsChart()
    createApplicantSkillsChart()
  }, 100)
}

// Watchers
watch(pieChartData, () => {
  createPieChart()
}, { deep: true })

watch(jobAnalyticsFilter, () => {
  // Recreate charts when filter changes
  setTimeout(() => {
    createPieChart()
    createTrendChart()
    createJobSkillsChart()
    createApplicantSkillsChart()
  }, 50)
})

// Lifecycle hooks
onMounted(() => {
  initializeCharts()
})

onBeforeUnmount(() => {
  // Clean up if needed
  pieChartInstance = null
  if (trendChartInstance) {
    trendChartInstance.destroy()
    trendChartInstance = null
  }
  if (jobSkillsChartInstance) {
    jobSkillsChartInstance.destroy()
    jobSkillsChartInstance = null
  }
  if (applicantSkillsChartInstance) {
    applicantSkillsChartInstance.destroy()
    applicantSkillsChartInstance = null
  }
})
</script>

<style scoped>
/* Header Styling */
.analytics-header {
  background: linear-gradient(135deg, black 0%, grey 100%);
  color: white;
  margin: -16px -16px 0 -16px;
}

.analytics-header .filter-select {
  min-width: 200px;
}

.analytics-header .filter-select >>> .q-field__control {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.analytics-header .filter-select >>> .q-field__native {
  color: white;
}

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

/* Enhanced Chart Cards */
.charts-section {
  background: white;
}

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
}

.chart-container {
  width: 100%;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.chart-container canvas {
  max-width: 100%;
  max-height: 100%;
  cursor: default;
}

/* Skills Section Styling */
.skills-section {
  background: #f8fafc;
}

.skills-chart-container {
  width: 100%;
  height: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-x: auto;
}

.skills-chart-container canvas {
  max-width: 100%;
  max-height: 100%;
  cursor: default;
}

.skills-legend {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
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

.legend-color.job-skills {
  background-color: #1976D2;
}

.legend-color.applicant-skills {
  background-color: #FF6B35;
}

/* Enhanced Table */
.table-section {
  background: white;
}

.table-card-enhanced {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
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
  padding: 16px 12px;
  border-bottom: 2px solid #e2e8f0;
}

.enhanced-table >>> .q-table tbody tr {
  transition: background-color 0.2s;
}

.enhanced-table >>> .q-table tbody tr:hover {
  background: #f8fafc;
}

.enhanced-table >>> .q-table tbody td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.status-badge {
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.rate-cell {
  min-width: 100px;
}

.rate-text {
  font-weight: 600;
  color: #374151;
}

.rate-progress {
  width: 60px;
  margin: 0 auto;
}

.mobile-job-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stat-value-enhanced {
    font-size: 2rem;
  }
  
  .chart-container {
    height: 320px;
  }
  
  .skills-chart-container {
    height: 420px;
  }
}

@media (max-width: 768px) {
  .analytics-header {
    text-align: center;
  }
  
  .analytics-header .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-card-enhanced {
    min-height: 140px;
  }
  
  .stat-value-enhanced {
    font-size: 1.8rem;
  }
  
  .chart-container {
    height: 280px;
    padding: 10px;
  }
  
  .skills-chart-container {
    height: 360px;
    padding: 10px;
  }
}

@media (max-width: 599px) {
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
  
  .chart-container {
    height: 250px;
  }
  
  .skills-chart-container {
    height: 320px;
  }
  
  .skills-legend .row {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  
  /* Ensure tooltips work properly on mobile */
  .chart-container canvas,
  .skills-chart-container canvas {
    touch-action: none;
  }
}
</style>