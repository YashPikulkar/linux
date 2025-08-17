<template>
  <div class="applicants-management">
    <!-- Header Section -->
    <div class="header-section">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <q-btn 
            flat 
            icon="arrow_back" 
            label="Back to Jobs" 
            color="primary" 
            @click="goBack"
            class="q-mb-sm"
          />
          <div class="text-h5 text-weight-medium text-grey-8">{{ jobDetails?.title || 'Job Applications' }}</div>
          <div class="text-body2 text-grey-6">
            {{ jobDetails?.company }} • {{ jobDetails?.location }} • {{ jobDetails?.jobtype }}
            <span v-if="jobId" class="q-ml-sm">• Job ID: {{ jobId }}</span>
          </div>
        </div>
        <div class="col-auto">
          <div class="row q-gutter-md items-center">
            <q-btn-toggle
              v-model="viewMode"
              toggle-color="grey-8"
              color="grey-2"
              text-color="grey-7"
              :options="[
                { label: 'Cards', value: 'cards' },
                { label: 'Table', value: 'table' }
              ]"
              class="modern-toggle"
            />
            <q-btn 
              icon="download" 
              label="Export" 
              color="grey-8" 
              outline
              @click="exportApplicants"
              class="modern-btn"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Stats Section -->
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
          <div class="stat-number text-positive">{{ getStatusCount('accepted') }}</div>
          <div class="stat-label">Accepted</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number text-negative">{{ getStatusCount('rejected') }}</div>
          <div class="stat-label">Rejected</div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-content row no-wrap">
      <!-- Left Sidebar - Applicants List -->
      <div class="applicants-sidebar col-4">
        <!-- Search and Filter -->
        <div class="filter-section">
          <q-input
            v-model="searchQuery"
            placeholder="Search applicants..."
            dense
            outlined
            clearable
            class="modern-input q-mb-md"
            bg-color="white"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-5" />
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
            bg-color="white"
          />
        </div>

        <!-- Debug Info -->
        <div class="debug-info" v-if="$q.dev">
          <div>Total: {{ applicants.length }} | Filtered: {{ filteredApplicants.length }}</div>
          <div v-if="loading">Loading...</div>
        </div>

        <!-- Applicants List -->
        <div class="applicants-list">
          <div v-if="loading" class="loading-state">
            <q-spinner size="32px" color="primary" />
            <div class="q-mt-sm text-grey-6">Loading applicants...</div>
          </div>

          <div v-else-if="applicants.length === 0" class="empty-state">
            <q-icon name="inbox" size="42px" color="grey-4" />
            <div class="text-body2 text-grey-6 q-mt-sm">No applicants yet</div>
          </div>

          <div v-else class="applicant-cards">
            <div 
              v-for="(applicant, idx) in filteredApplicants" 
              :key="applicant.uid || applicant.resume_url || idx" 
              :class="{ 'selected': selectedApplicant?.uid === applicant.uid }" 
              @click="selectApplicant(applicant)"
              class="applicant-card"
            >
              <!-- Avatar and main info -->
              <div class="applicant-header">
                <q-avatar size="40px" icon="person" color="grey-5" text-color="white" class="applicant-avatar" />
                <div class="applicant-info">
                  <div class="applicant-name">{{ applicant.name || 'Applicant' }}</div>
                  <div class="applicant-meta">Applied: {{ formatDate(applicant.applied) }}</div>
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

              <!-- Additional details -->
              <div class="applicant-details">
                <div class="detail-row">
                  <q-icon name="place" size="14px" color="grey-5" />
                  <span>{{ applicant.preferredLocation || 'Location not specified' }}</span>
                </div>
                <div class="detail-row">
                  <q-icon name="schedule" size="14px" color="grey-5" />
                  <span>{{ applicant.availability || 'Availability not specified' }}</span>
                </div>
                <div class="detail-row" v-if="applicant.resume_url">
                  <q-icon name="description" size="14px" color="primary" />
                  <a 
                    :href="applicant.resume_url" 
                    target="_blank"
                    @click.stop
                    class="resume-link"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Applicant Details -->
      <div class="applicant-details col-8">
        <div v-if="!selectedApplicant" class="no-selection">
          <q-icon name="person_search" size="80px" color="grey-4" class="q-mb-md" />
          <div class="text-h6 text-grey-6 text-weight-regular">Select an applicant to view details</div>
          <div class="text-body2 text-grey-5 q-mt-sm">
            Choose from the list on the left to see their profile and application details
          </div>
        </div>

        <div v-else class="applicant-profile">
          <!-- Profile Header -->
          <div class="profile-header">
            <div class="profile-info">
              <q-avatar size="64px" class="profile-avatar">
                <img 
                  :src="selectedApplicant.avatar || 'https://cdn.quasar.dev/img/avatar.png'" 
                  :alt="selectedApplicant.name || 'Applicant'" 
                />
              </q-avatar>
              <div class="profile-text">
                <div class="profile-name">{{ selectedApplicant.name || 'Anonymous Applicant' }}</div>
                <div class="profile-email">{{ selectedApplicant.email || 'No email provided' }}</div>
                <div class="profile-phone">{{ selectedApplicant.phone || 'No phone number provided' }}</div>
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
                @click="updateStatus('accepted')"
                :disable="selectedApplicant.status === 'accepted'"
                :loading="updatingStatus"
                class="action-btn q-mb-sm"
                no-caps
              />
              <q-btn 
                color="orange" 
                icon="schedule"
                label="Pending" 
                @click="updateStatus('pending')"
                :disable="selectedApplicant.status === 'pending'"
                :loading="updatingStatus"
                outline
                class="action-btn q-mb-sm"
                no-caps
              />
              <q-btn 
                color="negative" 
                icon="cancel"
                label="Reject" 
                @click="updateStatus('rejected')"
                :disable="selectedApplicant.status === 'rejected'"
                :loading="updatingStatus"
                outline
                class="action-btn"
                no-caps
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
            align="left"
            narrow-indicator
          >
            <q-tab name="overview" label="Overview" icon="person" no-caps />
            <q-tab name="resume" label="Resume & Documents" icon="description" no-caps />
            <q-tab name="education" label="Education" icon="school" no-caps />
            <q-tab name="experience" label="Experience" icon="work" no-caps />
            <q-tab name="contact" label="Contact Info" icon="contact_mail" no-caps />
          </q-tabs>

          <q-tab-panels v-model="activeTab" animated class="tab-panels">
            <!-- Overview Tab -->
            <q-tab-panel name="overview" class="tab-panel">
              <div class="row q-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="info-card">
                    <div class="card-header">Application Details</div>
                    <div class="info-content">
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
                        <span class="info-value">{{ selectedApplicant.preferredLocation || 'Not specified' }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Availability:</span>
                        <span class="info-value">{{ selectedApplicant.availability || 'Not specified' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="info-card">
                    <div class="card-header">Links & Documents</div>
                    <div class="info-content">
                      <div class="info-row" v-if="selectedApplicant.linkedIn">
                        <span class="info-label">LinkedIn:</span>
                        <span class="info-value">
                          <a :href="selectedApplicant.linkedIn" target="_blank" class="link-primary">
                            View Profile
                          </a>
                        </span>
                      </div>
                      <div class="info-row" v-if="selectedApplicant.portfolioWebsite">
                        <span class="info-label">Portfolio:</span>
                        <span class="info-value">
                          <a :href="selectedApplicant.portfolioWebsite" target="_blank" class="link-primary">
                            View Portfolio
                          </a>
                        </span>
                      </div>
                      <div class="info-row" v-if="selectedApplicant.resume_url">
                        <span class="info-label">Resume:</span>
                        <span class="info-value">
                          <a :href="selectedApplicant.resume_url" target="_blank" class="link-primary">
                            View Resume
                          </a>
                        </span>
                      </div>
                      <div v-if="!selectedApplicant.linkedIn && !selectedApplicant.portfolioWebsite && !selectedApplicant.resume_url" class="text-grey-6 text-center q-pa-md">
                        No additional links provided
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Resume Tab -->
            <q-tab-panel name="resume" class="tab-panel">
              <div class="info-card">
                <div class="card-header">Documents & Resume</div>
                <div class="info-content">
                  <div v-if="selectedApplicant.resume_url" class="q-mb-md">
                    <q-btn 
                      color="primary" 
                      icon="visibility"
                      label="View Resume" 
                      @click="viewResume(selectedApplicant.resume_url)"
                      class="q-mr-sm modern-btn"
                      no-caps
                    />
                    <q-btn 
                      color="grey-7" 
                      icon="download"
                      label="Download Resume" 
                      @click="downloadResume(selectedApplicant.resume_url)"
                      outline
                      class="modern-btn"
                      no-caps
                    />
                  </div>
                  <div v-else class="text-grey-6 text-center q-pa-lg">
                    <q-icon name="description" size="48px" color="grey-4" />
                    <div class="q-mt-sm">No resume uploaded</div>
                  </div>
                  
                  <!-- Cover Letter -->
                  <div class="q-mt-lg" v-if="selectedApplicant.coverLetter || selectedApplicant.cover_letter">
                    <div class="card-header q-mb-md">Cover Letter</div>
                    <div class="cover-letter">
                      {{ selectedApplicant.coverLetter || selectedApplicant.cover_letter }}
                    </div>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Education Tab -->
            <q-tab-panel name="education" class="tab-panel">
              <div class="info-card">
                <div class="card-header">Education History</div>
                <div class="info-content">
                  <div v-if="selectedApplicant.education && selectedApplicant.education.length > 0">
                    <div 
                      v-for="(edu, index) in selectedApplicant.education" 
                      :key="index"
                      class="education-item"
                    >
                      <div class="education-header">
                        <div class="education-degree">{{ edu.degree || 'Degree' }}</div>
                        <div class="education-institution">{{ edu.institution || 'Institution' }}</div>
                      </div>
                      <div class="education-details">
                        <span v-if="edu.field_of_study">{{ edu.field_of_study }}</span>
                        <span v-if="edu.start_year || edu.end_year" class="education-years">
                          {{ edu.start_year || 'N/A' }} - {{ edu.end_year || 'Present' }}
                        </span>
                      </div>
                      <div v-if="edu.grade || edu.percentage" class="education-grade">
                        <strong>Grade:</strong> {{ edu.grade || edu.percentage || 'Not specified' }}
                      </div>
                      <div v-if="edu.description" class="education-description">
                        {{ edu.description }}
                      </div>
                    </div>
                  </div>
                  
                  <div v-else-if="!selectedApplicant.detailsLoaded" class="loading-state">
                    <q-spinner size="24px" color="primary" />
                    <div class="q-mt-sm text-grey-6">Loading education details...</div>
                  </div>
                  
                  <div v-else class="empty-state">
                    <q-icon name="school" size="48px" color="grey-4" />
                    <div class="text-body2 text-grey-6 q-mt-sm">No education records found</div>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Experience Tab -->
            <q-tab-panel name="experience" class="tab-panel">
              <div class="info-card">
                <div class="card-header">Work Experience</div>
                <div class="info-content">
                  <div v-if="selectedApplicant.experience && selectedApplicant.experience.length > 0">
                    <div 
                      v-for="(exp, index) in selectedApplicant.experience" 
                      :key="index"
                      class="experience-item"
                    >
                      <div class="experience-header">
                        <div class="experience-position">{{ exp.position || exp.job_title || 'Position' }}</div>
                        <div class="experience-company">{{ exp.company || 'Company' }}</div>
                      </div>
                      <div class="experience-details">
                        <span v-if="exp.location">📍 {{ exp.location }}</span>
                        <span v-if="exp.start_date || exp.end_date" class="experience-duration">
                          {{ formatDate(exp.start_date) || 'N/A' }} - {{ exp.end_date ? formatDate(exp.end_date) : 'Present' }}
                        </span>
                      </div>
                      <div v-if="exp.employment_type" class="q-mt-xs">
                        <q-chip size="sm" color="blue" text-color="white">
                          {{ exp.employment_type }}
                        </q-chip>
                      </div>
                      <div v-if="exp.description || exp.responsibilities" class="experience-description">
                        {{ exp.description || exp.responsibilities }}
                      </div>
                      <div v-if="exp.skills" class="experience-skills">
                        <div class="skills-label">Skills used:</div>
                        <div class="skills-list">
                          <q-chip 
                            v-for="skill in (exp.skills || '').split(',').filter(s => s.trim())" 
                            :key="skill.trim()"
                            size="sm"
                            color="grey-2" 
                            text-color="grey-8"
                            class="skill-chip"
                          >
                            {{ skill.trim() }}
                          </q-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-else-if="!selectedApplicant.detailsLoaded" class="loading-state">
                    <q-spinner size="24px" color="primary" />
                    <div class="q-mt-sm text-grey-6">Loading experience details...</div>
                  </div>
                  
                  <div v-else class="empty-state">
                    <q-icon name="work" size="48px" color="grey-4" />
                    <div class="text-body2 text-grey-6 q-mt-sm">No work experience found</div>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="contact" class="tab-panel">
              <div class="info-card">
                <div class="card-header">Contact Information</div>
                <div class="info-content">
                  <div class="info-row">
                    <span class="info-label">LinkedIn:</span>
                    <span class="info-value">
                      <a v-if="selectedApplicant.linkedIn" :href="selectedApplicant.linkedIn" target="_blank" class="link-primary">
                        {{ selectedApplicant.linkedIn }}
                      </a>
                      <span v-else class="text-grey-6">Not provided</span>
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Portfolio:</span>
                    <span class="info-value">
                      <a v-if="selectedApplicant.portfolioWebsite" :href="selectedApplicant.portfolioWebsite" target="_blank" class="link-primary">
                        {{ selectedApplicant.portfolioWebsite }}
                      </a>
                      <span v-else class="text-grey-6">Not provided</span>
                    </span>
                  </div>
                  
                  <div class="q-mt-lg" v-if="selectedApplicant.linkedIn || selectedApplicant.portfolioWebsite">
                    <q-btn 
                      v-if="selectedApplicant.linkedIn"
                      color="primary" 
                      icon="link"
                      label="Visit LinkedIn" 
                      @click="window.open(selectedApplicant.linkedIn, '_blank')"
                      class="q-mr-sm modern-btn"
                      no-caps
                    />
                    <q-btn 
                      v-if="selectedApplicant.portfolioWebsite"
                      color="grey-7" 
                      icon="web"
                      label="Visit Portfolio" 
                      @click="window.open(selectedApplicant.portfolioWebsite, '_blank')"
                      outline
                      class="modern-btn"
                      no-caps
                    />
                  </div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAppStore } from 'src/stores/app-store';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const appStore = useAppStore();

// Props (for backward compatibility if passed as props)
const props = defineProps({
  jobDetails: {
    type: Object,
    default: () => ({})
  }
});

// Get jobId from route params or props
const jobId = computed(() => route.params.jobId || props.jobDetails?.id);

// UI State
const viewMode = ref('cards');
const searchQuery = ref('');
const statusFilter = ref(null);
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' }
];
const statusColors = {
  pending: 'orange',
  accepted: 'blue-grey-7',
  rejected: 'grey-7'
};
const activeTab = ref('overview');
const selectedApplicant = ref(null);
const updatingStatus = ref(false);
const jobDetails = ref(props.jobDetails || {});

// Local applicants state - FIXED: Direct reactive reference
const applicants = ref([]);
const loading = ref(false);

// Computed filtered list - FIXED: Better filtering logic
const filteredApplicants = computed(() => {
  let filtered = applicants.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(applicant =>
      (applicant.preferredLocation || '').toLowerCase().includes(query) ||
      (applicant.status || '').toLowerCase().includes(query) ||
      (applicant.availability || '').toLowerCase().includes(query) ||
      (applicant.name || '').toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    filtered = filtered.filter(applicant => applicant.status === statusFilter.value);
  }

  return filtered;
});

// Stats
const totalApplicants = computed(() => applicants.value.length);

function getStatusCount(status) {
  return applicants.value.filter(a => a.status === status).length;
}

// Navigation
function goBack() {
  router.go(-1);
}

// Selection - ENHANCED: Load detailed information
async function selectApplicant(applicant) {
  selectedApplicant.value = applicant;
  activeTab.value = 'overview';
  
  // Load additional details if uid is available
  if (applicant.uid) {
    await loadApplicantDetails(applicant.uid);
  }
}

// Load detailed applicant information
async function loadApplicantDetails(uid) {
  try {
    // Load education and experience in parallel
    const [educationResponse, experienceResponse] = await Promise.all([
      appStore.getEducation(uid).catch(err => {
        console.warn('Education data not available:', err);
        return null;
      }),
      appStore.getExperience(uid).catch(err => {
        console.warn('Experience data not available:', err);
        return null;
      })
    ]);

    // Add the detailed data to selected applicant
    if (selectedApplicant.value) {
      selectedApplicant.value = {
        ...selectedApplicant.value,
        education: educationResponse?.data || [],
        experience: experienceResponse?.data || [],
        detailsLoaded: true
      };
    }

  } catch (error) {
    console.error('Error loading applicant details:', error);
    // Don't show error notification for missing details, just log it
  }
}

// Format date - FIXED: Handle the correct property name
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

// Status update - ENHANCED: Use uid instead of id and proper API structure
async function updateStatus(status) {
  if (!selectedApplicant.value || !selectedApplicant.value.uid) {
    $q.notify({
      type: 'warning',
      message: 'Cannot update status: Applicant UID not available'
    });
    return;
  }

  updatingStatus.value = true;
  try {
    // Call the backend API with uid and status
    await appStore.updateStatus({
      uid: selectedApplicant.value.uid,
      status: status
    });
    
    // Update local state
    selectedApplicant.value.status = status;
    
    // Update in the applicants array
    const index = applicants.value.findIndex(a => 
      a.uid === selectedApplicant.value.uid
    );
    if (index !== -1) {
      applicants.value[index].status = status;
    }
    
    $q.notify({ 
      type: 'positive', 
      message: `Status updated to ${status}. Email notification sent.` 
    });
  } catch (err) {
    console.error('Status update error:', err);
    $q.notify({ 
      type: 'negative', 
      message: `Error updating status: ${err.message}` 
    });
  } finally {
    updatingStatus.value = false;
  }
}

// Resume actions
function viewResume(url) {
  if (url) {
    window.open(url, '_blank');
  } else {
    $q.notify({
      type: 'warning',
      message: 'Resume URL not available'
    });
  }
}

function downloadResume(url) {
  if (!url) {
    $q.notify({
      type: 'warning',
      message: 'Resume URL not available'
    });
    return;
  }
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export applicants - FIXED: Handle current data structure
function exportApplicants() {
  if (applicants.value.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'No applicants to export'
    });
    return;
  }

  const csvContent = [
    ['Status', 'Preferred Location', 'Availability', 'Applied Date', 'LinkedIn', 'Portfolio'],
    ...applicants.value.map(a => [
      a.status,
      a.preferredLocation || '',
      a.availability || '',
      formatDate(a.applied),
      a.linkedIn || '',
      a.portfolioWebsite || ''
    ])
  ]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `applicants_${jobId.value || 'unknown'}.csv`;
  link.click();
}

