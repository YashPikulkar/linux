<template>
  <q-dialog v-model="jobsStore.applicationDialogVisible" persistent @hide="closeDialog">
    <q-card flat bordered class="q-pa-lg dialog-card">
      <!-- Close icon -->
      <q-btn icon="close" flat round dense color="grey-6" class="close-icon" @click="closeDialog" />

      <div v-if="normalizedJob" class="scroll">
        <div class="centered-div">
          <!-- Main application card -->
          <q-card class="application-card" flat bordered>
            <div class="q-pa-lg">
              <!-- Company header -->
              <div class="company-header">
                <div class="company-info">
                  <div class="company-name">{{ normalizedJob.name }}</div>
                  <div class="job-title-large">{{ normalizedJob.title }}</div>
                  <div class="job-meta-info">
                    ₹{{ normalizedJob.salary }} &nbsp;|&nbsp;
                    {{ normalizedJob.location }} &nbsp;|&nbsp; {{ normalizedJob.type }}
                  </div>
                </div>
              </div>

              <q-separator spaced class="q-my-lg" />

              <!-- Quick info grid -->
              <div class="row q-col-gutter-lg q-mb-lg">
                <div class="info-col">
                  <div class="text-caption text-grey-7">Experience Required</div>
                  <div class="text-body1">{{ normalizedJob.experience }}</div>
                </div>
                <div class="info-col">
                  <div class="text-caption text-grey-7">Work Policy</div>
                  <div class="text-body1">{{ normalizedJob.remotePolicy }}</div>
                </div>
                <div class="info-col">
                  <div class="text-caption text-grey-7">Openings</div>
                  <div class="text-body1">{{ normalizedJob.openings }}</div>
                </div>
                <div class="info-col">
                  <div class="text-caption text-grey-7">Education</div>
                  <div class="text-body1">{{ normalizedJob.education }}</div>
                </div>
              </div>

              <!-- Skills section -->
              <div v-if="normalizedJob.skills.length" class="skills-section q-mb-lg">
                <div class="text-caption text-grey-7 q-mb-sm">Required Skills</div>
                <div class="row q-gutter-sm">
                  <div
                    v-for="(skill, i) in normalizedJob.skills"
                    :key="i"
                    class="custom-chip custom-chip-blue"
                  >
                    {{ skill }}
                  </div>
                </div>
              </div>

              <q-separator spaced class="q-my-lg" />

              <!-- Profile status section -->
              <div class="profile-status-section">
                <div class="status-title">Application Status</div>

                <!-- ML Prediction Section -->
                <div v-if="predictionLoading" class="prediction-loading q-mb-md">
                  <q-spinner-dots size="20px" color="primary" />
                  <span class="q-ml-sm text-grey-6">Analyzing your profile...</span>
                </div>

                <div v-else-if="predictionResult" class="prediction-result q-mb-md">
                  <div
                    class="prediction-card"
                    :class="{
                      'prediction-high': predictionResult.status === 'high',
                      'prediction-medium': predictionResult.status === 'medium',
                      'prediction-low': predictionResult.status === 'low',
                    }"
                  >
                    <div class="prediction-content">
                      <q-icon
                        :name="getPredictionIcon(predictionResult.status)"
                        size="20px"
                        :class="`prediction-icon-${predictionResult.status}`"
                      />
                      <div class="prediction-text">
                        <div class="prediction-title">Match Analysis</div>
                        <div class="prediction-message">{{ predictionResult.message }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="missingCriticalInfo.length" class="status-warning">
                  <div class="warning-content">
                    <q-icon name="warning" size="20px" class="warning-icon" />
                    <div class="warning-text">
                      <div class="warning-title">Profile Incomplete</div>
                      <div class="warning-subtitle">
                        Complete your profile to apply for this position
                      </div>
                    </div>
                  </div>
                  <div class="missing-items q-mt-md">
                    <div class="missing-label">Missing information:</div>
                    <div class="missing-chips">
                      <div
                        v-for="item in missingCriticalInfo"
                        :key="item"
                        class="custom-chip custom-chip-warning"
                      >
                        {{ item }}
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else-if="!predictionLoading && !predictionResult" class="status-success">
                  <div class="success-content">
                    <q-icon name="check_circle" size="20px" class="success-icon" />
                    <div class="success-text">
                      <div class="success-title">Ready to Apply</div>
                      <div class="success-subtitle">
                        Your profile is complete and ready for submission
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator spaced class="q-my-lg" />

              <!-- Action section -->
              <div class="action-section">
                <div class="action-text q-mb-md">
                  Your profile information will be sent directly to the recruiter.
                  <router-link to="/profile" class="profile-link" @click="closeDialog">
                    Review your profile
                  </router-link>
                </div>

                <div class="action-buttons">
                  <q-btn flat label="Cancel" class="cancel-button" @click="closeDialog" />

                  <q-btn
                    v-if="missingCriticalInfo.length"
                    unelevated
                    color="primary"
                    label="Complete Profile"
                    class="primary-button"
                    @click="goToProfile"
                  />

                  <q-btn
                    v-else
                    unelevated
                    color="black"
                    label="Submit Application"
                    class="submit-button"
                    @click="sendApplication"
                  />
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <div v-else class="q-pa-md loading-container">
        <q-spinner-hourglass size="40px" color="primary" />
        <div class="loading-text q-mt-md">Loading job details...</div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { useJobsStore } from 'src/stores/job-store'
import { useUserStore } from 'src/stores/user-store'

const base = 'http://127.0.0.1:5000'

export default {
  name: 'ApplicationDialog',
  data() {
    return {
      predictionLoading: false,
      predictionResult: null,
      predictionError: null,
    }
  },
  computed: {
    jobsStore() {
      return useJobsStore()
    },
    userStore() {
      return useUserStore()
    },
    normalizedJob() {
      const job = this.jobsStore.selectedJob
      if (!job) return null

      return {
        name: job.company_name || 'Unknown Company',
        title: job.custom_title || job.job_roles || '',
        salary:
          job.salary_min && job.salary_max
            ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
            : 'Not specified',
        location: job.locations || 'N/A',
        experience:
          job.experience_min && job.experience_max
            ? `${job.experience_min} - ${job.experience_max} yrs`
            : 'N/A',
        type: job.job_type || '',
        remotePolicy: job.mode_of_work || 'N/A',
        openings: job.opening || 0,
        education: job.qualification_name || 'N/A',
        skills: job.skills ? job.skills.split(',').map((s) => s.trim()) : [],
      }
    },
    missingCriticalInfo() {
      const missing = []
      if (!this.userStore.education_level || this.userStore.education_level.trim() === '')
        missing.push('Education Level')
      if (
        !this.userStore.skills ||
        (Array.isArray(this.userStore.skills)
          ? this.userStore.skills.length === 0
          : this.userStore.skills.trim() === '')
      )
        missing.push('Skills')
      if (!this.userStore.degree || this.userStore.degree.trim() === '') missing.push('Degree')
      return missing
    },
  },
  watch: {
    // Watch for when dialog opens and job is loaded
    'jobsStore.applicationDialogVisible'(newVal) {
      if (newVal && this.jobsStore.selectedJob && this.userStore.uid) {
        this.fetchPrediction()
      }
    },
  },
  methods: {
    async fetchPrediction() {
      if (!this.jobsStore.selectedJob?.jobid || !this.userStore.uid) {
        console.log('Missing jobid or uid for prediction')
        return
      }

      this.predictionLoading = true
      this.predictionResult = null
      this.predictionError = null

      try {
        const response = await fetch(
          `${base}/predict_application?uid=${this.userStore.uid}&jobid=${this.jobsStore.selectedJob.jobid}`,
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.user_feedback) {
          this.predictionResult = data.user_feedback
          console.log('Prediction result:', data)
        } else {
          throw new Error('No user_feedback in response')
        }
      } catch (error) {
        console.error('Error fetching prediction:', error)
        this.predictionError = error.message
        // Show fallback message
        this.predictionResult = {
          status: 'medium',
          message:
            '⚠️ Unable to analyze profile at the moment. Please ensure your profile is complete.',
          color: 'orange',
        }
      } finally {
        this.predictionLoading = false
      }
    },

    getPredictionIcon(status) {
      switch (status) {
        case 'high':
          return 'check_circle'
        case 'medium':
          return 'info'
        case 'low':
          return 'trending_up'
        default:
          return 'help'
      }
    },

    closeDialog() {
      // Reset prediction data when closing
      this.predictionResult = null
      this.predictionLoading = false
      this.predictionError = null
      this.jobsStore.closeApplicationDialog()
    },

    goToProfile() {
      this.$router.push('/profile')
      this.closeDialog()
    },

    async sendApplication() {
      const jobid = this.jobsStore.selectedJob?.jobid
      if (!jobid) {
        console.error('No job ID found to apply.')
        return
      }

      try {
        // First, submit the application
        const result = await this.userStore.applyForJob(jobid)

        if (result.success) {
          console.log('Application successful')

          // After successful application, call the regressor ML API
          try {
            const regressorResponse = await fetch(
              `${base}/regressor-ML?uid=${this.userStore.uid}&jobid=${jobid}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                // Add body if needed based on your API requirements
                // body: JSON.stringify({
                //   uid: this.userStore.uid,
                //   jobid: jobid
                // })
              },
            )

            if (!regressorResponse.ok) {
              throw new Error(`Regressor API error! status: ${regressorResponse.status}`)
            }

            const regressorData = await regressorResponse.json()
            console.log('Regressor ML API response:', regressorData)

            // Handle the regressor response if needed
            // You can store this data or show it to the user
          } catch (regressorError) {
            console.error('Error calling regressor ML API:', regressorError)
            // Don't block the application flow if regressor API fails
            // You might want to show a warning to the user or handle this silently
          }

          this.closeDialog()
        } else {
          console.error('Application failed:', result.message)
        }
      } catch (error) {
        console.error('Error applying for job:', error)
      }
    },
  },
}
</script>

<style scoped>
.dialog-card {
  width: 80vw;
  max-width: 900px;
  height: auto;
  max-height: 85vh;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.scroll {
  max-height: 70vh;
  overflow-y: auto;
}

.centered-div {
  width: 100%;
  margin: 0 auto;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.application-card {
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid #ccc;
}

.close-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.company-header {
  margin-bottom: 20px;
}

.company-name {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.job-title-large {
  font-size: 30px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
  line-height: 1.2;
}

.job-meta-info {
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
}

.info-col {
  width: calc(50% - 8px);
}

.custom-chip {
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  padding: 6px 14px;
  display: inline-block;
}

.custom-chip-blue {
  border: 1px solid #2a6fdb;
  background-color: #e6f0ff;
  color: #1b3a8a;
}

.custom-chip-warning {
  border: 1px solid #f59e0b;
  background-color: #fef3c7;
  color: #d97706;
}

.profile-status-section {
  margin-bottom: 20px;
}

.status-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

/* Prediction styles */
.prediction-loading {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
}

.prediction-result {
  margin-bottom: 16px;
}

.prediction-card {
  border-radius: 12px;
  padding: 14px;
  border: 1px solid;
}

.prediction-high {
  background-color: #dcfce7;
  border-color: #16a34a;
}

.prediction-medium {
  background-color: #fef3c7;
  border-color: #f59e0b;
}

.prediction-low {
  background-color: #fee2e2;
  border-color: #ef4444;
}

.prediction-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.prediction-icon-high {
  color: #16a34a;
}

.prediction-icon-medium {
  color: #d97706;
}

.prediction-icon-low {
  color: #dc2626;
}

.prediction-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.prediction-high .prediction-title {
  color: #15803d;
}

.prediction-medium .prediction-title {
  color: #92400e;
}

.prediction-low .prediction-title {
  color: #991b1b;
}

.prediction-message {
  font-size: 13px;
  line-height: 1.4;
  color: #374151;
}

.status-warning {
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 14px;
}

.status-success {
  background-color: #dcfce7;
  border: 1px solid #16a34a;
  border-radius: 12px;
  padding: 14px;
}

.warning-content,
.success-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.warning-icon {
  color: #d97706;
  margin-top: 2px;
}

.success-icon {
  color: #16a34a;
  margin-top: 2px;
}

.warning-title,
.success-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 3px;
}

.warning-title {
  color: #92400e;
}
.success-title {
  color: #15803d;
}

.warning-subtitle,
.success-subtitle {
  font-size: 13px;
}

.missing-items {
  margin-top: 12px;
}

.missing-label {
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 6px;
}

.missing-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.action-section {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 0;
}

.action-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.profile-link {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 0;
}

.cancel-button,
.primary-button,
.submit-button {
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 20px;
}

.submit-button {
  background-color: #000000;
  color: white;
}
.submit-button:hover {
  background-color: #333333;
}

.loading-container {
  text-align: center;
  padding: 50px 20px;
}

.loading-text {
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .dialog-card {
    width: 95vw;
    height: auto;
    max-height: 90vh;
  }
  .job-title-large {
    font-size: 24px;
  }
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  .cancel-button,
  .primary-button,
  .submit-button {
    width: 200px;
  }
}
</style>
