<template>
  <div class="applicants-management">
    <!-- Advertisement Banner (Topmost) -->
    <div class="ad-banner">
      <q-icon name="star" color="yellow-8" size="32px" class="q-mr-md" />
      <div>
        <div class="ad-title">✨ Application Ranking System</div>
        <div class="ad-desc">
          Our intelligent ranking system uses advanced algorithms to score and rank applicants, helping you find the best fit faster!
        </div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <q-btn
            flat
            dense
            round
            size="lg"
            icon="arrow_back"
            color="primary"
            @click="goBack"
            class="modern-btn q-mr-sm"
            aria-label="Back to Jobs"
          />
          <span class="text-h5 text-weight-bold">
            {{ jobDetails?.title || 'Job Applications' }}
          </span>
        </div>
        <div class="col-auto">
          <div class="row q-gutter-md items-center">
            <q-btn
              icon="download"
              label="Export"
              color="primary"
              outline
              @click="exportApplicants"
              class="modern-btn"
            />
          </div>
        </div>
      </div>
    </div>

    <q-separator />

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number text-primary">{{ totalApplicants }}</div>
          <div class="stat-label">Total Applicants</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number text-orange">{{ getStatusCount('pending') }}</div>
          <div class="stat-label">Pending Review</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number stat-accepted">{{ getStatusCount('accepted') }}</div>
          <div class="stat-label">Accepted</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number stat-rejected">{{ getStatusCount('rejected') }}</div>
          <div class="stat-label">Rejected</div>
        </div>
      </div>
    </div>

    <q-separator />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Left Sidebar - Applicants List -->
      <div class="applicants-sidebar">
        <!-- Search and Filter -->
        <div class="filter-section">
          <q-input
            v-model="searchQuery"
            placeholder="Search applicants..."
            dense
            outlined
            clearable
            class="modern-input q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            label="Filter by status"
            dense
            outlined
            clearable
            emit-value
            map-options
            class="modern-input"
          />
        </div>

        <!-- Debug Info -->
        <div class="debug-info" v-if="$q.dev">
          <div>Total applicants: {{ applicants.length }}</div>
          <div>Filtered applicants: {{ filteredApplicants.length }}</div>
          <div>Loading: {{ loading }}</div>
        </div>

        <!-- Applicants List -->
        <div class="applicants-list">
          <div v-if="loading" class="loading-state">
            <q-spinner size="40px" color="primary" />
            <div class="q-mt-sm">Loading applicants...</div>
          </div>

          <div v-else-if="applicants.length === 0" class="empty-state">
            <q-icon name="inbox" size="48px" color="grey-4" />
            <div class="text-body1 text-grey-6 q-mt-sm">No applicants yet</div>
          </div>

          <div v-else class="applicant-cards">
            <div
              v-for="(applicant, idx) in filteredApplicants"
              :key="applicant.uid || applicant.resume_url || idx"
              @click="selectApplicant(applicant)"
              class="applicant-card"
              :class="{ selected: selectedApplicant?.uid === applicant.uid }"
            >
              <div class="applicant-header">
                <div class="applicant-avatar">
                  <q-avatar size="48px" icon="person" color="blue-4" text-color="white" />
                </div>
                <div class="applicant-info">
                  <div class="applicant-name">
                    {{ applicant.name || 'Applicant' }}
                  </div>
                  <div class="applicant-meta">Applied: {{ formatDate(applicant.applied) }}</div>
                </div>

                <!-- ML Score Display -->
                <div class="score-section">
                  <div
                    class="ml-score"
                    :class="{
                      'score-excellent': applicant.label && applicant.label >= 0.8,
                      'score-good': applicant.label && applicant.label >= 0.6 && applicant.label < 0.8,
                      'score-fair': applicant.label && applicant.label < 0.6
                    }"
                  >
                    {{ applicant.label ? Math.round(applicant.label * 100) : 0 }}%
                  </div>
                  <div class="match-text">
                    Match Score
                  </div>
                </div>

                <q-chip
                  :color="statusColors[applicant.status]"
                  text-color="white"
                  size="sm"
                  class="status-chip"
                >
                  {{ applicant.status }}
                </q-chip>
              </div>
              <div class="applicant-details-card">
                <div class="detail-row">
                  <q-icon name="location_on" size="16px" />
                  <span>{{ applicant.preferredLocation || 'Not specified' }}</span>
                </div>
                <div class="detail-row">
                  <q-icon name="event_available" size="16px" />
                  <span>{{ applicant.availability || 'Not specified' }}</span>
                </div>
                <div v-if="applicant.resume_url" class="detail-row">
                  <a :href="applicant.resume_url" target="_blank" class="resume-link" @click.stop>
                    View Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-separator vertical />

      <!-- Right Panel - Applicant Details -->
      <div class="applicant-details">
        <div v-if="!selectedApplicant" class="no-selection">
          <q-icon name="person_search" size="120px" color="grey-4" class="q-mb-lg" />
          <div class="text-h6 text-grey-7">Select an applicant to view details</div>
          <div class="text-body2 text-grey-6">
            Choose from the list on the left to see their profile and application details
          </div>
        </div>

        <div v-else class="applicant-profile">
          <!-- Profile Header -->
          <div class="profile-header">
            <div class="profile-info">
              <q-avatar size="80px" class="profile-avatar">
                <img
                  :src="selectedApplicant.avatar || 'https://cdn.quasar.dev/img/avatar.png'"
                  :alt="selectedApplicant.name || 'Applicant'"
                />
              </q-avatar>
              <div class="profile-text">
                <div class="profile-name">
                  {{ selectedApplicant.name || 'Anonymous Applicant' }}
                </div>
                <div class="profile-email">
                  {{ selectedApplicant.email || 'No email provided' }}
                </div>
                <div class="profile-phone">
                  {{ selectedApplicant.phone || 'No phone number provided' }}
                </div>
                <div class="q-mt-sm">
                  <q-chip
                    :color="statusColors[selectedApplicant.status]"
                    text-color="white"
                    icon="circle"
                    class="status-chip-large"
                  >
                    {{ selectedApplicant.status.toUpperCase() }}
                  </q-chip>
                </div>
              </div>
            </div>
            <div class="profile-actions">
              <q-btn
                color="positive"
                icon="check_circle"
                label="Accept"
                @click="showStatusDialog('accepted')"
                :disable="selectedApplicant.status === 'accepted'"
                :loading="updatingStatus"
                class="action-btn"
              />
              <q-btn
                color="orange"
                icon="schedule"
                label="Pending"
                @click="showStatusDialog('pending')"
                :disable="selectedApplicant.status === 'pending'"
                :loading="updatingStatus"
                outline
                class="action-btn"
              />
              <q-btn
                color="negative"
                icon="cancel"
                label="Reject"
                @click="showStatusDialog('rejected')"
                :disable="selectedApplicant.status === 'rejected'"
                :loading="updatingStatus"
                outline
                class="action-btn"
              />
            </div>
          </div>

          <q-separator class="profile-separator" />

          <!-- Profile Details Tabs -->
          <q-tabs
            v-model="activeTab"
            dense
            class="modern-tabs"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="overview" label="Overview" icon="person" />
            <q-tab name="resume" label="Resume & Documents" icon="description" />
            <q-tab name="education" label="Education" icon="school" />
            <q-tab name="experience" label="Experience" icon="work" />
            <q-tab name="contact" label="Contact Info" icon="contact_mail" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated class="tab-panels">
            <!-- Overview Tab -->
            <q-tab-panel name="overview" class="tab-panel">
              <div class="row q-gutter-lg">
                <div class="col-12 col-md-6">
                  <q-card class="info-card">
                    <q-card-section class="card-header">Application Details</q-card-section>
                    <q-card-section class="info-content">
                      <div class="info-row">
                        <span class="info-label">Applied On:</span>
                        <span class="info-value">{{ formatDate(selectedApplicant.applied) }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value">{{ selectedApplicant.status }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Preferred Location:</span>
                        <span class="info-value">{{
                          selectedApplicant.preferredLocation || 'Not specified'
                        }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Availability:</span>
                        <span class="info-value">{{
                          selectedApplicant.availability || 'Not specified'
                        }}</span>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <q-card class="info-card">
                  <q-card-section class="card-header">Links & Documents</q-card-section>
                  <q-card-section class="info-content">
                    <div class="info-row" v-if="selectedApplicant.linkedIn">
                      <span class="info-label">LinkedIn:</span>
                      <span class="info-value">
                        <a
                          :href="selectedApplicant.linkedIn"
                          target="_blank"
                          class="link-primary"
                        >
                          View Profile
                        </a>
                      </span>
                    </div>
                    <div class="info-row" v-if="selectedApplicant.portfolioWebsite">
                      <span class="info-label">Portfolio:</span>
                      <span class="info-value">
                        <a
                          :href="selectedApplicant.portfolioWebsite"
                          target="_blank"
                          class="link-primary"
                        >
                          View Portfolio
                        </a>
                      </span>
                    </div>
                    <div class="info-row" v-if="selectedApplicant.resume_url">
                      <span class="info-label">Resume:</span>
                      <span class="info-value">
                        <a
                          :href="selectedApplicant.resume_url"
                          target="_blank"
                          class="link-primary"
                        >
                          View Resume
                        </a>
                      </span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </q-tab-panel>

            <!-- Resume Tab -->
            <q-tab-panel name="resume" class="tab-panel">
              <q-card class="info-card">
                <q-card-section class="card-header">Documents & Resume</q-card-section>
                <q-card-section class="info-content">
                  <div v-if="selectedApplicant.resume_url" class="row q-gutter-md">
                    <q-btn
                      color="primary"
                      icon="visibility"
                      label="View Resume"
                      @click="viewResume(selectedApplicant.resume_url)"
                      class=" modern-btn"
                    />

                    <q-btn
                      color="secondary"
                      icon="download"
                      label="Download Resume"
                      @click="downloadResume(selectedApplicant.resume_url)"
                      outline
                      class="modern-btn"
                    />
                  </div>
                  <div v-else class="text-grey-6">No resume uploaded</div>

                  <!-- Cover Letter -->
                  <div
                    class="q-mt-lg"
                    v-if="selectedApplicant.coverLetter || selectedApplicant.cover_letter"
                  >
                    <div class="text-weight-medium q-mb-sm">Cover Letter</div>
                    <div class="cover-letter">
                      {{ selectedApplicant.coverLetter || selectedApplicant.cover_letter }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Education Tab -->
            <q-tab-panel name="education" class="tab-panel">
              <q-card class="info-card">
                <q-card-section class="card-header">Education History</q-card-section>
                <q-card-section class="info-content">
                  <div v-if="selectedApplicant.education && selectedApplicant.education.length > 0">
                    <div
                      v-for="(edu, index) in selectedApplicant.education"
                      :key="index"
                      class="education-item"
                    >
                      <div class="education-header">
                        <div class="education-degree">
                          {{ edu.degree || 'Degree' }}
                        </div>
                        <div class="education-institution">
                          {{ edu.institution || 'Institution' }}
                        </div>
                      </div>
                      <div class="education-details">
                        <span v-if="edu.field_of_study">{{ edu.field_of_study }}</span>
                        <span v-if="edu.start_year || edu.end_year" class="education-years">
                          {{ edu.start_year || 'N/A' }} -
                          {{ edu.end_year || 'Present' }}
                        </span>
                      </div>
                      <div v-if="edu.grade || edu.percentage" class="education-grade">
                        <strong>Grade:</strong>
                        {{ edu.grade || edu.percentage || 'Not specified' }}
                      </div>
                      <div v-if="edu.description" class="education-description">
                        {{ edu.description }}
                      </div>
                    </div>
                  </div>

                  <div v-else-if="!selectedApplicant.detailsLoaded" class="text-center q-pa-lg">
                    <q-spinner size="24px" color="primary" />
                    <div class="q-mt-sm text-grey-6">Loading education details...</div>
                  </div>

                  <div v-else class="text-center q-pa-lg">
                    <q-icon name="school" size="48px" color="grey-4" />
                    <div class="text-body1 text-grey-6 q-mt-sm">No education records found</div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Experience Tab -->
            <q-tab-panel name="experience" class="tab-panel">
              <q-card class="info-card">
                <q-card-section class="card-header">Work Experience</q-card-section>
                <q-card-section class="info-content">
                  <div
                    v-if="selectedApplicant.experience && selectedApplicant.experience.length > 0"
                  >
                    <div
                      v-for="(exp, index) in selectedApplicant.experience"
                      :key="index"
                      class="experience-item"
                    >
                      <div class="experience-header">
                        <div class="experience-position">
                          {{ exp.position || exp.job_title || 'Position' }}
                        </div>
                        <div class="experience-company">
                          {{ exp.company || 'Company' }}
                        </div>
                      </div>
                      <div class="experience-details">
                        <span v-if="exp.location">📍 {{ exp.location }}</span>
                        <span v-if="exp.start_date || exp.end_date" class="experience-duration">
                          {{ formatDate(exp.start_date) || 'N/A' }} -
                          {{ exp.end_date ? formatDate(exp.end_date) : 'Present' }}
                        </span>
                      </div>
                      <div v-if="exp.employment_type" class="q-mt-xs">
                        <q-chip size="sm" color="blue" text-color="white">
                          {{ exp.employment_type }}
                        </q-chip>
                      </div>
                      <div
                        v-if="exp.description || exp.responsibilities"
                        class="experience-description"
                      >
                        {{ exp.description || exp.responsibilities }}
                      </div>
                      <div v-if="exp.skills" class="experience-skills">
                        <div class="skills-label">Skills used:</div>
                        <div class="skills-list">
                          <q-chip
                            v-for="skill in (exp.skills || '').split(',').filter((s) => s.trim())"
                            :key="skill.trim()"
                            size="sm"
                            color="blue-1"
                            text-color="blue-10"
                            class="skill-chip"
                          >
                            {{ skill.trim() }}
                          </q-chip>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="!selectedApplicant.detailsLoaded" class="text-center q-pa-lg">
                    <q-spinner size="24px" color="primary" />
                    <div class="q-mt-sm text-grey-6">Loading experience details...</div>
                  </div>

                  <div v-else class="text-center q-pa-lg">
                    <q-icon name="work" size="48px" color="grey-4" />
                    <div class="text-body1 text-grey-6 q-mt-sm">No work experience found</div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="contact" class="tab-panel">
              <q-card class="info-card">
                <q-card-section class="card-header">Contact Information</q-card-section>
                <q-card-section class="info-content">
                  <div class="info-row">
                    <span class="info-label">LinkedIn:</span>
                    <span class="info-value">
                      <a
                        v-if="selectedApplicant.linkedIn"
                        :href="selectedApplicant.linkedIn"
                        target="_blank"
                        class="link-primary"
                      >
                        {{ selectedApplicant.linkedIn }}
                      </a>
                      <span v-else class="text-grey-6">Not provided</span>
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Portfolio:</span>
                    <span class="info-value">
                      <a
                        v-if="selectedApplicant.portfolioWebsite"
                        :href="selectedApplicant.portfolioWebsite"
                        target="_blank"
                        class="link-primary"
                      >
                        {{ selectedApplicant.portfolioWebsite }}
                      </a>
                      <span v-else class="text-grey-6">Not provided</span>
                    </span>
                  </div>

                  <div class="row q-gutter-md">
                    <q-btn
                      v-if="selectedApplicant.linkedIn"
                      color="primary"
                      icon="link"
                      label="Visit LinkedIn"
                      @click="window.open(selectedApplicant.linkedIn, '_blank')"
                      class="modern-btn"
                    />
                    <q-btn
                      v-if="selectedApplicant.portfolioWebsite"
                      color="secondary"
                      icon="web"
                      label="Visit Portfolio"
                      @click="window.open(selectedApplicant.portfolioWebsite, '_blank')"
                      outline
                      class="modern-btn"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>

    <!-- Status Change Confirmation Dialog -->
    <q-dialog
      v-model="showConfirmDialog"
      persistent
      @hide="resetDialog"
    >
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Confirm Status Change</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="text-body1 q-mb-md">
            Are you sure you want to change the status of
            <strong>{{ selectedApplicant?.name || 'this applicant' }}</strong>
            to <strong class="text-capitalize">{{ pendingStatus }}</strong>?
          </div>

          <q-checkbox
            v-model="sendEmailNotification"
            label="Send email notification to applicant"
            color="primary"
            class="q-mb-sm"
          />

          <div v-if="sendEmailNotification" class="text-caption text-grey-6">
            An email notification will be sent to {{ selectedApplicant?.email || 'the applicant' }}
            informing them about the status change.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancel"
            color="grey-7"
            v-close-popup
            @click="resetDialog"
          />
          <q-btn
            label="Confirm"
            color="primary"
            @click="confirmStatusUpdate"
            :loading="updatingStatus"
            :disable="updatingStatus"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAppStore } from 'src/stores/app-store'

const $q = useQuasar()
const appStore = useAppStore()

// Props (for backward compatibility if passed as props)
const props = defineProps({
  jobDetails: {
    type: Object,
    default: () => ({}),
  },
  goBack: {
    type: Function,
  },
})

// Get jobId from route params or props
const jobId = computed(() => props.jobDetails?.jobid)

// UI State
//const sendEmails = ref(false)
//const viewMode = ref('cards')
const searchQuery = ref('')
const statusFilter = ref(null)
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
]
const statusColors = {
  pending: 'orange',
  accepted: 'positive',
  rejected: 'negative',
}
const activeTab = ref('overview')
const selectedApplicant = ref(null)
const updatingStatus = ref(false)
const jobDetails = ref(props.jobDetails || {})

// Confirmation Dialog State
const showConfirmDialog = ref(false)
const pendingStatus = ref('')
const sendEmailNotification = ref(true) // Default to true (checked by default)

// Local applicants state
const applicants = ref([])
const loading = ref(false)

// Computed filtered list
const filteredApplicants = computed(() => {
  let filtered = applicants.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (applicant) =>
        (applicant.preferredLocation || '').toLowerCase().includes(query) ||
        (applicant.status || '').toLowerCase().includes(query) ||
        (applicant.availability || '').toLowerCase().includes(query) ||
        (applicant.name || '').toLowerCase().includes(query),
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((applicant) => applicant.status === statusFilter.value)
  }

  return filtered
})

