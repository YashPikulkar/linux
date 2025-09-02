
<template>
  <div>
    <div class="card-header">
      <div class="card-title">Company Profile</div>
      <div class="action-buttons">
        <q-btn dense flat round icon="edit" v-if="!isGlobalEditable" @click="enableGlobalEdit" color="black" />
        <q-btn 
          dense 
          flat 
          round 
          icon="check" 
          v-if="isGlobalEditable" 
          @click="showSaveConfirmation" 
          color="positive" 
          :disable="!hasChanges"
          :class="{ 'pulse-animation': hasChanges }"
        />
        <q-btn
          dense
          flat
          round
          icon="close"
          v-if="isGlobalEditable"
          @click="showCancelConfirmation"
          color="negative"
        />
      </div>
    </div>
    <!---<q-separator class="custom-separator" />-->
    
    <!-- Change indicator -->
    <div v-if="isGlobalEditable && hasChanges" class="change-indicator">
      <q-icon name="info" color="primary" size="sm" />
      <span>You have unsaved changes</span>
    </div>
    
    <div class="bottom-section">
  <!-- Left card: spans full height -->
  <div class="left-card">
    <CompanyBasicInfo 
      class="basic-info-card" 
      :is-global-editable="isGlobalEditable"
      :edit-data="editData"
      :size-options="sizeOptions"
      :status-options="statusOptions"
      @update:edit-data="updateEditData"
      @data-changed="onDataChanged"
    />
  </div>

  <!-- Right top card -->
  <div class="right-top">
    <CompanyLocationsMarkets 
      class="basic-info-card" 
      :is-global-editable="isGlobalEditable"
      :edit-data="editData"
      :location-options="locationOptions"
      :market-options="marketOptions"
      :company-type-options="companyTypeOptions"
      @update:edit-data="updateEditData"
      @data-changed="onDataChanged"
    />
  </div>

  <!-- Right bottom card -->
  <div class="right-bottom">
    <TagsComponent 
      class="basic-info-card" 
      :is-global-editable="isGlobalEditable"
      :edit-data="editData"
      @update:edit-data="updateEditData"
      @data-changed="onDataChanged"
    />
  </div>

  <!-- Full width card -->
  <div class="full-width-card">
    <LinksComponent 
      class="basic-info-card" 
      :is-global-editable="isGlobalEditable"
      :edit-data="editData"
      @update:edit-data="updateEditData"
      @data-changed="onDataChanged"
    />
  </div>
</div>


    <!-- Save Confirmation Dialog -->
    <q-dialog v-model="showSaveDialog" persistent>
      <q-card class="confirmation-dialog">
        <q-card-section class="row items-center">
          <q-avatar icon="save" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6">Save Changes</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to save the changes to your company profile?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="#7a7a7a" @click="showSaveDialog = false" />
          <q-btn 
            unelevated 
            label="Save Changes" 
            color="primary" 
            @click="confirmSave"
            :loading="isSaving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Cancel Confirmation Dialog -->
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
          <q-btn 
            unelevated 
            label="Discard Changes" 
            color="primary" 
            @click="confirmCancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import { useFilterStore } from 'src/stores/filter-store'

// Import child components
import CompanyBasicInfo from 'src/components/RecruiterDashboard/CompanyBasicInfo.vue'
import CompanyLocationsMarkets from 'src/components/RecruiterDashboard/CompanySelectFields.vue'
import TagsComponent from 'src/components/RecruiterDashboard/CompanyTags.vue'
import LinksComponent from 'src/components/RecruiterDashboard/CompanyLinks.vue'

const $q = useQuasar()
const isGlobalEditable = ref(false)
const showSaveDialog = ref(false)
const showCancelDialog = ref(false)
const isSaving = ref(false)

const userStore = useUserStore()
const filterStore = useFilterStore()

// Store original data for comparison - using ref instead of reactive
const originalData = ref({})
const editData = ref({})

// Change detection
const hasChanges = ref(false)
const changedFields = ref([])

