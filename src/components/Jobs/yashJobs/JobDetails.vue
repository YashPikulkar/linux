<template>
  <q-dialog
    v-model="showDialog"
    position="bottom"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    @hide="closeDialog"
  >
    <q-card flat bordered class="q-pa-lg dialog-card">
      <!-- ❌ Close icon -->
      <q-btn icon="close" flat round dense color="grey-6" class="close-icon" @click="closeDialog" />

      <div v-if="job" class="scroll">
        <div class="centered-div">
          <!-- Main wrapper with left cards and right apply card -->
          <div class="main-content-wrapper">
            <!-- Left column with stacked cards -->
            <div class="left-column">
              <!-- Top Card - Job Details -->
              <q-card class="job-details-card" flat bordered>
                <div class="q-pa-lg">
                  <!-- Title & Meta -->
                  <div>
                    <div class="job-title">{{ job.title }}</div>
                    <div class="job-meta">
                      ₹{{ job.salary }} &nbsp;|&nbsp; {{ job.experience }} &nbsp;|&nbsp;
                      {{ job.type }}
                    </div>
                    <div class="job-posted">
                      Posted: {{ job.posted }} &nbsp;•&nbsp; Recruiter recently active
                    </div>
                  </div>

                  <q-separator spaced class="q-my-lg" />

                  <!-- Grid Info -->
                  <div class="info-grid">
                    <div class="info-col">
                      <div class="text-caption text-grey-7">Job Location</div>
                      <div class="text-body1">{{ job.jobLocation }}</div>
                    </div>
                    <div class="info-col">
                      <div class="text-caption text-grey-7">Industry</div>
                      <div class="text-body1">{{ job.industry }}</div>
                    </div>
                    <div class="info-col">
                      <div class="text-caption text-grey-7">Work Policy</div>
                      <div class="text-body1">{{ job.remotePolicy }}</div>
                    </div>
                    <div class="info-col">
                      <div class="text-caption text-grey-7">Openings</div>
                      <div class="text-body1">{{ job.openings }}</div>
                    </div>
                    <div class="info-col">
                      <div class="text-caption text-grey-7">Education Requirement</div>
                      <div class="text-body1">{{ job.education }}</div>
                    </div>
                    <div class="info-col skills-col">
                      <div class="text-caption text-grey-7">Skills</div>
                      <div class="skills-container">
                        <div
                          v-for="(skill, i) in job.skills"
                          :key="i"
                          class="custom-chip custom-chip-blue"
                        >
                          {{ skill }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>

              <!-- Bottom Card - About the Job -->
              <q-card class="about-job-card" flat bordered>
                <div class="q-pa-lg">
                  <div class="about-job-section">
                    <div class="about-job-title">About the Job</div>
                    <div
                      class="about-job-content"
                      v-html="formatJobDescription(job.description)"
                    ></div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- Right Side Card - Apply -->
            <div class="right-column">
              <q-card flat bordered class="apply-card">
                <div class="apply-header">Apply to {{ job.name }}</div>
                <div class="apply-body">
                  <p class="apply-text">
                    Please make sure your profile is complete as this information
                    <strong>will be sent to recruiters</strong>.
                    <router-link to="/profile" class="apply-link">Go to your profile</router-link>
                    to update it.
                  </p>
                  <div class="apply-warning" v-if="missingCriticalInfo.length">
                    <strong
                      >You cannot apply to this job because your profile is missing the following
                      critical pieces of information {{ job.name }} uses to evaluate
                      applicants.</strong
                    >
                    <ul>
                      <li v-for="item in missingCriticalInfo" :key="item">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <button class="apply-button" :disabled="applyDisabled" @click="applyForJob">
                    Apply Now
                  </button>
                </div>
              </q-card>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="q-pa-md">Loading job details...</div>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed } from 'vue'
import { useJobsStore } from 'src/stores/job-store'
import { useUserStore } from 'src/stores/user-store'

