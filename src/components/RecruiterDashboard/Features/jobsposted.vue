<template>
  <div class="q-pa-lg applicants-section">
    <q-card class="q-mx-auto" style="max-width: 900px">
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
                  @click="openDialog(job)"
                  :disable="!job.applicants?.length"
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

    <!-- Dialog: Applicants -->
    <q-dialog v-model="dialogVisible" persistent full-width max-width="900px">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Applicants for: {{ selectedJob?.title }}</div>
          <q-space />
          <q-toggle v-model="sendEmails" label="Send email notifications" left-label color="primary" class="q-mr-md" />
          <q-btn-toggle
            v-model="viewMode"
            toggle-color="primary"
            :options="[
              { label: 'List View', value: 'list' },
              { label: 'Table View', value: 'table' }
            ]"
            class="q-mr-md"
          />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none" style="max-height: 600px; overflow-y: auto;">
          <!-- LIST VIEW -->
          <div v-if="viewMode === 'list'" class="q-pa-md">
            <q-card
              v-for="(applicant, index) in selectedJob?.applicants || []"
              :key="applicant.id"
              class="q-mb-md applicant-card q-pa-md"
            >
              <div class="row items-center q-col-gutter-md">
                <div class="col-auto">
                  <q-avatar size="64px">
                    <img :src="applicant.avatar || 'https://cdn.quasar.dev/img/avatar.png'" alt="avatar" />
                  </q-avatar>
                </div>
                <div class="col">
                  <div class="text-subtitle1">{{ applicant.name }}</div>
                  <div class="text-caption text-grey">Applied for: {{ selectedJob.title }}</div>
                  <div class="text-caption">
                    Status:
                    <q-chip
                      :color="statusColors[applicant.status]"
                      text-color="white"
                      size="sm"
                      class="q-ml-xs"
                    >
                      {{ applicant.status }}
                    </q-chip>
                  </div>
                </div>
                <div class="col-auto">
                  <div class="q-gutter-sm row">
                    <q-btn size="sm" outline label="View Profile" color="primary" @click="viewApplicantDetails(applicant)" />
                    <q-btn size="sm" outline label="Download Resume" color="secondary" @click="viewResume(applicant.resumeUrl)" />
                  </div>
                  <div class="q-mt-sm q-gutter-sm row">
                    <q-btn size="sm" label="Accept" color="positive" @click="updateStatus(applicant, 'accepted')" />
                    <q-btn size="sm" label="Review" color="info" @click="updateStatus(applicant, 'pending')" />
                    <q-btn size="sm" label="Reject" color="negative" @click="updateStatus(applicant, 'rejected')" />
                    <q-btn size="sm" outline icon="chat" @click="notify('Message sent to ' + applicant.name)" />
                  </div>
                </div>
              </div>
            </q-card>
            <div v-if="!selectedJob?.applicants?.length" class="text-center q-pa-lg text-grey">
              <q-icon name="people_outline" size="48px" class="q-mb-md" />
              <div>No applicants yet for this position</div>
            </div>
          </div>

          <!-- TABLE VIEW -->
          <div v-else-if="viewMode === 'table'" class="q-pa-md">
            <q-table
              :rows="selectedJob?.applicants || []"
              :columns="columns"
              row-key="id"
              flat
              bordered
              hide-pagination
            >
              <template #body-cell-avatar="props">
                <q-td :props="props">
                  <q-avatar size="32px">
                    <img :src="props.row.avatar || 'https://cdn.quasar.dev/img/avatar.png'" />
                  </q-avatar>
                </q-td>
              </template>
              <template #body-cell-resume="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    icon="visibility"
                    label="View"
                    color="primary"
                    size="sm"
                    @click="viewResume(props.row.resumeUrl)"
                  />
                </q-td>
              </template>
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-chip :color="statusColors[props.row.status]" text-color="white" size="sm">
                    {{ props.row.status }}
                  </q-chip>
                </q-td>
              </template>
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn-group flat>
                    <q-btn
                      icon="check"
                      color="green"
                      dense
                      round
                      size="sm"
                      @click="updateStatus(props.row, 'accepted')"
                      :disable="props.row.status === 'accepted'"
                    />
                    <q-btn
                      icon="close"
                      color="red"
                      dense
                      round
                      size="sm"
                      @click="updateStatus(props.row, 'rejected')"
                      :disable="props.row.status === 'rejected'"
                    />
                  </q-btn-group>
                </q-td>
              </template>
            </q-table>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row items-center">
          <div class="text-body2 text-grey-7">
            Total Applicants: {{ selectedJob?.applicants?.length || 0 }} |
            Pending: {{ getStatusCount('pending') }} |
            Accepted: {{ getStatusCount('accepted') }} |
            Rejected: {{ getStatusCount('rejected') }}
          </div>
          <q-space />
          <q-btn flat label="Export List" icon="download" color="primary" @click="exportApplicants" />
        </q-card-section>
      </q-card>
    </q-dialog>

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

