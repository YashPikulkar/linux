<template>
  <q-card flat bordered class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Sign In & Security</div>
    </q-card-section>

    <q-card-section>
      <q-input
        v-model="form.currentPassword"
        label="Current Password"
        type="password"
        filled
        color="primary"
        class="q-mb-md"
      />

      <q-input
        v-model="form.newPassword"
        label="New Password"
        type="password"
        filled
        color="primary"
        class="q-mb-md"
      />

      <q-input
        v-model="form.confirmPassword"
        label="Confirm New Password"
        type="password"
        filled
        color="primary"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        label="Update Password"
        class="primary-btn"
        color="primary"
        @click="updatePassword"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRecruiterStore } from 'src/stores/recruiterStore'

const $q = useQuasar()
const recruiterStore = useRecruiterStore()

// Access data from nested recruiter object
const recruiter = computed(() => recruiterStore.recruiter)
const fullName = computed(() => recruiter.value.fullName)
const password = computed(() => recruiter.value.password)

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function updatePassword() {
  if (!form.value.currentPassword || !form.value.newPassword || !form.value.confirmPassword) {
    $q.notify({
      type: 'negative',
      message: 'All fields are required.'
    })
    return
  }

  if (form.value.currentPassword !== password.value) {
    $q.notify({
      type: 'negative',
      message: 'Current password is incorrect.'
    })
    return
  }

  if (form.value.newPassword.length < 6) {
    $q.notify({
      type: 'warning',
      message: 'New password must be at least 6 characters long.'
    })
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    $q.notify({
      type: 'negative',
      message: 'New passwords do not match.'
    })
    return
  }

  // Update password in store
  recruiterStore.updatePassword(form.value.newPassword)

  $q.notify({
    type: 'positive',
    message: `Password successfully updated for ${fullName.value}`
  })

  // Clear form
  form.value.currentPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
}
</script>

<style scoped>
.primary-btn {
  background-color: #027be3;
  color: white;
}
</style>
