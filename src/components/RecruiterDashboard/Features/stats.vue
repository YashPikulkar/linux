<template>
  <div class="form-wrapper">
    <q-card class="post-job-card">
      <div class="form-header">Recent Activity</div>

      <div class="activity-list">
        <div
          class="activity-item"
          v-for="(activity, index) in activities"
          :key="index"
        >
          <q-icon :name="activity.icon" color="primary" class="q-mr-sm" />
          <div class="activity-text">{{ activity.text }}</div>
          <div class="timestamp">{{ activity.time }}</div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activities = ref([
  { icon: 'work', text: 'You posted a job for UI Designer', time: '2 hours ago' },
  { icon: 'email', text: 'Sent email to shortlisted candidates', time: '1 day ago' },
  { icon: 'check_circle', text: 'Closed position: Backend Developer', time: '3 days ago' },
  { icon: 'update', text: 'Updated company profile', time: '5 days ago' }
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

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.activity-text {
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
