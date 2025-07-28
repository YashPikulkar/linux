<template>
  <div class="job-dashboard row no-wrap">

    <div class="sidebar-container" v-show="showSidebar">
      <FilterSection />
    </div>


    <div class="job-section q-pa-md">
      <JobSection />
    </div>

    <
    <q-btn
      fab
      color="black"
      icon="tune"
      class="floating-filter-btn"
      @click="toggleSidebar"
      label="Filters"
    />

    <!-- Floating Search Input -->
    <div class="floating-search">
      <q-input
        dense
        outlined
        v-model="searchQuery"
        placeholder="Search for jobs..."
        debounce="300"
        class="search-bar"
        color="primary"
        clearable
        :input-style="{ color: 'black' }"
      />
    </div>
  </div>
</template>

<script>
import FilterSection from 'src/components/Jobs/Sidebar/FilterSection.vue'
import JobSection from 'src/components/Jobs/JobSection.vue'

export default {
  name: 'JobDashboard',
  components: {
    FilterSection,
    JobSection
  },
  data() {
    return {
      showSidebar: true,
      searchQuery: ''
    }
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
    }
  }
}
</script>

<style scoped>
.job-dashboard {
  padding-top: 64px;
  background: radial-gradient(circle, #e6fafd 0%, #cceef3 100%);




  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
}

/* Sidebar */
.sidebar-container {
  width: 300px;
  background: radial-gradient(circle, #e6fafd 0%, #cceef3 100%);

  padding: 16px;
  
}

/* Main job content */
.job-section {
  flex: 1;
  min-width: 0;
}

/* Floating Filters Button */
.floating-filter-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10;
}

/* Floating Search UI */
.floating-search {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11;
  width: 50%;
  max-width: 600px;
}

.search-bar {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
