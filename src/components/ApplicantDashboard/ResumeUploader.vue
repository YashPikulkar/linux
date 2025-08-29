<template>
  <div class="resume-uploader">
    <input ref="fileInput" type="file" accept="application/pdf" @change="handleFileChange" hidden />

    <!-- Upload Area -->
    <div
      class="upload-area"
      :class="{ 'has-file': resumeFile, dragging: isDragging }"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div v-if="!resumeFile" class="upload-prompt">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <div class="upload-text">
          <div class="primary-text">Click or drag PDF here</div>
          <div class="secondary-text">Max 10MB</div>
        </div>
      </div>

      <div v-else class="file-display">
        <div class="file-info">
          <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
          <div class="file-details">
            <div class="file-name">{{ resumeName }}</div>
            <div class="file-size">{{ formatFileSize(resumeFile.size) }}</div>
          </div>
        </div>
        <button class="remove-btn" @click.stop="clearFile" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Upload Button -->
    <button
      class="upload-btn"
      :class="{ disabled: !resumeFile, loading: uploading }"
      :disabled="!resumeFile || uploading"
      @click="uploadResume"
      type="button"
    >
      <svg
        v-if="uploading"
        class="loading-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
      <svg v-else class="upload-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17,8 12,3 7,8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      {{ uploading ? 'Uploading...' : 'Upload Resume' }}
    </button>
  </div>

  <q-dialog v-model="isSkillModalOpen" class="custom-modal">
    <q-card class="skills-modal-card">
      <q-card-section class="modal-header">
        <div class="modal-title">
          <svg class="skills-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
            <path d="M15 12c0-3-3-3-3-3s-3 0-3 3" />
          </svg>
          Suggested Skills
        </div>
        <div class="modal-subtitle">We found these skills in your resume</div>
      </q-card-section>

      <q-card-section class="modal-content">
        <div class="skills-grid">
          <label v-for="skill in suggestedSkills" :key="skill" class="skill-checkbox-wrapper">
            <input type="checkbox" :value="skill" v-model="selectedSkills" class="skill-checkbox" />
            <span class="skill-label">{{ skill }}</span>
            <svg class="checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </label>
        </div>
      </q-card-section>

      <q-card-actions class="modal-actions">
        <button class="modal-btn secondary" @click="isSkillModalOpen = false">Cancel</button>
        <button class="modal-btn primary" @click="updateSkills">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l11 11z"
            />
          </svg>
          Add Skills
        </button>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import { useResumeStore } from 'src/stores/resume-store'

const $q = useQuasar()
const uid = useUserStore().uid
const userStore = useUserStore()
const resumeStore = useResumeStore()

const fileInput = ref(null)
const resumeFile = ref(null)
const resumeName = ref(null)
const uploading = ref(false)
const isDragging = ref(false)

const isSkillModalOpen = ref(false)
const suggestedSkills = ref([])
const selectedSkills = ref([])

const emit = defineEmits(['uploaded'])

const triggerFileInput = () => fileInput.value.click()

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  processFile(file)
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  processFile(file)
}

const processFile = (file) => {
  if (file && file.type === 'application/pdf') {
    if (file.size > 10 * 1024 * 1024) {
      $q.notify({
        type: 'negative',
        message: 'File must be under 10MB',
        position: 'top',
      })
      return
    }
    resumeFile.value = file
    resumeName.value = file.name
  } else {
    $q.notify({
      type: 'negative',
      message: 'PDF files only',
      position: 'top',
    })
  }
}

const clearFile = () => {
  resumeFile.value = null
  resumeName.value = null
  if (fileInput.value) fileInput.value.value = null
}

const uploadResume = async () => {
  if (!resumeFile.value) return

  uploading.value = true
  const formData = new FormData()
  formData.append('uid', uid)
  formData.append('resume', resumeFile.value)

  try {
    const response = await fetch(`http://localhost:3000/resume/upload-resume/${uid}`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('Upload failed')

    $q.notify({
      type: 'positive',
      message: 'Resume uploaded successfully!',
      position: 'top',
    })

    await resumeStore.fetchResumeBlob(uid)
    emit('uploaded')
    clearFile()

    // Fetch suggested skills after upload
    fetchSuggestedSkills()
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Upload failed. Try again.',
      position: 'top',
    })
    console.error(err)
  } finally {
    uploading.value = false
  }
}