// Stats
const totalApplicants = computed(() => applicants.value.length)

function getStatusCount(status) {
  return applicants.value.filter((a) => a.status === status).length
}

// Selection
async function selectApplicant(applicant) {
  selectedApplicant.value = applicant
  activeTab.value = 'overview'

  // Load additional details if uid is available
  if (applicant.uid) {
    await loadApplicantDetails(applicant.uid)
  }
}

// Load detailed applicant information
async function loadApplicantDetails(uid) {
  try {
    // Load education and experience in parallel
    const [educationResponse, experienceResponse] = await Promise.all([
      appStore.getEducation(uid).catch((err) => {
        console.warn('Education data not available:', err)
        return null
      }),
      appStore.getExperience(uid).catch((err) => {
        console.warn('Experience data not available:', err)
        return null
      }),
    ])

    // Add the detailed data to selected applicant
    if (selectedApplicant.value) {
      selectedApplicant.value = {
        ...selectedApplicant.value,
        education: educationResponse?.data || [],
        experience: experienceResponse?.data || [],
        detailsLoaded: true,
      }
    }
  } catch (error) {
    console.error('Error loading applicant details:', error)
  }
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}

// Show status confirmation dialog
function showStatusDialog(status) {
  if (!selectedApplicant.value || !selectedApplicant.value.uid) {
    $q.notify({
      type: 'warning',
      message: 'Cannot update status: Applicant UID not available',
    })
    return
  }

  pendingStatus.value = status
  sendEmailNotification.value = true // Reset to default (checked)
  showConfirmDialog.value = true
}

