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
              <div ref="applicationStatus" class="profile-status-section">
                <div class="status-title">Application Status</div>

                <!-- Improved Advertisement Banner -->
                <div ref="adBanner" class="ad-banner-container">
                  <div class="ad-banner">
                    <div class="ad-icon-wrapper">
                      <q-icon name="psychology" class="ad-icon" />
                    </div>
                    <div class="ad-content">
                      <div class="ad-title">
                        <q-icon name="auto_awesome" size="18px" class="ad-title-icon" />
                        AI Profile Match Analysis
                      </div>
                      <div class="ad-description">
                        Get instant insights on your compatibility with this role. Our AI evaluates
                        your profile against job requirements to show your match score and selection
                        probability.
                      </div>
                    </div>
                    <div class="ad-cta">
                      <q-icon name="trending_up" size="20px" class="cta-icon" />
                    </div>
                  </div>
                </div>

                <!-- ML Prediction Section - Improved -->
                <div v-if="predictionLoading" class="prediction-loading">
                  <div class="loading-content">
                    <q-spinner-dots size="24px" color="primary" />
                    <div class="loading-text">
                      <div class="loading-title">Analyzing Your Profile</div>
                      <div class="loading-subtitle">This may take a few seconds...</div>
                    </div>
                  </div>
                </div>

                <div v-else-if="predictionResult" class="prediction-result">
                  <div
                    class="analysis-card"
                    :class="{
                      'analysis-high': predictionResult.status === 'high',
                      'analysis-medium': predictionResult.status === 'medium',
                      'analysis-low': predictionResult.status === 'low',
                    }"
                  >
                    <div class="analysis-header">
                      <div class="analysis-icon-wrapper">
                        <q-icon
                          :name="getPredictionIcon(predictionResult.status)"
                          class="analysis-icon"
                          :class="`analysis-icon-${predictionResult.status}`"
                        />
                      </div>
                      <div class="analysis-title-section">
                        <div class="analysis-title">Profile Match Analysis</div>
                        <div class="analysis-status" :class="`status-${predictionResult.status}`">
                          {{ getStatusText(predictionResult.status) }}
                        </div>
                      </div>
                      <div class="analysis-score" :class="`score-${predictionResult.status}`">
                        {{ getScoreDisplay(predictionResult.status) }}
                      </div>
                    </div>

                    <div class="analysis-content">
                      <div class="analysis-message">{{ predictionResult.message }}</div>

                      <!-- Progress bar for visual appeal -->
                      <div class="match-progress">
                        <div class="progress-label">Match Strength</div>
                        <div class="progress-bar">
                          <div
                            class="progress-fill"
                            :class="`progress-${predictionResult.status}`"
                            :style="{ width: getProgressWidth(predictionResult.status) }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="missingCriticalInfo.length" class="status-warning">
                  <div class="warning-content">
                    <div class="warning-icon-wrapper">
                      <q-icon name="warning" class="warning-icon" />
                    </div>
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
                        <q-icon name="error_outline" size="14px" class="chip-icon" />
                        {{ item }}
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else-if="!predictionLoading && !predictionResult" class="status-success">
                  <div class="success-content">
                    <div class="success-icon-wrapper">
                      <q-icon name="check_circle" class="success-icon" />
                    </div>
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
                  <router-link
                    to="/applicant/edit-applicant"
                    class="profile-link"
                    @click="closeDialog"
                  >
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
    'jobsStore.applicationDialogVisible'(newVal) {
      if (newVal && this.jobsStore.selectedJob && this.userStore.uid) {
        this.fetchPrediction()
        this.$nextTick(() => {
          this.scrollToAdBanner()
        })
      }
    },
  },
  methods: {
    scrollToAdBanner() {
      if (this.$refs.applicationStatus) {
        this.$refs.applicationStatus.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    },

    getStatusText(status) {
      switch (status) {
        case 'high':
          return 'Excellent Match'
        case 'medium':
          return 'Good Match'
        case 'low':
          return 'Needs Improvement'
        default:
          return 'Unknown'
      }
    },

    getScoreDisplay(status) {
      switch (status) {
        case 'high':
          return '85-95%'
        case 'medium':
          return '60-75%'
        case 'low':
          return '30-50%'
        default:
          return 'N/A'
      }
    },

    getProgressWidth(status) {
      switch (status) {
        case 'high':
          return '90%'
        case 'medium':
          return '65%'
        case 'low':
          return '40%'
        default:
          return '0%'
      }
    },

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
        this.predictionResult = {
          status: 'medium',
          message:
            'Unable to analyze profile at the moment. Please ensure your profile is complete.',
          color: 'orange',
        }
      } finally {
        this.predictionLoading = false
      }
    },

    getPredictionIcon(status) {
      switch (status) {
        case 'high':
          return 'verified'
        case 'medium':
          return 'info'
        case 'low':
          return 'trending_up'
        default:
          return 'help'
      }
    },

    closeDialog() {
      this.predictionResult = null
      this.predictionLoading = false
      this.predictionError = null
      this.jobsStore.closeApplicationDialog()
    },

    goToProfile() {
      this.$router.push('/applicant/edit-applicant')
      this.closeDialog()
    },

    async sendApplication() {
      const jobid = this.jobsStore.selectedJob?.jobid
      if (!jobid) {
        console.error('No job ID found to apply.')
        return
      }

      try {
        const result = await this.userStore.applyForJob(jobid)

        if (result.success) {
          console.log('Application successful')

          try {
            const regressorResponse = await fetch(
              `${base}/regressor-ML?uid=${this.userStore.uid}&jobid=${jobid}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )

            if (!regressorResponse.ok) {
              throw new Error(`Regressor API error! status: ${regressorResponse.status}`)
            }

            const regressorData = await regressorResponse.json()
            console.log('Regressor ML API response:', regressorData)
          } catch (regressorError) {
            console.error('Error calling regressor ML API:', regressorError)
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

/* Company Header */
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

/* Info Grid */
.info-col {
  width: calc(50% - 8px);
}

/* Skills Chips */
.custom-chip {
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  padding: 6px 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

.chip-icon {
  margin-right: 2px;
}

/* Profile Status Section */
.profile-status-section {
  margin-bottom: 20px;
}

.status-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

/* Advertisement Banner */
.ad-banner-container {
  margin: 20px 0;
}

.ad-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  min-height: 80px;
}

.ad-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.ad-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.ad-icon {
  font-size: 32px;
  color: white;
}

.ad-content {
  flex: 1;
  color: white;
}

.ad-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ad-title-icon {
  color: #ffd700;
}

.ad-description {
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.95;
  font-weight: 400;
}

.ad-cta {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 12px;
  backdrop-filter: blur(10px);
}

.cta-icon {
  color: white;
}

/* Prediction Loading */
.prediction-loading {
  margin: 20px 0;
  background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.loading-text {
  flex: 1;
}

.loading-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}

.loading-subtitle {
  font-size: 14px;
  color: #64748b;
}

/* Analysis Card */
.prediction-result {
  margin: 20px 0;
}

.analysis-card {
  border-radius: 16px;
  padding: 0;
  border: 2px solid;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.analysis-high {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.analysis-medium {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.analysis-low {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.analysis-icon-wrapper {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.analysis-icon {
  font-size: 24px;
}

.analysis-icon-high {
  color: #10b981;
}

.analysis-icon-medium {
  color: #f59e0b;
}

.analysis-icon-low {
  color: #ef4444;
}

.analysis-title-section {
  flex: 1;
}

.analysis-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.analysis-status {
  font-size: 14px;
  font-weight: 600;
}

.status-high {
  color: #059669;
}

.status-medium {
  color: #d97706;
}

.status-low {
  color: #dc2626;
}

.analysis-score {
  font-size: 24px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.score-high {
  color: #059669;
}

.score-medium {
  color: #d97706;
}

.score-low {
  color: #dc2626;
}

.analysis-content {
  padding: 16px 24px 24px;
}

.analysis-message {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  margin-bottom: 16px;
}

/* Progress Bar */
.match-progress {
  margin-top: 16px;
}

.progress-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease-in-out;
}

.progress-high {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progress-medium {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.progress-low {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

/* Status Cards */
.status-warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 2px solid #f59e0b;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
}

.status-success {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #10b981;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
}

.warning-content,
.success-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.warning-icon-wrapper,
.success-icon-wrapper {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.warning-icon {
  color: #d97706;
  font-size: 20px;
}

.success-icon {
  color: #10b981;
  font-size: 20px;
}

.warning-title,
.success-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.warning-title {
  color: #92400e;
}

.success-title {
  color: #065f46;
}

.warning-subtitle,
.success-subtitle {
  font-size: 14px;
  color: #374151;
}

/* Missing Items */
.missing-items {
  margin-top: 16px;
}

.missing-label {
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 8px;
}

.missing-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Action Section */
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

/* Loading Container */
.loading-container {
  text-align: center;
  padding: 50px 20px;
}

/* RESPONSIVE DESIGN */

/* Tablet and smaller */
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

  .ad-banner {
    padding: 20px;
    gap: 16px;
    min-height: 70px;
  }

  .ad-title {
    font-size: 18px;
  }

  .ad-description {
    font-size: 13px;
  }

  .ad-icon {
    font-size: 28px;
  }

  .info-col {
    width: 100%;
    margin-bottom: 12px;
  }

  .analysis-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    padding: 16px 20px;
  }

  .analysis-score {
    font-size: 20px;
  }

  .analysis-content {
    padding: 12px 16px 20px;
  }

  .analysis-message {
    font-size: 13px;
  }

  .missing-chips {
    flex-direction: column;
    gap: 6px;
  }

  .custom-chip {
    justify-content: center;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .ad-banner {
    flex-direction: column;
    text-align: center;
    padding: 16px;
    gap: 12px;
  }

  .ad-title {
    font-size: 16px;
  }

  .ad-description {
    font-size: 12px;
  }

  .ad-icon {
    font-size: 24px;
  }

  .analysis-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .analysis-content {
    padding: 12px 16px 20px;
  }

  .analysis-message {
    font-size: 13px;
  }
}
</style>
