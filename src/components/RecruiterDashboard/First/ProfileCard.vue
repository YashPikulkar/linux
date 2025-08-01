<template>
  <q-card class="sidebar-card q-pa-md bg-white text-black" flat bordered>
    <!-- Avatar from Store -->
    <q-card-section class="q-pa-none text-center">
      <q-avatar size="120px" class="q-mt-md q-mb-sm">
        <img :src="companyProfile.logoUrl || fallbackImage" alt="Company Logo" />
      </q-avatar>
    </q-card-section>

    <q-separator spaced />

    <q-card-section>
      <div class="text-h6 text-weight-bold text-center">
        {{ companyProfile.name || 'Company Name' }}
      </div>
      <div class="text-caption text-center text-grey-7">
        {{ companyProfile.companyType || 'Company Type' }}
      </div>

      <div class="q-mt-md q-gutter-sm">
        <q-item dense>
          <q-item-section avatar>
            <q-icon name="phone" color="primary" />
          </q-item-section>
          <q-item-section>{{ companyProfile.phone || 'N/A' }}</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section avatar>
            <q-icon name="email" color="primary" />
          </q-item-section>
          <q-item-section>{{ companyProfile.email || 'N/A' }}</q-item-section>
        </q-item>
      </div>
    </q-card-section>

    <q-card-actions vertical class="q-mt-md">
      <q-btn label="Edit Profile" color="primary" flat class="full-width" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useRecruiterStore } from 'src/stores/recruiterStore'
import { storeToRefs } from 'pinia'

// 💡 Get reactive access to the company profile
const { companyProfile } = storeToRefs(useRecruiterStore())

// 💡 Optional fallback image in case store.logoUrl is empty
const fallbackImage = 'https://cdn.quasar.dev/img/avatar.png'
</script>

<style scoped>
.sidebar-card {
  width: 100%;
  max-width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}
</style>