const fetchSuggestedSkills = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/user/suggest-skills/${uid}`)
    if (!response.ok) {
      throw new Error('Failed to fetch suggested skills')
    }
    const some = await response.json()
    suggestedSkills.value = some.suggested_skills
    selectedSkills.value = [...some.suggested_skills] // Pre-select all skills
    isSkillModalOpen.value = true
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch suggested skills.',
      position: 'top',
    })
    console.error(error)
  }
}

const updateSkills = async () => {
  try {
    const skillsResponse = await fetch('http://localhost:3000/skills/all')
    if (!skillsResponse.ok) throw new Error('Failed to fetch all skills')

    const skillsData = await skillsResponse.json()
    const allSkills = new Map(skillsData.skills.map(([id, name]) => [name, id]))

    const currentSkillsNames = userStore.skills.map((skill) => skill[1])

    const newSkills = selectedSkills.value.filter((skill) => !currentSkillsNames.includes(skill))

    const newSkillsWithId = newSkills.map((skillName) => ({
      id: allSkills.get(skillName),
      name: skillName,
    }))

    const updatedSkills = [
      ...userStore.skills,
      ...newSkillsWithId.map((skill) => [skill.id, skill.name]),
    ]

    await userStore.updateSkills(updatedSkills)

    $q.notify({
      type: 'positive',
      message: 'Skills updated successfully!',
      position: 'top',
    })

    isSkillModalOpen.value = false
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update skills.',
      position: 'top',
    })
    console.error(err)
  }
}
</script>

<style scoped>
.resume-uploader {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  background: #ffffff;
}

.upload-area {
  flex: 1;
  border: 2px dashed #d1d5db;
  border-radius: 0.375rem;
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.upload-area:hover {
  border-color: #9ca3af;
  background: #f5f5f5;
}

.upload-area.dragging {
  border-color: #374151;
  background: #f0f0f0;
  border-style: solid;
}

.upload-area.has-file {
  border-style: solid;
  border-color: #d1d5db;
  background: #ffffff;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  color: #6b7280;
}

.upload-icon {
  width: 40px;
  height: 40px;
  stroke-width: 1.5;
}

.primary-text {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.secondary-text {
  font-size: 14px;
  color: #9ca3af;
}

.file-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  width: 32px;
  height: 32px;
  color: #374151;
  stroke-width: 1.5;
}

.file-name {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
  margin-bottom: 2px;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
}

.remove-btn {
  padding: 8px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: #dc2626;
  background: #fef2f2;
}

.remove-btn svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn:hover:not(.disabled):not(.loading) {
  background: #000000;
}

.upload-btn.disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.upload-btn.loading {
  cursor: not-allowed;
}

.upload-btn-icon,
.loading-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

/* Modal Styles */
.skills-modal-card {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: none;
  max-width: 500px;
  width: 90vw;
}

.modal-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.skills-icon {
  width: 20px;
  height: 20px;
  color: #374151;
  stroke-width: 2;
}

.modal-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-left: 32px;
}

.modal-content {
  padding: 20px 24px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.skill-checkbox-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
}

.skill-checkbox-wrapper:hover {
  border-color: #d1d5db;
  background: #f5f5f5;
}

.skill-checkbox {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.skill-checkbox:checked {
  background: #111827;
  border-color: #111827;
}

.skill-checkbox:checked + .skill-label {
  color: #111827;
  font-weight: 600;
}

.skill-checkbox:checked ~ .checkmark {
  opacity: 1;
  transform: scale(1);
}

.skill-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s ease;
}

.checkmark {
  position: absolute;
  left: 12px;
  width: 12px;
  height: 12px;
  color: #ffffff;
  stroke-width: 2.5;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
  pointer-events: none;
}

.modal-actions {
  padding: 16px 24px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #f3f4f6;
}

.modal-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.modal-btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.modal-btn.secondary:hover {
  background: #e5e7eb;
}

.modal-btn.primary {
  background: #111827;
  color: #ffffff;
}

.modal-btn.primary:hover {
  background: #000000;
}

.btn-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
