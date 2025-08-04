<template>
  <div class="user-navbar row no-wrap items-center">
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
.user-tab {
  border-radius: 999px;
  background-color: white;
  color: #111827;
  transition: all 0.2s ease;
  font-weight: 500;
  padding: 0px 10px;
  margin-right: 8px; /* 👈 this adds spacing between tabs */
}

.user-tab:last-child {
  margin-right: 0; /* remove right margin for last tab */
}

.user-tab.is-active {
  background-color: #000000;
  color: white;
}

.user-tabs {
  display: flex; /* ensure flex to support margin/gap */
  align-items: center;
}

.user-navbar {
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0;
  border: none;
}
</style>
