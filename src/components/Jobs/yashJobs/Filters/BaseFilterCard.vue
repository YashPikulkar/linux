<template>
  <div class="filter-card" :class="{ 'active-filter': active }">
    <div class="filter-header row items-center justify-between q-mb-sm">
      <div class="filter-title">{{ title }}</div>
      <div v-if="active" class="clear-text" @click="$emit('clear')">Clear</div>
    </div>

    <div v-if="subtitle" class="filter-subtitle q-mb-sm">
      {{ subtitle }}
    </div>

    <!-- Slot for filter inputs -->
    <div class="filter-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseFilterCard',
  props: {
    title: String,
    subtitle: String,
    active: Boolean,
  },
  emits: ['clear'],
}
</script>

<style scoped>
.filter-card {
  border: 1px solid #dcdcdc;
  padding: 16px;
  background-color: white;
  transition: all 0.2s ease;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.filter-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
}

.clear-text {
  font-size: 13px;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
}
</style>