const $q = useQuasar()
const router = useRouter()
const jobsStore = useJobsStore()
const userStore = useUserStore()

// Reactive data
const loading = ref(false)
const dialogVisible = ref(false)
const deleteDialog = ref(false)
const selectedJob = ref(null)
const jobToDelete = ref(null)
const viewMode = ref('list')
const sendEmails = ref(true)

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

// Table columns
const columns = [
  { name: 'avatar', label: '', align: 'center', style: 'width: 50px' },
  { name: 'name', label: 'Candidate', align: 'left', field: 'name' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'resume', label: 'Resume', align: 'center' },
  { name: 'status', label: 'Status', align: 'center' },
  { name: 'actions', label: 'Actions', align: 'center' }
]

// Methods
const loadJobs = async () => {
  loading.value = true
  try {
    await jobsStore.fetchJobByRecruiter() // Using the correct method name from your store
    console.log('Jobs loaded:', jobsStore.recruiterJobs)
  } catch (error) {
    console.error('Error loading jobs:', error)
    notify('Failed to load jobs', 'negative')
  } finally {
    loading.value = false
  }
}

const openDialog = (job) => {
  selectedJob.value = job
  dialogVisible.value = true
}

const editJob = (job) => {
  // Navigate to edit job page with job ID
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

const updateStatus = async (applicant, newStatus) => {
  if (applicant.status === newStatus) return
  applicant.status = newStatus
  notify(`${applicant.name} marked as ${newStatus}`, statusColors[newStatus])

  if (sendEmails.value) await sendEmailNotification(applicant, newStatus)
}

const sendEmailNotification = async (applicant, newStatus) => {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: applicant.email,
        subject: `Your Application Was ${newStatus}`,
        message: `Hi ${applicant.name},\n\nYour application for "${selectedJob.value.title}" at ${selectedJob.value.company} has been ${newStatus}.\n\nRegards,\n${selectedJob.value.company} Team`
      })
    })
    notify(`Email sent to ${applicant.name}`, 'positive')
  } catch (error) {
    notify('Failed to send email', 'negative')
    console.error('Email error:', error)
  }
}

const viewResume = (url) => {
  if (!url) return notify('No resume found', 'negative')
  window.open(url, '_blank')
}

const viewApplicantDetails = (applicant) => {
  notify(`Viewing profile of ${applicant.name}`, 'info')
  // You can navigate to applicant details page here
  // router.push(`/applicant/${applicant.id}`)
}

const exportApplicants = () => {
  const applicants = selectedJob.value?.applicants || []
  if (!applicants.length) {
    notify('No applicants to export', 'warning')
    return
  }

  const csvContent = [
    ['Name', 'Email', 'Status', 'Phone'].join(','),
    ...applicants.map(app => [app.name, app.email, app.status, app.phone || ''].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${selectedJob.value.title}_applicants.csv`
  a.click()
  window.URL.revokeObjectURL(url)
  notify('Applicants list exported', 'positive')
}

const getStatusCount = (status) => {
  return selectedJob.value?.applicants?.filter(app => app.status === status).length || 0
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

.applicant-card {
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.applicant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.q-item {
  border-radius: 8px;
}

.q-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>