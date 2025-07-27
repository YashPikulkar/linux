<template>
  <div class="dashboard-notifications">
    <h2>My Notifications</h2>

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
      You have no notifications at this time.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from 'src/stores/UserStore.js'

const userStore = useUserStore()
const notifications = ref([])

function loadUserNotifications() {
  const user = userStore.currentUser

  if (!user) return

  if (user.role === 'user') {
    notifications.value = [
      {
        title: 'New Job Posted',
        message: `Hi ${user.name}, a new job matching your profile has just been posted.`,
        timestamp: 'Just now',
      },
      {
        title: 'Application Update',
        message: `Your application for Frontend Developer is now under review.`,
        timestamp: '2 hours ago',
      },
      {
        title: 'Profile Reminder',
        message: `Complete your profile, ${user.name}, to get better job matches.`,
        timestamp: 'Yesterday',
      },
    ]
  } else {
    notifications.value = []
  }
}

onMounted(() => {
  loadUserNotifications()
})
</script>

<style scoped>
.dashboard-notifications {
  padding: 20px;
}

.text-h6 {
  font-weight: bold;
}
</style>
