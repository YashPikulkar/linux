<template>
  <div class="form-wrapper">
    <q-card class="post-job-card">
      <div class="form-header">Post a New Job</div>

      <div class="section-title">Basic Details</div>
      <div class="form-entry">
        <q-input v-model="form.title" label="Job Title" filled :rules="[isRequired]" />
        <q-input v-model="form.company" label="Company Name" filled readonly />
        <q-select v-model="form.jobType" :options="jobTypes" label="Job Type" filled :rules="[isRequired]" />
      </div>

      <div class="section-title">Job Logistics</div>
      <div class="form-entry">
        <q-select v-model="form.modeOfWork" :options="modeOptions" label="Mode of Work" filled :rules="[isRequired]" />
        <q-select v-model="form.experienceRequired" :options="experienceOptions" label="Experience Required" filled :rules="[isRequired]" />
        <q-input v-model="form.salary" label="Salary (e.g. ₹5L or ₹800000)" filled :rules="[isRequired, isSalaryValid]" />
      </div>

      <div class="section-title">Location & Skills</div>
      <div class="form-entry">
        <q-select
          v-model="form.location"
          :options="locationOptions"
          label="Branch Location"
          filled
          :rules="[isRequired]"
          emit-value
          map-options
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
      </div>

      <div class="section-title">Description</div>
      <div class="form-entry">
        <q-input
          v-model="form.description"
          label="Job Description"
          type="textarea"
          filled
          :rules="[minLength(20)]"
        />
      </div>

      <div class="row justify-end q-mt-md">
        <q-btn label="Post Job" color="primary" @click="submitJob" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useJobsStore } from 'src/stores/jobStore'
import { useRecruiterStore } from 'src/stores/recruiterStore'

const $q = useQuasar()
const jobsStore = useJobsStore()
const recruiterStore = useRecruiterStore()

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

  if (lMatch || kMatch) return true
  const raw = parseInt(salary)
  return (!isNaN(raw) && raw > 1000 && raw < 99990000) || 'Enter a valid salary like ₹5L or ₹800000'
}

onMounted(() => {
  form.value.company = recruiterProfile.value.name
  form.value.location = locationOptions.value[0] || ''
})

function submitJob() {
  const newJob = {
    ...form.value,
    id: jobsStore.jobs.length + 1,
    status: 'published',
    recruiterEmail: recruiterProfile.value.email,
    recruiterName: recruiterProfile.value.name
  }

  jobsStore.postJob(newJob)

  $q.dialog({
    title: 'Success',
    message: 'Job posted successfully!',
    ok: { label: 'OK', color: 'primary' }
  })

  resetForm()
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
.post-job-card {
  width: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 16px;
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}

.form-header {
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: -12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #444;
}

.form-entry {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  min-height: 0; /* necessary for scroll to work inside flex */
}

.post-job-card {
  width: 100%;
  margin: 0; /* remove center alignment */

  padding: 24px;
  background-color: white;
  border-radius: 16px;
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}

.form-header {
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: -12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #444;
}

.form-entry {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>
