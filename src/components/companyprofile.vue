<template>
  <div class="company-profile">
    <q-card class="q-pa-md">
      <q-form ref="formRef" @submit.prevent="saveProfile">
        <!-- Title -->
        <q-card-section>
          <div class="text-h6">Company Profile</div>
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
            :readonly="true"
            :rules="[isRequired]"
          />

          <q-input
            v-model="company.email"
            label="Email"
            filled
            class="q-mt-md"
            :readonly="true"
            :rules="[isRequired, isEmail]"
          />

          <q-input
            v-model="company.phone"
            label="Phone Number"
            filled
            class="q-mt-md"
            :readonly="true"
            :rules="[isPhone]"
          />

          <q-input
            v-model="company.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            filled
            class="q-mt-md"
            :readonly="true"
            :rules="[isStrongPassword]"
          >
            <template #append>
              <q-icon
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
            :rules="[isRequired]"
          />

          <q-select
            v-model="company.industry"
            label="Industry"
            :options="industryOptions"
            filled
            class="q-mt-md"
            :rules="[isRequired]"
          />

          <q-select
            v-model="company.companySize"
            label="Company Size"
            :options="companySizeOptions"
            filled
            class="q-mt-md"
            :rules="[isRequired]"
          />

          <q-input
            v-model="company.location"
            label="Location"
            filled
            class="q-mt-md"
            :rules="[isRequired]"
          />

          <q-input
            v-model="company.description"
            type="textarea"
            label="Company Description"
            filled
            class="q-mt-md"
            :rules="[minLength(10)]"
          />

          <q-input
            v-model="company.taxIdOrGst"
            label="GST/Tax ID (Optional)"
            filled
            class="q-mt-md"
            :rules="[isOptionalGst]"
          />

          <!-- Registration Certificate Upload -->
          <div class="q-mt-md">
            <div class="text-subtitle1 q-mb-xs">Registration Certificate (Optional)</div>
            <q-uploader
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
        <q-card-actions align="right">
          <q-btn type="submit" label="Save Changes" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRecruiterStore } from 'src/stores/recruiterStore.js' // ✅ useRecruiterStore import

const $q = useQuasar()
const recruiterStore = useRecruiterStore()

// Form Ref
const formRef = ref(null)

// Bind reactive form to store data
const company = ref({ ...recruiterStore.companyProfile })

// Optional: sync updates back to store on save
const updateStoreProfile = () => {
  recruiterStore.setCompanyProfile(company.value)
}

const logoUrl = ref(company.value.logoUrl || '')
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

// File Upload (Logo)
function uploadLogo(files) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      logoUrl.value = reader.result
      company.value.logoUrl = reader.result
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
      company.value.registrationCertificateUrl = reader.result
      resolve({ url: reader.result })
    }
    reader.readAsDataURL(files[0])
  })
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
async function saveProfile () {
  const isValid = await formRef.value.validate()
  if (!isValid) {
    $q.notify({ type: 'negative', message: 'Please fix the errors in the form.' })
    return
  }

  updateStoreProfile() // ✅ Save to store

  $q.notify({
    type: 'positive',
    message: 'Company profile updated successfully!'
  })

  // Add real API call here if needed
}
</script>

<style scoped>
.company-profile {
  max-width: 700px;
  margin: auto;
}
</style>
