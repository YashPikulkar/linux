<template>
  <q-card flat bordered class="basic-info-card">
    <div class="section-header">
      <div class="section-title">Links</div>
      <q-btn 
        v-if="canEdit"
        flat dense round icon="add"
        class="add-btn"
        @click="addLink"
      />
    </div>
    
    <div class="links-container">
      <div 
        v-for="(link, index) in (editData.links || [])"
        :key="'link-' + index"
        class="dynamic-item"
      >
        <q-input
          :model-value="link"
          :disable="!canEdit"
          filled
          placeholder="https://company.com"
          class="styled-input dynamic-input"
          @update:model-value="updateLink(index, $event)"
        />
        <q-btn
          v-if="canEdit"
          flat
          dense
          round
          icon="remove"
          class="remove-btn"
          @click="removeLink(index)"
        />
      </div>
      
      <!-- Show message when no links -->
      <div v-if="(!editData.links || editData.links.length === 0) && !canEdit" class="no-links-message">
        No links added yet
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isGlobalEditable: Boolean,
  editData: Object
})

const emit = defineEmits(['update:editData', 'data-changed'])

const canEdit = computed(() => props.isGlobalEditable)

function addLink() {
  const currentLinks = props.editData.links || []
  const updatedData = {
    ...props.editData,
    links: [...currentLinks, '']
  }
  
  emit('update:editData', updatedData)
  emit('data-changed')
}

function removeLink(index) {
  const currentLinks = props.editData.links || []
  const updatedLinks = currentLinks.filter((_, i) => i !== index)
  const updatedData = {
    ...props.editData,
    links: updatedLinks
  }
  
  emit('update:editData', updatedData)
  emit('data-changed')
}

function updateLink(index, value) {
  const currentLinks = [...(props.editData.links || [])]
  currentLinks[index] = value
  
  const updatedData = {
    ...props.editData,
    links: currentLinks
  }
  
  emit('update:editData', updatedData)
  emit('data-changed')
}
</script>

<style scoped>
.basic-info-card {
  background: white !important;
  border: 1px solid #e5e5e5 !important;
  border-radius: 0.375rem !important;
  padding: 1.5rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
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
  color: #1c1c1c;
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dynamic-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.dynamic-input {
  flex: 1;
}

.no-links-message {
  color: #7a7a7a;
  text-align: center;
  padding: 1rem;
}

.styled-input :deep(.q-field__control) {
  background: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.375rem !important;
  color: #000000 !important;
}

.styled-input :deep(.q-field__control):before {
  border: none !important;
}

.styled-input :deep(.q-field__control):after {
  border: 2px solid #1c1c1c !important;
  border-radius: 0.375rem !important;
}

.styled-input :deep(.q-field__label) {
  color: #7a7a7a !important;
  font-weight: 500 !important;
}

.styled-input :deep(.q-field__native) {
  color: #1c1c1c !important;
}

.styled-input :deep(.q-field--disabled) {
  opacity: 0.7 !important;
}

.styled-input :deep(.q-field--disabled .q-field__control) {
  background: #f9fafb !important;
  color: #7a7a7a !important;
}

.add-btn {
  background: white !important;
  border: 1px solid #d1d5db !important;
  color: #1c1c1c !important;
  border-radius: 0.375rem !important;
}

.add-btn:hover {
  background: #f9fafb !important;
  border-color: #1c1c1c !important;
}

.remove-btn {
  background: white !important;
  border: 1px solid #ef4444 !important;
  color: #ef4444 !important;
  border-radius: 0.375rem !important;
  min-width: 36px;
}

.remove-btn:hover {
  background: #ef4444 !important;
  color: white !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dynamic-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .remove-btn {
    align-self: flex-end;
    width: 40px;
  }
}
</style>