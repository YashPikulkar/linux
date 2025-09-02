<template>
  <q-card class="skills-card">
    <!-- Header -->
    <div class="form-header">
      <div>Add Your Skills</div>
      <div>
        <q-btn
          v-if="!isEditable"
          dense
          flat
          round
          icon="edit"
          size="sm"
          color="black"
          @click="toggleEdit"
        />
        <template v-else >
          <q-btn
            dense
            flat
            round
            icon="check"
            color="green"
            size="sm"
            class="q-mr-xs"
            :disable="!hasChanges"
            :class="{ 'pulse-animation': hasChanges }"
            @click="handleSave"
          />
          <q-btn dense flat round icon="close" color="red" size="sm" @click="handleCancel" />
        </template>
      </div>
    </div>

    <!-- Change indicator -->
    <div v-if="isEditable && hasChanges" class="change-indicator">
      <q-icon name="info" color="primary" size="sm" />
      <span>You have unsaved changes</span>
    </div>

    <!-- Skills List -->
    <div class="skills-list">
      <q-chip
        v-for="(skill, index) in localSkills"
        :key="skill.id ?? skill.name"
        :style="chipStyle"
        class="skill-chip q-mr-sm q-mb-sm"
        color="primary"
        :removable="isEditable"
        @remove="removeSkill(index)"
      >
        {{ skill.name }}
      </q-chip>
    </div>

    <!-- Search-based Skill Input -->
    <div v-if="isEditable" class="add-skill-row">
      <q-input
        v-model="searchQuery"
        dense
        outlined
        label="Search and add a skill"
        :loading="loadingSkills"
        color="white"
        class="add-skill-input q-mb-sm"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Error Message -->
      <div v-if="skillFetchError" class="text-negative q-mb-sm">
        <q-icon name="error" class="q-mr-xs" />
        {{ skillFetchError }}
      </div>

      <!-- Skills Dropdown -->
      <q-list v-if="searchQuery && filteredSkills.length" bordered class="dropdown-skill-list">
        <q-item
          v-for="[id, name] in filteredSkills"
          :key="id"
          clickable
          @click="selectSkill([id, name])"
        >
          <q-item-section>{{ name }}</q-item-section>
          <q-item-section side>
            <q-icon name="add" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-card>
  
  <!-- Confirmation Dialogs -->
  <q-dialog v-model="showSaveDialog" persistent>
    <q-card class="confirmation-dialog">
      <q-card-section class="row items-center">
        <q-avatar icon="save" color="primary" text-color="white" />
        <span class="q-ml-sm text-h6">Save Changes</span>
      </q-card-section>
      <q-card-section class="q-pt-none">
        Are you sure you want to save the changes to your skills details?
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
        <q-btn flat label="Keep Editing" color="#7a7a7a" @click="showCancelDialog = false" />
        <q-btn unelevated label="Discard" color="primary" @click="confirmCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from 'src/stores/user-store'

const userStore = useUserStore()

const isEditable = ref(false)
const localSkills = ref([])
const originalSkills = ref([])
const searchQuery = ref('')
const allSkills = ref([])
const loadingSkills = ref(false)
const skillFetchError = ref(null)
const showSaveDialog = ref(false)
const showCancelDialog = ref(false)
const isSaving = ref(false)

const chipStyle = computed(() => ({
  backgroundColor: '#1f2937',
  color: '#ffffff',
  transition: 'all 0.2s ease',
}))

// Computed property to check for changes
const hasChanges = computed(() => {
  if (originalSkills.value.length !== localSkills.value.length) {
    return true
  }
  
  return !originalSkills.value.every((originalSkill, index) => {
    const localSkill = localSkills.value[index]
    return localSkill && originalSkill.id === localSkill.id && originalSkill.name === localSkill.name
  })
})

const initializeOriginalData = () => {
  originalSkills.value = JSON.parse(JSON.stringify(localSkills.value))
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
    const updatedSkills = localSkills.value.map(({ id, name }) => [id, name])
    await userStore.updateSkills(updatedSkills)
    originalSkills.value = JSON.parse(JSON.stringify(localSkills.value))
    isEditable.value = false
  } catch (error) {
    console.error('Error saving skills data:', error)
  } finally {
    isSaving.value = false
  }
}

const confirmSave = async () => {
  showSaveDialog.value = false
  await saveEdit()
}

const confirmCancel = () => {
  showCancelDialog.value = false
  cancelEdit()
}

const cancelEdit = () => {
  // Reset local skills to original values
  localSkills.value = JSON.parse(JSON.stringify(originalSkills.value))
  isEditable.value = false
}

const removeSkill = (index) => {
  localSkills.value.splice(index, 1)
}

const fetchAllSkills = async () => {
  try {
    loadingSkills.value = true
    skillFetchError.value = null
    const res = await fetch('http://localhost:3000/skills/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch skills')
    }

    allSkills.value = json.skills // [[id, name]]
  } catch (err) {
    skillFetchError.value = err.message
    console.error('Error fetching skills:', err)
  } finally {
    loadingSkills.value = false
  }
}

const filteredSkills = computed(() => {
  if (!searchQuery.value) return []
  return allSkills.value.filter(([id, name]) => {
    return (
      name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      !localSkills.value.some((skill) => skill.id === id)
    )
  })
})

const selectSkill = ([id, name]) => {
  localSkills.value.push({ id, name })
  searchQuery.value = ''
}

// Initialize on component mount
onMounted(() => {
  const rawSkills = userStore.skills || []
  localSkills.value = rawSkills.map(([id, name]) => ({ id, name }))
  initializeOriginalData()
  fetchAllSkills()
})
</script>

<style scoped>
.skills-card {
  width: 100%;
  background-color: white;
  border-radius: 1rem;
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  gap: 1.5rem;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease;
  padding: 1rem;
}

/* Header scales down on small screens */
.form-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-weight: bold;
  font-size: 1.125rem; /* ~18px */
  color: black;
  margin-bottom: 1rem;
}

/* Flex wrap ensures chips move to new lines */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-chip:hover {
  background-color: #374151;
  cursor: pointer;
}

.add-skill-row {
  margin-top: 0.75rem;
  width: 100%;
  max-width: 100%;
}

.dropdown-skill-list {
  max-height: 40vh; /* relative to viewport */
  overflow-y: auto;
  background: white;
  color: #1f2937;
  border-radius: 0.5rem;
  border: 1px solid #2e2e2e;
  margin-top: 0.25rem;
}

.dropdown-skill-list .q-item:hover {
  background-color: #f3f4f6;
}

.confirmation-dialog {
  width: 100%;
  max-width: 90vw;
  min-width: auto;
}

/* Change indicator adapts naturally */
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
  margin-bottom: 1rem;
}

/* Pulse stays the same */
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

/* --- MEDIA QUERIES --- */

/* Small screens: shrink font, stack layout */
@media (max-width: 600px) {
  .form-header {
    font-size: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .skills-card {
    border-radius: 0.75rem;
    padding: 0.75rem;
  }

  .skills-list {
    gap: 0.25rem;
  }
}

</style>


