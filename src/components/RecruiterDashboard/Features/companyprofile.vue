<template>
  <div class="company-profile">
    <q-card class="q-pa-md">
      <q-form ref="formRef" @submit.prevent="saveProfile">
        <!-- Title and Edit Button -->
        <q-card-section class="flex justify-between items-center">
          <div class="text-h6">Company Profile</div>
          <div class="q-gutter-sm">
            <q-btn
              v-if="!isEditMode"
              label="Edit Profile"
              color="primary"
              outline
              @click="enableEditMode"
            />
            <q-btn
              v-if="isEditMode"
              label="Cancel"
              color="grey"
              flat
              @click="cancelEdit"
            />
          </div>
        </q-card-section>

        <!-- Company Logo Upload -->
        <q-card-section class="q-gutter-md">
          <div class="text-subtitle1">Company Logo</div>
          <q-img
            :src="logoUrl || placeholder"
            alt="Company Logo"
            style="max-width: 150px; height: 150px;"
            class="q-mb-sm"
            spinner-color="primary"
          />
          <q-uploader
            v-if="isEditMode"
            label="Upload Logo"
            :factory="uploadLogo"
            accept="image/*"
            auto-upload
            style="max-width: 300px"
            @uploaded="onUploadSuccess"
            @failed="onUploadFailed"
          />
        </q-card-section>

        <!-- Company Info -->
        <q-card-section>
          <q-input
            v-model="company.name"
            label="Company Name"
            filled
            :readonly="!isEditMode"
            :rules="[isRequired]"
          />

          <q-input
            v-model="company.email"
            label="Email"
            filled
            class="q-mt-md"
            :readonly="!isEditMode"
            :rules="[isRequired, isEmail]"
          />

          <q-input
            v-model="company.phone"
            label="Phone Number"
            filled
            class="q-mt-md"
            :readonly="!isEditMode"
            :rules="[isPhone]"
          />

          <q-input
            v-model="company.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            filled
            class="q-mt-md"
            :readonly="!isEditMode"
            :rules="[isStrongPassword]"
          >
            <template #append>
              <q-icon
                v-if="isEditMode"
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="company.companyType"
            label="Company Type"
            filled
            class="q-mt-md"
            :readonly="!isEditMode"
            :rules="[isRequired]"
          />

          <q-select
            v-model="company.industry"
            label="Industry"
            :options="industryOptions"
            filled
            class="q-mt-md"
            :readonly="!isEditMode"
            :rules="[isRequired]"
          />

          <q-select
            v-model="company.companySize"
            label="Company Size"
            :options="companySizeOptions"
            filled
            class="q-mt-md"
            :readonly="!isEditMode"
            :rules="[isRequired]"
          />

          <q-input
            v-model="company.location"
            label="Location"
            filled
            class="q-mt-md"
            :readonly="!isEditMode"
            :rules="[isRequired]"
          />

          <q-input
            v-model="company.description"
            type="textarea"
            label="Company Description"
            filled
            class="q-mt-md"
            :readonly="!isEditMode"
            :rules="[minLength(10)]"
          />

          <q-input
            v-model="company.taxIdOrGst"
            label="GST/Tax ID (Optional)"
            filled
            class="q-mt-md"
            :readonly="!isEditMode"
            :rules="[isOptionalGst]"
          />

          <!-- Registration Certificate Upload -->
          <div class="q-mt-md">
            <div class="text-subtitle1 q-mb-xs">Registration Certificate (Optional)</div>
            <div v-if="!isEditMode && company.registrationCertificateUrl" class="q-mb-sm">
              <q-btn
                label="View Certificate"
                color="primary"
                outline
                size="sm"
                @click="viewCertificate"
              />
            </div>
            <q-uploader
              v-if="isEditMode"
              label="Upload Registration Certificate"
              :factory="uploadCertificate"
              accept=".pdf,.jpg,.jpeg,.png"
              auto-upload
              @uploaded="onCertificateUploadSuccess"
              @failed="onCertificateUploadFailed"
            />
          </div>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions v-if="isEditMode" align="right">
          <q-btn
            type="submit"
            label="Save Changes"
            color="primary"
            :loading="isSaving"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useRecruiterStore } from 'src/stores/recruiterStore.js'

