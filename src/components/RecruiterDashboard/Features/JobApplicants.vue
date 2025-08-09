<template>
  <div class="applicants-management">
    <!-- Header Section -->
    <div class="header-section q-pa-lg">
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
          <div class="text-h5 text-weight-bold">{{ jobDetails?.title || 'Job Applications' }}</div>
          <div class="text-subtitle2 text-grey-7">
            {{ jobDetails?.company }} • {{ jobDetails?.location }} • {{ jobDetails?.jobtype }}
            <span v-if="jobId" class="q-ml-sm">• Job ID: {{ jobId }}</span>
          </div>
        </div>
        <div class="col-auto">
          <div class="row q-gutter-md items-center">
            <q-toggle 
              v-model="sendEmails" 
              label="Email notifications" 
              color="primary" 
            />
            <q-btn-toggle
              v-model="viewMode"
              toggle-color="primary"
              :options="[
                { label: 'Cards', value: 'cards' },
                { label: 'Table', value: 'table' }
              ]"
            />
            <q-btn 
              icon="download" 
              label="Export" 
              color="secondary" 
              outline
              @click="exportApplicants"
            />
          </div>
        </div>
      </div>
    </div>

    <q-separator />

    <!-- Stats Section -->
    <div class="stats-section q-pa-lg">
      <div class="row q-gutter-md">
        <div class="col">
          <q-card class="stats-card">
            <q-card-section class="text-center">
              <div class="text-h4 text-primary">{{ totalApplicants }}</div>
              <div class="text-caption text-grey-7">Total Applicants</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card class="stats-card">
            <q-card-section class="text-center">
              <div class="text-h4 text-orange">{{ getStatusCount('pending') }}</div>
              <div class="text-caption text-grey-7">Pending Review</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card class="stats-card">
            <q-card-section class="text-center">
              <div class="text-h4 text-positive">{{ getStatusCount('accepted') }}</div>
              <div class="text-caption text-grey-7">Accepted</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card class="stats-card">
            <q-card-section class="text-center">
              <div class="text-h4 text-negative">{{ getStatusCount('rejected') }}</div>
              <div class="text-caption text-grey-7">Rejected</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <q-separator />

    <!-- Main Content Area -->
    <div class="main-content row no-wrap">
      <!-- Left Sidebar - Applicants List -->
      <div class="applicants-sidebar col-4 q-pa-lg">
        <!-- Search and Filter -->
        <div class="q-mb-lg">
          <q-input
            v-model="searchQuery"
            placeholder="Search applicants..."
            dense
            outlined
            clearable
            class="q-mb-md"
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
          />
        </div>

        <!-- Debug Info -->
        <div class="q-mb-md q-pa-sm bg-grey-2 text-caption" v-if="$q.dev">
          <div>Total applicants: {{ applicants.length }}</div>
          <div>Filtered applicants: {{ filteredApplicants.length }}</div>
          <div>Loading: {{ loading }}</div>
        </div>

        <!-- Applicants List -->
        <div class="applicants-list">
          <div v-if="loading" class="text-center q-pa-lg">
            <q-spinner size="40px" color="primary" />
            <div class="q-mt-sm">Loading applicants...</div>
          </div>

          <div v-else-if="applicants.length === 0" class="text-center q-pa-lg">
            <q-icon name="inbox" size="48px" color="grey-4" />
            <div class="text-body1 text-grey-6 q-mt-sm">No applicants yet</div>
          </div>

          <q-list v-else separator>
            <q-item 
              v-for="(applicant, idx) in filteredApplicants" 
              :key="applicant.uid || applicant.resume_url || idx" 
              clickable  
              :class="{ 'bg-blue-1': selectedApplicant?.uid === applicant.uid }" 
              @click="selectApplicant(applicant)"
              class="applicant-item q-pa-md"
            >
              <!-- Left section: Avatar -->
              <q-item-section avatar>
                <q-avatar size="48px" icon="person" color="blue-4" text-color="white" />
              </q-item-section>

              <!-- Main applicant details -->
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ applicant.name || 'Applicant' }}
                </q-item-label>
                <q-item-label caption>
                  Applied: {{ formatDate(applicant.applied) }}
                </q-item-label>
                <q-item-label caption>
                  Location: {{ applicant.preferredLocation || 'Not specified' }}
                </q-item-label>
                <q-item-label caption>
                  Availability: {{ applicant.availability || 'Not specified' }}
                </q-item-label>
              </q-item-section>

              <!-- Right side: Status and links -->
              <q-item-section side>
                <q-chip 
                  :color="statusColors[applicant.status]" 
                  text-color="white" 
                  size="sm"
                  class="q-mb-sm"
                >
                  {{ applicant.status }}
                </q-chip>
                <div class="text-caption text-blue">
                  <a 
                    v-if="applicant.resume_url" 
                    :href="applicant.resume_url" 
                    target="_blank"
                    @click.stop
                  >
                    View Resume
                  </a>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <q-separator vertical />

      <!-- Right Panel - Applicant Details -->
      <div class="applicant-details col-8">
        <div v-if="!selectedApplicant" class="no-selection q-pa-xl text-center">
          <q-icon name="person_search" size="120px" color="grey-4" class="q-mb-lg" />
          <div class="text-h6 text-grey-7">Select an applicant to view details</div>
          <div class="text-body2 text-grey-6">
            Choose from the list on the left to see their profile and application details
          </div>
        </div>

        <div v-else class="applicant-profile q-pa-lg">
          <!-- Profile Header -->
          <div class="profile-header q-mb-lg">
            <div class="row items-center q-gutter-lg">
              <q-avatar size="80px">
                <img 
                  :src="selectedApplicant.avatar || 'https://cdn.quasar.dev/img/avatar.png'" 
                  :alt="selectedApplicant.name || 'Applicant'" 
                />
              </q-avatar>
              <div class="col">
                <div class="text-h5 text-weight-bold">{{ selectedApplicant.name || 'Anonymous Applicant' }}</div>
                <div class="text-subtitle1 text-grey-7">{{ selectedApplicant.email || 'No email provided' }}</div>
                <div class="text-body2 text-grey-6 q-mt-xs">
                  {{ selectedApplicant.phone || 'No phone number provided' }}
                </div>
                <div class="q-mt-sm">
                  <q-chip 
                    :color="statusColors[selectedApplicant.status]" 
                    text-color="white"
                    icon="circle"
                  >
                    {{ selectedApplicant.status.toUpperCase() }}
                  </q-chip>
                </div>
              </div>
              <div class="col-auto">
                <div class="row q-gutter-sm">
                  <q-btn 
                    color="positive" 
                    icon="check_circle"
                    label="Accept" 
                    @click="updateStatus('accepted')"
                    :disable="selectedApplicant.status === 'accepted'"
                    :loading="updatingStatus"
                  />
                  <q-btn 
                    color="orange" 
                    icon="schedule"
                    label="Pending" 
                    @click="updateStatus('pending')"
                    :disable="selectedApplicant.status === 'pending'"
                    :loading="updatingStatus"
                    outline
                  />
                  <q-btn 
                    color="negative" 
                    icon="cancel"
                    label="Reject" 
                    @click="updateStatus('rejected')"
                    :disable="selectedApplicant.status === 'rejected'"
                    :loading="updatingStatus"
                    outline
                  />
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-mb-lg" />

          <!-- Profile Details Tabs -->
          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey"
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

          <q-tab-panels v-model="activeTab" animated class="q-mt-md">
            <!-- Overview Tab -->
            <q-tab-panel name="overview" class="q-pa-none">
              <div class="row q-gutter-lg">
                <div class="col-6">
                  <q-card class="info-card">
                    <q-card-section>
                      <div class="text-weight-medium q-mb-sm">Application Details</div>
                      <div class="info-row">
                        <span class="info-label">Applied On:</span>
                        <span>{{ formatDate(selectedApplicant.applied) }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span>{{ selectedApplicant.status }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Preferred Location:</span>
                        <span>{{ selectedApplicant.preferredLocation || 'Not specified' }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Availability:</span>
                        <span>{{ selectedApplicant.availability || 'Not specified' }}</span>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-6">
                  <q-card class="info-card">
                    <q-card-section>
                      <div class="text-weight-medium q-mb-sm">Links & Documents</div>
                      <div class="info-row" v-if="selectedApplicant.linkedIn">
                        <span class="info-label">LinkedIn:</span>
                        <span>
                          <a :href="selectedApplicant.linkedIn" target="_blank" class="text-primary">
                            View Profile
                          </a>
                        </span>
                      </div>
                      <div class="info-row" v-if="selectedApplicant.portfolioWebsite">
                        <span class="info-label">Portfolio:</span>
                        <span>
                          <a :href="selectedApplicant.portfolioWebsite" target="_blank" class="text-primary">
                            View Portfolio
                          </a>
                        </span>
                      </div>
                      <div class="info-row" v-if="selectedApplicant.resume_url">
                        <span class="info-label">Resume:</span>
                        <span>
                          <a :href="selectedApplicant.resume_url" target="_blank" class="text-primary">
                            View Resume
                          </a>
                        </span>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <!-- Resume Tab -->
            <q-tab-panel name="resume" class="q-pa-none">
              <q-card class="info-card">
                <q-card-section>
                  <div class="text-weight-medium q-mb-md">Documents & Resume</div>
                  <div v-if="selectedApplicant.resume_url" class="q-mb-md">
                    <q-btn 
                      color="primary" 
                      icon="visibility"
                      label="View Resume" 
                      @click="viewResume(selectedApplicant.resume_url)"
                      class="q-mr-sm"
                    />
                    <q-btn 
                      color="secondary" 
                      icon="download"
                      label="Download Resume" 
                      @click="downloadResume(selectedApplicant.resume_url)"
                      outline
                    />
                  </div>
                  <div v-else class="text-grey-6">
                    No resume uploaded
                  </div>
                  
                  <!-- Cover Letter -->
                  <div class="q-mt-lg" v-if="selectedApplicant.coverLetter || selectedApplicant.cover_letter">
                    <div class="text-weight-medium q-mb-sm">Cover Letter</div>
                    <q-card class="bg-grey-1 q-pa-md">
                      <div class="text-body2" style="white-space: pre-line;">
                        {{ selectedApplicant.coverLetter || selectedApplicant.cover_letter }}
                      </div>
                    </q-card>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Education Tab -->
            <q-tab-panel name="education" class="q-pa-none">
              <q-card class="info-card">
                <q-card-section>
                  <div class="text-weight-medium q-mb-md">Education History</div>
                  
                  <div v-if="selectedApplicant.education && selectedApplicant.education.length > 0">
                    <q-card 
                      v-for="(edu, index) in selectedApplicant.education" 
                      :key="index"
                      class="q-mb-md bg-blue-1"
                      flat
                      bordered
                    >
                      <q-card-section>
                        <div class="text-h6 text-weight-bold">{{ edu.degree || 'Degree' }}</div>
                        <div class="text-subtitle1 text-primary">{{ edu.institution || 'Institution' }}</div>
                        <div class="text-body2 text-grey-7 q-mt-xs">
                          <span v-if="edu.field_of_study">{{ edu.field_of_study }}</span>
                          <span v-if="edu.start_year || edu.end_year" class="q-ml-md">
                            {{ edu.start_year || 'N/A' }} - {{ edu.end_year || 'Present' }}
                          </span>
                        </div>
                        <div v-if="edu.grade || edu.percentage" class="text-body2 q-mt-xs">
                          <strong>Grade:</strong> {{ edu.grade || edu.percentage || 'Not specified' }}
                        </div>
                        <div v-if="edu.description" class="text-body2 q-mt-sm">
                          {{ edu.description }}
                        </div>
                      </q-card-section>
                    </q-card>
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
            <q-tab-panel name="experience" class="q-pa-none">
              <q-card class="info-card">
                <q-card-section>
                  <div class="text-weight-medium q-mb-md">Work Experience</div>
                  
                  <div v-if="selectedApplicant.experience && selectedApplicant.experience.length > 0">
                    <q-card 
                      v-for="(exp, index) in selectedApplicant.experience" 
                      :key="index"
                      class="q-mb-md bg-green-1"
                      flat
                      bordered
                    >
                      <q-card-section>
                        <div class="text-h6 text-weight-bold">{{ exp.position || exp.job_title || 'Position' }}</div>
                        <div class="text-subtitle1 text-primary">{{ exp.company || 'Company' }}</div>
                        <div class="text-body2 text-grey-7 q-mt-xs">
                          <span v-if="exp.location">📍 {{ exp.location }}</span>
                          <span v-if="exp.start_date || exp.end_date" class="q-ml-md">
                            {{ formatDate(exp.start_date) || 'N/A' }} - {{ exp.end_date ? formatDate(exp.end_date) : 'Present' }}
                          </span>
                        </div>
                        <div v-if="exp.employment_type" class="q-mt-xs">
                          <q-chip size="sm" color="blue" text-color="white">
                            {{ exp.employment_type }}
                          </q-chip>
                        </div>
                        <div v-if="exp.description || exp.responsibilities" class="text-body2 q-mt-sm">
                          {{ exp.description || exp.responsibilities }}
                        </div>
                        <div v-if="exp.skills" class="q-mt-sm">
                          <div class="text-caption text-grey-7 q-mb-xs">Skills used:</div>
                          <q-chip 
                            v-for="skill in (exp.skills || '').split(',').filter(s => s.trim())" 
                            :key="skill.trim()"
                            size="sm"
                            color="blue-1" 
                            text-color="blue-10"
                            class="q-ma-xs"
                          >
                            {{ skill.trim() }}
                          </q-chip>
                        </div>
                      </q-card-section>
                    </q-card>
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
            <q-tab-panel name="contact" class="q-pa-none">
              <q-card class="info-card">
                <q-card-section>
                  <div class="text-weight-medium q-mb-md">Contact Information</div>
                  <div class="info-row">
                    <span class="info-label">LinkedIn:</span>
                    <span>
                      <a v-if="selectedApplicant.linkedIn" :href="selectedApplicant.linkedIn" target="_blank" class="text-primary">
                        {{ selectedApplicant.linkedIn }}
                      </a>
                      <span v-else class="text-grey-6">Not provided</span>
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Portfolio:</span>
                    <span>
                      <a v-if="selectedApplicant.portfolioWebsite" :href="selectedApplicant.portfolioWebsite" target="_blank" class="text-primary">
                        {{ selectedApplicant.portfolioWebsite }}
                      </a>
                      <span v-else class="text-grey-6">Not provided</span>
                    </span>
                  </div>
                  
                  <div class="q-mt-lg">
                    <q-btn 
                      v-if="selectedApplicant.linkedIn"
                      color="primary" 
                      icon="link"
                      label="Visit LinkedIn" 
                      @click="window.open(selectedApplicant.linkedIn, '_blank')"
                      class="q-mr-sm"
                    />
                    <q-btn 
                      v-if="selectedApplicant.portfolioWebsite"
                      color="secondary" 
                      icon="web"
                      label="Visit Portfolio" 
                      @click="window.open(selectedApplicant.portfolioWebsite, '_blank')"
                      outline
                    />
                  </div>
                </q-card-section>
              </q-card>
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
const sendEmails = ref(false);
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
  accepted: 'positive',
  rejected: 'negative'
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
.applicants-management {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: hidden;
}

.applicants-sidebar {
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.applicant-details {
  overflow-y: auto;
}

.stats-card {
  min-height: 100px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
}

.info-label {
  font-weight: 500;
  min-width: 140px;
  margin-right: 12px;
}

.applicant-item:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60%;
}
</style>