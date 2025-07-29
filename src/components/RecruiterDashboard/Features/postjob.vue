<template>
  <div class="post-job-form q-pa-lg">
    <q-card class="q-mx-auto" style="max-width: 700px">
      <q-card-section>
        <div class="text-h6">
          {{ isPreviewing ? 'Preview Job Post' : 'Post a Job' }}
        </div>
        <div class="text-subtitle2 text-grey-7 q-mt-xs">
          Logged in as: {{ recruiterProfile.name }} ({{ recruiterProfile.email }})
        </div>
      </q-card-section>

      <!-- Job Form -->
      <q-form v-if="!isPreviewing" ref="formRef" @submit.prevent="previewJob">
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.title" label="Job Title" filled :rules="[isRequired]" />
          <q-input v-model="form.company" label="Company Name" filled readonly />
          <q-select v-model="form.jobType" :options="jobTypes" label="Job Type" filled :rules="[isRequired]" />
          <q-select v-model="form.modeOfWork" :options="modeOptions" label="Mode of Work" filled :rules="[isRequired]" />
          <q-select v-model="form.experienceRequired" :options="experienceOptions" label="Experience Required" filled :rules="[isRequired]" />
          <q-input v-model="form.salary" label="Salary (e.g. ₹5L or ₹800000)" filled :rules="[isRequired, isSalaryValid]" />

          <!-- Location dropdown -->
          <q-select
            v-model="form.location"
            :options="locationOptions"
            label="Select Branch Location"
            filled
            :rules="[isRequired]"
            emit-value
            map-options
          />

          <q-input
            v-model="form.description"
            label="Job Description"
            type="textarea"
            filled
            :rules="[minLength(20)]"
          />

          <q-select
            v-model="form.skills"
            :options="skillOptions"
            label="Required Skills"
            filled
            use-chips
            multiple
            :rules="[isRequired]"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn type="submit" label="Preview Job" color="primary" />
        </q-card-actions>
      </q-form>

      <!-- Preview Mode -->
      <template v-else>
        <q-card-section>
          <JobCardPreview :job="form" />
        </q-card-section>

        <q-card-actions align="between" class="q-pa-md">
          <q-btn flat label="Back to Edit" color="grey-6" @click="isPreviewing = false" />
          <q-btn label="Submit Job" color="primary" @click="submitJob" />
        </q-card-actions>
      </template>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useJobsStore } from 'src/stores/jobStore'
import { useRecruiterStore } from 'src/stores/recruiterStore'
import JobCardPreview from 'src/components/Jobs/JobCard.vue'

const $q = useQuasar()
const jobsStore = useJobsStore()
const recruiterStore = useRecruiterStore()

const formRef = ref(null)
const isPreviewing = ref(false)

const recruiterProfile = computed(() => recruiterStore.companyProfile)
const locationOptions = computed(() => Array.isArray(recruiterProfile.value.locations) ? recruiterProfile.value.locations : [])

const form = ref({
  title: '',
  company: '',
  jobType: '',
  modeOfWork: '',
  experienceRequired: '',
  salary: '',
  location: '',
  description: '',
  skills: [],
  postedAt: new Date().toISOString().split('T')[0]
})

const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract']
const modeOptions = ['Online', 'Offline', 'Hybrid']
const experienceOptions = ['Fresher', '0-1 year', '1-3 years', '3-5 years', '5+ years']
const skillOptions = [
  'Vue.js', 'JavaScript', 'HTML', 'CSS', 'REST APIs', 'Node.js', 'Express',
  'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Figma', 'Sketch', 'Python', 'SQL'
]

const isRequired = val => !!val || 'This field is required'
const minLength = n => val => !val || val.length >= n || `Minimum ${n} characters`
const isSalaryValid = val => {
  if (!val) return 'Salary is required'
  const salary = val.toUpperCase().replace('₹', '').trim()
  const lMatch = salary.match(/^([1-9]\d{0,3})L$/)
  const kMatch = salary.match(/^([1-9]\d{0,5})K$/)

  if (lMatch) return true
  if (kMatch) return true

  const rawNumber = parseInt(salary)
  if (!isNaN(rawNumber)) return rawNumber > 1000 && rawNumber < 99990000 || 'Amount must be > 1000 and < 99990000'

  return 'Enter a valid salary like ₹5L, ₹800000, or 5000K'
}

onMounted(() => {
  form.value.company = recruiterProfile.value.name
  form.value.location = locationOptions.value[0] || ''
})

async function previewJob() {
  const isValid = await formRef.value.validate()
  if (!isValid) {
    $q.notify({ type: 'negative', message: 'Please correct the errors in the form.' })
    return
  }
  isPreviewing.value = true
}

function submitJob() {
  const newJob = {
    ...form.value,
    id: jobsStore.jobs.length + 1,
    status: 'published',
    recruiterEmail: recruiterProfile.value.email,
    recruiterName: recruiterProfile.value.name
  }

  jobsStore.postJob(newJob)

  $q.notify({
    type: 'positive',
    message: 'Job posted successfully!',
    actions: [{ label: 'View Job', color: 'white', handler: () => {} }]
  })

  resetForm()
  isPreviewing.value = false
}

function resetForm() {
  form.value = {
    title: '',
    company: recruiterProfile.value.name,
    jobType: '',
    modeOfWork: '',
    experienceRequired: '',
    salary: '',
    location: locationOptions.value[0] || '',
    description: '',
    skills: [],
    postedAt: new Date().toISOString().split('T')[0]
  }
}
</script>

<style scoped>
.post-job-form {
  max-width: 720px;
  margin: auto;
}
</style>
