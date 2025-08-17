<template>
  <div class="q-pa-lg applicants-section">
    <!-- Show Job Applicants Component if viewing applicants -->
    <JobApplicants 
      v-if="showingApplicants"
      :job-details="selectedJobForApplicants"
      :applicants="selectedJobForApplicants?.applicants || []"
      @back="closeApplicantsView"
      @status-updated="handleStatusUpdate"
    />

    <!-- Original Jobs Posted View -->
    <q-card v-else class="q-mx-auto" style="max-width: 900px">
      <q-card-section>
        <div class="text-h6">Jobs You've Posted</div>
      </q-card-section>

      <q-separator />

      <!-- Loading State -->
      <q-card-section v-if="loading" class="text-center">
        <q-spinner-dots size="40px" color="primary" />
        <div class="q-mt-sm">Loading your jobs...</div>
      </q-card-section>

      <!-- Jobs List -->
      <q-card-section v-else-if="userJobs.length">
        <q-list bordered separator>
          <q-item v-for="job in userJobs" :key="job.jobid" class="column q-py-md">
            <q-item-section class="q-mb-sm">
              <q-item-label><strong>{{ job.title }}</strong> at {{ job.company }}</q-item-label>
              <q-item-label caption>{{ job.location }} | {{ job.jobtype }} | Posted: {{ formatDate(job.created_at) }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <div v-if="job.applicants?.length">
                <div class="q-mb-sm text-weight-medium">Candidates: {{ job.applicants.length }}</div>
                <div class="q-gutter-sm row items-center">
                  <div v-for="status in ['pending', 'accepted', 'rejected']" :key="status" class="text-caption">
                    <q-badge :color="statusColors[status]" class="q-mr-sm">
                      {{ status }}:
                      {{ job.applicants.filter(app => app.status === status).length }}
                    </q-badge>
                  </div>
                </div>
              </div>
              <div v-else class="text-grey">No candidates applied yet.</div>
            </q-item-section>

            <q-item-section side class="q-mt-sm">
              <div class="q-gutter-sm">
                <q-btn
                  label="View Applications"
                  color="primary"
                  size="sm"
                  @click="viewApplications(job.jobid)"
                  
                />
                <q-btn
                  label="Edit Job"
                  color="secondary"
                  size="sm"
                  outline
                  @click="editJob(job)"
                />
                <q-btn
                  label="Delete"
                  color="negative"
                  size="sm"
                  outline
                  @click="confirmDeleteJob(job)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- Empty State -->
      <q-card-section v-else class="text-grey text-center q-py-xl">
        <q-icon name="work_off" size="64px" class="q-mb-md" />
        <div class="text-h6 q-mb-sm">No Jobs Posted Yet</div>
        <div class="text-body2">Start by posting your first job to attract candidates</div>
        <q-btn 
          label="Post a Job" 
          color="primary" 
          class="q-mt-md"
          @click="$router.push('/post-job')"
        />
      </q-card-section>
    </q-card>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this job posting?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteJob" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useJobsStore } from 'src/stores/jobStore'
import { useUserStore } from 'src/stores/user-store'
import JobApplicants from './JobApplicants.vue' // Import the new component

const $q = useQuasar()
const router = useRouter()
const jobsStore = useJobsStore()
const userStore = useUserStore()

// Reactive data
const loading = ref(false)
const deleteDialog = ref(false)
const jobToDelete = ref(null)
const showingApplicants = ref(false)
const selectedJobForApplicants = ref(null)

// Computed properties
const userJobs = computed(() => {
  return jobsStore.recruiterJobs || []
})

// Status colors
const statusColors = {
  pending: 'grey',
  accepted: 'green',
  rejected: 'red'
}

// Methods
const loadJobs = async () => {
  loading.value = true
  try {
    await jobsStore.fetchJobByRecruiter()
    console.log('Jobs loaded:', jobsStore.recruiterJobs)
  } catch (error) {
    console.error('Error loading jobs:', error)
    notify('Failed to load jobs', 'negative')
  } finally {
    loading.value = false
  }
}


function viewApplications(jobId) {
  if (!jobId) {
    $q.notify({
      type: 'warning',
      message: 'Job ID is required'
    });
    return;
  }

  try {
    // Navigate to the applications page within recruiter dashboard
    router.push({
      name: 'job-applications',
      params: { jobId: jobId.toString() } // Ensure it's a string
    });
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: `Error navigating to applications: ${err.message}`
    });
  }
}

const closeApplicantsView = () => {
  showingApplicants.value = false
  selectedJobForApplicants.value = null
  // Optionally reload jobs to get updated applicant counts
  loadJobs()
}

const handleStatusUpdate = (updateData) => {
  // Handle status update event from JobApplicants component
  console.log('Status updated:', updateData)
  // You can update local job data here if needed
  notify(`Application status updated to ${updateData.newStatus}`, 'positive')
}

const editJob = (job) => {
  router.push(`/edit-job/${job.jobid}`)
}

const confirmDeleteJob = (job) => {
  jobToDelete.value = job
  deleteDialog.value = true
}

const deleteJob = async () => {
  try {
    await jobsStore.deleteJob(jobToDelete.value.jobid)
    notify('Job deleted successfully', 'positive')
    deleteDialog.value = false
    jobToDelete.value = null
  } catch (error) {
    console.error('Error deleting job:', error)
    notify('Failed to delete job', 'negative')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

const notify = (msg, color = 'primary') => {
  $q.notify({ message: msg, color })
}

// Lifecycle
onMounted(() => {
  loadJobs()
})
</script>

<style scoped>
.applicants-section {
  width: 100%;
}

.q-item {
  border-radius: 8px;
}

.q-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>