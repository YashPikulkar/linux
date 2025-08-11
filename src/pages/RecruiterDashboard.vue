<template>
  <div class="layout-wrapper row q-pa-md">
    <!-- Left Sidebar -->
    <div class="profile-col">
      <ProfileCard />
      
    </div>

    <!-- Right Scrollable Panel -->
    <div class="content-col column scrollable-panel">
      <router-view class="fit" />
    </div>
  </div>
</template>

<script setup>
import ProfileCard from 'src/components/RecruiterDashboard/First/ProfileCard.vue'
import RecentActCard from 'src/components/RecruiterDashboard/First/RecentActCard.vue'
</script>

<style scoped>
.layout-wrapper {
  margin-top: 64px;
  height: calc(100vh - 64px);
  flex-wrap: nowrap;
  width: 100%;
  box-sizing: border-box;
}

.profile-col {
  flex: 0 1 auto; /* Size based on content but allow shrink if needed */
  width: fit-content; /* Adjust to content width */
  max-width: 100%; /* Never overflow parent */
  display: flex;
  flex-direction: column;
  gap: 16px; /* Keeps space between cards */
}






/* RIGHT COLUMN (Main Content) */
.content-col {
  flex: 1;
  margin-left: 16px;
  overflow-y: auto;
  padding-right: 4px;
  height: 100%;
  min-width: 0; /* ✅ Prevent overflow in flex layout */
}

/* Responsive layout for small screens */
@media (max-width: 768px) {
  .layout-wrapper {
    flex-direction: column;
    height: auto;
  }

  .profile-col {
    width: 100%;
    margin-bottom: 16px;
  }

  .content-col {
    margin-left: 0;
    height: auto;
    max-height: none;
  }

}
/* Scrollable panel for the right column
.scrollable-panel {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}*/
/* For mobile: force full width so it doesn't look cramped */
@media (max-width: 768px) {
  .profile-col {
    width: 100%;
  }
}
</style>
