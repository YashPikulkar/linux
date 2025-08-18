<template>
  <div class="jobs-page-wrapper">
    <!-- Job Header with tabs -->
    <JobHeader v-model="activeTab" />

    <!-- Content wrapper (stable height) -->
    <div class="tab-content-wrapper" :style="{ minHeight: wrapperHeight + 'px' }" ref="wrapper">
      <transition name="fade-slide" mode="out-in">
        <div v-show="activeTab === 'browse'" key="browse" class="browse-section" ref="browse">
          <SavedSearchSection />
          <JobList />
        </div>
      </transition>

      <transition name="fade-slide" mode="out-in">
        <div
          v-show="activeTab === 'saved'"
          key="saved"
          class="list-section saved-section"
          ref="saved"
        >
          <SavedJobList />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import JobHeader from './JobHeader.vue'
import SavedSearchSection from './SavedSearchSection.vue'
import JobList from './JobList.vue'
import SavedJobList from './SavedJobList.vue'

export default {
  name: 'JobsPage',
  components: {
    JobHeader,
    SavedSearchSection,
    JobList,
    SavedJobList,
  },
  data() {
    return {
      activeTab: 'browse',
      wrapperHeight: 0, // will hold the tallest section's height
    }
  },
  mounted() {
    this.calculateMaxHeight()
  },
  methods: {
    calculateMaxHeight() {
      this.$nextTick(() => {
        const browseHeight = this.$refs.browse ? this.$refs.browse.offsetHeight : 0
        const savedHeight = this.$refs.saved ? this.$refs.saved.offsetHeight : 0
        this.wrapperHeight = Math.max(browseHeight, savedHeight)
      })
    },
  },
  watch: {
    activeTab() {
      // recalc in case list grows dynamically
      this.calculateMaxHeight()
    },
  },
}
</script>

<style scoped>
.tab-content-wrapper {
  transition: min-height 0.3s ease; /* smooth adjustment */
}

/* Saved section adjustment: bring content slightly upwards */
.saved-section {
  margin-top: -15.5px; /* tweak this value as needed for alignment */
  margin-left: -10px;
}

/* Example fade-slide transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