// Reset dialog state
function resetDialog() {
  pendingStatus.value = ''
  sendEmailNotification.value = true
  showConfirmDialog.value = false
}

// Confirm status update
async function confirmStatusUpdate() {
  await updateStatus(pendingStatus.value, sendEmailNotification.value)
  showConfirmDialog.value = false
  resetDialog()
}

// Status update
async function updateStatus(status, sendEmail = true) {
  if (!selectedApplicant.value || !selectedApplicant.value.uid) {
    $q.notify({
      type: 'warning',
      message: 'Cannot update status: Applicant UID not available',
    })
    return
  }

  updatingStatus.value = true
  try {
    // Call the backend API with uid, status, and email notification flag
    await appStore.updateStatus({
      uid: selectedApplicant.value.uid,
      status: status,
      sendEmail: sendEmail
    })

    // Update local state
    selectedApplicant.value.status = status

    // Update in the applicants array
    const index = applicants.value.findIndex((a) => a.uid === selectedApplicant.value.uid)
    if (index !== -1) {
      applicants.value[index].status = status
    }

    const emailMessage = sendEmail ? ' Email notification sent.' : ' No email notification sent.'
    $q.notify({
      type: 'positive',
      message: `Status updated to ${status}.${emailMessage}`,
    })
  } catch (err) {
    console.error('Status update error:', err)
    $q.notify({
      type: 'negative',
      message: `Error updating status: ${err.message}`,
    })
  } finally {
    updatingStatus.value = false
  }
}

