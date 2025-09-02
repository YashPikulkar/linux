<template>
  <q-card flat bordered class="basic-info-card">
    <div class="section-header">
      <div class="section-title">Locations & Markets</div>
    </div>

    <q-form class="form-content">
      <!-- Location Multi-Select -->
      <q-select
        :model-value="editData.locationids || []"
        :disable="!canEdit"
        filled
        label="Company Locations"
        multiple
        use-chips
        emit-value
        map-options
        :options="locationOptions"
        class="styled-input"
        @update:model-value="updateField('locationids', $event)"
      />

      <!-- Market Multi-Select -->
      <q-select
        :model-value="editData.marketids || []"
        :disable="!canEdit"
        filled
        label="Markets"
        multiple
        use-chips
        emit-value
        map-options
        :options="marketOptions"
        class="styled-input"
        @update:model-value="updateField('marketids', $event)"
      />

      <!-- Company Type Multi-Select -->
      <q-select
        :model-value="editData.type || []"
        :disable="!canEdit"
        filled
        label="Company Type"
        multiple
        use-chips
        emit-value
        map-options
        :options="companyTypeOptions"
        class="styled-input"
        @update:model-value="updateField('type', $event)"
      />
    </q-form>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isGlobalEditable: Boolean,
  editData: Object,
  locationOptions: Array,
  marketOptions: Array,
  companyTypeOptions: Array,
})

const emit = defineEmits(['update:editData', 'data-changed'])

// Computed property to determine if fields can be edited
const canEdit = computed(() => props.isGlobalEditable)

// Handle field updates
function updateField(fieldName, value) {
  const updatedData = {
    ...props.editData,
    [fieldName]: [...(value || [])],
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
  min-height: 0; /* allow children to shrink */
}

.section-header {
  flex-shrink: 0; /* don’t let header steal form space */
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

/* Make form stretch and inputs fill equally */
.form-content {
  flex: 1;                /* take remaining card height */
  display: flex;
  flex-direction: column;
  gap: 1rem;              /* vertical spacing */
  min-height: 0;
}

/* Equal split for all inputs */
.form-content > .styled-input,
.form-field {
  flex: 1;                /* each input gets equal height */
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Q-Field grows to fill wrapper */
.styled-input :deep(.q-field) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Control fills available height */
.styled-input :deep(.q-field__control) {
  flex: 1;
  display: flex;
  align-items: center;
  background: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.375rem !important;
  color: #1c1c1c !important;
  min-height: 0;
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

/* Multi-select chip styling */
.styled-input :deep(.q-chip) {
  background-color: #e5e7eb !important;
  color: #7a7a7a !important;
}

.styled-input :deep(.q-chip--selected) {
  background-color: copper !important;
  color: white !important;
}
</style>
