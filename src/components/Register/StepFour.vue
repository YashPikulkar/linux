<template>
    <div class="q-gutter-md" style="width: 100%;">
      <div class="text-subtitle1 text-primary">Review and Confirm</div>
  
      <q-markup-table flat bordered class="rounded-borders q-mt-md">
        <thead>
          <tr>
            <th class="text-left">Field</th>
            <th class="text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Full Name</strong></td>
            <td>{{ modelValue.firstName }}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>{{ modelValue.email }}</td>
          </tr>
          <tr>
            <td><strong>Phone</strong></td>
            <td>{{ modelValue.phone }}</td>
          </tr>
          <tr>
            <td><strong>Role</strong></td>
            <td>{{ modelValue.role }}</td>
          </tr>
          <tr>
            <td><strong>Password</strong></td>
            <td class="row items-center">
              <span class="col">
                {{ showPassword ? modelValue.password : '*'.repeat(modelValue.password?.length || 8) }}
              </span>
              <q-btn
                flat
                dense
                size="sm"
                :icon="showPassword ? 'visibility_off' : 'visibility'"
                @click="showPassword = !showPassword"
                class="q-ml-sm"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
  
      <div class="row justify-between q-mt-md">
        <q-btn flat label="Back" @click="emit('prev')" />
        <q-btn color="primary" label="Confirm & Proceed" @click="emit('submit')" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const modelValue = defineModel()
  const emit = defineEmits(['prev', 'submit'])
  
  const showPassword = ref(false)
  </script>