// Resume actions
function viewResume(url) {
  if (url) {
    window.open(url, '_blank')
  } else {
    $q.notify({
      type: 'warning',
      message: 'Resume URL not available',
    })
  }
}

function downloadResume(url) {
  if (!url) {
    $q.notify({
      type: 'warning',
      message: 'Resume URL not available',
    })
    return
  }

  const link = document.createElement('a')
  link.href = url
  link.download = 'resume.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export applicants
function exportApplicants() {
  if (applicants.value.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'No applicants to export',
    })
    return
  }

  const csvContent = [
    ['Status', 'Preferred Location', 'Availability', 'Applied Date', 'LinkedIn', 'Portfolio'],
    ...applicants.value.map((a) => [
      a.status,
      a.preferredLocation || '',
      a.availability || '',
      formatDate(a.applied),
      a.linkedIn || '',
      a.portfolioWebsite || '',
    ]),
  ]
    .map((row) => row.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `applicants_${jobId.value || 'unknown'}.csv`
  link.click()
}

// Load applications
async function loadApplications() {
  if (!jobId.value) {
    $q.notify({
      type: 'warning',
      message: 'No job ID provided',
    })
    return
  }

  loading.value = true
  try {
    const response = await appStore.getApplication(jobId.value)

    if (response && response.data) {
      applicants.value = Array.isArray(response.data) ? response.data : [response.data]
      applicants.value = applicants.value.map((applicant, index) => ({
        ...applicant,
        uid: applicant.uid || `temp_${index}`,
        name: applicant.name || `Applicant ${index + 1}`,
      }))
    } else if (response && Array.isArray(response)) {
      applicants.value = response
    } else {
      applicants.value = appStore.applications || []
    }
  } catch (err) {
    console.error('Error loading applications:', err)
    $q.notify({
      type: 'negative',
      message: `Error loading applications: ${err.message}`,
    })
    applicants.value = []
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadApplications()
})
</script>

