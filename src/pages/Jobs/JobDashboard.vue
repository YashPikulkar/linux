<template>
  <div class="q-mx-auto" style="padding-top: 100px; width: 80vw">
    <JobHeader />
    <!-- Add padding/margin below SavedSearchSection -->
    <div class="q-mb-md">
      <SavedSearchSection />
    </div>

    <JobFilterCard v-model="showFilter" />
    <JobList />
  </div>
</template>

<script>
import JobFilterCard from "src/components/Jobs/JobFilterCard.vue";
import JobHeader from "src/components/Jobs/JobHeader.vue";
import JobList from "src/components/Jobs/ListJobs/JobList.vue";
import SavedSearchSection from "src/components/Jobs/SavedSearchSection.vue";

export default {
  name: "JobDashboard",
  components: {
    JobFilterCard,
    JobList,
    SavedSearchSection,
    JobHeader,
  },
  data() {
    return {
      showFilter: false,
    };
  },
};
</script>
