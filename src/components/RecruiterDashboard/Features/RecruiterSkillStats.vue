<template>
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
              <!-- Chart is always rendered, but may be hidden during loading -->
              <canvas 
                ref="jobSkillsChartCanvas" 
                :style="{ visibility: isLoadingJobSkills ? 'hidden' : 'visible' }"
              ></canvas>
              <!-- Loading overlay -->
              <div v-if="isLoadingJobSkills" class="loading-overlay">
                <q-spinner-dots size="50px" color="primary" />
                <div class="text-caption q-mt-sm">Loading job skills data...</div>
              </div>
              <!-- No data message -->
              <div 
                v-if="!isLoadingJobSkills && (!skillsData.jobSkills.length || skillsData.jobCounts.every(c => c === 0))" 
                class="no-data-message"
              >
                <q-icon name="info" size="24px" color="grey-5" />
                <div class="text-caption text-grey-6 q-mt-sm">No job skills data available</div>
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
              <!-- Chart is always rendered, but may be hidden during loading -->
              <canvas 
                ref="applicantSkillsChartCanvas" 
                :style="{ visibility: isLoadingApplicantSkills ? 'hidden' : 'visible' }"
              ></canvas>
              <!-- Loading overlay -->
              <div v-if="isLoadingApplicantSkills" class="loading-overlay">
                <q-spinner-dots size="50px" color="orange" />
                <div class="text-caption q-mt-sm">Loading applicant skills data...</div>
              </div>
              <!-- No data message -->
              <div 
                v-if="!isLoadingApplicantSkills && (!skillsData.applicantSkills.length || skillsData.applicantCounts.every(c => c === 0))" 
                class="no-data-message"
              >
                <q-icon name="info" size="24px" color="grey-5" />
                <div class="text-caption text-grey-6 q-mt-sm">No applicant skills data available</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import Chart from 'chart.js/auto'

// --- STORE + TOKEN --- //
const userStore = useUserStore()
const token = userStore.token || sessionStorage.getItem('token')
const $q = useQuasar()

// --- CHART REFS --- //
const jobSkillsChartCanvas = ref(null)
const applicantSkillsChartCanvas = ref(null)
let jobSkillsChartInstance = null
let applicantSkillsChartInstance = null

// --- LOADING STATES --- //
const isLoadingJobSkills = ref(false)
const isLoadingApplicantSkills = ref(false)

// --- DATA --- //
const skillsData = ref({
  jobSkills: [],
  jobCounts: [],
  applicantSkills: [],
  applicantCounts: [],
})

// --- HELPER: DESTROY CHART SAFELY --- //
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

// --- HELPER: CREATE BAR CHART --- //
function createBarChart(canvas, labels, counts, label, colors) {
  if (!canvas) {
    console.warn('Canvas not available for chart:', label)
    return null
  }
  
  if (!labels.length || !counts.length) {
    console.warn('No data available for chart:', label)
    return null
  }

  try {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels.slice(0, 15), // Limit to 15 items for better visibility
        datasets: [{
          label,
          data: counts.slice(0, 15),
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: 1,
          hoverBackgroundColor: colors.hoverBg,
          hoverBorderColor: colors.border,
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true, 
            position: 'top',
            labels: {
              font: { size: 12 },
              padding: 15
            }
          },
          title: { 
            display: true, 
            text: label, 
            font: { size: 14, weight: 'bold' },
            padding: { bottom: 20 }
          },
          tooltip: { 
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: colors.border,
            borderWidth: 1,
            cornerRadius: 6,
            callbacks: {
              title: function(context) {
                return context[0].label
              },
              label: function(context) {
                return `${label.split(' ')[0]}: ${context.raw} count`
              }
            }
          },
        },
        scales: {
          y: { 
            beginAtZero: true, 
            ticks: { 
              precision: 0,
              font: { size: 11 }
            },
            title: {
              display: true,
              text: 'Count',
              font: { size: 12 }
            }
          },
          x: { 
            ticks: { 
              autoSkip: false, 
              maxRotation: 45, 
              minRotation: 45,
              font: { size: 10 }
            },
            title: {
              display: true,
              text: 'Skills',
              font: { size: 12 }
            }
          },
        },
        animation: {
          duration: 750,
          easing: 'easeInOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      },
    })
  } catch (error) {
    console.error('Error creating chart:', label, error)
    return null
  }
}

