<template>
  <div class="form-wrapper">
    <q-card class="post-job-card">
      <div class="form-header">
        {{ isPreviewing ? 'Preview Job Post' : 'Post a Job' }}
      </div>

      <!-- Progress Stepper -->
      <div v-if="!isPreviewing" class="stepper-container">
        <q-stepper
          v-model="currentStep"
          color="primary"
          animated
          flat
          class="custom-stepper"
        >
          <q-step
            :name="1"
            title="Basic Details"
            icon="business"
            :done="currentStep > 1"
          />
          <q-step
            :name="2"
            title="Job Logistics"
            icon="work"
            :done="currentStep > 2"
          />
          <q-step
            :name="3"
            title="Additional Details"
            icon="info"
            :done="currentStep > 3"
          />
          <q-step
            :name="4"
            title="Location & Skills"
            icon="place"
            :done="currentStep > 4"
          />
          <q-step
            :name="5"
            title="Description"
            icon="description"
            :done="currentStep > 5"
          />
          <q-step
            :name="6"
            title="Review"
            icon="preview"
            :done="false"
          />
        </q-stepper>
      </div>

      <q-form v-if="!isPreviewing" ref="formRef" @submit.prevent="handleNext">
        <!-- Step 1: Basic Details -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="section-title">Basic Details</div>
          <div class="form-entry">
            <q-input
              v-model="form.title"
              label="Job Title"
              filled
              :rules="[isRequired, maxLength(100)]"
            />
            <q-input v-model="form.companyName" label="Company Name" filled readonly />
            <q-select
              v-model="form.job_type"
              :options="jobTypes"
              label="Job Type"
              filled
              :rules="[isRequired]"
            />
          </div>
        </div>

        <!-- Step 2: Job Logistics -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="section-title">Job Logistics</div>
          <div class="form-entry">
            <q-select
              v-model="form.mode_of_work"
              :options="modeOptions"
              label="Mode of Work"
              filled
              :rules="[isRequired]"
            />

            <!-- Experience Range -->
            <div class="experience-range">
              <q-input
                v-model.number="form.experience_min"
                label="Min Experience (Years)"
                type="number"
                filled
                :rules="[isPositiveNumber]"
                class="experience-input"
              />
              <q-input
                v-model.number="form.experience_max"
                label="Max Experience (Years)"
                type="number"
                filled
                :rules="[isPositiveNumber, validateExperienceRange]"
                min="0"
                max="50"
                class="experience-input"
              />
            </div>

            <!-- Salary Range -->
            <div class="salary-range">
              <q-input
                v-model.number="form.salary_min"
                label="Min Salary (₹)"
                type="number"
                filled
                :rules="[isRequired, isSalaryValid]"
                min="1000"
                placeholder="e.g. 400000"
                class="salary-input"
              />
              <q-input
                v-model.number="form.salary_max"
                label="Max Salary (₹)"
                type="number"
                filled
                :rules="[isSalaryValid, validateSalaryRange]"
                min="1000"
                placeholder="e.g. 600000"
                class="salary-input"
              />
            </div>

            <!-- Equity Range (Optional) -->
            <div class="equity-range">
              <q-input
                v-model.number="form.equity_min"
                label="Min Equity % (Optional)"
                type="number"
                filled
                min="0"
                max="100"
                step="0.1"
                class="equity-input"
              />
              <q-input
                v-model.number="form.equity_max"
                label="Max Equity % (Optional)"
                type="number"
                filled
                min="0"
                max="100"
                step="0.1"
                :rules="[validateEquityRange]"
                class="equity-input"
              />
            </div>

            <!-- Number of Openings -->
            <q-input
              v-model.number="form.opening"
              label="Number of Openings"
              type="number"
              filled
              :rules="[isRequired, isPositiveOpenings]"
              min="1"
              max="100"
            />
          </div>
        </div>

        <!-- Step 3: Additional Details -->
        <div v-if="currentStep === 3" class="step-content">
          <div class="section-title">Additional Details</div>
          <div class="form-entry">
            <q-select
              v-model="form.qualification"
              :options="qualificationOptions"
              label="Minimum Qualification *"
              filled
              :rules="[isRequired]"
            />

            <q-select
              v-model="form.job_markets"
              :options="MarketOptions"
              label="Select Markets *"
              filled
              use-chips
              multiple
              :rules="[isRequired]"
              emit-value
              map-options
              :loading="skillsLoading"
              :disable="skillsLoading"
            />

            <q-select
              v-model="form.job_roles"
              :options="RoleOptions"
              label="Select Job Roles *"
              filled
              use-chips
              multiple
              :rules="[isRequired]"
              emit-value
              map-options
              :loading="skillsLoading"
              :disable="skillsLoading"
            />
          </div>
        </div>

        <!-- Step 4: Location & Skills -->
        <div v-if="currentStep === 4" class="step-content">
          <div class="section-title">Location & Skills</div>
          <div class="form-entry">
            <q-select
              v-model="form.lid"
              :options="locationOptions"
              label="Branch Location *"
              filled
              :rules="[isRequired]"
              emit-value
              map-options
              :loading="locationsLoading"
              :disable="locationsLoading"
            />
            <q-select
              v-model="form.skillids"
              :options="skillOptions"
              label="Required Skills *"
              filled
              use-chips
              multiple
              :rules="[isRequired]"
              emit-value
              map-options
              :loading="skillsLoading"
              :disable="skillsLoading"
            />
          </div>
        </div>

        <!-- Step 5: Description -->
        <div v-if="currentStep === 5" class="step-content">
          <div class="section-title">Description</div>
          <div class="form-entry">
            <q-input
              v-model="form.smallDescription"
              label="Short Description *"
              type="textarea"
              filled
              :rules="[minLength(10), maxLength(100), isRequired]"
              placeholder="e.g. A brief summary of the job role"
            />
          </div>

          <div class="form-entry q-mt-md">
            <q-input
              v-model="form.bigDescription"
              label="Detailed Job Description *"
              type="textarea"
              filled
              :rules="[minLength(20), isRequired]"
              placeholder="e.g. Full responsibilities, requirements, etc."
              rows="6"
            />
          </div>
        </div>

        <!-- Step 6: Review -->
        <div v-if="currentStep === 6" class="step-content">
          <div class="section-title">Review Your Job Post</div>
          <div class="review-container">
            <PreviewJob :job="previewJob" />
          </div>
        </div>

        <!-- Navigation Buttons -->
        <q-card-actions align="between" class="step-actions">
          <q-btn
            v-if="currentStep > 1"
            flat
            label="Previous"
            color="grey-6"
            @click="handlePrevious"
            icon="chevron_left"
            size="md"
          />
          <div v-else></div>

          <div class="step-counter">
            Step {{ currentStep }} of 6
          </div>

          <q-btn
            v-if="currentStep < 6"
            type="submit"
            label="Next"
            color="primary"
            icon-right="chevron_right"
            size="md"
          />
          <q-btn
            v-else
            label="Preview & Submit"
            color="primary"
            @click="showConfirmDialogHandler"
            icon-right="send"
            size="md"
          />
        </q-card-actions>
      </q-form>

      <!-- Preview Mode -->
      <div v-else class="form-wrapper">
        <q-separator />
        <q-card-section>
          <PreviewJob :job="previewJob" />
        </q-card-section>
        <q-card-actions align="between" class="q-pa-md">
          <q-btn 
            flat 
            label="Back to Edit" 
            color="grey-6" 
            @click="backToEdit" 
            icon="edit"
            size="md"
          />
          <q-btn 
            label="Submit Job" 
            color="primary" 
            @click="submitJob" 
            :loading="isSubmitting"
            icon="publish"
            size="md"
          />
        </q-card-actions>
      </div>
    </q-card>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showConfirmation" persistent>
      <q-card class="confirmation-dialog">
        <q-card-section class="row items-center">
          <q-avatar icon="help" color="primary" text-color="white" size="lg" />
          <span class="q-ml-sm text-h6">Confirm Job Submission</span>
        </q-card-section>
        
        <q-card-section class="q-pt-none">
          <div class="text-body1">
            Are you sure you want to submit this job posting? Once submitted, it will be published and visible to candidates.
          </div>
          
          <!-- Display any missing fields if validation fails -->
          <div v-if="missingFields.length > 0" class="q-mt-md">
            <q-banner inline-actions class="text-white bg-negative">
              <template v-slot:avatar>
                <q-icon name="warning" color="white" size="md" />
              </template>
              <div class="text-weight-bold">Missing Required Fields:</div>
              <ul class="q-mt-sm q-mb-none">
                <li v-for="field in missingFields" :key="field">{{ field }}</li>
              </ul>
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            flat 
            label="Cancel" 
            color="grey-6" 
            @click="showConfirmation = false" 
            icon="cancel"
            size="md"
          />
          <q-btn 
            label="Yes, Submit Job" 
            color="primary" 
            @click="confirmSubmit" 
            :loading="isSubmitting"
            :disable="missingFields.length > 0"
            icon="check_circle"
            size="md"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useJobsStore } from 'src/stores/jobStore'
