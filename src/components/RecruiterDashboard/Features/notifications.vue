<template>
  <div class="dashboard-notifications">
    <h2>Recruiter Notifications</h2>

    <q-card
      v-for="(notification, index) in notifications"
      :key="index"
      class="q-mb-md"
    >
      <q-card-section>
        <div class="text-h6">{{ notification.title }}</div>
        <div class="text-subtitle2">{{ notification.timestamp }}</div>
        <div class="q-mt-sm">{{ notification.message }}</div>
      </q-card-section>
    </q-card>

    <div v-if="notifications.length === 0" class="text-grey text-center q-mt-md">
      No new notifications at the moment.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRecruiterNotificationStore } from 'src/stores/RecruiterNotificationStore'

const recruiterNotificationStore = useRecruiterNotificationStore()

const notifications = computed(() => {
  return  recruiterNotificationStore.notifications
})
</script>



<style scoped lang="scss">
.dashboard-notifications {
  padding: 24px;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.q-card {
  border-radius: 12px;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.05),
    0 8px 16px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;
  background-color: #ffffff;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 12px rgba(0, 0, 0, 0.08),
      0 10px 20px rgba(0, 0, 0, 0.05);
  }
}

.q-card-section {
  padding: 16px;
}

.text-h6 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.text-subtitle2 {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

.q-mt-sm {
  margin-top: 12px;
  font-size: 1rem;
  color: #374151;
}

.text-grey {
  color: #9ca3af;
}

.text-center {
  text-align: center;
}

.q-mt-md {
  margin-top: 24px;
}

/* Responsive spacing for mobile */
@media (max-width: 768px) {
  .dashboard-notifications {
    padding: 16px;
  }

  .q-card-section {
    padding: 12px;
  }

  h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
}
</style>
