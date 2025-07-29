<template>
  <div class="q-pa-lg">
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
                <div class="q-mb-sm text-weight-medium">
                  Candidates: {{ job.applicants.length }}
                </div>
                <div class="q-gutter-sm row items-center">
                  <div v-for="status in ['pending', 'accepted', 'rejected']" :key="status" class="text-caption">
                    <q-badge :color="statusColors[status]" class="q-mr-sm">
                      {{ status }}:
                      {{
                        job.applicants.filter(app => app.status === status).length
                      }}
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

    <!-- Applicant Modal -->
    <q-dialog v-model="dialogVisible" persistent full-width max-width="800px">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Applicants for: {{ selectedJob?.title }}</div>
          <q-space />
          <q-toggle
            v-model="sendEmails"
            label="Send email notifications"
            left-label
            color="primary"
            class="q-mr-md"
          />
          <q-btn-toggle
            v-model="viewMode"
            toggle-color="primary"
            :options="[
              {label: 'List View', value: 'list'},
              {label: 'Table View', value: 'table'}
            ]"
            class="q-mr-md"
          />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none" style="max-height: 600px; overflow-y: auto;">
          <!-- List View -->
          <div v-if="viewMode === 'list'" class="applicant-list q-pa-md">
            <q-list bordered separator>
              <q-item
                v-for="applicant in selectedJob?.applicants || []"
                :key="applicant.id"
                clickable
                class="applicant-item"
                @click="viewApplicantDetails(applicant)"
              >
                <q-item-section avatar>
                  <q-avatar size="50px">
                    <img
                      :src="applicant.avatar || 'https://cdn.quasar.dev/img/avatar.png'"
                      :alt="applicant.name"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ applicant.name }}</q-item-label>
                  <q-item-label caption class="text-grey-7">{{ applicant.email }}</q-item-label>
                  <q-item-label caption>
                    <q-chip
                      :color="statusColors[applicant.status]"
                      text-color="white"
                      size="sm"
                      class="q-mt-xs"
                    >
                      {{ applicant.status }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>

                <q-item-section side class="column q-gutter-xs">
                  <q-btn
                    flat
                    dense
                    icon="visibility"
                    label="View"
                    color="primary"
                    size="sm"
                    @click.stop="viewResume(applicant.resumeUrl)"
                  />
                  <div class="row q-gutter-xs">
                    <q-btn
                      dense
                      round
                      icon="check"
                      color="green"
                      size="sm"
                      @click.stop="updateStatus(applicant, 'accepted')"
                      :disable="applicant.status === 'accepted'"
                    >
                      <q-tooltip>Accept</q-tooltip>
                    </q-btn>
                    <q-btn
                      dense
                      round
                      icon="close"
                      color="red"
                      size="sm"
                      @click.stop="updateStatus(applicant, 'rejected')"
                      :disable="applicant.status === 'rejected'"
                    >
                      <q-tooltip>Reject</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-if="!selectedJob?.applicants?.length" class="text-center q-pa-lg text-grey">
              <q-icon name="people_outline" size="48px" class="q-mb-md" />
              <div>No applicants yet for this position</div>
            </div>
          </div>

          <!-- Table View -->
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
                    <img
                      :src="props.row.avatar || 'https://cdn.quasar.dev/img/avatar.png'"
                      :alt="props.row.name"
                    />
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
                  <q-chip
                    :color="statusColors[props.row.status]"
                    text-color="white"
                    size="sm"
                  >
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
                    >
                      <q-tooltip>Accept</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="close"
                      color="red"
                      dense
                      round
                      size="sm"
                      @click="updateStatus(props.row, 'rejected')"
                      :disable="props.row.status === 'rejected'"
                    >
                      <q-tooltip>Reject</q-tooltip>
                    </q-btn>
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
          <q-btn
            flat
            label="Export List"
            icon="download"
            color="primary"
            @click="exportApplicants"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Applicant Detail Modal -->
    <q-dialog v-model="detailsDialogVisible" persistent max-width="600px">
      <q-card v-if="selectedApplicant">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar size="60px" class="q-mr-md">
            <img
              :src="selectedApplicant.avatar || 'https://cdn.quasar.dev/img/avatar.png'"
              :alt="selectedApplicant.name"
            />
          </q-avatar>
          <div>
            <div class="text-h6">{{ selectedApplicant.name }}</div>
            <div class="text-subtitle2 text-grey-7">{{ selectedApplicant.email }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-gutter-md">
            <div>
              <div class="text-weight-medium q-mb-xs">Status</div>
              <q-chip :color="statusColors[selectedApplicant.status]" text-color="white">
                {{ selectedApplicant.status }}
              </q-chip>
            </div>
            <div v-if="selectedApplicant.phone">
              <div class="text-weight-medium q-mb-xs">Phone</div>
              <div>{{ selectedApplicant.phone }}</div>
            </div>
            <div v-if="selectedApplicant.experience">
              <div class="text-weight-medium q-mb-xs">Experience</div>
              <div>{{ selectedApplicant.experience }}</div>
            </div>
            <div v-if="selectedApplicant.skills">
              <div class="text-weight-medium q-mb-xs">Skills</div>
              <div class="q-gutter-xs">
                <q-chip
                  v-for="skill in selectedApplicant.skills"
                  :key="skill"
                  color="grey-3"
                  text-color="grey-8"
                  size="sm"
                >
                  {{ skill }}
                </q-chip>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="between">
          <q-btn
            flat
            label="View Resume"
            icon="description"
            color="primary"
            @click="viewResume(selectedApplicant.resumeUrl)"
          />
          <div class="q-gutter-sm">
            <q-btn
              label="Reject"
              color="red"
              @click="updateStatus(selectedApplicant, 'rejected')"
              :disable="selectedApplicant.status === 'rejected'"
            />
            <q-btn
              label="Accept"
              color="green"
              @click="updateStatus(selectedApplicant, 'accepted')"
              :disable="selectedApplicant.status === 'accepted'"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useJobsStore } from 'src/stores/appStore'
import { useRecruiterStore } from 'src/stores/recruiterStore'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const appStore = useJobsStore()
const recruiterStore = useRecruiterStore()

const recruiterEmail = computed(() => recruiterStore.companyProfile.email)
const userJobs = computed(() =>
  appStore.jobs.filter(job => job?.company === recruiterStore.companyProfile.name)
)

const dialogVisible = ref(false)
const detailsDialogVisible = ref(false)
const selectedJob = ref(null)
const selectedApplicant = ref(null)
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

const viewApplicantDetails = applicant => {
  selectedApplicant.value = applicant
  detailsDialogVisible.value = true
}

const viewResume = url => {
  if (!url) return $q.notify({ type: 'negative', message: 'No resume found' })
  window.open(url, '_blank')
}

const updateStatus = async (applicant, newStatus) => {
  if (applicant.status === newStatus) return
  applicant.status = newStatus
  $q.notify({
    type: 'positive',
    message: `${applicant.name} marked as ${newStatus}`
  })

  if (sendEmails.value) {
    await sendEmailNotification(applicant, newStatus)
  }
}

const sendEmailNotification = async (applicant, newStatus) => {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: applicant.email,
        subject: `Your Application Was ${newStatus}`,
        message: `
          Hi ${applicant.name},

          Your application for the job "${selectedJob.value.title}" at ${selectedJob.value.company} has been ${newStatus}.

          Thank you for your interest.

          Regards,
          ${selectedJob.value.company} Team
        `
      })
    })
    $q.notify({
      type: 'positive',
      message: `Email sent to ${applicant.name}`
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Failed to send email.'
    })
  }
}

const getStatusCount = status =>
  selectedJob.value?.applicants?.filter(app => app.status === status).length || 0

const exportApplicants = () => {
  const applicants = selectedJob.value?.applicants || []
  const csvContent = [
    ['Name', 'Email', 'Status', 'Phone'].join(','),
    ...applicants.map(app => [
      app.name,
      app.email,
      app.status,
      app.phone || ''
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${selectedJob.value.title}_applicants.csv`
  a.click()
  window.URL.revokeObjectURL(url)

  $q.notify({
    type: 'positive',
    message: 'Applicants list exported successfully!'
  })
}
</script>


<style scoped>
.q-badge {
  min-width: 90px;
  text-align: center;
}

.applicant-list {
  background-color: #fafafa;
}

.applicant-item {
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.applicant-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.applicant-item:last-child {
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .applicant-item .q-item-section.side {
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