import { useUserStore } from 'src/stores/user-store'
import PreviewJob from 'src/components/RecruiterDashboard/PreviewJob.vue'

const $q = useQuasar()
const jobsStore = useJobsStore()

// Base URL for API calls
const baseUrl = 'http://localhost:3000'

const formRef = ref(null)
const isPreviewing = ref(false)
const isSubmitting = ref(false)
const currentStep = ref(1)
//const showConfirmDialog = ref(false)
const showConfirmation = ref(false)
const missingFields = ref([])

// Loading states for dropdowns
const skillsLoading = ref(false)
const locationsLoading = ref(false)

// Data arrays
const skills = ref([])
const locations = ref([])

// Convert skills and locations to select options
const skillOptions = computed(() =>
  skills.value.map((skill) => ({
    label: skill.name,
    value: skill.id,
  })),
)

const locationOptions = computed(() =>
  locations.value.map((location) => ({
    label: location.name,
    value: location.id,
  })),
)

const form = ref({
  title: '',
  companyName: '',
  job_type: '',
  mode_of_work: '',
  experience_min: 0,
  experience_max: 0,
  salary_min: 0,
  salary_max: 0,
  equity_min: 0,
  equity_max: 0,
  opening: 1,
  qualification: null,
  job_markets: [],
  job_roles: [],
  lid: null,
  cid: null,
  skillids: [],
  bigDescription: '',
  smallDescription: '',
})