// Initialize data
function initializeData() {
  const companyData = JSON.parse(JSON.stringify(userStore.company))
  
  // Ensure arrays exist
  companyData.locationids = Array.isArray(companyData.locationids) ? companyData.locationids : []
  companyData.marketids = Array.isArray(companyData.marketids) ? companyData.marketids : []
  companyData.tags = Array.isArray(companyData.tags) ? companyData.tags : []
  companyData.links = Array.isArray(companyData.links) ? companyData.links : []
  companyData.type = Array.isArray(companyData.type) ? companyData.type : []

  // Set original data
  originalData.value = JSON.parse(JSON.stringify(companyData))
  
  // Set edit data
  editData.value = JSON.parse(JSON.stringify(companyData))
}

// Deep comparison function
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true
  
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false
    return obj1.every((item, index) => deepEqual(item, obj2[index]))
  }
  
  if (obj1 && obj2 && typeof obj1 === 'object' && typeof obj2 === 'object') {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    
    if (keys1.length !== keys2.length) return false
    
    return keys1.every(key => deepEqual(obj1[key], obj2[key]))
  }
  
  return false
}

// Check for changes
function checkForChanges() {
  const changed = []
  const fields = ['name', 'description', 'companySize', 'status', 'CEO', 'companyEmail', 'locationids', 'marketids', 'type', 'tags', 'links']
  
  fields.forEach(field => {
    if (!deepEqual(editData.value[field], originalData.value[field])) {
      changed.push(field)
    }
  })
  
  changedFields.value = changed
  hasChanges.value = changed.length > 0
}

// Watch for changes in editData
watch(() => editData.value, () => {
  nextTick(() => {
    checkForChanges()
  })
}, { deep: true })

// Handle updates from child components
function updateEditData(updatedData) {
  editData.value = { ...updatedData }
}

// Handle data changes from child components
function onDataChanged() {
  nextTick(() => {
    checkForChanges()
  })
}

// Options for selects
const locationOptions = computed(() =>
  filterStore.locations.map((loc) => ({ label: loc.label, value: loc.value })),
)
const marketOptions = computed(() =>
  filterStore.markets.map((m) => ({ label: m.label, value: m.value })),
)

const sizeOptions = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10000+',
]
const statusOptions = ['Hiring', 'Not-Hiring']

const companyTypeOptions = [
  { label: 'Startup', value: 'Startup' },
  { label: 'Small Business', value: 'Small Business' },
  { label: 'Medium Enterprise', value: 'Medium Enterprise' },
  { label: 'Large Enterprise', value: 'Large Enterprise' },
  { label: 'MNC', value: 'MNC' },
  { label: 'Non-Profit', value: 'Non-Profit' },
  { label: 'Government', value: 'Government' },
  { label: 'Public Sector', value: 'Public Sector' },
  { label: 'Private', value: 'Private' },
  { label: 'Joint Venture', value: 'Joint Venture' },
  { label: 'Cooperative', value: 'Cooperative' },
  { label: 'Other', value: 'Other' },
  { label: 'Holding Company', value: 'Holding Company' },
]

onMounted(async () => {
  await filterStore.fetchFilters()
  initializeData()
  console.log('Initialized Edit Data:', editData.value)
})

// Global edit functions
function enableGlobalEdit() {
  isGlobalEditable.value = true
  // Reset change detection when entering edit mode
  checkForChanges()
}

function showCancelConfirmation() {
  if (hasChanges.value) {
    showCancelDialog.value = true
  } else {
    cancelGlobalEdit()
  }
}

function confirmCancel() {
  showCancelDialog.value = false
  cancelGlobalEdit()
}

function cancelGlobalEdit() {
  // Reset to original data
  editData.value = JSON.parse(JSON.stringify(originalData.value))
  isGlobalEditable.value = false
  hasChanges.value = false
  changedFields.value = []
}

function showSaveConfirmation() {
  if (hasChanges.value) {
    showSaveDialog.value = true
  }
}

async function confirmSave() {
  showSaveDialog.value = false
  isSaving.value = true
  
  try {
    await saveAll()
  } finally {
    isSaving.value = false
  }
}

async function saveAll() {
  isGlobalEditable.value = false
  await updateCompanyProfile()
}

