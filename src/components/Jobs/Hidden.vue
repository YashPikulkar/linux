<template>
  <div v-show="isVisible" class="hidden-box q-pa-md q-mb-md">
    <slot>
      <!-- Default fallback content if no slot provided -->
      <div class="text-body2 text-grey-7">
        This section is currently hidden or toggled.
      </div>
    </slot>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const isVisible = ref(props.show);
</script>

<style scoped>
.hidden-box {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
