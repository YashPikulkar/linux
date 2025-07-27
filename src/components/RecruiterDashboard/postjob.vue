<template>
  <div class="post-job-form q-pa-lg">
    <q-card class="q-mx-auto" style="max-width: 700px">
      <q-form ref="formRef" @submit.prevent="submitJob">
        <q-card-section>
          <div class="text-h6">Post a Job</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.title" label="Job Title" filled :rules="[isRequired]" />

          <q-input
            v-model="form.company"
            label="Company Name"
            filled
            readonly
          />

          <q-select
            v-model="form.jobType"
            :options="jobTypes"
            label="Job Type"
            filled
            :rules="[isRequired]"
          />

          <q-select
            v-model="form.modeOfWork"
            :options="modeOptions"
            label="Mode of Work"
            filled
            :rules="[isRequired]"
          />

          <q-select
            v-model="form.experienceRequired"
            :options="experienceOptions"
            label="Experience Required"
            filled
            :rules="[isRequired]"
          />

          <q-input v-model="form.salary" label="Salary (e.g. ₹5L - ₹10L)" filled />

          <q-input v-model="form.location" label="Location" filled :rules="[isRequired]" />

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
          <q-btn type="submit" label="Post Job" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useJobsStore } from 'src/stores/jobStore'
import { useRecruiterStore } from 'src/stores/recruiterStore'

const $q = useQuasar()
const jobsStore = useJobsStore()
const recruiterStore = useRecruiterStore()

const formRef = ref(null)

const form = ref({
  title: '',
  company: '', // will be set from recruiter store
  jobType: '',
  modeOfWork: '',
  experienceRequired: '',
  salary: '',
  location: '',
  description: '',
  skills: [],
  postedAt: new Date().toISOString().split('T')[0]
})

// Dropdown options
const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract']
const modeOptions = ['Online', 'Offline', 'Hybrid']
const experienceOptions = ['Fresher', '0-1 year', '1-3 years', '3-5 years', '5+ years']
const skillOptions = [
  'Vue.js', 'JavaScript', 'HTML', 'CSS', 'REST APIs',
  'Node.js', 'Express', 'MongoDB', 'AWS', 'Docker',
  'Kubernetes', 'Figma', 'Sketch', 'Python', 'SQL'
]

// Validation
const isRequired = val => !!val || 'This field is required'
const minLength = n => val => !val || val.length >= n || `Minimum ${n} characters`

onMounted(() => {
  form.value.company = recruiterStore.name || 'Your Company'
})

async function submitJob () {
  const isValid = await formRef.value.validate()
  if (!isValid) {
    $q.notify({ type: 'negative', message: 'Please correct the errors in the form.' })
    return
  }

  const newJob = {
    ...form.value,
    id: jobsStore.jobs.length + 1
  }

  jobsStore.jobs.unshift(newJob)

  $q.notify({ type: 'positive', message: 'Job posted successfully!' })

  // Reset form
  form.value = {
    title: '',
    company: recruiterStore.name || '',
    jobType: '',
    modeOfWork: '',
    experienceRequired: '',
    salary: '',
    location: '',
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
