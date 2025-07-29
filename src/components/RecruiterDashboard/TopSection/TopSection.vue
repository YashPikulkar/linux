<template>
  <div class="top-section" :style="{ '--gap': dynamicGap }">
    <UserNavbar
      class="block-section"
      :tab="tab"
      @update:tab="$emit('update:tab', $event)"
    />
    <UserPanel class="block-section" />
  </div>
</template>

<script>
import UserNavbar from "./RecuNavbar.vue";
import UserPanel from "./RecuPanel.vue";

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
    gap: {
      type: [String, Number],
      default: null, // Let CSS handle default responsive spacing
    },
  },
  computed: {
    dynamicGap() {
      // If gap prop is provided, use it; otherwise, let CSS handle responsive spacing
      if (this.gap !== null) {
        return typeof this.gap === 'number' ? `${this.gap}px` : this.gap;
      }
      return null;
    },
  },
  emits: ["update:tab"],
};
</script>

<style scoped>
.top-section {
  display: flex;
  flex-direction: column;
  /* Responsive gap using CSS custom property with fallback */
  gap: var(--gap, clamp(12px, 2.5vw, 24px));
  width: 100%;
  max-width: 100%;
}

.block-section {
  background: white;
  padding: clamp(12px, 3vw, 20px);
  border-radius: clamp(8px, 1.5vw, 16px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

/* Responsive breakpoints for better control */
@media (max-width: 480px) {
  .top-section {
    gap: var(--gap, 8px);
  }

  .block-section {
    padding: 12px;
    border-radius: 8px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .top-section {
    gap: var(--gap, 16px);
  }

  .block-section {
    padding: 16px;
    border-radius: 12px;
  }
}

@media (min-width: 769px) {
  .top-section {
    gap: var(--gap, 20px);
  }

  .block-section {
    padding: 20px;
    border-radius: 16px;
  }
}

/* Optional: Add hover effects for better interactivity */
.block-section:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
</style>
