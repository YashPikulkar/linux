<template>
  <div
    class="filter-card"
    :class="{
      'active-filter': active,
      'has-subtitle': subtitle,
    }"
    role="region"
    :aria-label="`Filter: ${title}`"
  >
    <div class="filter-header">
      <div class="filter-title-section">
        <h3 class="filter-title">{{ title }}</h3>
        <div v-if="subtitle" class="filter-subtitle">
          {{ subtitle }}
        </div>
      </div>

      <div v-if="active" class="filter-actions">
        <button
          class="clear-button"
          @click="$emit('clear')"
          type="button"
          :aria-label="`Clear ${title} filter`"
        >
          <svg class="clear-icon" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"
            />
          </svg>
          Clear
        </button>
      </div>
    </div>

    <!-- Slot for filter inputs -->
    <div class="filter-body">
      <slot />
    </div>

    <!-- Optional loading state -->
    <div v-if="loading" class="filter-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseFilterCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['clear'],

  methods: {
    handleClear() {
      if (!this.disabled) {
        this.$emit('clear')
      }
    },
  },
}
</script>

<style scoped>
.filter-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background-color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.filter-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.active-filter {
  border-color: #3b82f6;
  background-color: #f8faff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-card[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

.filter-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}

.filter-title-section {
  flex: 1;
  min-width: 0;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1.5;
}

.filter-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.4;
  margin: 0;
}

.filter-actions {
  flex-shrink: 0;
}

.clear-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #2563eb;
}

.clear-button:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  ring-offset: 2px;
}

.clear-button:active {
  transform: translateY(1px);
}

.clear-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.filter-body {
  position: relative;
}

/* Loading state */
.filter-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .filter-card {
    padding: 16px;
  }

  .filter-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .filter-actions {
    align-self: flex-end;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .filter-card {
    border-color: #000000;
  }

  .active-filter {
    border-color: #0000ff;
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .filter-card,
  .clear-button,
  .loading-spinner {
    transition: none;
    animation: none;
  }
}
</style>
