<template>
  <q-card flat bordered class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Sign In & Security</div>
    </q-card-section>

    <q-card-section>
      <q-input v-model="form.currentPassword" label="Current Password" type="password" filled />
      <q-input v-model="form.newPassword" label="New Password" type="password" filled class="q-mt-md" />
      <q-input
        v-model="form.confirmPassword"
        label="Confirm New Password"
        type="password"
        filled
        class="q-mt-md"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Update Password" color="primary" @click="updatePassword" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function updatePassword() {
  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }

  console.log('Updating password with:', form.value)
  // Call your backend API here
}
</script>
