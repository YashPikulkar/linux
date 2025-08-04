<template>
  <div class="settings-container q-pa-md">
    <!-- Toggle Tabs -->
    <div class="q-mb-lg row justify-center">
      <q-btn
        :color="activeTab === 'account' ? 'primary' : 'grey-4'"
        text-color="black"
        label="Account Preferences"
        @click="activeTab = 'account'"
        class="q-mr-sm"
        flat
      />
      <q-btn
        :color="activeTab === 'security' ? 'primary' : 'grey-4'"
        text-color="black"
        label="Sign-In & Security"
        @click="activeTab = 'security'"
        flat
      />
    </div>

    <!-- Account Preferences Section -->
    <q-card
      v-if="activeTab === 'account'"
      class="q-pa-md"
      flat
      bordered
    >
      <q-card-section>
        <div class="text-h6">Account Preferences</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="form.name"
          label="Full Name"
          filled
          class="q-mb-md"
        />
        <q-input
          v-model="form.email"
          label="Email"
          filled
          class="q-mb-md"
        />
        <q-input
          v-model="form.phone"
          label="Phone Number"
          filled
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save Changes" color="primary" @click="updateProfile" />
      </q-card-actions>
    </q-card>

    <!-- Sign-In & Security Section -->
    <q-card
      v-if="activeTab === 'security'"
      class="q-pa-md"
      flat
      bordered
    >
      <q-card-section>
        <div class="text-h6">Sign-In & Security</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="form.currentPassword"
          label="Current Password"
          type="password"
          filled
          class="q-mb-md"
        />
        <q-input
          v-model="form.newPassword"
          label="New Password"
          type="password"
          filled
          class="q-mb-md"
        />
        <q-input
          v-model="form.confirmPassword"
          label="Confirm New Password"
          type="password"
          filled
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Update Password" color="primary" @click="updatePassword" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRecruiterStore } from 'src/stores/recruiterStore'

const $q = useQuasar()
const recruiterStore = useRecruiterStore()

// Profile state from store
const profile = computed(() => recruiterStore.companyProfile)

// Toggle between sections
const activeTab = ref('account')

// Form state
const form = ref({
  name: profile.value.name,
  email: profile.value.email,
  phone: profile.value.phone,
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Update basic info
function updateProfile() {
  if (!form.value.name || !form.value.email || !form.value.phone) {
    $q.notify({ type: 'negative', message: 'Please fill all fields.' })
    return
  }

  recruiterStore.setCompanyProfile({
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone
  })

  $q.notify({ type: 'positive', message: 'Profile updated successfully.' })
}

// Update password
function updatePassword() {
  const storedPassword = profile.value.password

  if (
    !form.value.currentPassword ||
    !form.value.newPassword ||
    !form.value.confirmPassword
  ) {
    $q.notify({ type: 'negative', message: 'All fields are required.' })
    return
  }

  if (form.value.currentPassword !== storedPassword) {
    $q.notify({ type: 'negative', message: 'Current password is incorrect.' })
    return
  }

  if (form.value.newPassword.length < 6) {
    $q.notify({
      type: 'warning',
      message: 'New password must be at least 6 characters.'
    })
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    $q.notify({ type: 'negative', message: 'Passwords do not match.' })
    return
  }

  recruiterStore.setCompanyProfile({ password: form.value.newPassword })

  $q.notify({ type: 'positive', message: 'Password updated successfully.' })

  // Reset fields
  form.value.currentPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
}
</script>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
