<template>
  <div class="top-section">
    <!-- Two-way binding using v-model:tab -->
    <RecruiterNavbar
      class="block-section"
      :tab="tab"
      @update:tab="$emit('update:tab', $event)"
    />
    <RecruiterPanel class="block-section" />
  </div>
</template>

<script>
import RecruiterNavbar from "./RecuNavbar.vue";
import RecruiterPanel  from "./RecuPanel.vue";

export default {
  name: "TopSection",
  components: {
    RecruiterNavbar,
    RecruiterPanel,
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
}
</style>