// FIXED: Load applications function with proper error handling and uid extraction
async function loadApplications() {
  if (!jobId.value) {
    $q.notify({
      type: 'warning',
      message: 'No job ID provided'
    });
    return;
  }

  loading.value = true;
  try {
    // Call your API directly or through the store
    const response = await appStore.getApplication(jobId.value);
    
    // Handle the response structure based on your API
    if (response && response.data) {
      applicants.value = Array.isArray(response.data) ? response.data : [response.data];
      
      // Add uid from the response if not present (extract from applications table)
      // Since your backend joins with applicants table, uid should be available
      // But we need to modify the backend query to include uid in the SELECT
      applicants.value = applicants.value.map((applicant, index) => ({
        ...applicant,
        uid: applicant.uid || `temp_${index}`, // Fallback if uid is missing
        name: applicant.name || `Applicant ${index + 1}` // Add name if missing
      }));
      
    } else if (response && Array.isArray(response)) {
      applicants.value = response;
    } else {
      // Fallback: try to get from store
      applicants.value = appStore.applications || [];
    }
    
    console.log('Loaded applications:', applicants.value);
    
  } catch (err) {
    console.error('Error loading applications:', err);
    $q.notify({ 
      type: 'negative', 
      message: `Error loading applications: ${err.message}` 
    });
    
    // Set empty array on error
    applicants.value = [];
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  loadApplications();
});
</script>

