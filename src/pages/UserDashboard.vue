<template>
  <q-layout view="lHh Lpr lFf" class="dashboard-layout">
    <q-page class="flex flex-center">
      <q-card class="main-card">
        <!-- ✅ Top Section with v-model to sync tab -->
        <TopSection v-model:tab="tab" />

        <!-- ✅ Conditionally rendered bottom components -->
        <BottomOne v-if="tab === 'Details'" />
        <BottomTwo v-else-if="tab === 'Application Status'" />
        <BottomThree v-else-if="tab === 'Resumes & Links'" />
        <!-- Optional: Add others later -->
      </q-card>
    </q-page>
  </q-layout>
</template>

<script>
import TopSection from "src/components/UserDashboard/TopSection/TopSection.vue";
import BottomOne from "src/components/UserDashboard/BottomOne/BottomOne.vue";
import BottomTwo from "src/components/UserDashboard/BottomTwo/BottomTwo.vue";
import BottomThree from "src/components/UserDashboard/BottomThree/BottomThree.vue";

export default {
  name: "UserDashboard",
  components: {
    TopSection,
    BottomOne,
    BottomTwo,
    BottomThree,
  },
  data() {
    return {
      tab: "Details", // Default active tab
    };
  },
};
</script>

<style scoped>
.dashboard-layout {
  background-color: #f4f0fa; /* Lavender tint */
}

.main-card {
  width: 90vw;
  height: 90vh;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 153, 255, 0.2); /* ✨ Bluish glow */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
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
