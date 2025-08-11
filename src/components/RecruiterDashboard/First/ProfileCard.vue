<template>
  <q-card class="profile-card q-pa-lg" flat>
    <!-- Edit Icon in Top Corner -->
    <q-btn
      icon="edit"
      class="edit-icon-btn"
      flat
      round
      size="sm"
    >
      <q-tooltip class="text-caption">Edit Profile</q-tooltip>
    </q-btn>
    <q-card-section class="q-pa-none text-center">
      <!-- Avatar Upload Section -->
      <div class="avatar-container q-mb-lg" @click="triggerUpload">
        <q-avatar
          size="140px"
          class="avatar-main cursor-pointer"
        >
          <img 
            :src="avatarPreview || avatar || 'https://cdn.quasar.dev/img/avatar.png'" 
            alt="Profile Avatar"
            class="avatar-image"
          />
          <div class="avatar-overlay">
            <q-icon name="camera_alt" size="24px" color="white" />
          </div>
        </q-avatar>
        <input 
          type="file" 
          ref="fileInput" 
          class="hidden" 
          @change="handleFileChange" 
          accept="image/*"
        />
      </div>

      <!-- Profile Info -->
      <div class="profile-info">
        <h3 class="profile-name">{{ fullName }}</h3>
        <p class="profile-company">{{ companyName }}</p>
      </div>
    </q-card-section>

    <q-separator class="q-my-lg" color="grey-3" />

    <!-- Contact Information -->
    <q-card-section class="q-pa-none">
      <div class="contact-section">
        <div class="contact-item" v-if="phone !== 'Phone not available'">
          <div class="contact-icon-wrapper">
            <q-icon name="phone" class="contact-icon" />
          </div>
          <div class="contact-details">
            <span class="contact-label">Phone</span>
            <span class="contact-value">{{ phone }}</span>
          </div>
        </div>

        <div class="contact-item" v-if="email !== 'Email not available'">
          <div class="contact-icon-wrapper">
            <q-icon name="email" class="contact-icon" />
          </div>
          <div class="contact-details">
            <span class="contact-label">Email</span>
            <span class="contact-value">{{ email }}</span>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Edit Icon in Top Corner -->
    <q-btn
      icon="edit"
      class="edit-icon-btn"
      flat
      round
      size="sm"
    >
      <q-tooltip class="text-caption">Edit Profile</q-tooltip>
    </q-btn>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from 'src/stores/user-store'

const userStore = useUserStore()

const avatarPreview = ref(null)
const fileInput = ref(null)

// Bind user info from Pinia store dynamically
const fullName = computed(() => userStore.user?.name || 'Recruiter Name')
const email = computed(() => userStore.user?.email || 'Email not available')
const phone = computed(() => userStore.user?.phone || 'Phone not available')
const companyName = computed(() => userStore.user?.company?.companyName || 'Company Name')
const avatar = computed(() => userStore.user?.avatar || '')

// Avatar Upload Logic
function triggerUpload() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => {
      avatarPreview.value = reader.result
      // Optional: Upload avatar to server & update store
    }
    reader.readAsDataURL(file)
  }
}

// Optional: Fetch user from token if not already present
onMounted(() => {
  if (!userStore.user) {
    userStore.fetchUserFromToken?.()
  }
})
</script>

<style scoped>
.profile-card {
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8, #1e40af);
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 25px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Avatar Styling */
.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-main {
  border: 4px solid #ffffff;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(148, 163, 184, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.avatar-main:hover {
  transform: scale(1.05);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(148, 163, 184, 0.2);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}

.avatar-main:hover .avatar-overlay {
  opacity: 1;
}

/* Profile Information */
.profile-info {
  margin-bottom: 8px;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.profile-company {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Contact Section */
.contact-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.2s ease;
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: #cbd5e1;
  transform: translateX(2px);
}

.contact-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon {
  color: white;
  font-size: 18px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: left;
}

.contact-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.contact-value {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  word-break: break-all;
}

/* Edit Icon */
.edit-icon-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  color: #64748b;
  transition: all 0.3s ease;
  z-index: 10;
}

.edit-icon-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.2);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Utilities */
.hidden {
  display: none;
}

/* Responsive Design */
@media (max-width: 480px) {
  .profile-card {
    border-radius: 16px;
    margin: 8px;
  }
  
  .avatar-main {
    width: 120px;
    height: 120px;
  }
  
  .profile-name {
    font-size: 20px;
  }
  
  .contact-item {
    padding: 10px 12px;
  }
}

/* Subtle Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-card {
  animation: fadeIn 0.6s ease-out;
}

/* Dark Mode Support */
.body--dark .profile-card {
  background: linear-gradient(145deg, #1e293b 0%, #334155 100%);
  border-color: #475569;
}

.body--dark .edit-icon-btn {
  background: rgba(51, 65, 85, 0.9);
  border-color: rgba(71, 85, 105, 0.6);
  color: #94a3b8;
}

.body--dark .edit-icon-btn:hover {
  background: rgba(51, 65, 85, 1);
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.2);
}

.body--dark .profile-name {
  color: #f1f5f9;
}

.body--dark .profile-company {
  color: #94a3b8;
}

.body--dark .contact-item {
  background: rgba(51, 65, 85, 0.6);
  border-color: rgba(71, 85, 105, 0.8);
}

.body--dark .contact-item:hover {
  background: rgba(51, 65, 85, 0.8);
  border-color: #64748b;
}

.body--dark .contact-label {
  color: #94a3b8;
}

.body--dark .contact-value {
  color: #e2e8f0;
}
</style>