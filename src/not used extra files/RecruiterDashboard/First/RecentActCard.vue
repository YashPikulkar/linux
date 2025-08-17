<template>
  <q-card class="profile-card q-pa-lg" flat>
    <!-- Header -->
    <div class="sidebar-header">
      <span class="sidebar-title">Recent Activity</span>
      <q-btn
        flat
        round
        icon="refresh"
        size="sm"
        color="primary"
        @click="refreshActivities"
        class="refresh-btn"
      >
        <q-tooltip class="text-caption">Refresh activities</q-tooltip>
      </q-btn>
    </div>

    <div class="sidebar-body">
      <q-scroll-area
        v-if="activities.length > 0"
        :style="scrollAreaStyle"
        class="activity-scroll"
      >
        <div
          class="activity-item"
          v-for="(activity, index) in displayedActivities"
          :key="index"
        >
          <div class="activity-icon-wrapper">
            <q-icon
              :name="activity.icon"
              class="activity-icon"
            />
          </div>
          <div class="activity-content">
            <span class="activity-text">{{ activity.text }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </q-scroll-area>

      <!-- Empty state -->
      <div v-else class="sidebar-empty">
        <q-icon name="inbox" size="36px" color="grey-5" />
        <div class="sidebar-empty-text">No recent activity</div>
        <div class="sidebar-empty-subtext">
          Your recent actions will appear here
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  maxActivities: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['activity-refresh'])

const activities = ref([
  { icon: 'work', text: 'You posted a job for UI Designer', time: '2 hours ago' },
  { icon: 'email', text: 'Sent email to shortlisted candidates', time: '1 day ago' },
  { icon: 'check_circle', text: 'Closed position: Backend Developer', time: '3 days ago' },
  { icon: 'update', text: 'Updated company profile', time: '5 days ago' },
  { icon: 'person_add', text: 'New candidate applied for Frontend Developer', time: '1 week ago' }
])

const displayedActivities = computed(() =>
  activities.value.slice(0, props.maxActivities)
)

const rowHeight = 56
const scrollAreaStyle = computed(() => {
  const count = displayedActivities.value.length
  const height = Math.min(count * rowHeight, 400)
  return `height: ${height}px; max-height: 60vh;`
})

const refreshActivities = () => {
  emit('activity-refresh')
}
</script>

<style scoped>
/* Card Base Styling */
.profile-card {
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
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

/* Header */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 0;
  margin-bottom: 12px;
}

.sidebar-title {
  color: #1e293b;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(59, 130, 246, 0.2);
}

/* Activities */
.activity-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  margin-bottom: 10px;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(2px);
}

.activity-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon {
  color: white;
  font-size: 18px;
}

.activity-content {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
}

.activity-text {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  font-size: 11px;
  color: #64748b;
}

/* Empty State */
.sidebar-empty {
  text-align: center;
  padding: 40px 0;
  color: #aaa;
}

.sidebar-empty-text {
  font-size: 14px;
  margin-top: 10px;
  font-weight: 500;
}

.sidebar-empty-subtext {
  font-size: 12px;
  color: #bbb;
  margin-top: 4px;
}

/* Dark Mode */
.body--dark .profile-card {
  background: linear-gradient(145deg, #1e293b 0%, #334155 100%);
  border-color: #475569;
}

.body--dark .activity-item {
  background: rgba(51, 65, 85, 0.6);
  border-color: rgba(71, 85, 105, 0.8);
}

.body--dark .activity-item:hover {
  background: rgba(51, 65, 85, 0.8);
}

.body--dark .activity-text {
  color: #e2e8f0;
}

.body--dark .activity-time {
  color: #94a3b8;
}

.body--dark .sidebar-title {
  color: #f1f5f9;
}
</style>
