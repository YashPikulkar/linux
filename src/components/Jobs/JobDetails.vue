<template>
  <q-dialog
    v-model="showDialog"
    position="standard"
    transition-show="scale"
    transition-hide="scale"
    persistent
    @hide="closeDialog"
  >
    <q-card flat bordered class="q-pa-lg dialog-card">
      <!-- ❌ Close icon -->
      <q-btn icon="close" flat round dense color="grey-6" class="close-icon" @click="closeDialog" />

      <div v-if="job" class="scroll">
        <div class="centered-div">
          <!-- Main wrapper with full width content -->
          <div class="main-content-wrapper">
            <!-- Full width column -->
            <div class="full-width-column">
              <!-- Top Card - Job Details -->
              <q-card class="job-details-card full-width-card" flat bordered>
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
              <q-card class="about-job-card full-width-card" flat bordered>
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
              (line.length < 100 && line.endsWith(':')) ||
              (line.length < 80 && /^[A-Z\s\-_&]+:?$/.test(line)) ||
              (/^(About|Role|Responsibilities|Requirements|Qualifications|Skills|Experience|Benefits|Company|Job|What|Key|Primary|Essential|Preferred|Nice|Must|Should)/i.test(
                line,
              ) &&
                line.length < 120) ||
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
  width: 90vw;
  height: 85vh;
  max-width: 1400px;
  max-height: 900px;
  border-radius: 20px;
  position: relative;
}

.centered-div {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding-top: 20px;
}

.scroll {
  height: 100%;
  overflow-y: auto;
}

.main-content-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.full-width-column {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Make both cards take full width */
.full-width-card {
  width: 100%;
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
