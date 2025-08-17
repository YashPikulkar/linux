<template>
  <div class="jobs-page-wrapper">
    <!-- Job Header with tabs -->
    <JobHeader v-model="activeTab" />

    <!-- Browse Tab: show filters + job list -->
    <div v-if="activeTab === 'browse'" class="browse-section">
      <SavedSearchSection />
      <JobList />
    </div>

    <!-- Saved Tab: show only saved jobs -->
    <div v-else-if="activeTab === 'saved'" class="list-section">
      <JobList :filterType="'saved'" />
    </div>

    <!-- Hidden Tab: show only hidden jobs -->
    <div v-else-if="activeTab === 'hidden'" class="list-section">
      <JobList :filterType="'hidden'" />
    </div>
  </div>
</template>

<script>
import JobHeader from './JobHeader.vue'
import SavedSearchSection from './SavedSearchSection.vue'
import JobList from './JobList.vue'

export default {
  name: 'JobsPage',
  components: {
    JobHeader,
    SavedSearchSection,
    JobList,
  },
  data() {
    return {
      activeTab: 'browse', // controlled by JobHeader v-model
    }
  },
}
</script>

<style scoped>
.jobs-page-wrapper {
  width: 100%;
  margin: 0 auto;
  padding: 0;
  min-height: 70vh; /* stable height */
}

/* ✅ Stack SavedSearch + JobList with spacing */
.browse-section {
  display: flex;
  flex-direction: column;
  gap: 24px; /* adds spacing between them */
}

.list-section {
  margin-top: 16px; /* keeps consistent spacing for saved/hidden */
}
</style>