const previewJob = computed(() => {
  const selectedLocation = locations.value.find((location) => location.id === form.value.lid)

  let selectedSkills = form.value.skillids.map((skillId) => {
    const skill = skills.value.find((skill) => skill.id === skillId)
    return skill ? skill.name : 'Unknown Skill'
  })

  const locationLabel = selectedLocation ? selectedLocation.name : 'Not selected'

  return {
    ...form.value,
    company: useUserStore().company,
    location: locationLabel,
    skills: selectedSkills,
    posted: new Date().toISOString().split('T')[0],
  }
})

const jobTypes = ['Full-time', 'Co-founder', 'Contract', 'Internship']
const modeOptions = ['Remote', 'Hybrid', 'Onsite']

const qualificationOptions = ['Postgraduate', 'Undergraduate', 'Phd', '10th', '12th']
const MarketOptions = ref([])
const RoleOptions = ref([])

// Field validation mapping for better error messages
const fieldLabels = {
  title: 'Job Title',
  job_type: 'Job Type',
  mode_of_work: 'Mode of Work',
  experience_min: 'Minimum Experience',
  salary_min: 'Minimum Salary',
  opening: 'Number of Openings',
  qualification: 'Qualification',
  job_markets: 'Markets',
  job_roles: 'Job Roles',
  lid: 'Branch Location',
  skillids: 'Required Skills',
  smallDescription: 'Short Description',
  bigDescription: 'Detailed Job Description'
}

const validateCurrentStep = async () => {
  if (!formRef.value) return false
  const success = await formRef.value.validate()
  return success
}

// Navigation handlers
const handleNext = async () => {
  const isValid = await validateCurrentStep()
  if (!isValid) {
    $q.notify({
      type: 'negative',
      message: 'Please fix the form errors before proceeding.',
    })
    return
  }

  if (currentStep.value < 6) {
    currentStep.value++
  }
}

const handlePrevious = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const showConfirmDialogHandler = () => {
  // Check for missing fields before showing dialog
  missingFields.value = checkMissingFields()
  
  if (missingFields.value.length > 0) {
    $q.notify({
      type: 'negative',
      message: `Please complete all required fields: ${missingFields.value.slice(0, 3).join(', ')}${missingFields.value.length > 3 ? '...' : ''}`,
      timeout: 5000
    })
    return
  }

  showConfirmation.value = true
}

