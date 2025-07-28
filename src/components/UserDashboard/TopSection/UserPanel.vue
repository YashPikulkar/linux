<template>
  <div class="user-panel row no-wrap items-center">
    <!-- Avatar with Upload Trigger -->
    <q-avatar size="74px" class="avatar-box q-mr-md clickable" @click="triggerUpload">
      <img :src="avatarPreview || avatar" alt="User Avatar" width="100" />
    </q-avatar>
    <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none" />

    <!-- Main Info -->
    <div class="main-info column justify-center">
      <div class="user-name">{{ fullName }}</div>
      <div class="user-skills-placeholder">Add your skills here (e.g. Vue, Node.js, Design)</div>
    </div>

    <!-- Spacer -->
    <q-space />

    <!-- Detail Fields & Vertical Separator -->
    <div class="detail-info row no-wrap items-center">
      <!-- Info Column -->
      <div class="info-col row q-pr-xl">
  <div class="info-block q-mr-xl">
    <div class="label">Phone Number:</div>
    <div class="value strong">{{ phone }}</div>
  </div>
  <div class="info-block q-mr-xl">
    <div class="label">Email:</div>
    <div class="value email">{{ email }}</div>
  </div>
  <div class="info-block">
    <div class="label">Role:</div>
    <div class="value">{{ role }}</div>
  </div>
</div>

      <!-- Vertical Separator -->
      <div class="vertical-separator q-mx-md"></div>

      <!-- Premium Button -->
      <q-btn label="Premium" class="premium-btn" unelevated flat rounded />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from 'src/stores/UserStore'

const userStore = useUserStore()
const { fullName, phone, email, role, avatar } = userStore.register

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
      // Optional: uploadAvatarToBackend(file)
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.user-panel {
  width: 100%;
  border-radius: 16px;
  min-height: 94px;
  padding: 16px 24px;
  font-size: 15px;
  align-items: center;
  transition: box-shadow 0.3s ease;

  background: rgba(255, 255, 255, 0.1); /* semi-transparent */
  backdrop-filter: blur(10px);         /* frosted glass effect */
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2); /* subtle border */
}


.user-panel:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.08);
}

.avatar-box {
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}

.avatar-box.clickable {
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-box.clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.main-info .user-name {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
}

.user-skills-placeholder {
  font-size: 13px;
  font-style: italic;
  color: #94a3b8;
  margin-top: 4px;
}

.detail-info {
  font-size: 15px;
  color: #2d3748;
  align-items: center;
}

.info-col {
  display: flex;
  flex-direction: row; /* horizontal */
  gap: 24px;
}

.info-block {
  display: flex;
  flex-direction: column;
}


.label {
  font-size: 13px;
  color: #94a3b8;
}

.value {
  font-size: 15px;
  color: #232c47;
  margin-top: 2px;
}

.value.strong {
  font-weight: 600;
  color: #242d53;
}

.value.email {
  color: #2382fa;
  word-break: break-word;
}

.premium-btn {
  border: 1px solid gold;
  color: gold;
  padding: 6px 18px;
  font-weight: 600;
  font-size: 14px;
  background-color: transparent;
  box-shadow: 0 2px 6px rgba(218, 165, 32, 0.3);
  transition: transform 0.2s ease;
}

.premium-btn:hover {
  transform: scale(1.05);
}

.vertical-separator {
  height: 48px;
  width: 1px;
  background-color: #e0e0e0;
}

@media (max-width: 900px) {
  .user-panel {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }

  .main-info {
    margin-bottom: 6px;
  }

  .detail-info {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 8px;
  }

  .vertical-separator {
    display: none;
  }

  .premium-btn {
    margin-top: 12px;
  }
}
</style>
