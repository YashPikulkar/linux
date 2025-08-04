<template>
  <div class="form-wrapper">
    <q-card class="post-job-card">
      <div class="form-header">Notifications</div>

      <div class="notification-list">
        <div
          class="notification-item"
          v-for="(notification, index) in notifications"
          :key="index"
        >
          <q-icon :name="notification.icon" color="primary" class="q-mr-sm" />
          <div class="notification-text">{{ notification.text }}</div>
          <div class="timestamp">{{ notification.time }}</div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const notifications = ref([
  { icon: 'notifications', text: 'New applicant for Frontend Developer role', time: 'Just now' },
  { icon: 'event', text: 'Interview scheduled with Jane Doe', time: '3 hours ago' },
  { icon: 'done', text: 'Job listing approved by admin', time: 'Yesterday' },
  { icon: 'info', text: 'System maintenance scheduled for Sunday', time: '2 days ago' }
])
</script>

<style scoped>
.form-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  min-height: 0;
}

.post-job-card {
  width: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 16px;
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}

.form-header {
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: -12px;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.notification-text {
  flex: 1;
  font-size: 15px;
  color: #555;
}

.timestamp {
  font-size: 13px;
  color: #999;
  margin-left: 16px;
}
</style>
