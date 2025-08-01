<template>
  <div class="company-profile">
    <q-card class="q-pa-md">
      <q-form ref="formRef" @submit.prevent="saveProfile">
        <q-card-section class="flex justify-between items-center">
          <div class="text-h6">Company Profile</div>
          <div>
            <q-btn v-if="!isEditMode" label="Edit" color="primary" outline @click="enableEditMode" />
            <q-btn v-if="isEditMode" label="Cancel" color="secondary" flat @click="cancelEdit" />
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1">Company Logo</div>
          <q-img :src="logoUrl || placeholder" style="width: 150px; height: 150px" spinner-color="primary" />
          <q-uploader
            v-if="isEditMode"
            :factory="uploadLogo"
            accept="image/*"
            auto-upload
            class="q-mt-sm"
            @uploaded="onUploadSuccess"
          />
        </q-card-section>

        <q-card-section>
          <q-input v-model="company.name" label="Company Name" filled :readonly="!isEditMode" :rules="[isRequired]" />
          <q-input v-model="company.email" label="Email" filled :readonly="!isEditMode" :rules="[isRequired, isEmail]" class="q-mt-md" />
          <q-input v-model="company.phone" label="Phone Number" filled :readonly="!isEditMode" :rules="[isPhone]" class="q-mt-md" />
          <q-input
            v-model="company.password"
            label="Password"
            filled
            :type="showPassword ? 'text' : 'password'"
            :readonly="!isEditMode"
            class="q-mt-md"
            :rules="[isStrongPassword]"
          >
            <template v-if="isEditMode" #append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" />
            </template>
          </q-input>
          <q-input v-model="company.companyType" label="Company Type" filled :readonly="!isEditMode" class="q-mt-md" />
          <q-select v-model="company.industry" :options="industryOptions" label="Industry" filled :readonly="!isEditMode" class="q-mt-md" />
          <q-select v-model="company.companySize" :options="sizeOptions" label="Company Size" filled :readonly="!isEditMode" class="q-mt-md" />

          <div class="q-mt-md">
            <label class="text-subtitle1">Branch Locations</label>
            <div v-if="!isEditMode">
              <ul class="q-pl-md">
                <li v-for="(loc, index) in company.locations" :key="index">{{ loc }}</li>
              </ul>
            </div>
            <div v-else>
              <div v-for="(loc, index) in company.locations" :key="index" class="row q-mb-sm items-center">
                <q-input
                  v-model="company.locations[index]"
                  filled
                  placeholder="Enter branch location"
                  class="col"
                  :rules="[isRequired]"
                />
                <q-btn icon="delete" flat color="negative" dense class="q-ml-sm" @click="removeLocation(index)" />
              </div>
              <q-btn icon="add" label="Add Location" flat color="primary" @click="addLocation" />
            </div>
          </div>

          <q-input v-model="company.description" label="Description" type="textarea" filled :readonly="!isEditMode" class="q-mt-md" :rules="[minLength(10)]" />
          <q-input v-model="company.taxIdOrGst" label="GST / Tax ID (Optional)" filled :readonly="!isEditMode" class="q-mt-md" :rules="[isOptionalGst]" />

          <div class="q-mt-md">
            <div class="text-subtitle1">Registration Certificate</div>
            <div v-if="!isEditMode && company.registrationCertificateUrl">
              <q-btn label="View Certificate" color="primary" flat @click="viewCertificate" />
            </div>
            <q-uploader
              v-if="isEditMode"
              :factory="uploadCertificate"
              accept=".pdf,.jpg,.png"
              auto-upload
              @uploaded="onCertificateUploadSuccess"
              class="q-mt-sm"
            />
            <q-banner v-if="company.registrationCertificateUrl" class="bg-grey-2 text-black q-mt-sm" dense>
              Certificate uploaded.
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions v-if="isEditMode" align="right">
          <q-btn type="submit" label="Save Changes" color="primary" :loading="isSaving" :disable="!hasChanges" />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRecruiterStore } from 'src/stores/recruiterStore'

const $q = useQuasar()
const recruiterStore = useRecruiterStore()

const formRef = ref(null)
const isEditMode = ref(false)
const isSaving = ref(false)
const showPassword = ref(false)
const company = reactive({ ...recruiterStore.companyProfile })

const originalCompany = ref(JSON.parse(JSON.stringify(company)))
if (!Array.isArray(company.locations)) company.locations = [company.location || '']

const logoUrl = ref(company.logoUrl || '')
const placeholder = 'https://cdn.quasar.dev/img/avatar.png'

const industryOptions = ['IT', 'Finance', 'Healthcare', 'Retail', 'Other']
const sizeOptions = ['1-10', '11-50', '51-200', '201-500', '500+']

function enableEditMode() {
  originalCompany.value = JSON.parse(JSON.stringify(company))
  isEditMode.value = true
}

function cancelEdit() {
  Object.assign(company, structuredClone(originalCompany.value))
  logoUrl.value = company.logoUrl || ''
  isEditMode.value = false
}

function addLocation() {
  if (company.locations.some(loc => loc.trim() === '')) return
  company.locations.push('')
}

function removeLocation(index) {
  company.locations.splice(index, 1)
}

function viewCertificate() {
  if (company.registrationCertificateUrl) window.open(company.registrationCertificateUrl, '_blank')
}

const hasChanges = computed(() => !isEqual(company, originalCompany.value))

function uploadLogo(files) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => {
      logoUrl.value = reader.result
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

async function saveProfile() {
  const isValid = await formRef.value.validate()
  if (!isValid) {
    $q.notify({ type: 'negative', message: 'Please fix the errors in the form.' })
    return
  }

  $q.dialog({
    title: 'Confirm Submission',
    message: 'Do you want to submit the updated profile?',
    ok: { label: 'Yes', color: 'primary' },
    cancel: { label: 'No', color: 'grey' }
  }).onOk(async () => {
    isSaving.value = true
    try {
      await recruiterStore.setCompanyProfile(structuredClone(company))

      $q.dialog({
        title: 'Profile Updated',
        message: 'Your company profile has been updated.',
        ok: { label: 'OK', color: 'primary' }
      })

      originalCompany.value = structuredClone(company)
      isEditMode.value = false
      showPassword.value = false
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Failed to update. Try again.' })
    } finally {
      isSaving = false
    }
  })
}

// Validation rules
const isRequired = val => (val !== null && val !== undefined && val.toString().trim() !== '') || 'Required'
const isEmail = val => (!val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) || 'Invalid email'
const isPhone = val => (!val || /^\d{10}$/.test(val)) || 'Enter 10-digit number'
const isStrongPassword = val => !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(val) || 'Must include upper, lower, number, special char'
const minLength = n => val => !val || val.length >= n || `Min ${n} characters`
const isOptionalGst = val => !val || /^[A-Z0-9\-]{5,20}$/i.test(val) || 'Invalid GST/Tax ID'
</script>

<style scoped>
.company-profile {
  height: 100vh;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
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
