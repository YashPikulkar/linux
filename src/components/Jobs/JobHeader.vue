<template>
  <div class="q-mb-md job-tabs-wrapper">
    <!-- Tabs -->
    <div class="row items-center q-gutter-md tabs-row">
      <div
        v-for="(tab, index) in visibleTabs"
        :key="index"
        @click="selectTab(tab.name)"
        class="cursor-pointer row items-center tab-item"
        :class="{ 'selected-tab': selected === tab.name }"
      >
        <span class="text-body1 q-mr-xs">{{ tab.label }}</span>

        <!-- Badge for Saved tab -->
        <q-badge
          v-if="tab.name === 'saved'"
          color="grey-4"
          text-color="black"
          label="1"
          class="q-pa-xs q-mx-xs"
          style="font-size: 10px; border-radius: 4px"
        />

        <!-- Underline -->
        <div v-if="selected === tab.name" class="underline"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from 'src/stores/user-store'

export default {
  name: 'JobHeader',
  props: {
    modelValue: { type: String, default: 'browse' },
  },
  data() {
    return {
      selected: this.modelValue,
      tabs: [
        { name: 'browse', label: 'Browse all' },
        { name: 'saved', label: 'Saved' },
      ],
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    // 👇 Only show "saved" tab if user is logged in
    visibleTabs() {
      if (this.userStore.uid || this.userStore.token) {
        return this.tabs
      }
      return this.tabs.filter((t) => t.name !== 'saved')
    },
  },
  methods: {
    selectTab(tabName) {
      this.selected = tabName
      this.$emit('update:modelValue', tabName)
    },
  },
  watch: {
    modelValue(newVal) {
      this.selected = newVal
    },
  },
}
</script>

<style scoped>
.tabs-row {
  display: flex;
  gap: 16px;
}

.tab-item {
  position: relative;
  padding-bottom: 4px; /* space for underline */
  cursor: pointer;
}

.selected-tab {
  color: black;
  font-weight: bold;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: black;
}
</style>
