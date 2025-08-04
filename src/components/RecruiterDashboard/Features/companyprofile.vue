<template>
  <div class="form-wrapper">
    <q-card class="company-profile-card">
      <!-- Header -->
      <div class="form-header">
        <div>Company Profile</div>
        <div v-if="!isEditable">
          <q-btn dense flat round icon="edit" size="sm" @click="enableEditMode" />
        </div>
        <div v-else class="row no-wrap items-center">
          <q-btn dense flat round icon="check" size="sm" color="positive" @click="saveProfile" />
          <q-btn dense flat round icon="close" size="sm" color="negative" @click="cancelEdit" />
        </div>
      </div>

      <!-- Logo Upload -->
      <div class="section-title">Logo</div>
      <div class="form-entry items-center">
        <q-img :src="company.logoUrl || placeholder" style="width: 100px; height: 100px" />
        <q-uploader
          v-if="isEditable"
          :factory="uploadLogo"
          accept="image/*"
          auto-upload
          flat
          class="q-mt-sm"
          @uploaded="onUploadSuccess"
        />
      </div>

      <div class="section-title">Company Information</div>
      <div class="form-entry">
        <q-input v-model="company.name" :disable="!isEditable" dense filled label="Company Name" :rules="[isRequired]" />
        <q-input v-model="company.email" :disable="!isEditable" dense filled label="Email" :rules="[isEmail]" />
        <q-input v-model="company.phone" :disable="!isEditable" dense filled label="Phone" :rules="[isPhone]" />
        <q-input v-model="company.password" :type="showPassword ? 'text' : 'password'" :disable="!isEditable" dense filled label="Password" :rules="[isStrongPassword]">
          <template v-if="isEditable" #append>
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" />
          </template>
        </q-input>
        <q-input v-model="company.companyType" :disable="!isEditable" dense filled label="Company Type" />
        <q-select v-model="company.industry" :options="industryOptions" label="Industry" filled dense :disable="!isEditable" />
        <q-select v-model="company.companySize" :options="sizeOptions" label="Company Size" filled dense :disable="!isEditable" />
      </div>

      <!-- Branch Locations -->
      <div class="section-title">Branch Locations</div>
      <div class="form-entry">
        <div v-if="!isEditable">
          <ul class="q-pl-md">
            <li v-for="(loc, i) in company.locations" :key="i">{{ loc }}</li>
          </ul>
        </div>
        <div v-else>
          <div v-for="(loc, index) in company.locations" :key="index" class="row items-center q-gutter-sm">
            <q-input v-model="company.locations[index]" filled dense placeholder="Enter location" class="col" :rules="[isRequired]" />
            <q-btn icon="delete" flat dense color="negative" @click="removeLocation(index)" />
          </div>
          <q-btn icon="add" label="Add Location" flat color="primary" class="q-mt-sm" @click="addLocation" />
        </div>
      </div>

      <div class="section-title">Other Information</div>
      <div class="form-entry">
        <q-input v-model="company.description" :disable="!isEditable" type="textarea" dense filled label="Description" :rules="[minLength(10)]" />
        <q-input v-model="company.taxIdOrGst" :disable="!isEditable" dense filled label="GST / Tax ID (Optional)" :rules="[isOptionalGst]" />
      </div>

      <!-- Certificate Upload -->
      <div class="section-title">Registration Certificate</div>
      <div class="form-entry">
        <div v-if="!isEditable && company.registrationCertificateUrl">
          <q-btn label="View Certificate" color="primary" flat @click="viewCertificate" />
        </div>
        <q-uploader
          v-if="isEditable"
          :factory="uploadCertificate"
          accept=".pdf,.jpg,.png"
          auto-upload
          flat
          @uploaded="onCertificateUploadSuccess"
        />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isEditable = ref(false)
const showPassword = ref(false)
const placeholder = 'https://cdn.quasar.dev/img/avatar.png'

const company = reactive({
  logoUrl: '',
  name: 'Acme Inc.',
  email: 'hr@acme.com',
  phone: '9876543210',
  password: '',
  companyType: 'Private',
  industry: 'Technology',
  companySize: '51-200',
  locations: ['New York'],
  description: 'We innovate cool tech products and serve enterprise clients.',
  taxIdOrGst: '',
  registrationCertificateUrl: ''
})

const originalCompany = ref(JSON.parse(JSON.stringify(company)))
const industryOptions = ['IT', 'Finance', 'Healthcare', 'Retail', 'Other']
const sizeOptions = ['1-10', '11-50', '51-200', '201-500', '500+']

function enableEditMode() {
  originalCompany.value = JSON.parse(JSON.stringify(company))
  isEditable.value = true
}
function cancelEdit() {
  Object.assign(company, originalCompany.value)
  isEditable.value = false
}
function saveProfile() {
  $q.dialog({
    title: 'Confirm Submission',
    message: 'Submit updated profile?',
    ok: { label: 'Yes', color: 'primary' },
    cancel: { label: 'No', color: 'grey' }
  }).onOk(() => {
    originalCompany.value = JSON.parse(JSON.stringify(company))
    isEditable.value = false
    $q.notify({ type: 'positive', message: 'Profile updated.' })
  })
}
function addLocation() {
  company.locations.push('')
}
function removeLocation(index) {
  company.locations.splice(index, 1)
}
function viewCertificate() {
  if (company.registrationCertificateUrl) window.open(company.registrationCertificateUrl, '_blank')
}

// Uploads
function uploadLogo(files) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => {
      company.logoUrl = reader.result
      resolve({ url: reader.result })
    }
    reader.readAsDataURL(files[0])
  })
}
function uploadCertificate(files) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => {
      company.registrationCertificateUrl = reader.result
      resolve({ url: reader.result })
    }
    reader.readAsDataURL(files[0])
  })
}
function onUploadSuccess() {
  $q.notify({ type: 'positive', message: 'Logo uploaded.' })
}
function onCertificateUploadSuccess() {
  $q.notify({ type: 'positive', message: 'Certificate uploaded.' })
}

// Validation Rules
const isRequired = val => !!val || 'Required'
const isEmail = val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email'
const isPhone = val => /^\d{10}$/.test(val) || 'Enter 10-digit number'
const isStrongPassword = val =>
  !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(val) ||
  'Must include upper, lower, number, special char'
const minLength = n => val => !val || val.length >= n || `Min ${n} characters`
const isOptionalGst = val => !val || /^[A-Z0-9\-]{5,20}$/i.test(val) || 'Invalid GST/Tax ID'
</script>

<style scoped>
.form-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  min-height: 0;
}

.company-profile-card {
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
  display: flex;
  justify-content: space-between;
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
