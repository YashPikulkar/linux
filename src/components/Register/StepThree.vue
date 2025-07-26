<template>
    <q-form @submit.prevent="handleNext" class="q-gutter-md" style="width: 100%;">
      <div class="text-subtitle1 text-primary">Select Your Role</div>
  
      <q-select
        filled
        v-model="modelValue.role"
        :options="roleOptions"
        label="Choose your role"
        :rules="[isRequired]"
        ref="roleSelectRef"
        emit-value
        map-options
        @keyup.native="handleKeyup"
      />
  
      <div class="row justify-between q-mt-md">
        <q-btn flat label="Back" @click="emit('prev')" />
        <q-btn color="primary" label="Next" type="submit" />
      </div>
    </q-form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useQuasar } from 'quasar'
  
  const $q = useQuasar()
  const emit = defineEmits(['next', 'prev'])
  const modelValue = defineModel()
  
  const roleSelectRef = ref(null)
  
  const isRequired = val => !!val || 'Role is required'
  
  const roleOptions = [
    { label: 'Candidate', value: 'candidate' },
    { label: 'Recruiter', value: 'recruiter' }
  ]
  
  // Manually validate before proceeding
  const handleNext = async () => {
    const valid = await roleSelectRef.value.validate()
    if (valid) {
      emit('next')
    } else {
      $q.notify({
        type: 'negative',
        message: 'Please select a role to continue.',
        position: 'top'
      })
    }
  }
  
  // Optional: handle Enter key for accessibility
  const handleKeyup = (event) => {
    if (event.key === 'Enter') {
      handleNext()
    }
  }
  </script>