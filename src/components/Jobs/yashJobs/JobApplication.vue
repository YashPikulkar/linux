<template>
  <q-dialog v-model="jobsStore.applicationDialogVisible" persistent>
    <q-card flat class="application-card">
      <!-- Header with gradient background -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="header-text">
            <h2 class="dialog-title">Apply for Position</h2>
            <p class="dialog-subtitle">Review job details and submit your application</p>
          </div>
          <q-btn flat round icon="close" size="md" class="close-btn" @click="closeDialog" />
        </div>
      </div>

      <div class="dialog-body" v-if="normalizedJob">
        <!-- Company & Job Info Card -->
        <div class="job-info-card">
          <div class="company-section">
            <div class="company-avatar">
              <q-avatar size="64px" class="company-logo">
                <img v-if="normalizedJob.logo" :src="normalizedJob.logo" />
                <div v-else class="avatar-fallback">
                  {{ normalizedJob.name.charAt(0).toUpperCase() }}
                </div>
              </q-avatar>
            </div>

            <div class="company-details">
              <h3 class="company-name">{{ normalizedJob.name }}</h3>
              <div class="company-meta">
                <q-icon name="business" size="14px" class="meta-icon" />
                {{ normalizedJob.size }}
                <span class="separator">•</span>
                <q-icon name="domain" size="14px" class="meta-icon" />
                {{ normalizedJob.industry }}
              </div>
            </div>

            <div class="job-status-badge">
              <q-chip
                :color="normalizedJob.hiringStatus === 'urgent' ? 'red' : 'primary'"
                text-color="white"
                size="sm"
                icon="schedule"
              >
                {{ normalizedJob.hiringStatus || 'Active' }}
              </q-chip>
            </div>
          </div>

          <div class="job-header">
            <h1 class="job-title">{{ normalizedJob.title }}</h1>
            <div class="job-meta">
              <div class="meta-item">
                <q-icon name="place" size="16px" />
                <span>{{ normalizedJob.location }}</span>
              </div>
              <div class="meta-item">
                <q-icon name="payments" size="16px" />
                <span>₹{{ normalizedJob.salary }}</span>
              </div>
              <div class="meta-item">
                <q-icon name="work" size="16px" />
                <span>{{ normalizedJob.type }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <q-icon name="trending_up" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">Experience</div>
              <div class="stat-value">{{ normalizedJob.experience }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <q-icon name="computer" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">Work Mode</div>
              <div class="stat-value">{{ normalizedJob.remotePolicy }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <q-icon name="group" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">Openings</div>
              <div class="stat-value">{{ normalizedJob.openings }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <q-icon name="school" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">Education</div>
              <div class="stat-value">{{ normalizedJob.education }}</div>
            </div>
          </div>
        </div>

        <!-- Skills Section -->
        <div class="skills-section" v-if="normalizedJob.skills.length">
          <div class="section-header">
            <q-icon name="code" size="20px" class="section-icon" />
            <h4 class="section-title">Required Skills</h4>
          </div>
          <div class="skills-container">
            <q-chip
              v-for="(skill, index) in normalizedJob.skills"
              :key="index"
              class="skill-chip"
              color="primary"
              text-color="white"
              size="md"
            >
              {{ skill }}
            </q-chip>
          </div>
        </div>

        <!-- Missing Info Alert -->
        <q-card v-if="missingCriticalInfo.length" class="missing-info-card" flat>
          <q-card-section class="missing-info-content">
            <div class="alert-header">
              <q-icon name="warning" size="24px" class="warning-icon" />
              <div>
                <div class="alert-title">Complete Your Profile</div>
                <div class="alert-subtitle">
                  Add missing information to proceed with your application
                </div>
              </div>
            </div>

            <div class="missing-items">
              <q-chip
                v-for="(item, idx) in missingCriticalInfo"
                :key="idx"
                color="orange"
                text-color="white"
                icon="error_outline"
                size="sm"
              >
                {{ item }}
              </q-chip>
            </div>

            <div class="alert-actions">
              <q-btn
                unelevated
                color="primary"
                icon="person"
                label="Update Profile"
                size="md"
                class="update-btn"
                to="/profile"
                @click="closeDialog"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Enhanced Footer -->
      <div class="dialog-footer">
        <div class="footer-info">
          <q-icon name="info" size="16px" class="info-icon" />
          <span class="info-text">
            {{ canApply ? 'Ready to submit your application' : 'Complete profile to apply' }}
          </span>
        </div>
        <div class="footer-actions">
          <q-btn flat label="Cancel" class="cancel-btn" @click="closeDialog" />
          <q-btn
            unelevated
            :label="canApply ? 'Send Application' : 'Complete Profile'"
            :icon="canApply ? 'send' : 'person'"
            class="apply-btn"
            :color="canApply ? 'primary' : 'grey'"
            :disable="!canApply"
            @click="canApply ? sendApplication() : $router.push('/profile')"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!normalizedJob" class="loading-state">
        <q-spinner-hourglass size="40px" color="primary" />
        <div class="loading-text">Loading job details...</div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { useJobsStore } from 'src/stores/job-store'
import { useUserStore } from 'src/stores/user-store'

export default {
  name: 'ApplicationDialog',
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
        name: job.company_name || job.custom_title || 'Unknown Company',
        logo: job.logo || null,
        size: job.companySize || 'N/A',
        title: job.custom_title || job.job_roles || 'Job Title',
        salary:
          job.salary_min && job.salary_max
            ? `${(job.salary_min / 1000).toFixed(1)}K – ${(job.salary_max / 1000).toFixed(1)}K`
            : 'Not specified',
        location: job.locations || 'Not specified',
        experience: job.experience_max
          ? `${job.experience_min || 0} – ${job.experience_max} years`
          : 'Not specified',
        type: job.job_type || 'Not specified',
        posted: job.posted ? new Date(job.posted).toLocaleDateString() : 'Unknown',
        companyLocation: job.company_location || 'Not specified',
        industry: job.markets || 'Not specified',
        remotePolicy: job.mode_of_work || 'Not specified',
        openings: job.opening || 0,
        education: job.qualification_name || 'Not specified',
        skills: job.skills ? job.skills.split(',').map((s) => s.trim()) : [],
        missingFields: job.missingFields || [],
        hiringStatus: job.hiring_status || '',
      }
    },
    missingCriticalInfo() {
      const missing = []
      const { skills, degree } = this.userStore

      if (!skills || (Array.isArray(skills) ? skills.length === 0 : skills.trim() === ''))
        missing.push('Skills')
      if (!degree || degree.trim() === '') missing.push('Degree')

      return missing
    },
    canApply() {
      const job = this.normalizedJob
      return (
        (!job?.missingFields || job.missingFields.length === 0) &&
        this.missingCriticalInfo.length === 0
      )
    },
  },
  methods: {
    closeDialog() {
      this.jobsStore.closeApplicationDialog()
    },
    async sendApplication() {
      if (!this.canApply) return

      const jobid = this.jobsStore.selectedJob?.jobid
      if (!jobid) {
        console.error('No job ID found to apply.')
        return
      }

      try {
        const result = await this.userStore.applyForJob(jobid)
        if (result.success) {
          console.log('Application successful')
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
.application-card {
  max-width: 700px;
  width: 700px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  padding: 24px 32px;
  position: relative;
  overflow: hidden;
}

.dialog-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.header-text {
  flex: 1;
}

.dialog-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
}

.dialog-subtitle {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

.close-btn {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.dialog-body {
  padding: 32px;
  background: #fafafa;
}

.job-info-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.company-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.company-avatar {
  margin-right: 16px;
}

.company-logo {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.company-details {
  flex: 1;
}

.company-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #1a1a1a;
}

.company-meta {
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  opacity: 0.7;
}

.separator {
  margin: 0 4px;
  opacity: 0.5;
}

.job-status-badge {
  position: absolute;
  top: 0;
  right: 0;
}

.job-header {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.job-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.job-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 2px;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.skills-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-icon {
  color: #667eea;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  font-weight: 500;
}

.missing-info-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #f59e0b;
}

.missing-info-content {
  padding: 20px;
}

.alert-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.warning-icon {
  color: #d97706;
  margin-top: 2px;
}

.alert-title {
  font-size: 16px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 2px;
}

.alert-subtitle {
  font-size: 14px;
  color: #a16207;
}

.missing-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.alert-actions {
  display: flex;
  justify-content: flex-start;
}

.update-btn {
  font-weight: 600;
  border-radius: 8px;
}

.dialog-footer {
  padding: 20px 32px;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.info-icon {
  opacity: 0.7;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  font-weight: 600;
  color: #6b7280;
  border-radius: 8px;
  padding: 10px 20px;
}

.cancel-btn:hover {
  background: #f9fafb;
  color: #1a1a1a;
}

.apply-btn {
  font-weight: 700;
  border-radius: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
  transition: all 0.2s ease;
}

.apply-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.loading-state {
  padding: 80px 32px;
  text-align: center;
  color: #6b7280;
}

.loading-text {
  font-size: 16px;
  margin-top: 16px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .application-card {
    width: 95vw;
    max-width: none;
    margin: 10px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .job-meta {
    flex-direction: column;
    gap: 12px;
  }

  .dialog-body {
    padding: 20px;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .footer-actions {
    justify-content: center;
  }
}
</style>