<style scoped>
/* --- Layout & General --- */
.applicants-management {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
}

/* --- Advertisement Banner --- */
.ad-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  background: linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%);
  border-radius: 10px;
  margin: 0 32px 0 32px;
  padding: 18px 28px;
  box-shadow: 0 2px 12px rgba(56, 189, 248, 0.08);
  border: 1px solid #dbeafe;
  min-height: 60px;
  margin-top: 18px;
}
.ad-title {
  font-size: 18px;
  font-weight: 700;
  color: #b87333;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
}
.ad-desc {
  font-size: 14px;
  color: #7a7a7a;
  font-weight: 500;
}

/* --- Header --- */
.header-section {
  background: #ffffff;
  padding: 18px 32px 10px 32px;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 32, 128, 0.04);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* --- Remove red from everywhere --- */
.stat-number.stat-rejected {
  color: #64748b; /* Use neutral gray instead of red */
}
.score-fair { color: #f59e0b !important; } /* Use orange for fair scores instead of red */

/* --- Small Back Button --- */
.modern-btn[icon="arrow_back"], .modern-btn.q-mr-sm {
  min-width: 32px;
  min-height: 32px;
  padding: 0;
}

/* --- Stats Section --- */
.stats-section {
  background: #f3f6fa;
  padding: 10px 32px 10px 32px;
  border-bottom: 1px solid #e8e8e8;
}
.stats-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  max-width: 900px;
  margin: 0 auto;
}
.stat-item {
  text-align: center;
  min-width: 100px;
}
.stat-number {
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
}
.stat-number.text-primary { color: #b87333; }
.stat-number.text-orange { color: #f59e0b; }
.stat-number.stat-accepted { color: #059669; }
.stat-number.stat-rejected { color: red; }
.stat-label {
  font-size: 12px;
  color: #7a7a7a;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: #e5e7eb;
}

/* --- Main Content --- */
.main-content {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 0;
  background: none;
}

/* --- Sidebar --- */
.applicants-sidebar {
  background: #f9fafb;
  border-right: 1.5px solid #e5e7eb;
  overflow-y: auto;
  height: calc(100vh - 170px);
  width: 400px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0,0,0,0.02);
}
.filter-section {
  padding: 18px 18px 10px 18px;
  border-bottom: 1px solid #e5e7eb;
  background: #f3f6fa;
}
.modern-input .q-field__control {
  border-radius: 8px;
}
.debug-info {
  padding: 6px 18px;
  background: #f1f5f9;
  font-size: 11px;
  color: #7a7a7a;
  border-bottom: 1px solid #e5e7eb;
}
.applicants-list {
  padding: 10px 8px 10px 8px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}
.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 10px;
}

/* --- Applicant Cards --- */
.applicant-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.applicant-card {
  background: linear-gradient(90deg, #fff 80%, #f0fdfa 100%);
  border: 1.5px solid #e0e7ef;
  border-radius: 12px;
  padding: 14px 18px 10px 18px;
  cursor: pointer;
  transition: box-shadow 0.18s, border-color 0.18s, transform 0.12s;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.04);
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.applicant-card:hover, .applicant-card.selected {
  border-color: #b87333;
  box-shadow: 0 4px 16px rgba(37,99,235,0.10);
  background: linear-gradient(90deg, #e0e7ff 80%, #f0fdfa 100%);
  transform: translateY(-2px) scale(1.01);
}
.applicant-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.applicant-avatar {
  flex-shrink: 0;
}
.applicant-info {
  flex: 1;
  min-width: 0;
}
.applicant-name {
  font-weight: 700;
  color: #1c1c1c;
  font-size: 15px;
  margin-bottom: 2px;
  letter-spacing: 0.1px;
}
.applicant-meta {
  font-size: 12px;
  color: #7a7a7a;
}
.status-chip {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-left: 8px;
}
.applicant-details-card {
  display: flex;
  flex-direction: row;
  gap: 18px;
  margin-top: 2px;
  font-size: 12px;
  color: #7a7a7a;
}
.detail-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #7a7a7a;
}
.resume-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}
.resume-link:hover {
  text-decoration: underline;
}

/* --- Score Section --- */
.score-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}
.ml-score {
  font-size: 22px;
  font-weight: bold;
  color: #059669;
  line-height: 1;
  margin-bottom: 2px;
  transition: color 0.2s;
}
.match-text {
  font-size: 10px;
  color: #64748b;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.score-excellent { color: #059669 !important; } /* 80%+ Green */
.score-good { color: #f59e0b !important; }      /* 60-79% Orange */
.score-fair { color: #f59e0b !important; }      /* <60% Orange */

/* --- Details Panel --- */
.applicant-details {
  background: #f9fafb;
  overflow-y: auto;
  height: calc(100vh - 170px);
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 48px;
}
.applicant-profile {
  height: auto;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.profile-header {
  background: white;
  padding: 24px 32px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.04);
}
.profile-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}
.profile-avatar {
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  overflow: hidden;
}
.profile-avatar img {
  display: block;
  width: 80px;
  height: 80px;
  object-fit: cover;
}
.profile-text {
  flex: 1;
}
.profile-name {
  font-size: 22px;
  font-weight: 700;
  color: #1c1c1c;
  margin-bottom: 4px;
}
.profile-email,
.profile-phone {
  color: #7a7a7a;
  font-size: 14px;
  margin-bottom: 2px;
}
.status-chip-large {
  font-weight: 700;
  font-size: 13px;
}
.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 140px;
}
.action-btn {
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}
.profile-separator {
  background: #e8e8e8;
}
.modern-tabs {
  background: white;
  padding: 0 32px;
  border-bottom: 1px solid #e8e8e8;
}
.modern-tabs .q-tab {
  color: #7a7a7a;
  font-weight: 600;
  text-transform: none;
  font-size: 15px;
}
.modern-tabs .q-tab--active {
  color: #b87333;
}
.tab-panels {
  flex: 1;
  background: #f9fafb;
  overflow-y: auto;
}
.tab-panel {
  padding: 28px 32px;
  min-height: 400px;
}

/* --- Info Cards --- */
.info-card {
  background: white;
  border-radius: 10px;
  border: 1.5px solid #e0e7ef;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.04);
  overflow: hidden;
  margin-bottom: 18px;
}
.card-header {
  background: #f3f6fa;
  padding: 14px 20px;
  font-weight: 700;
  color: #1c1c1c;
  border-bottom: 1px solid #e5e7eb;
  font-size: 16px;
}
.info-content {
  padding: 18px 20px;
}
.info-row {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}
.info-label {
  width: 140px;
  color: #7a7a7a;
  font-weight: 700;
  font-size: 13px;
}
.info-value {
  flex: 1;
  color: #1c1c1c;
  font-size: 14px;
}

/* --- Education & Experience --- */
.education-item, .experience-item {
  padding: 10px 0;
  border-bottom: 1px dashed #e0e7ef;
}
.education-header, .experience-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}
.education-degree, .experience-position {
  font-weight: 700;
  color: #1c1c1c;
}
.education-institution, .experience-company {
  color: #7a7a7a;
  font-size: 13px;
}
.education-details, .experience-details {
  color: #334155;
  font-size: 13px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.education-years, .experience-duration {
  color: #7a7a7a;
  font-size: 13px;
}
.education-grade {
  font-size: 13px;
  color: #1c1c1c;
  margin-top: 4px;
}
.education-description, .experience-description {
  color: #7a7a7a;
  font-size: 13px;
  margin-top: 6px;
}
.experience-skills {
  margin-top: 6px;
}
.skills-label {
  font-size: 13px;
  color: #1c1c1c;
  font-weight: 700;
  margin-bottom: 4px;
}
.skills-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.skill-chip {
  background: #e0e7ff;
  color: #b87333;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}
.cover-letter {
  background: #f3f6fa;
  border: 1px solid #e0e7ef;
  padding: 12px;
  border-radius: 8px;
  color: #334155;
  font-size: 14px;
  white-space: pre-wrap;
}
.link-primary {
  color: #b87333;
  font-weight: 700;
  text-decoration: none;
}
.link-primary:hover {
  text-decoration: underline;
}
.q-separator--vertical {
  margin: 0 12px;
  height: auto;
}

/* --- Scrollbars --- */
.applicants-sidebar::-webkit-scrollbar,
.applicant-details::-webkit-scrollbar,
.tab-panels::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.applicants-sidebar::-webkit-scrollbar-thumb,
.applicant-details::-webkit-scrollbar-thumb,
.tab-panels::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.08);
  border-radius: 8px;
}

/* --- Responsive --- */
@media (max-width: 1100px) {
  .main-content {
    flex-direction: column;
  }
  .applicants-sidebar {
    width: 100%;
    min-width: auto;
    max-height: none;
    border-right: none;
    border-bottom: 1.5px solid #e5e7eb;
    height: auto;
  }
  .q-separator--vertical {
    display: none;
  }
  .profile-actions {
    flex-direction: row;
    justify-content: flex-start;
    min-width: 0;
    gap: 8px;
  }
  .profile-avatar img {
    width: 64px;
    height: 64px;
  }
  .profile-name {
    font-size: 18px;
  }
  .tab-panel {
    padding: 16px;
    min-height: auto;
  }
  .ad-banner, .header-section, .stats-section {
    margin-left: 0;
    margin-right: 0;
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>