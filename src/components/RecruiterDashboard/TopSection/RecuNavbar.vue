<template>
  <div class="user-navbar sticky row no-wrap items-center">
    <q-tabs
      :model-value="tab"
      @update:model-value="$emit('update:tab', $event)"
      dense
      align="left"
      class="user-tabs"
      shrink
      indicator-color="transparent"
    >
      <q-tab
        v-for="item in tabs"
        :key="item"
        :name="item"
        :label="item"
        :class="['user-tab', tabClass(item)]"
        no-caps
      />
    </q-tabs>
  </div>
</template>

<script>
export default {
  name: "RecruiterNavbar",
  props: {
    tab: {
      type: String,
      required: true,
    },
  },
  emits: ["update:tab"],
  data() {
    return {
      tabs: [
        "Home",
        "Post a Job",
        "Manage Jobs",
        "Notifications",
        "Profile",
      ],
    };
  },
  methods: {
    tabClass(item) {
      return this.tab === item ? "is-active" : "";
    },
  },
};
</script>

<style scoped>
.user-navbar {
  max-width: 100%;
  flex-shrink: 0;
  overflow-x: auto;
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0;
  border: none;
  display: flex;
}

/* Optional sticky navbar */
.user-navbar.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  background: inherit;
}

.user-tabs {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;       /* Firefox */
  -ms-overflow-style: none;    /* IE/Edge */
  width: 100%;
}

.user-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.user-tab {
  border-radius: 999px;
  background-color: white;
  color: #111827;
  transition: all 0.2s ease;
  font-weight: 500;
  padding: 6px 12px;
  margin-right: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 14px;
}

.user-tab:last-child {
  margin-right: 0;
}

.user-tab.is-active {
  background-color: #000000;
  color: white;
}

@media (max-width: 600px) {
  .user-tab {
    font-size: 13px;
    padding: 4px 10px;
  }
}
</style>
