<template>
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
import ProfileCard from 'src/components/RecruiterDashboard/First/ProfileCard.vue';

</script>

<style scoped>
.scrollable-panel {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}
</style>