const $q = useQuasar()
const recruiterStore = useRecruiterStore()

// Form Ref
const formRef = ref(null)

// Edit Mode State
const isEditMode = ref(false)
const isSaving = ref(false)

// Bind reactive form to store data
const company = reactive({ ...recruiterStore.companyProfile })
const originalCompany = ref({}) // Store original data for cancel functionality

const logoUrl = ref(company.logoUrl || '')
const placeholder = 'https://cdn.quasar.dev/img/avatar.png'
const showPassword = ref(false)

const industryOptions = [
  'Information Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Construction',
  'Transportation',
  'Hospitality',
  'Real Estate',
  'Telecommunications',
  'Other'
]

const companySizeOptions = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1001-5000 employees',
  '5001-10,000 employees',
  '10,000+ employees'
]

// Mode Functions
function enableEditMode() {
  isEditMode.value = true
  // Store original data for cancel functionality
  originalCompany.value = JSON.parse(JSON.stringify(company))
}

function cancelEdit() {
  // Restore original data
  Object.assign(company, originalCompany.value)
  logoUrl.value = company.logoUrl || ''
  isEditMode.value = false
  showPassword.value = false
}

// File Upload (Logo)
function uploadLogo(files) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      logoUrl.value = reader.result
      company.logoUrl = reader.result
      resolve({ url: reader.result })
    }
    reader.readAsDataURL(files[0])
  })
}

// File Upload (Certificate)
function uploadCertificate(files) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      company.registrationCertificateUrl = reader.result
      resolve({ url: reader.result })
    }
    reader.readAsDataURL(files[0])
  })
}

// Certificate Viewer
function viewCertificate() {
  if (company.registrationCertificateUrl) {
    window.open(company.registrationCertificateUrl, '_blank')
  }
}

// Upload Callbacks
function onUploadSuccess() {
  $q.notify({ type: 'positive', message: 'Logo uploaded successfully!' })
}
function onUploadFailed() {
  $q.notify({ type: 'negative', message: 'Failed to upload logo.' })
}
function onCertificateUploadSuccess() {
  $q.notify({ type: 'positive', message: 'Certificate uploaded successfully!' })
}
function onCertificateUploadFailed() {
  $q.notify({ type: 'negative', message: 'Failed to upload certificate.' })
}

// Validation Rules
const isRequired = val => !!val || 'This field is required'
const isEmail = val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email'
const isPhone = val => !val || /^\d{10}$/.test(val) || 'Enter 10-digit number'
const isStrongPassword = val =>
  !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(val) ||
  'Must include uppercase, lowercase, number, and special character'
const minLength = n => val => !val || val.length >= n || `Minimum ${n} characters`
const isOptionalGst = val => !val || /^[A-Z0-9\-]{5,20}$/i.test(val) || 'Invalid GST or Tax ID'

// Submit Function
async function saveProfile() {
  const isValid = await formRef.value.validate()
  if (!isValid) {
    $q.notify({ type: 'negative', message: 'Please fix the errors in the form.' })
    return
  }

  isSaving.value = true

  try {
    // Update store
    recruiterStore.setCompanyProfile({ ...company })

    $q.notify({
      type: 'positive',
      message: 'Company profile updated successfully!'
    })

    // Exit edit mode
    isEditMode.value = false
    showPassword.value = false

    // Add real API call here if needed
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile. Please try again.'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.company-profile {
  max-width: 700px;
  margin: auto;
}

/* Style readonly fields differently */
.q-field--readonly .q-field__control {
  background-color: #f5f5f5;
}

.q-field--readonly .q-field__native {
  color: #424242;
}
</style>