export default {
  name: 'TwoCardDialog',
  components: {},
  setup() {
    const jobsStore = useJobsStore()
    const userStore = useUserStore()

    const showDialog = computed({
      get: () => jobsStore.learnMoreDialogVisible,
      set: (val) => {
        if (!val) jobsStore.closeLearnMoreDialog()
      },
    })

    const job = computed(() => {
      const rawJob = jobsStore.selectedJob
      if (!rawJob) return null

      return {
        name: rawJob.company_name || 'Unknown Company',
        title: rawJob.custom_title || rawJob.job_roles || '',
        salary:
          rawJob.salary_min && rawJob.salary_max
            ? `${rawJob.salary_min.toLocaleString()} - ${rawJob.salary_max.toLocaleString()}`
            : 'Not specified',
        experience:
          rawJob.experience_min && rawJob.experience_max
            ? `${rawJob.experience_min} - ${rawJob.experience_max} yrs`
            : 'N/A',
        type: rawJob.job_type || '',
        posted: rawJob.posted ? new Date(rawJob.posted).toLocaleDateString() : 'N/A',
        jobLocation: rawJob.locations || 'N/A',
        industry: rawJob.markets || 'N/A',
        remotePolicy: rawJob.mode_of_work || 'N/A',
        openings: rawJob.opening || 0,
        education: rawJob.qualification_name || 'N/A',
        skills: rawJob.skills ? rawJob.skills.split(',').map((s) => s.trim()) : [],
        description: rawJob.bigDescription || '',
      }
    })

    const jobDetail = computed(() => jobsStore.selectedJob || null)

    const missingCriticalInfo = computed(() => {
      const missing = []
      if (!userStore.education_level || userStore.education_level.trim() === '')
        missing.push('Education Level')
      if (
        !userStore.skills ||
        (Array.isArray(userStore.skills)
          ? userStore.skills.length === 0
          : userStore.skills.trim() === '')
      )
        missing.push('Skills')
      if (!userStore.degree || userStore.degree.trim() === '') missing.push('Degree')
      return missing
    })

    const applyDisabled = computed(() => missingCriticalInfo.value.length > 0)

    async function applyForJob() {
      if (!jobsStore.selectedJob?.jobid) {
        console.error('No job selected for application')
        return
      }
      console.log('Applying for job', jobsStore.selectedJob.jobid)
      await jobsStore.openApplicationDialog(jobsStore.selectedJob.jobid)
    }

    function closeDialog() {
      jobsStore.closeLearnMoreDialog()
    }

    function formatJobDescription(description) {
      if (!description) return ''

      // Clean up the description and split into sections
      let cleanedDescription = description.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

      // Split by double line breaks or more to identify sections
      const sections = cleanedDescription.split(/\n\s*\n+/).filter((section) => section.trim())

      return sections
        .map((section) => {
          const trimmed = section.trim()
          const lines = trimmed
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line)

          if (lines.length === 0) return ''

          const processedLines = lines.map((line) => {
            // Check if line is a heading (various patterns)
            const isHeading =
              // Short line with colon at end
              (line.length < 100 && line.endsWith(':')) ||
              // All caps short line
              (line.length < 80 && /^[A-Z\s\-_&]+:?$/.test(line)) ||
              // Title case with specific keywords
              (/^(About|Role|Responsibilities|Requirements|Qualifications|Skills|Experience|Benefits|Company|Job|What|Key|Primary|Essential|Preferred|Nice|Must|Should)/i.test(
                line,
              ) &&
                line.length < 120) ||
              // Numbered or bulleted headings
              (/^(\d+\.|•|\*|-)\s*[A-Z]/.test(line) && line.length < 80)

            if (isHeading) {
              return `<div class="job-heading">${line.replace(/:$/, '')}</div>`
            }

            // Check if it's a bullet point
            if (/^[-•*]\s/.test(line) || /^\d+\.\s/.test(line)) {
              return `<div class="job-bullet">${line}</div>`
            }

            // Regular paragraph line
            return `<div class="job-paragraph">${line}</div>`
          })

          return processedLines.join('')
        })
        .join('<div class="job-section-break"></div>')
    }

    return {
      showDialog,
      job,
      jobDetail,
      closeDialog,
      applyDisabled,
      applyForJob,
      missingCriticalInfo,
      formatJobDescription,
    }
  },
}
</script>

<style scoped>
.dialog-card {
  width: 100vw;
  height: 85vh;
  max-width: 100vw;
  border-radius: 20px;
  position: relative;
}
.centered-div {
  width: 100%; /* take full available width */
  max-width: 2000px; /* was 1800px, increase cap */
  margin: 0 auto; /* keep centered */
  padding-top: 20px;
}

.scroll {
  height: 100%;
  overflow-y: auto;
}

.main-content-wrapper {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
}

.left-column {
  flex: 1;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  width: 420px;
  flex-shrink: 0;
}

/* Job Details Card (Top) */
.job-details-card {
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid #ccc;
}

/* About Job Card (Bottom) */
.about-job-card {
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid #ccc;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
  align-items: start;
}

.skills-col {
  grid-column: 1 / -1;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.custom-chip {
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  padding: 5px 14px;
}

.custom-chip-blue {
  border: 1px solid #2a6fdb;
  background-color: #e6f0ff;
  color: #1b3a8a;
}

.info-col {
  min-width: 0;
}

.job-title {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}

.job-meta {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.job-posted {
  font-size: 16px;
  color: #6e6e73;
}

.close-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

/* Apply Card */
.apply-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 20px;
  max-height: calc(85vh - 40px);
}

.apply-header {
  background-color: black;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 20px;
  border-radius: 16px 16px 0 0;
}

.apply-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.apply-text {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  color: #555;
}

.apply-link {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
}

.apply-warning {
  background-color: #fff3f3;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  color: #d60000;
  line-height: 1.4;
}

.apply-warning ul {
  margin: 8px 0 0 16px;
  padding: 0;
}

.apply-button {
  width: 100%;
  background-color: black;
  color: white;
  border: none;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  margin-top: auto;
  transition: background-color 0.2s ease;
}

.apply-button:hover:not(:disabled) {
  background-color: #333;
}

.apply-button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}

/* About Job Section Styling */
.about-job-section {
  margin-bottom: 0;
}

.about-job-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.about-job-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

/* Job Description Formatting */
.about-job-content :deep(.job-heading) {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 24px 0 12px 0;
  line-height: 1.3;
}

.about-job-content :deep(.job-heading:first-child) {
  margin-top: 0;
}

.about-job-content :deep(.job-paragraph) {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #444;
  text-align: justify;
}

.about-job-content :deep(.job-bullet) {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #444;
  padding-left: 12px;
}

.about-job-content :deep(.job-section-break) {
  margin: 20px 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-content-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .right-column {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }

  .apply-card {
    position: static;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .centered-div {
    width: 98%;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .job-title {
    font-size: 24px;
  }

  .about-job-title {
    font-size: 20px;
  }

  .about-job-content {
    font-size: 15px;
  }

  .about-job-content :deep(.job-heading) {
    font-size: 16px;
    margin: 20px 0 10px 0;
  }

  .about-job-content :deep(.job-paragraph),
  .about-job-content :deep(.job-bullet) {
    font-size: 14px;
  }
}
</style>