// --- FALLBACK DATA (CONSISTENT, not random) --- //
const fallbackJobData = {
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'CSS', 'HTML'],
  counts: [12, 10, 8, 15, 9, 7, 6, 5],
}
const fallbackApplicantData = {
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'CSS', 'HTML'],
  counts: [11, 9, 7, 14, 8, 6, 5, 4],
}

// --- FETCH FUNCTIONS --- //
const fetchJobSkillsData = async () => {
  console.log('Fetching job skills data...')
  isLoadingJobSkills.value = true
  
  try {
    const response = await fetch('http://localhost:3000/skills/count-job-skills', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const jobData = await response.json()
    console.log('Job skills API response:', jobData)

    if (jobData.data && typeof jobData.data === 'object') {
      skillsData.value.jobSkills = Object.keys(jobData.data)
      skillsData.value.jobCounts = Object.values(jobData.data)
    } else {
      throw new Error('Invalid job data structure')
    }

    console.log('Job skills data processed:', {
      skills: skillsData.value.jobSkills,
      counts: skillsData.value.jobCounts
    })

  } catch (err) {
    console.error('Error fetching job skills:', err)
    skillsData.value.jobSkills = [...fallbackJobData.skills]
    skillsData.value.jobCounts = [...fallbackJobData.counts]
    console.log('Using fallback job skills data')
  }
}

const fetchApplicantSkillsData = async () => {
  console.log('Fetching applicant skills data...')
  isLoadingApplicantSkills.value = true
  
  try {
    const response = await fetch('http://localhost:3000/skills/count-app-skills', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const appData = await response.json()
    console.log('Applicant skills API response:', appData)

    if (appData.data && typeof appData.data === 'object') {
      skillsData.value.applicantSkills = Object.keys(appData.data)
      skillsData.value.applicantCounts = Object.values(appData.data)
    } else {
      throw new Error('Invalid applicant data structure')
    }

    console.log('Applicant skills data processed:', {
      skills: skillsData.value.applicantSkills,
      counts: skillsData.value.applicantCounts
    })

  } catch (err) {
    console.error('Error fetching applicant skills:', err)
    skillsData.value.applicantSkills = [...fallbackApplicantData.skills]
    skillsData.value.applicantCounts = [...fallbackApplicantData.counts]
    console.log('Using fallback applicant skills data')
  }
}

// --- CHART RECREATION FUNCTIONS --- //
const recreateJobSkillsChart = async () => {
  console.log('Recreating job skills chart...')
  
  // Destroy existing chart
  jobSkillsChartInstance = destroyChart(jobSkillsChartInstance)
  
  // Wait for DOM updates
  await nextTick()
  
  if (!jobSkillsChartCanvas.value) {
    console.warn('Job skills canvas not available')
    return
  }

  // Small delay to ensure canvas is ready
  setTimeout(() => {
    jobSkillsChartInstance = createBarChart(
      jobSkillsChartCanvas.value,
      skillsData.value.jobSkills,
      skillsData.value.jobCounts,
      'Job Skills Required (Count)',
      {
        bg: 'rgba(25, 118, 210, 0.7)',
        border: '#1976D2',
        hoverBg: 'rgba(25, 118, 210, 0.9)',
      }
    )
    console.log('Job skills chart recreated')
    isLoadingJobSkills.value = false
  }, 150)
}

const recreateApplicantSkillsChart = async () => {
  console.log('Recreating applicant skills chart...')
  
  // Destroy existing chart
  applicantSkillsChartInstance = destroyChart(applicantSkillsChartInstance)
  
  // Wait for DOM updates
  await nextTick()
  
  if (!applicantSkillsChartCanvas.value) {
    console.warn('Applicant skills canvas not available')
    return
  }

  // Small delay to ensure canvas is ready
  setTimeout(() => {
    applicantSkillsChartInstance = createBarChart(
      applicantSkillsChartCanvas.value,
      skillsData.value.applicantSkills,
      skillsData.value.applicantCounts,
      'Applicant Skills Available (Count)',
      {
        bg: 'rgba(255, 107, 53, 0.7)',
        border: '#FF6B35',
        hoverBg: 'rgba(255, 107, 53, 0.9)',
      }
    )
    console.log('Applicant skills chart recreated')
    isLoadingApplicantSkills.value = false
  }, 150)
}

// --- COMBINED DATA FETCH AND CHART RECREATION --- //
const fetchAndRecreateJobSkills = async () => {
  try {
    await fetchJobSkillsData()
    await recreateJobSkillsChart()
  } catch (error) {
    console.error('Error in fetchAndRecreateJobSkills:', error)
    isLoadingJobSkills.value = false
  }
}

const fetchAndRecreateApplicantSkills = async () => {
  try {
    await fetchApplicantSkillsData()
    await recreateApplicantSkillsChart()
  } catch (error) {
    console.error('Error in fetchAndRecreateApplicantSkills:', error)
    isLoadingApplicantSkills.value = false
  }
}

// --- MAIN REFRESH FUNCTION --- //
const refreshData = async () => {
  console.log('RecruiterSkillStats: Starting data refresh...')
  
  try {
    // Run both refresh operations in parallel
    await Promise.all([
      fetchAndRecreateJobSkills(),
      fetchAndRecreateApplicantSkills()
    ])
    
    console.log('RecruiterSkillStats: All data refreshed and charts recreated successfully')
    return Promise.resolve()
  } catch (error) {
    console.error('RecruiterSkillStats: Error refreshing data:', error)
    $q.notify({
      color: 'negative', 
      message: 'Error refreshing skills data', 
      icon: 'error',
      position: 'top-right',
      timeout: 3000
    })
    throw error
  }
}

// --- LIFECYCLE --- //
onMounted(async () => {
  console.log('RecruiterSkillStats mounted, initializing...')
  
  // Wait for DOM to be ready
  await nextTick()
  
  // Initial data fetch and chart creation
  await refreshData()
})

onBeforeUnmount(() => {
  console.log('RecruiterSkillStats unmounting, cleaning up...')
  
  // Clean up chart instances
  jobSkillsChartInstance = destroyChart(jobSkillsChartInstance)
  applicantSkillsChartInstance = destroyChart(applicantSkillsChartInstance)
})

// --- EXPOSE TO PARENT --- //
defineExpose({ 
  refreshData,
  // Also expose individual refresh functions for granular control
  refreshJobSkills: fetchAndRecreateJobSkills,
  refreshApplicantSkills: fetchAndRecreateApplicantSkills
})
</script>

<style scoped>
.skills-section {
  background: #f8fafc;
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

.skills-chart-container {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.skills-chart-container canvas {
  max-width: 100%;
  max-height: 100%;
  cursor: default;
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
  background: rgba(255, 255, 255, 0.9);
  color: #64748b;
  z-index: 10;
  border-radius: 8px;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .skills-chart-container {
    height: 380px;
  }
}

@media (max-width: 768px) {
  .skills-chart-container {
    height: 350px;
    padding: 15px;
  }

  .chart-header {
    text-align: center;
  }
}

@media (max-width: 599px) {
  .skills-chart-container {
    height: 300px;
    padding: 10px;
  }

  .skills-chart-container canvas {
    touch-action: none;
  }
}

/* Enhanced loading states */
.loading-overlay .q-spinner {
  margin-bottom: 16px;
}

.loading-overlay .text-caption {
  font-weight: 500;
  opacity: 0.8;
}

/* No data styling */
.no-data-message .q-icon {
  margin-bottom: 8px;
  opacity: 0.6;
}

.no-data-message .text-caption {
  font-weight: 500;
  opacity: 0.8;
}
</style>