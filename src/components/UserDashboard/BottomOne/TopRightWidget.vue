<template>
  <q-card class="education-info-form">
    <!-- Header -->
    <div class="form-header">
      <div>Education</div>
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

    <!-- College Name -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-input
            v-model="tempData.college"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="College Name"
          />
        </div>
      </div>
    </div>

    <!-- Degree -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-input
            v-model="tempData.degree"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="Qualification/Degree"
          />
        </div>
        <div class="edu-subtitle">
          <q-input
            v-model="tempData.degreeCgpa"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="CGPA"
          />
        </div>
      </div>
    </div>

    <!-- Higher Secondary -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-input
            v-model="tempData.higherSecondary"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="Higher Secondary School"
          />
        </div>
        <div class="edu-subtitle">
          <q-input
            v-model="tempData.higherCgpa"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="CGPA"
          />
        </div>
      </div>
    </div>

    <!-- High School -->
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-title">
          <q-input
            v-model="tempData.highSchool"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="High School"
          />
        </div>
        <div class="edu-subtitle">
          <q-input
            v-model="tempData.highCgpa"
            :disable="!isEditable"
            dense
            flat
            filled
            class="no-border"
            label="CGPA"
          />
        </div>
      </div>
    </div>

    <!-- Certifications -->
    <div class="cert-section">
      <div class="cert-header">Certifications</div>
      <div
        v-for="(cert, index) in tempData.certifications"
        :key="index"
        class="cert-entry"
      >
        <q-input
          v-model="tempData.certifications[index]"
          :disable="!isEditable"
          dense
          flat
          filled
          class="no-border"
          :label="'Certificate ' + (index + 1)"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: "EducationForm",
  data() {
    return {
      isEditable: false,
      education: {
        college: "Goa College of Engineering",
        degree: "B.E. in Information Technology",
        degreeCgpa: "7.8",
        higherSecondary: "ABC Higher Secondary School",
        higherCgpa: "8.5",
        highSchool: "XYZ High School",
        highCgpa: "9.0",
        certifications: ["Full Stack Web Dev", "Python Basics", "UX Design"],
      },
      tempData: {},
    };
  },
  methods: {
    toggleEdit() {
      this.tempData = JSON.parse(JSON.stringify(this.education));
      this.isEditable = true;
    },
    saveEdit() {
      this.education = JSON.parse(JSON.stringify(this.tempData));
      this.isEditable = false;
    },
    cancelEdit() {
      this.isEditable = false;
    },
  },
};
</script>

<style scoped>
.education-info-form {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.edu-entry {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.edu-left {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.edu-title input,
.edu-subtitle input {
  font-size: 15px;
  font-weight: 500;
  color: #222;
  padding: 0;
  margin: 0;
}

.edu-subtitle input {
  font-size: 13px;
  color: #666;
}

.cert-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cert-header {
  font-weight: bold;
  font-size: 16px;
  color: #444;
  margin-bottom: 4px;
}

.cert-entry {
  width: 100%;
}

.no-border ::v-deep .q-field__control {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}
</style>
