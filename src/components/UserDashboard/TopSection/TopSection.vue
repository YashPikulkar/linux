<template>
  <div class="top-section">
    <!-- Two-way binding using v-model:tab -->
    <UserNavbar
      class="block-section"
      :tab="tab"
      @update:tab="$emit('update:tab', $event)"
    />
    <UserPanel class="block-section" />
  </div>
</template>

<script>
import UserNavbar from "./UserNavbar.vue";
import UserPanel from "./UserPanel.vue";

export default {
  name: "TopSection",
  components: {
    UserNavbar,
    UserPanel,
  },
  props: {
    tab: {
      type: String,
      required: true,
    },
  },
  emits: ["update:tab"],
};
</script>

<style scoped>
.top-section {
  flex: 0 0 auto;
}

.block-section {
  margin-bottom: 10px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