<style scoped>
/* Base Layout */
.applicants-management {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

/* Header Section */
.header-section {
  background: #ffffff;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.modern-toggle .q-btn {
  border-radius: 6px;
}

.modern-btn {
  border-radius: 6px;
  font-weight: 500;
  text-transform: none;
}

/* Compact Stats Section */
.stats-section {
  background: #f8f9fa;
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.stats-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  min-width: 120px;
}

.stat-number {
  font-size: 28px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-number.text-primary {
  color: #3b82f6;
}

.stat-number.text-orange {
  color: #f59e0b;
}

.stat-number.stat-accepted {
  color: #475569;
}

.stat-number.stat-rejected {
  color: #6b7280;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e5e7eb;
}

/* Main Content */
.main-content {
  flex: 1;
  min-height: 0;
  display: flex;
}

/* Left Sidebar */
.applicants-sidebar {
  background: white;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
  max-height: calc(100vh - 140px);
}

.filter-section {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafbfc;
}

.modern-input .q-field__control {
  border-radius: 8px;
}

.debug-info {
  padding: 8px 20px;
  background: #f8f9fa;
  font-size: 11px;
  color: #6c757d;
  border-bottom: 1px solid #f3f4f6;
}

.applicants-list {
  padding: 12px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 48px 20px;
}

.applicant-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.applicant-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.applicant-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.applicant-card.selected {
  background: #eff6ff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.applicant-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.applicant-avatar {
  flex-shrink: 0;
}

.applicant-info {
  flex: 1;
  min-width: 0;
}

.applicant-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 2px;
}

.applicant-meta {
  font-size: 12px;
  color: #6b7280;
}

.status-chip {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
}

.applicant-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.resume-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.resume-link:hover {
  text-decoration: underline;
}

/* Right Panel */
.applicant-details {
  background: #fafafa;
  overflow-y: auto;
  max-height: calc(100vh - 140px);
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

/* Profile Header */
.profile-header {
  background: white;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.profile-avatar {
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-text {
  flex: 1;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.profile-email {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 2px;
}

.profile-phone {
  color: #6b7280;
  font-size: 14px;
}

.status-chip-large {
  font-weight: 600;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 140px;
}

.action-btn {
  border-radius: 6px;
  font-weight: 500;
}

.profile-separator {
  background: #e8e8e8;
}

/* Tabs */
.modern-tabs {
  background: white;
  padding: 0 24px;
  border-bottom: 1px solid #e8e8e8;
}

.modern-tabs .q-tab {
  color: #6b7280;
  font-weight: 500;
  text-transform: none;
}

.modern-tabs .q-tab--active {
  color: #3b82f6;
}

/* Tab Panels */
.tab-panels {
  flex: 1;
  background: #fafafa;
  overflow-y: auto;
}

.tab-panel {
  padding: 24px;
  min-height: 400px;
}

/* Info Cards */
.info-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  padding: 16px 20px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.info-content {
  padding: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
}

.info-label {
  font-weight: 500;
  min-width: 140px;
  color: #6b7280;
  margin-right: 12px;
}

.info-value {
  color: #374151;
  flex: 1;
}

.link-primary {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.link-primary:hover {
  text-decoration: underline;
}

.cover-letter {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
  white-space: pre-line;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

/* Education Items */
.education-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fefefe;
}

.education-item:last-child {
  margin-bottom: 0;
}

.education-header {
  margin-bottom: 8px;
}

.education-degree {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
}

.education-institution {
  color: #3b82f6;
  font-weight: 500;
  margin-top: 2px;
}

.education-details {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 6px;
}

.education-years {
  margin-left: 12px;
}

.education-grade {
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
}

.education-description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.4;
}

/* Experience Items */
.experience-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fefefe;
  border-left: 3px solid #64748b;
}

.experience-item:last-child {
  margin-bottom: 0;
}

.experience-header {
  margin-bottom: 8px;
}

.experience-position {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
}

.experience-company {
  color: #475569;
  font-weight: 500;
  margin-top: 2px;
}

.experience-details {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
}

.experience-duration {
  margin-left: 12px;
}

.experience-description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.4;
  margin-top: 8px;
}

.experience-skills {
  margin-top: 12px;
}

.skills-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 6px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-chip {
  font-size: 11px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }
  
  .applicants-sidebar {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .applicant-details {
    max-height: none;
    min-height: 500px;
  }
  
  .stats-container {
    gap: 16px;
  }
  
  .stat-number {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .header-section,
  .stats-section,
  .tab-panel {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .profile-actions {
    align-self: stretch;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .stats-container {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .stat-item {
    min-width: 80px;
  }
  
  .stat-divider {
    display: none;
  }
}

@media (max-width: 480px) {
  .applicant-header {
    flex-wrap: wrap;
  }
  
  .status-chip {
    margin-top: 8px;
  }
  
  .profile-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>