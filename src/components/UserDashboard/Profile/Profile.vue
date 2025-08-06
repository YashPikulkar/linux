<template>
  <q-layout view="lHh Lpr lFf" class="dashboard-layout">
    <q-page class="flex flex-center no-gap">
      <q-card class="main-card blur-card">
        <TopSection v-model:tab="tab" />
        <Content v-if="tab === 'Details'" />
        <ApplicationStatus v-else-if="tab === 'Application Status'" />
        <Combine v-else-if="tab === 'Resume'" />
      </q-card>
    </q-page>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import TopSection from "./TopSection/TopSection.vue";
import Content from "./Details/Content.vue";
import Combine from "./Resume/Combine.vue";
import ApplicationStatus from "./ApplicationStatus/ApplicationStatus.vue";

const tab = ref("Details");
</script>
<style scoped>
.dashboard-layout {
  background: radial-gradient(
      circle at 30% 30%,
      rgba(220, 235, 245, 0.5),
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 70%,
      rgba(200, 220, 240, 0.4),
      transparent 60%
    ),
    linear-gradient(135deg, #f0f4f8, #e6ecf1);
  backdrop-filter: blur(8px);
  min-height: 100vh;
}

.main-card {
  width: 90vw;
  height: 100vh;
  background: transparent;
  padding: 16px;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 0 40px rgba(0, 153, 255, 0.1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

.blur-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px); /* Blur the background behind it */
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Optional light border */
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); /* Optional depth */
}

@media (max-width: 900px) {
  .main-card {
    height: auto;
    max-height: none;
    overflow: visible;
  }

  .q-page {
    overflow-y: auto;
  }
}
</style>
