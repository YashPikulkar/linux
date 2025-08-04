<template>
  <!-- Layout Row -->
  <div class="row q-pa-md" style="margin-top: 64px; height: calc(100vh - 64px); overflow: hidden;">
    
    <!-- Left Sidebar -->
    <div class="col-auto" style="width: 300px;">
      <ProfileCard />
    </div>

    <!-- Right Scrollable Panel -->
    <div class="col q-ml-md column scrollable-panel">
      <router-view class="fit" />
    </div>
    
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ProfileCard from 'src/components/UserDashboard/First/ProfileCard.vue';

const route = useRoute();
const isProfileRoute = computed(() => route.path === '/userdashboard/profile');
</script>

<style scoped>
.scrollable-panel {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px; /* optional: better for scrollbar spacing */
}
</style>
