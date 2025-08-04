<template>
  <q-dialog
    v-model="showDialog"
    persistent
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="filter-wrapper column bg-white">
      <div class="filter-content scroll q-pa-md">
        <!-- Section 1: Filters -->
        <div class="q-mb-lg">
          <div class="text-h6 q-mb-sm">Basic Filters</div>
          <div class="row q-col-gutter-md">
            <!-- Job Title Filter -->
            <div class="col-12 col-md-6">
              <JobTitleFilter />
            </div>

            <!-- Location + Region Filter -->
            <div class="col-12 col-md-6">
              <LocationRegionFilter />
              <JobMode/>
            </div>
          </div>
        </div>

        <!-- Section 2: Selected Tags -->
        <div class="q-mb-lg">
          <div class="text-h6 q-mb-sm">Selected Filters</div>
          <SelectedTags />
        </div>

        <!-- Section Divider -->
        <q-separator spaced />

        <!-- Section 3: Compensation Filters -->
        <CompensationFilter />

        <!-- Section 4: Areas of Interest -->
        <q-separator spaced />
        <AreasOfInterest />

        <!-- Section 5: Job Details Filters -->
        <q-separator spaced />
        <JobDetailsFilter />
        <q-separator spaced />
        <CompanyDetailsFilter />
        <q-separator spaced />
        <EduTop />
      </div>
      <q-card-actions align="right" class="q-pa-sm">
        <q-btn
          label="Close"
          color="black"
          text-color="white"
          unelevated
          @click="showDialog = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import JobTitleFilter from "./Filters/BasicFilter/JobTitleFilter.vue";
import LocationRegionFilter from "./Filters/BasicFilter/LocationRegionFilter.vue";
import SelectedTags from "./SelectedTags.vue";
import CompensationFilter from "./Filters/Compensation/CompensationFilter.vue";
import AreasOfInterest from "./Filters/AOI/AreasOfInterest.vue";
import JobDetailsFilter from "./Filters/JobDetails/JobDetailsFilter.vue"; // ✅ New Import
import CompanyDetailsFilter from "./Filters/CompanyDetails/CompanyDetailsFilter.vue";
import EduTop from "./Filters/EducationTop/EduTop.vue";
import JobMode from "./Filters/BasicFilter/JobMode.vue";

export default {
  name: "JobFilterCard",
  components: {
    JobTitleFilter,
    LocationRegionFilter,
    SelectedTags,
    CompensationFilter,
    AreasOfInterest,
    JobDetailsFilter, // ✅ Registered
    CompanyDetailsFilter,
    EduTop,
  },
  props: {
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],
  computed: {
    showDialog: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
};
</script>

<style scoped>
.filter-wrapper {
  width: 100%;
  max-width: 1000px;
  height: 97vh;
  max-height: 100vh;
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.filter-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
  width: 95%;
  margin: 0 auto;
}
</style>
