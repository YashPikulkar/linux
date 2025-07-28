<template>
  <div class="bottom-section row q-mt-sm">
    <!-- LEFT SIDE -->
    <div class="left-side">
      <Resume class="widget" />
    </div>

    <!-- RIGHT SIDE -->
    <div class="right-side">
      <Links class="widget" />
    </div>
  </div>
</template>

<script>
import Resume from "./Resume.vue";
import Links from "./Links.vue";

export default {
  name: "Combine",
  components: {
    Resume,
    Links,
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
  height: 100%; /* ✅ Add this if it's inside a fixed card */
}

.left-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px; /* ✅ Add gap to separate Resume and Links */
}

.widget {
  flex: 1; /* ✅ Ensures both Resume and Links share equal height */
  background: transparent;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
  min-height: 0; /* ✅ Prevents overflow when parent uses flex */
}


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
  height: 100%;
  width: 100%;
}

.widget:last-child {
  margin-bottom: 0;
}

/* Mobile layout adjustments */
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

/* Custom Scrollbar */
.widget::-webkit-scrollbar {
  width: 8px;
}
.widget::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}
.widget::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 8px;
}
.widget::-webkit-scrollbar-thumb:hover {
  background: #b3b3b3;
}

/* Firefox */
.widget {
  scrollbar-width: thin;
  scrollbar-color: #ccc #f1f1f1;
}
</style>
