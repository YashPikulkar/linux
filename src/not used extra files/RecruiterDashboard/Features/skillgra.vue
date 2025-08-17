<template>
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
              <canvas ref="jobSkillsChartCanvas" v-if="!isLoadingSkills"></canvas>
              <div v-else class="loading-container">
                <q-spinner-dots size="50px" color="primary" />
                <div class="text-caption q-mt-sm">Loading job skills data...</div>
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
              <canvas ref="applicantSkillsChartCanvas" v-if="!isLoadingSkills"></canvas>
              <div v-else class="loading-container">
                <q-spinner-dots size="50px" color="orange" />
                <div class="text-caption q-mt-sm">Loading applicant skills data...</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
// Reference: Chart.js documentation https://www.chartjs.org/docs/latest/
// Chart.js is used for rendering all line and pie charts in this component.
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store' 

const userStore = useUserStore();
const token = userStore.token || sessionStorage.getItem("token");
const $q = useQuasar()

// Chart refs
const jobSkillsChartCanvas = ref(null)
const applicantSkillsChartCanvas = ref(null)

// Loading states
const isLoadingSkills = ref(false)

// Set larger chart sizes after mount
function setLargeChartSizes() {
  if (jobSkillsChartCanvas.value) {
    jobSkillsChartCanvas.value.width = 700;
    jobSkillsChartCanvas.value.height = 500;
  }
  if (applicantSkillsChartCanvas.value) {
    applicantSkillsChartCanvas.value.width = 700;
    applicantSkillsChartCanvas.value.height = 500;
  }
}

// Import Chart.js library
import Chart from './charts.js'
let applicantSkillsChartInstance = null
let jobSkillsChartInstance = null

// Skills data - Only "all time" data
const skillsData = ref({
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git'],
  jobDemand: [88, 80, 82, 76, 72, 68, 55, 86],
  applicantSkills: [78, 70, 72, 73, 62, 50, 45, 81]
})

// API Integration for Skills Data
const fetchSkillsData = async () => {
  isLoadingSkills.value = true
  try {
    // Fetch job skills required data
    const jobSkillsResponse = await fetch('http://localhost:3000/jobs/skillsRequired', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    // Fetch applicant skills available data
    const applicantSkillsResponse = await fetch('http://localhost:3000/jobs/applicantSkills', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (jobSkillsResponse.ok && applicantSkillsResponse.ok) {
      const jobSkillsData = await jobSkillsResponse.json()
      const applicantSkillsData = await applicantSkillsResponse.json()
      
      // Update skills data with API response
      skillsData.value = {
        skills: jobSkillsData.skills || skillsData.value.skills,
        jobDemand: jobSkillsData.demand || skillsData.value.jobDemand,
        applicantSkills: applicantSkillsData.skills || skillsData.value.applicantSkills
      }

      console.log('Updated skills data:', skillsData.value)
      
      // Recreate charts with new data
      await nextTick()
      createJobSkillsChart()
      createApplicantSkillsChart()
    } else {
      console.error('Failed to fetch skills data')
      // Use fallback data if API fails
      generateFallbackSkillsData()
    }
  } catch (error) {
    console.error('Error fetching skills data:', error)
    // Use fallback data on error
    generateFallbackSkillsData()
  } finally {
    isLoadingSkills.value = false
  }
}

const generateFallbackSkillsData = () => {
  // Generate some realistic mock data if API fails
  const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git']
  const jobDemand = skills.map(() => Math.floor(Math.random() * 40) + 50) // 50-90%
  const applicantSkills = skills.map((skill, index) => 
    Math.max(20, jobDemand[index] - Math.floor(Math.random() * 20)) // 20-80%, usually lower than demand
  )

  skillsData.value = { skills, jobDemand, applicantSkills }
  
  // Recreate charts with fallback data
  createJobSkillsChart()
  createApplicantSkillsChart()
}

const refreshSkillsData = () => {
  fetchSkillsData()
}

// Chart creation functions using Chart.js
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
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: Math.max(...data.jobDemand) + 20,
          ticks: {
            stepSize: 10 // Each grid value is 10
          },
          grid: {
            drawOnChartArea: true,
            color: '#e0e0e0'
          }
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
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: Math.max(...data.applicantSkills) + 20,
          ticks: {
            stepSize: 10 // Each grid value is 10
          },
          grid: {
            drawOnChartArea: true,
            color: '#e0e0e0'
          }
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
  setLargeChartSizes()
  setTimeout(() => {
    createJobSkillsChart()
    createApplicantSkillsChart()
  }, 100)
}

// Lifecycle hooks
onMounted(() => {
  initializeCharts();
  fetchSkillsData(); // Fetch real data from API
})

onBeforeUnmount(() => {
  // Clean up chart instances
  if (jobSkillsChartInstance) {
    jobSkillsChartInstance.destroy()
    jobSkillsChartInstance = null
  }
  if (applicantSkillsChartInstance) {
    applicantSkillsChartInstance.destroy()
    applicantSkillsChartInstance = null
  }
})

// Expose refresh function for parent components
defineExpose({
  refreshSkillsData
})
</script>

<style scoped>
/* Skills Section Styling */
.skills-section {
  background: #f8fafc;
}

/* Enhanced Chart Cards */
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .skills-chart-container {
    height: 420px;
  }
}

@media (max-width: 768px) {
  .skills-chart-container {
    height: 360px;
    padding: 10px;
  }
}

@media (max-width: 599px) {
  .skills-chart-container {
    height: 320px;
  }
  
  /* Ensure tooltips work properly on mobile */
  .skills-chart-container canvas {
    touch-action: none;
  }
}
</style>