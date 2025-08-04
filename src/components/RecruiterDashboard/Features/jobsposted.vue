<template>
  <div class="q-pa-lg applicants-section">
    <q-card class="q-mx-auto" style="max-width: 900px">
      <q-card-section>
        <div class="text-h6">Jobs You've Posted</div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="userJobs.length">
        <q-list bordered separator>
          <q-item v-for="job in userJobs" :key="job.id" class="column q-py-md">
            <q-item-section class="q-mb-sm">
              <q-item-label><strong>{{ job.title }}</strong> at {{ job.company }}</q-item-label>
              <q-item-label caption>{{ job.location }} | {{ job.jobType }} | Posted: {{ job.postedAt }}</q-item-label>
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
              <q-btn
                label="View Applications"
                color="primary"
                size="sm"
                @click="openDialog(job)"
                :disable="!job.applicants?.length"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section v-else class="text-grey text-center">
        You haven't posted any jobs yet.
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useJobsStore } from 'src/stores/appStore'
import { useRecruiterStore } from 'src/stores/recruiterStore'

const $q = useQuasar()
const appStore = useJobsStore()
const recruiterStore = useRecruiterStore()

const recruiterEmail = computed(() => recruiterStore.companyProfile.email)
const userJobs = computed(() =>
  appStore.jobs.filter(job => job?.company === recruiterStore.companyProfile.name)
)

const dialogVisible = ref(false)
const selectedJob = ref(null)
const viewMode = ref('list')
const sendEmails = ref(true)

const statusColors = {
  pending: 'grey',
  accepted: 'green',
  rejected: 'red'
}

const columns = [
  { name: 'avatar', label: '', align: 'center', style: 'width: 50px' },
  { name: 'name', label: 'Candidate', align: 'left', field: 'name' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'resume', label: 'Resume', align: 'center' },
  { name: 'status', label: 'Status', align: 'center' },
  { name: 'actions', label: 'Actions', align: 'center' }
]

const openDialog = job => {
  selectedJob.value = job
  dialogVisible.value = true
}

const updateStatus = async (applicant, newStatus) => {
  if (applicant.status === newStatus) return
  applicant.status = newStatus
  notify(`${applicant.name} marked as ${newStatus}`, statusColors[newStatus])

  if (sendEmails.value) await sendEmailNotification(applicant, newStatus)
}

const notify = (msg, color = 'primary') => {
  $q.notify({ message: msg, color })
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
  }
}

const viewResume = url => {
  if (!url) return notify('No resume found', 'negative')
  window.open(url, '_blank')
}

const exportApplicants = () => {
  const applicants = selectedJob.value?.applicants || []
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
}

const getStatusCount = status => selectedJob.value?.applicants?.filter(app => app.status === status).length || 0

const viewApplicantDetails = applicant => {
  notify(`Viewing profile of ${applicant.name}`, 'info')
}
</script>

<style scoped>
.applicants-section {
  width: 100%;
}
.applicant-card {
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
</style>