// Common save function
async function updateCompanyProfile(customMessage = 'Company profile updated.') {
  // Create a copy to avoid mutating the original
  const dataToSave = { ...editData.value }
  
  // Clean arrays before sending
  dataToSave.tags = dataToSave.tags?.filter(Boolean) || []
  dataToSave.links = dataToSave.links?.filter(Boolean) || []
  dataToSave.marketids = dataToSave.marketids?.filter((id) =>
    marketOptions.value.some((opt) => opt.value === id),
  ) || []
  dataToSave.locationids = dataToSave.locationids?.filter((id) =>
    locationOptions.value.some((opt) => opt.value === id),
  ) || []
  dataToSave.type = dataToSave.type?.filter(Boolean) || []

  try {
    const response = await userStore.updateRecruiter(dataToSave)
    console.log('Update Recruiter Response:', response)

    if (response?.message === 'success') {
      $q.notify({ type: 'positive', message: customMessage })
      
      // Update the store and reset original data
      Object.assign(userStore.company, dataToSave)
      originalData.value = JSON.parse(JSON.stringify(dataToSave))
      editData.value = JSON.parse(JSON.stringify(dataToSave))
      
      // Reset change tracking
      hasChanges.value = false
      changedFields.value = []
    } else {
      const errorMsg = response?.error?.message || 'Company update failed.'
      $q.notify({ type: 'negative', message: errorMsg })
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to save changes.' })
    console.error(err)
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #000000;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.custom-separator {
  background-color: #e5e5e5 !important;
  margin: 1rem 1.5rem !important;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  margin: 0 1.5rem 1rem 1.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #856404;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 2-column layout */
  grid-template-rows: auto auto;   /* grow dynamically */
  gap: 1rem;
  padding: 0 1.5rem 1.5rem 1.5rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* Left side card (takes full height of right stack) */
.left-card {
  grid-column: 1;
  grid-row: 1 / 3;  /* spans 2 rows */
  display: flex;
  flex-direction: column;
}

/* Right side top card */
.right-top {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
}

/* Right side bottom card */
.right-bottom {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
}

/* Full-width bottom card */
.full-width-card {
  grid-column: 1 / 3;  /* span across both columns */
  grid-row: 3;
  display: flex;
  flex-direction: column;
}


/* 📱 Responsive: stack into 1 column */
@media (max-width: 768px) {
  .bottom-section {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .left-card,
  .right-top,
  .right-bottom,
  .full-width-card {
    grid-column: 1;
    grid-row: auto;
  }
}

.widget {
  flex: 1; /* each card grows equally */
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex-wrap: nowrap;
}


.full-width-section {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.confirmation-dialog {
  min-width: 400px;
  max-width: 500px;
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 1rem 1rem 0 1rem;
  }

  .action-buttons {
    align-self: flex-end;
  }

  .custom-separator {
    margin: 1rem !important;
  }

  .change-indicator {
    margin: 0 1rem 1rem 1rem;
  }

  .bottom-section {
    flex-direction: column;
    padding: 0 1rem 1rem 1rem;
    height: auto; /* let it flow naturally on mobile */
  }

  .left-side,
  .right-side {
    height: auto;
  }

  .right-side {
    margin-left: 0 !important;
    margin-top: 1rem;
  }

  .widget {
    flex: unset; /* don’t force equal heights on stacked layout */
  }

  .full-width-section {
    padding: 0 1rem 1rem 1rem;
  }

  .confirmation-dialog {
    min-width: 300px;
    max-width: 90vw;
  }
}

@media (max-width: 480px) {
  .card-header {
    padding: 0.75rem 0.75rem 0 0.75rem;
  }

  .custom-separator {
    margin: 0.75rem !important;
  }

  .change-indicator {
    margin: 0 0.75rem 0.75rem 0.75rem;
  }

  .bottom-section {
    padding: 0 0.75rem 0.75rem 0.75rem;
  }

  .full-width-section {
    padding: 0 0.75rem 0.75rem 0.75rem;
  }
}
@media (max-width: 768px) {
  .basic-info-card {
    flex: unset;      /* don’t force equal height */
    height: auto;     /* let them size naturally */
  }
}
/* CUSTOM SCROLLBAR */
.widget::-webkit-scrollbar {
  width: 8px;
}
.widget::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}
.widget::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 8px;
}
.widget::-webkit-scrollbar-thumb:hover {
  background: #b3b3b3;
}

/* Firefox */
.widget {
  scrollbar-width: thin;
  scrollbar-color: #ccc #f1f1f1;
}

</style>