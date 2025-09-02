<template>
  <div class="jobs-page-wrapper">
    <!-- Job Header with tabs -->
    <JobHeader v-model="activeTab" />

    <!-- Content wrapper (auto height, no minHeight lock) -->
    <div class="tab-content-wrapper" ref="wrapper">
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
    }
  },
}
</script>

<style scoped>
.tab-content-wrapper {
  /* removed min-height lock, now it grows/shrinks with content */
}

/* Saved section adjustment: bring content slightly upwards */
.saved-section {
  margin-top: -15.5px; /* tweak this value as needed for alignment */
  margin-left: -10px;
}

/* Add spacing between SavedSearchSection and JobList */
.browse-section > *:first-child {
  margin-bottom: 24px; /* adjust value as needed */
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