const confirmSubmit = async () => {
  showConfirmation.value = false
  await submitJob()
}

const backToEdit = () => {
  isPreviewing.value = false
  currentStep.value = 6 // Go back to review step
}

// API Functions
async function getAllSkills() {
  try {
    skillsLoading.value = true
    const res = await fetch(`${baseUrl}/skills/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch skills`)
    }

    const data = await res.json()
    console.log('Skills response:', data)

    if (data.success && data.skills && Array.isArray(data.skills)) {
      skills.value = data.skills.map((skill) => ({
        id: skill[0],
        name: skill[1],
      }))
    } else {
      throw new Error('Invalid skills data format')
    }
  } catch (error) {
    console.error('Error fetching skills:', error)
    $q.notify({
      type: 'negative',
      message: `Failed to load skills: ${error.message}`,
    })
    skills.value = []
  } finally {
    skillsLoading.value = false
  }
}

async function getAllLocations() {
  try {
    locationsLoading.value = true
    const res = await fetch(`${baseUrl}/location/location`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch locations`)
    }

    const data = await res.json()
    console.log('Locations response:', data)

    if (data.success && data.locations && Array.isArray(data.locations)) {
      locations.value = data.locations.map((location) => ({
        id: location[0],
        name: location[1],
      }))
    } else {
      throw new Error('Invalid locations data format')
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    $q.notify({
      type: 'negative',
      message: `Failed to load locations: ${error.message}`,
    })
    locations.value = []
  } finally {
    locationsLoading.value = false
  }
}

async function getAllMarkets() {
  try {
    const res = await fetch(`${baseUrl}/markets/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    if (data.success && data.markets) {
      MarketOptions.value = data.markets.map((market) => ({
        label: market[1],
        value: market[0],
      }))
      console.log('Markets fetched successfully')
    }
  } catch (error) {
    console.error('Error fetching markets:', error)
    $q.notify({
      type: 'negative',
      message: `Failed to load markets: ${error.message}`,
    })
  }
}

async function getAllRoles() {
  try {
    const res = await fetch(`${baseUrl}/roles/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    if (data.success && data.roles) {
      RoleOptions.value = data.roles.map((role) => ({
        label: role[1],
        value: role[0],
      }))
      console.log('Roles fetched successfully')
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
    $q.notify({
      type: 'negative',
      message: `Failed to load roles: ${error.message}`,
    })
  }
}

// Validation Rules
const isRequired = (val) => !!val || 'This field is required'
const minLength = (n) => (val) => !val || val.length >= n || `Minimum ${n} characters`
const maxLength = (n) => (val) => !val || val.length <= n || `Maximum ${n} characters`

const isPositiveNumber = (val) => {
  return (val >= 0 && val <= 50) || 'Experience should be between 0-50 years'
}

const isPositiveOpenings = (val) => {
  return (val >= 1 && val <= 100) || 'Openings should be between 1-100'
}

const isSalaryValid = (val) => {
  if (!val || val < 1000) return 'Salary must be at least ₹1,000'
  if (val > 99990000) return 'Salary seems too high'
  return true
}

const validateExperienceRange = (val) => {
  if (!val) return true
  if (form.value.experience_min && val < form.value.experience_min) {
    return 'Max experience should be greater than or equal to min experience'
  }
  return true
}

const validateSalaryRange = (val) => {
  if (!val) return true
  if (form.value.salary_min && val <= form.value.salary_min) {
    return 'Max salary should be greater than min salary'
  }
  return true
}

const validateEquityRange = (val) => {
  if (!val) return true
  if (form.value.equity_min && val < form.value.equity_min) {
    return 'Max equity should be greater than or equal to min equity'
  }
  return true
}

// Enhanced validation check for missing fields
function checkMissingFields() {
  const missing = []
  const requiredFields = [
    'title', 'job_type', 'mode_of_work', 'experience_min', 
    'salary_min', 'opening', 'qualification', 'job_markets', 
    'job_roles', 'lid', 'skillids', 'smallDescription', 'bigDescription'
  ]

  requiredFields.forEach(field => {
    const value = form.value[field]
    if (!value || (Array.isArray(value) && value.length === 0) || 
        (typeof value === 'string' && value.trim() === '')) {
      missing.push(fieldLabels[field] || field)
    }
  })

  // Check description length requirements
  if (form.value.smallDescription && form.value.smallDescription.length < 10) {
    if (!missing.includes('Short Description')) {
      missing.push('Short Description (minimum 10 characters)')
    }
  }
  
  if (form.value.bigDescription && form.value.bigDescription.length < 20) {
    if (!missing.includes('Detailed Job Description')) {
      missing.push('Detailed Job Description (minimum 20 characters)')
    }
  }

  return missing
}

// Enhanced scroll to invalid field function
/*function scrollToFirstInvalidField() {
  setTimeout(() => {
    let errorField = document.querySelector('.q-field--error')
    
    if (!errorField) {
      const requiredSelectors = [
        'input[aria-required="true"]',
        'textarea[aria-required="true"]',
        '.q-select[aria-required="true"]'
      ]
      
      for (const selector of requiredSelectors) {
        const fields = document.querySelectorAll(selector)
        for (const field of fields) {
          const fieldWrapper = field.closest('.q-field')
          if (fieldWrapper && !fieldWrapper.classList.contains('q-field--filled')) {
            errorField = fieldWrapper
            break
          }
        }
        if (errorField) break
      }
    }

    if (errorField) {
      errorField.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      })
      
      setTimeout(() => {
        const input = errorField.querySelector('input, textarea, .q-select')
        if (input && input.focus) {
          input.focus()
        }
        
        errorField.style.transform = 'scale(1.02)'
        errorField.style.transition = 'transform 0.3s ease'
        setTimeout(() => {
          errorField.style.transform = 'scale(1)'
        }, 300)
      }, 100)
    }
  }, 100)
}*/

onMounted(async () => {
  await Promise.all([getAllSkills(), getAllLocations(), getAllMarkets(), getAllRoles()])

  if (useUserStore().company) {
    form.value.companyName = useUserStore().company.name
    form.value.cid = useUserStore().company.cid
  }
})

async function submitJob() {
  console.log('🔥 SUBMIT JOB FUNCTION CALLED!')

  isSubmitting.value = true

  try {
    const jobData = {
      title: form.value.title,
      bigDescription: form.value.bigDescription,
      smallDescription: form.value.smallDescription,
      job_type: form.value.job_type,
      mode_of_work: form.value.mode_of_work,
      experience_min: form.value.experience_min,
      experience_max: form.value.experience_max,
      salary_min: form.value.salary_min,
      salary_max: form.value.salary_max,
      equity_min: form.value.equity_min || 0,
      equity_max: form.value.equity_max || 0,
      opening: form.value.opening,
      qualification: form.value.qualification,
      job_markets: form.value.job_markets,
      job_roles: form.value.job_roles,
      skillids: form.value.skillids,
      lid: form.value.lid,
    }

    console.log(jobData)
    const result = await jobsStore.postJob(jobData)

    console.log('Job submission result:', result)

    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Job posted successfully!',
        timeout: 3000
      })

      resetForm()
      isPreviewing.value = false
      currentStep.value = 1
    } else {
      $q.notify({
        type: 'negative',
        message: result.message,
      })
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message,
    })
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  form.value = {
    title: '',
    companyName: useUserStore().company?.name || '',
    job_type: '',
    mode_of_work: '',
    experience_min: 0,
    experience_max: 0,
    salary_min: 0,
    salary_max: 0,
    equity_min: 0,
    equity_max: 0,
    opening: 1,
    qualification: null,
    job_markets: [],
    job_roles: [],
    lid: null,
    cid: useUserStore().company?.cid || null,
    skillids: [],
    bigDescription: '',
    smallDescription: '',
  }

  if (formRef.value) {
    formRef.value.resetValidation()
  }
}
</script>

<style scoped>
.post-job-card {
  width: 100%;
  margin: 0 auto;
  padding: 32px;
  background-color: white;
}

.form-header {
  font-size: 24px;
  font-weight: 600;
  color: #1c1c1c;
  margin-bottom: 8px; /* tighter spacing */
}

.stepper-container {
  margin-bottom: 12px; /* reduced gap */
}

.custom-stepper {
  background: transparent;
}

.custom-stepper :deep(.q-stepper__header) {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px; /* reduced */
  margin-bottom: 12px;  /* reduced */
}

.custom-stepper :deep(.q-stepper__tab) {
  padding: 12px 16px;
  min-width: auto;
}

.custom-stepper :deep(.q-stepper__label) {
  font-weight: 500;
  font-size: 14px;
}

/* Enhanced Icon Sizes */
.custom-stepper :deep(.q-step__icon) {
  font-size: 28px !important;
  width: 48px !important;
  height: 48px !important;
}

.q-btn :deep(.q-icon) {
  font-size: 20px !important;
}

.q-avatar :deep(.q-icon) {
  font-size: 24px !important;
}

.q-banner :deep(.q-icon) {
  font-size: 22px !important;
}

.step-content {
  min-height: 400px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
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
  min-height: 0;
}

.step-actions {
  margin-top: 32px;
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
}

.step-counter {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.review-container {
  background: #f9fafb;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.confirm-dialog {
  min-width: 400px;
}

/* Confirmation Dialog Styling */
.confirmation-dialog {
  min-width: 400px;
  max-width: 600px;
}

.confirmation-dialog .q-banner {
  border-radius: 8px;
}

/* Unified Input & Select Styling */
.q-input,
.q-select {
  background: white;
}

.q-input :deep(.q-field__control),
.q-select :deep(.q-field__control) {
  background: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  min-height: 56px;
}

.q-input :deep(.q-field__control):before,
.q-select :deep(.q-field__control):before {
  border: none !important;
}

.q-input :deep(.q-field__control):after,
.q-select :deep(.q-field__control):after {
  border: 2px solid #000000 !important;
  border-radius: 8px !important;
}

.q-input :deep(.q-field__label),
.q-select :deep(.q-field__label) {
  color: #7a7a7a !important;
  font-weight: 500 !important;
}

.q-input :deep(.q-field__native),
.q-select :deep(.q-field__native) {
  color: #1c1c1c !important;
}

/* Focus States */
.q-field--focused :deep(.q-field__control) {
  border-color: #000000 !important;
  box-shadow: 0 0 0 1px #000000 !important;
}

/* Disabled States */
.q-input :deep(.q-field--disabled),
.q-select :deep(.q-field--disabled) {
  opacity: 0.7 !important;
}

.q-input :deep(.q-field--disabled .q-field__control),
.q-select :deep(.q-field--disabled .q-field__control) {
  background: #f9fafb !important;
  color: #6b7280 !important;
}

/* Buttons */
.q-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
  border-radius: 8px;
  padding: 12px 24px;
}

.q-btn.bg-primary {
  background-color: #1c1c1c !important;
  color: white !important;
}

.q-btn.bg-primary:hover {
  background-color: #b87333 !important;
}

.q-btn--flat {
  color: #1a1a1a;
}

.q-btn--flat:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

/* Range input styles */
.experience-range,
.salary-range,
.equity-range {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.experience-input,
.salary-input,
.equity-input {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .post-job-card {
    padding: 24px 16px;
  }

  .form-header {
    margin-bottom: 4px; /* tighter on mobile */
    font-size: 20px;
  }

  .stepper-container {
    margin-bottom: 8px;
  }

  .custom-stepper :deep(.q-stepper__header) {
    flex-wrap: wrap;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }

  .custom-stepper :deep(.q-stepper__tab) {
    flex: 1;
    min-width: 0;
    padding: 8px 4px;
  }

  .custom-stepper :deep(.q-stepper__label) {
    font-size: 12px;
  }

  .custom-stepper :deep(.q-step__icon) {
    font-size: 24px !important;
    width: 40px !important;
    height: 40px !important;
  }

  .step-actions {
    flex-direction: column;
    gap: 16px;
  }

  .step-counter {
    text-align: center;
    order: -1;
  }

  .q-btn :deep(.q-icon) {
    font-size: 18px !important;
  }
}

@media (max-width: 600px) {
  .experience-range,
  .salary-range,
  .equity-range {
    flex-direction: column;
    gap: 8px;
  }

  .experience-input,
  .salary-input,
  .equity-input {
    width: 100%;
  }

  .confirm-dialog {
    min-width: 300px;
    margin: 16px;
  }

  .custom-stepper :deep(.q-step__icon) {
    font-size: 20px !important;
    width: 36px !important;
    height: 36px !important;
  }
}

</style>