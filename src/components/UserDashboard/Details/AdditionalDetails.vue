<template>
  <q-card class="education-info-form">
    <!-- Header -->
    <div class="form-header">
      <div>Additional Details</div>
      <div v-if="!isEditable">
        <q-btn dense flat round icon="edit" size="sm" @click="toggleEdit" />
      </div>
      <div v-else class="row no-wrap items-center">
        <q-btn
          dense
          flat
          round
          icon="check"
          size="sm"
          color="positive"
          @click="saveEdit"
        />
        <q-btn
          dense
          flat
          round
          icon="close"
          size="sm"
          color="negative"
          @click="cancelEdit"
        />
      </div>
    </div>

    <!-- PERSONAL INFO -->
    <div class="section-title">Personal Information</div>
    <div class="edu-entry">
      <div class="edu-left">
        <q-select
          v-model="tempData.gender"
          :disable="!isEditable"
          :options="['Male', 'Female', 'Other']"
          dense
          flat
          filled
          class="no-border"
          label="Gender"
        />
        <q-input
          v-model="tempData.dob"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          label="Date of Birth"
          type="date"
        />
      </div>
    </div>

    <!-- PROFESSIONAL INFO -->
    <div class="section-title">Professional Details</div>
    <div class="edu-entry">
      <div class="edu-left">
        <q-input
          v-model="tempData.experience"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          label="Work Experience (in years)"
          type="number"
        />
        <q-select
          v-model="tempData.employmentStatus"
          :disable="!isEditable"
          :options="['Employed', 'Unemployed', 'Fresher']"
          dense
          flat
          filled
          class="no-border"
          label="Employment Status"
        />
      </div>
    </div>

    <!-- JOB PREFERENCE -->
    <div class="section-title">Job Preferences</div>
    <div class="edu-entry">
      <div class="edu-left">
        <q-select
          v-model="tempData.jobType"
          :disable="!isEditable"
          :options="['Full-time', 'Part-time', 'Internship']"
          dense
          flat
          filled
          class="no-border"
          label="Preferred Job Type"
        />
        <q-input
          v-model="tempData.preferredLocation"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          label="Preferred Job Location"
        />
      </div>
    </div>

    <!-- AVAILABILITY -->
    <div class="edu-entry">
      <q-option-group
        v-model="tempData.availability"
        :disable="!isEditable"
        inline
        :options="[
          { label: 'Remote', value: 'Remote' },
          { label: 'Onsite', value: 'Onsite' },
          { label: 'Hybrid', value: 'Hybrid' },
        ]"
        type="checkbox"
        label="Availability"
      />
    </div>

    <!-- LANGUAGE -->
    <div class="edu-entry">
      <q-input
        v-model="tempData.languages"
        :disable="!isEditable"
        dense
        flat
        filled
        class="no-border"
        label="Languages Known (comma separated)"
      />
    </div>

    <!-- HEADLINE -->
    <div class="edu-entry">
      <q-input
        v-model="tempData.resumeHeadline"
        :disable="!isEditable"
        dense
        flat
        filled
        class="no-border"
        label="Resume Headline"
      />
    </div>

    <!-- LINKS -->
    <div class="section-title">Links</div>
    <div class="edu-entry">
      <div class="edu-left">
        <q-input
          v-model="tempData.linkedin"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          label="LinkedIn Profile URL"
        />
        <q-input
          v-model="tempData.portfolio"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          label="Portfolio Website (if any)"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import { useUserStore } from "src/stores/UserStore";

export default {
  data() {
    return {
      isEditable: false,
      tempData: {},
    };
  },
  mounted() {
    this.tempData = { ...this.userStore.additional };
  },
  methods: {
    toggleEdit() {
      this.tempData = { ...this.userStore.additional };
      this.isEditable = true;
    },
    saveEdit() {
      this.userStore.updateAdditional(this.tempData);
      this.isEditable = false;
    },
    cancelEdit() {
      this.tempData = { ...this.userStore.additional };
      this.isEditable = false;
    },
  },
  created() {
    this.userStore = useUserStore(); // ✅ Initialize store here
  },
};
</script>

<style scoped>
.education-info-form {
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  font-family: "Inter", sans-serif;
  background-color: #ffffff;
}

.form-header {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #3b3b3b;
  margin-top: 24px;
  margin-bottom: 8px;
}

.edu-entry {
  margin-bottom: 16px;
}

.edu-left {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.no-border :deep(.q-field__control) {
  border: none;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 14px;
  box-shadow: inset 0 0 0 1px #ddd;
  transition: box-shadow 0.2s;
}
</style>
