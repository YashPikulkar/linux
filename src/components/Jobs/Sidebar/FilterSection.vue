<template>
  <q-card flat class="job-filter-card q-pa-md">
    <!-- Header -->
    <div class="text-subtitle1 text-weight-bold q-mb-md">All Filters</div>

    <!-- Work Mode Section -->
    <div class="filter-section">
      <div class="filter-title">Work mode</div>
      <q-option-group
        v-model="selectedWorkMode"
        :options="workModeOptions"
        type="checkbox"
        class="q-mt-sm"
      />
    </div>

    <!-- Experience Section -->
    <div class="filter-section">
      <div class="filter-title">Experience</div>
      <q-slider
        v-model="experience"
        :min="0"
        :max="30"
        label-always
        color="primary"
        class="q-mt-sm"
      />
    </div>

    <!-- Department Section -->
    <div class="filter-section">
      <div class="filter-title">Department</div>
      <q-option-group
        v-model="selectedDepartments"
        :options="departmentOptions"
        type="checkbox"
        class="q-mt-sm"
      />
      <q-btn flat label="View More" icon="add" color="primary" class="q-mt-sm" />
    </div>

    <!-- Location Section -->
    <div class="filter-section">
      <div class="filter-title">Location / State</div>
      <q-option-group
        v-model="selectedLocations"
        :options="locationOptions"
        type="checkbox"
        class="q-mt-sm"
      />
      <q-btn flat label="View More" icon="add" color="primary" class="q-mt-sm" />
    </div>

    <!-- Company Section -->
    <div class="filter-section">
      <div class="filter-title">Company</div>
      <q-option-group
        v-model="selectedCompanies"
        :options="companyOptions"
        type="checkbox"
        class="q-mt-sm"
      />
      <q-btn flat label="View More" icon="add" color="primary" class="q-mt-sm" />
    </div>

    <!-- Designation Section -->
    <div class="filter-section">
      <div class="filter-title">Designation</div>
      <q-option-group
        v-model="selectedDesignations"
        :options="designationOptions"
        type="checkbox"
        class="q-mt-sm"
      />
      <q-btn flat label="View More" icon="add" color="primary" class="q-mt-sm" />
    </div>

    <!-- Pay Range Section -->
    <div class="filter-section">
      <div class="filter-title">Pay Range</div>
      <q-option-group
        v-model="selectedPay"
        :options="payOptions"
        type="checkbox"
        class="q-mt-sm"
      />
      <q-btn flat label="View More" icon="add" color="primary" class="q-mt-sm" />
    </div>

    <!-- Education Level Section -->
    <div class="filter-section">
      <div class="filter-title">Education Level</div>
      <q-option-group
        v-model="selectedEducation"
        :options="educationOptions"
        type="checkbox"
        class="q-mt-sm"
      />
      <q-btn flat label="View More" icon="add" color="primary" class="q-mt-sm" />
    </div>

    <!-- Close Button -->
    <q-btn label="Close" flat @click="$emit('close')" class="q-mt-xl q-ml-xs" />
  </q-card>
</template>

<script>
export default {
  name: 'JobFilters',
  data() {
    return {
      selectedWorkMode: [],
      selectedDepartments: [],
      experience: 0,
      selectedLocations: [],
      selectedCompanies: [],
      selectedDesignations: [],
      selectedPay: [],
      selectedEducation: [],

      workModeOptions: [
        { label: 'Work from office', value: 'office' },
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'Remote', value: 'remote' },
        { label: 'Temp. WFH due to...', value: 'temp_wfh' }
      ],
      departmentOptions: [
        { label: 'Engineering - Software', value: 'engineering' },
        { label: 'Project & Program Management', value: 'project' },
        { label: 'UX, Design & Architecture', value: 'ux' },
        { label: 'IT & Information Security', value: 'it' }
      ],
      locationOptions: [
        { label: 'Bangalore', value: 'bangalore' },
        { label: 'Hyderabad', value: 'hyderabad' },
        { label: 'Pune', value: 'pune' },
        { label: 'Chennai', value: 'chennai' }
      ],
      companyOptions: [
        { label: 'TCS', value: 'tcs' },
        { label: 'Infosys', value: 'infosys' },
        { label: 'Google', value: 'google' },
        { label: 'Accenture', value: 'accenture' }
      ],
      designationOptions: [
        { label: 'Software Developer', value: 'sde' },
        { label: 'Tech Lead', value: 'tech_lead' },
        { label: 'Manager', value: 'manager' },
        { label: 'Intern', value: 'intern' }
      ],
      payOptions: [
        { label: '3 - 6 LPA', value: '3_6' },
        { label: '6 - 10 LPA', value: '6_10' },
        { label: '10 - 15 LPA', value: '10_15' },
        { label: '15+ LPA', value: '15_plus' }
      ],
      educationOptions: [
        { label: 'B.Tech / B.E.', value: 'btech' },
        { label: 'M.Tech / M.E.', value: 'mtech' },
        { label: 'MCA', value: 'mca' },
        { label: 'Diploma', value: 'diploma' }
      ]
    }
  }
}
</script>

<style scoped>
.job-filter-card {
  border-radius: 12px;
  background-color: #fff;
  width: 100%;
  max-width: 320px;
  border: 1px solid #eee;
}

.filter-section {
  margin-top: 16px;
}

.filter-title {
  font-weight: 600;
  font-size: 16px;
  color: #1f1f1f;
}
</style>
