<template>
  <q-card class="education-info-form">
    <!-- Header -->
    <div class="form-header">
      <div>Additional Details</div>
      <div v-if="!isEditable">
        <q-btn dense flat round icon="edit" size="sm" @click="toggleEdit" />
      </div>
      <div v-else class="row no-wrap items-center">
        <q-btn 
          dense 
          flat 
          round 
          icon="check" 
          size="sm" 
          color="positive" 
          @click="handleSave"
          :disable="!hasChanges"
          :class="{ 'pulse-animation': hasChanges }" 
        />
        <q-btn 
          dense 
          flat 
          round 
          icon="close" 
          size="sm" 
          color="negative" 
          @click="handleCancel" 
        />
      </div>
    </div>
    
    <!-- Change indicator -->
    <div v-if="isEditable && hasChanges" class="change-indicator">
      <q-icon name="info" color="primary" size="sm" />
      <span>You have unsaved changes</span>
    </div>

    <!-- PERSONAL INFO -->
    <div class="section-title">Personal Information</div>
    <div class="edu-entry">
      <div class="edu-left">
        <q-select
          v-model="tempData.gender"
          :disable="!isEditable"
          :options="['Male', 'Female', 'Other']"
          dense
          flat
          filled
          class="no-border"
          label="Gender"
        />
        <q-input
          v-model="tempData.dob"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          label="Date of Birth"
          type="date"
        />
      </div>
    </div>

    <!-- PROFESSIONAL INFO -->
    <div class="section-title">Professional Details</div>
    <div class="edu-entry">
      <div class="edu-left">
        <q-select
          v-model="tempData.employmentStatus"
          :disable="!isEditable"
          :options="['Employed', 'Unemployed', 'Fresher']"
          dense
          flat
          filled
          class="no-border"
          label="Employment Status"
        />
      </div>
    </div>

    <!-- JOB PREFERENCES -->
    <div class="section-title">Job Preferences</div>
    <div class="edu-entry">
      <div class="edu-left">
        <q-select
          v-model="tempData.jobType"
          :disable="!isEditable"
          :options="['Full-time', 'Part-time', 'Internship']"
          dense
          flat
          filled
          class="no-border"
          label="Preferred Job Type"
        />
        <q-select
          v-model="tempData.availability"
          :disable="!isEditable"
          :options="['Remote', 'Onsite', 'Hybrid']"
          dense
          flat
          filled
          class="no-border"
          label="Availability"
        />
      </div>
    </div>

    <!-- LINKS -->
    <div class="section-title">Links</div>
    <div class="edu-entry">
      <div class="edu-left">
        <q-input
          v-model="tempData.linkedIn"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          label="LinkedIn Profile URL"
        />
        <q-input
          v-model="tempData.portfolioWebsite"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          label="Portfolio Website (if any)"
        />
      </div>
    </div>
    
    <!-- Confirmation Dialogs -->
    <q-dialog v-model="showSaveDialog" persistent>
      <q-card class="confirmation-dialog">
        <q-card-section class="row items-center">
          <q-avatar icon="save" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6">Save Changes</span>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Are you sure you want to save the changes to your additional details?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="#7a7a7a" @click="showSaveDialog = false" />
          <q-btn flat unelevated label="Save" color="primary" @click="confirmSave" :loading="isSaving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCancelDialog" persistent>
      <q-card class="confirmation-dialog">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6">Discard Changes</span>
        </q-card-section>
        <q-card-section class="q-pt-none">
          You have unsaved changes. Are you sure you want to discard them?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Keep Editing" color="#7a7a7a" @click="showCancelDialog = false" />
          <q-btn flat unelevated label="Discard" color="primary" @click="confirmCancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { useUserStore } from 'src/stores/user-store'
import { ref, reactive, computed } from 'vue'

const userStore = useUserStore()

const isEditable = ref(false)
const showSaveDialog = ref(false)
const showCancelDialog = ref(false)
const isSaving = ref(false)
// Store original data for comparison
const originalData = ref({})

const tempData = reactive({
  gender: userStore.gender || '',
  dob: userStore.dob || '',
  employmentStatus: userStore.employmentStatus || '',
  jobType: userStore.jobType || '',
  preferredLocation: userStore.preferredLocation || '',
  availability: userStore.availability || '',
  linkedIn: userStore.linkedIn || '',
  portfolioWebsite: userStore.portfolioWebsite || '',
})

// Initialize original data
const initializeOriginalData = () => {
  originalData.value = {
    gender: userStore.gender || '',
    dob: userStore.dob || '',
    employmentStatus: userStore.employmentStatus || '',
    jobType: userStore.jobType || '',
    preferredLocation: userStore.preferredLocation || '',
    availability: userStore.availability || '',
    linkedIn: userStore.linkedIn || '',
    portfolioWebsite: userStore.portfolioWebsite || '',
  }
}

// Computed property to check for changes
const hasChanges = computed(() => {
  return Object.keys(tempData).some(key => 
    tempData[key] !== originalData.value[key]
  )
})

// Edit mode functions
const toggleEdit = () => {
  isEditable.value = true
  initializeOriginalData()
}

const handleSave = () => {
  if (hasChanges.value) {
    showSaveDialog.value = true
  } else {
    saveEdit()
  }
}

const handleCancel = () => {
  if (hasChanges.value) {
    showCancelDialog.value = true
  } else {
    cancelEdit()
  }
}

const saveEdit = async () => {
  try {
    isSaving.value = true
    await userStore.updateAdditionalData({ ...tempData })
    originalData.value = { ...tempData }
    isEditable.value = false
  } catch (error) {
    console.error('Error saving additional data:', error)
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  // Reset temp data to original values
  Object.keys(originalData.value).forEach(key => {
    tempData[key] = originalData.value[key]
  })
  isEditable.value = false
}

const confirmSave = async () => {
  showSaveDialog.value = false
  await saveEdit()
}

const confirmCancel = () => {
  showCancelDialog.value = false
  cancelEdit()
}

// Initialize on component mount
initializeOriginalData()
</script>

<style scoped>
.education-info-form {
  width: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 16px;

  /* 💡 3D Effect + white glow */
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),
    /* soft white outer glow */ 0 8px 16px rgba(0, 0, 0, 0.05),
    /* subtle shadow for depth */ inset 0 1px 3px rgba(255, 255, 255, 0.6); /* slight inset highlight */

  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #856404;
}

.confirmation-dialog {
  min-width: 300px;
  max-width: 90vw;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #444;
  margin-top: 12px;
}

.edu-entry {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.edu-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.no-border ::v-deep .q-field__control {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important; /* ✅ Remove grey background */
  border-radius: 0 !important;
  padding: 0 !important;
  font-size: 14px;
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}
</style>