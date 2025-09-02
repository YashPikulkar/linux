<template>
  <q-card class="education-info-form">
    <!-- Header -->
    <div class="form-header">
      <div>Education</div>
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

    <!-- Institution Name -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-input
            v-model="tempData.institution"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="Institution Name"
            @update:model-value="checkForChanges"
          />
        </div>
      </div>
    </div>

    <!-- Degree -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-input
            v-model="tempData.degree"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="Degree"
            @update:model-value="checkForChanges"
          />
        </div>
        <q-input
          v-model="tempData.grade_value"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          :label="tempData.grade_type || 'Grade'"
          @update:model-value="checkForChanges"
        >
          <template v-slot:append>
            <q-chip
              dense
              square
              color="grey-3"
              text-color="black"
              class="q-ml-sm"
              style="font-size: 13px"
            >
              {{ tempData.grade_type || 'Grade' }}
            </q-chip>
          </template>
        </q-input>
      </div>
    </div>

    <!-- Field of Study -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-input
            v-model="tempData.field_of_study"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="Field of study"
            @update:model-value="checkForChanges"
          />
        </div>
      </div>
    </div>

    <!-- Education Level -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-select
            v-model="tempData.education_level"
            :disable="!isEditable"
            dense
            flat
            filled
            :options="educationLevelOptions"
            class="no-border"
            label="Education level"
            @update:model-value="checkForChanges"
          />
        </div>
      </div>
    </div>

    <!-- Start Date -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-input
            v-model="tempData.start_date_degree"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="Start Date"
            type="date"
            @update:model-value="checkForChanges"
          />
        </div>
      </div>
    </div>

    <!-- End Date -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-input
            v-model="tempData.end_date_degree"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="End date"
            type="date"
            @update:model-value="checkForChanges"
          />
        </div>
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
          Are you sure you want to save the changes to your education details?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="#7a7a7a" @click="showSaveDialog = false" />
          <q-btn unelevated label="Save" color="primary" @click="confirmSave" :loading="isSaving" />
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
          <q-btn flat  label="Keep Editing" color="#7a7a7a" @click="showCancelDialog = false" />
          <q-btn 
            unelevated 
            label="Discard Changes" 
            color="primary" 
            @click="confirmCancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, reactive, computed} from 'vue'
import { useUserStore } from 'src/stores/user-store'

const userStore = useUserStore()

// State management
const isEditable = ref(false)
const showSaveDialog = ref(false)
const showCancelDialog = ref(false)
const isSaving = ref(false)

// Education level options
const educationLevelOptions = ['Undergraduate', 'Postgraduate', 'Diploma', '10th', '12th', 'PhD']

// Store original data for comparison
const originalData = ref({})

// Reactive form data
const tempData = reactive({
  degree: userStore.degree || '',
  institution: userStore.institution || '',
  field_of_study: userStore.field_of_study || '',
  start_date_degree: userStore.start_date_degree || '',
  end_date_degree: userStore.end_date_degree || '',
  grade_value: userStore.grade_value || '',
  grade_type: userStore.grade_type || 'GPA',
  education_level: userStore.education_level || '',
})

// Initialize original data
const initializeOriginalData = () => {
  originalData.value = {
    degree: userStore.degree || '',
    institution: userStore.institution || '',
    field_of_study: userStore.field_of_study || '',
    start_date_degree: userStore.start_date_degree || '',
    end_date_degree: userStore.end_date_degree || '',
    grade_value: userStore.grade_value || '',
    grade_type: userStore.grade_type || 'GPA',
    education_level: userStore.education_level || '',
  }
}

// Computed property to check for changes
const hasChanges = computed(() => {
  return Object.keys(tempData).some(key => 
    tempData[key] !== originalData.value[key]
  )
})

// Check for changes function
const checkForChanges = () => {
  // This function is called on input changes to trigger reactivity
  // The computed property will handle the actual comparison
}

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
    await userStore.updateEducation({ ...tempData })
    originalData.value = { ...tempData }
    isEditable.value = false
  } catch (error) {
    console.error('Error saving education data:', error)
    // Handle error appropriately
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
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #333;
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
  width: 100%;
  gap: 8px;
}

.edu-title {
  width: 100%;
}
  .confirmation-dialog {
    min-width: 300px;
    max-width: 90vw;
  }
:deep(.no-border .q-field__control) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

:deep(.no-border .q-field__control::before) {
  border: none !important;
}

:deep(.no-border .q-field__control::after) {
  border: none !important;
}

/* Pulse animation for save button */
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