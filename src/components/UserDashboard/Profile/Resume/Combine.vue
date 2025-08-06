<template>
  <div class="bottom-section row q-mt-sm">
    <!-- LEFT SIDE -->
    <div class="left-side">
      <ResumeUploader class="widget" @uploaded="triggerReload" />
    </div>

    <!-- RIGHT SIDE -->
    <div class="right-side">
      <ResumePreview class="widget" :reload="reloadKey" />
    </div>
  </div>
</template>

<script>
import ResumeUploader from "./ResumeUploader.vue";
import ResumePreview from "./ResumePreview.vue";

export default {
  name: "Combine",
  components: {
    ResumeUploader,
    ResumePreview,
  },
  data() {
    return {
      reloadKey: 0,
    };
  },
  methods: {
    triggerReload() {
      this.reloadKey += 1; // Trigger prop watch in ResumePreview
    },
  },
};
</script>

<style scoped>
.bottom-section {
  flex: 1 1 auto;
  display: flex;
  overflow: hidden;
  gap: 12px;
  flex-wrap: nowrap;
  height: 100%;
}

.left-side,
.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.widget {
  flex: 1;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
  min-height: 0;
}

@media (max-width: 900px) {
  .bottom-section {
    flex-direction: column;
  }

  .right-side {
    margin-left: 0 !important;
  }

  .left-side .widget {
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>
