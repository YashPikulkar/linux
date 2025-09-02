<template>
  <q-card flat bordered class="basic-info-card">
    <div class="section-header">
      <div class="section-title">Tags</div>
      <q-btn 
        v-if="canEdit"
        flat dense round icon="add"
        class="add-btn"
        @click="toggleNewTagInput"
      />
    </div>
    
    <div class="tag-container">
      <!-- Existing Tags as Chips -->
      <q-chip
        v-for="(tag, index) in (editData.tags || [])"
        :key="'tag-' + index"
        :removable="canEdit"
        @remove="removeTag(index)"
        class="q-mr-sm q-mb-sm custom-chip"
      >
        {{ tag }}
      </q-chip>
      
      <!-- Input for Adding New Tag -->
      <q-input
        v-if="canEdit && showNewTagInput"
        ref="tagInput"
        v-model="newTag"
        filled
        dense
        placeholder="Innovative / Work-Life Balance"
        class="q-mb-sm new-tag-input"
        @keyup.enter="addTagFromInput"
        @blur="hideTagInput"
        autofocus
      />
      <div v-if="(!editData.tags || editData.tags.length === 0) && !canEdit" class="no-tags-message">
        No tags added yet
      </div>
    </div>
     
  </q-card>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  isGlobalEditable: Boolean,
  editData: Object
})

const emit = defineEmits(['update:editData', 'data-changed'])

const canEdit = computed(() => props.isGlobalEditable)

const showNewTagInput = ref(false)
const newTag = ref('')
const tagInput = ref(null)

function toggleNewTagInput() {
  showNewTagInput.value = true
  nextTick(() => {
    if (tagInput.value) {
      tagInput.value.focus()
    }
  })
}

function addTagFromInput() {
  const tag = newTag.value.trim()
  const currentTags = props.editData.tags || []
  
  if (tag && !currentTags.includes(tag)) {
    const updatedData = {
      ...props.editData,
      tags: [...currentTags, tag]
    }
    
    emit('update:editData', updatedData)
    emit('data-changed')
  }
  
  newTag.value = ''
  showNewTagInput.value = false
}

function hideTagInput() {
  // Small delay to allow enter key to process first
  setTimeout(() => {
    if (newTag.value.trim()) {
      addTagFromInput()
    }
    showNewTagInput.value = false
    newTag.value = ''
  }, 150)
}

function removeTag(index) {
  const currentTags = props.editData.tags || []
  const updatedTags = currentTags.filter((_, i) => i !== index)
  
  const updatedData = {
    ...props.editData,
    tags: updatedTags
  }
  
  emit('update:editData', updatedData)
  emit('data-changed')
}
</script>

<style scoped>
/* Card styling */
.basic-info-card {
  background: white !important;
  border: 1px solid #e5e5e5 !important;
  border-radius: 0.375rem !important;
  padding: 1.5rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}



.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000000;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
}

.new-tag-input {
  min-width: 200px;
  max-width: 300px;
}

.new-tag-input :deep(.q-field__control) {
  background: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.375rem !important;
  color: #000000 !important;
}

.new-tag-input :deep(.q-field__control):before {
  border: none !important;
}

.new-tag-input :deep(.q-field__control):after {
  border: 2px solid #000000 !important;
  border-radius: 0.375rem !important;
}

.new-tag-input :deep(.q-field__label) {
  color: #374151 !important;
  font-weight: 500 !important;
}

.new-tag-input :deep(.q-field__native) {
  color: #000000 !important;
}
.custom-chip {
  border: 1px solid grey;
  background-color: #fefcfa;
  color:grey;
}

.add-btn {
  background: white !important;
  border: 1px solid #d1d5db !important;
  color: #000000 !important;
  border-radius: 0.375rem !important;
}

.add-btn:hover {
  background: #f9fafb !important;
  border-color: #000000 !important;
}
.no-tags-message {
  color: #7a7a7a;
  text-align: center;
  padding: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tag-container {
    flex-direction: column;
    align-items: stretch;
  }

  .new-tag-input {
    max-width: 100%;
  }
}
</style>