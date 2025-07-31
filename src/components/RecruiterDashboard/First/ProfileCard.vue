<template>
    <q-card class="sidebar-card q-pa-md bg-white text-black" flat bordered>
      <q-card-section class="q-pa-none text-center">
        <!-- Avatar Upload -->
        <q-avatar
          size="120px"
          class="q-mt-md q-mb-sm cursor-pointer"
          @click="triggerUpload"
        >
          <img :src="avatarPreview || avatar || 'https://cdn.quasar.dev/img/avatar.png'" alt="Recruiter Avatar" />
        </q-avatar>
        <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" />
      </q-card-section>
  
      <q-separator spaced />
  
      <q-card-section>
        <div class="text-h6 text-weight-bold text-center">
          {{ fullName }}
        </div>
        <div class="text-caption text-center text-grey-7">
          {{ companyName }}
        </div>
  
        <div class="q-mt-md q-gutter-sm">
          <q-item dense>
            <q-item-section avatar>
              <q-icon name="phone" color="primary" />
            </q-item-section>
            <q-item-section>{{ phone }}</q-item-section>
          </q-item>
  
          <q-item dense>
            <q-item-section avatar>
              <q-icon name="email" color="primary" />
            </q-item-section>
            <q-item-section>{{ email }}</q-item-section>
          </q-item>
        </div>
      </q-card-section>
  
      <q-card-actions vertical class="q-mt-md">
        <q-btn label="Edit Profile" color="primary" flat class="full-width" />
      </q-card-actions>
    </q-card>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Static data (replace with props or API data if needed)
  const fullName = ref('John Recruiter')
  const email = ref('john.recruiter@example.com')
  const phone = ref('+91 98765 43210')
  const companyName = ref('TechCorp Solutions')
  const avatar = ref('')
  
  // Avatar preview
  const avatarPreview = ref(null)
  const fileInput = ref(null)
  
  function triggerUpload() {
    fileInput.value.click()
  }
  
  function handleFileChange(event) {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        avatarPreview.value = reader.result
      }
      reader.readAsDataURL(file)
    }
  }
  </script>
  
  <style scoped>
  .sidebar-card {
    width: 100%;
    max-width: 100%;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  }
  .hidden {
    display: none;
  }
  </style>
  