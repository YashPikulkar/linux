<template>
  <q-dialog v-model="showDialog" persistent transition-show="fade" transition-hide="fade">
    <q-card class="filter-wrapper column bg-white">
      <div class="filter-content scroll q-pa-md">
        <!-- Selected Filters -->
        <div class="q-mb-lg spacing-bottom">
          <div class="text-h6 q-mb-sm">Selected Filters</div>
          <SelectedTags />
        </div>

        <!-- Basic Filters -->
        <div class="q-mb-lg spacing-bottom">
          <div class="text-h6 q-mb-sm">Basic Filters</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <JobRoleFilter />
            </div>
            <div class="col-12 col-md-6">
              <LocationRegionFilter />
            </div>
          </div>
        </div>

        <q-separator spaced class="spacing-bottom" />

        <!-- Salary + Equity -->
        <div class="spacing-bottom">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <SalaryFilter />
            </div>
            <div class="col-12 col-md-6">
              <EquityFilter />
            </div>
          </div>
        </div>

        <q-separator spaced class="spacing-bottom" />

        <!-- Areas of Interest -->
        <div class="spacing-bottom">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <SkillsFilter />
            </div>
            <div class="col-12 col-md-6">
              <MarketsFilter />
            </div>
          </div>
        </div>

        <q-separator spaced class="spacing-bottom" />
        <!-- Job Details -->
        <div class="spacing-bottom">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <JobTypeFilter />
            </div>
            <div class="col-12 col-md-6">
              <ExperienceFilter />
              <div class="q-mt-md">
                <JobModeFilter />
                <!-- ✅ Placed below Experience -->
              </div>
            </div>
          </div>
        </div>

        <q-separator spaced class="spacing-bottom" />

        <!-- Company Size + Company Type -->
        <div class="spacing-bottom">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <CompanySizeFilter />
            </div>
            <div class="col-12 col-md-6">
              <CompanyTypeFilter />
            </div>
          </div>
        </div>

        <q-separator spaced class="spacing-bottom" />

        <!-- Education + Top Companies -->
        <div class="spacing-bottom">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <EducationFilter />
            </div>
            <div class="col-12 col-md-6">
              <TopCompaniesFilter />
            </div>
          </div>
        </div>
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
import SelectedTags from './SelectedTags.vue'
import JobRoleFilter from './Filters/JobRoleFilter.vue'
import LocationRegionFilter from './Filters/LocationRegionFilter.vue'

// ✅ Replace CompensationFilter with Salary + Equity
import SalaryFilter from './Filters/SalaryFilter.vue'
import EquityFilter from './Filters/EquityFilter.vue'

import JobTypeFilter from './Filters/JobTypeFilter.vue'
import ExperienceFilter from './Filters/ExperienceFilter.vue'
import JobModeFilter from './Filters/JobModeFilter.vue'
import EducationFilter from './Filters/EducationFilter.vue'
import TopCompaniesFilter from './Filters/TopCompaniesFilter.vue'

// ✅ Updated imports
import SkillsFilter from './Filters/SkillsFilter.vue'
import MarketsFilter from './Filters/MarketsFilter.vue'
import CompanySizeFilter from './Filters/CompanySizeFilter.vue'
import CompanyTypeFilter from './Filters/CompanyTypeFilter.vue'

import { useFilterStore } from 'src/stores/filter-store'

export default {
  name: 'JobFilterCard',
  components: {
    SelectedTags,
    JobRoleFilter,
    LocationRegionFilter,
    SalaryFilter,
    EquityFilter,
    SkillsFilter,
    MarketsFilter,
    JobTypeFilter,
    ExperienceFilter,
    JobModeFilter, // ✅ Registered here
    CompanySizeFilter,
    CompanyTypeFilter,
    EducationFilter,
    TopCompaniesFilter,
  },
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  computed: {
    showDialog: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
  },
  data() {
    return {
      filterStore: useFilterStore(),
    }
  },
}
</script>

<style scoped>
.spacing-bottom {
  margin-bottom: 24px;
}
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
