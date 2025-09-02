<template>
  <q-card flat bordered class="basic-info-card">
    <div class="section-header">
      <div class="section-title">Basic Information</div>
    </div>
        
    <q-form class="form-content">
      <q-input
        :model-value="editData.name"
        :disable="!canEdit"
        filled
        label="Company Name"
        class="styled-input"
        @update:model-value="updateField('name', $event)"
      />
      <q-input
        :model-value="editData.description"
        :disable="!canEdit"
        filled
        type="textarea"
        label="Description"
        class="styled-input"
        @update:model-value="updateField('description', $event)"
      />
      <q-select
        :model-value="editData.companySize"
        :disable="!canEdit"
        filled
        label="Company Size"
        :options="sizeOptions"
        class="styled-input"
        @update:model-value="updateField('companySize', $event)"
      />
      <q-select
        :model-value="editData.status"
        :disable="!canEdit"
        filled
        label="Status"
        :options="statusOptions"
        class="styled-input"
        @update:model-value="updateField('status', $event)"
      />
      <q-input
        :model-value="editData.CEO"
        :disable="!canEdit"
        filled
        label="CEO"
        class="styled-input"
        @update:model-value="updateField('CEO', $event)"
      />
      <q-input
        :model-value="editData.companyEmail"
        :disable="!canEdit"
        filled
        label="Company Email"
        class="styled-input"
        @update:model-value="updateField('companyEmail', $event)"
      />
    </q-form>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isGlobalEditable: Boolean,
  editData: Object,
  sizeOptions: Array,
  statusOptions: Array
})

const emit = defineEmits(['update:editData', 'data-changed'])

// Computed property to determine if fields can be edited
const canEdit = computed(() => props.isGlobalEditable)

// Handle field updates
function updateField(fieldName, value) {
  const updatedData = {
    ...props.editData,
    [fieldName]: value
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

.section-actions {
  display: flex;
  gap: 0.5rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.styled-input :deep(.q-field__control) {
  background: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.375rem !important;
  color: #1c1c1c !important;
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
</style>