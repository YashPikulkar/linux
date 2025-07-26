<template>
  <q-card class="resume-links-card">
    <!-- Header -->
    <div class="form-header">
      <div>Resume & Online Profiles</div>
    </div>

    <!-- Resume Upload -->
    <div class="section-title">Upload Resume</div>
    <div class="upload-section q-mb-md">
      <q-uploader
        url=""
        label="Click or drag file here to upload"
        color="primary"
        square
        bordered
        flat
        class="full-width"
        style="height: 180px"
        no-thumbnails
        :auto-upload="false"
        @added="onResumeAdded"
      />
      <div v-if="resumeName" class="text-subtitle2 q-mt-sm">
        Selected File: {{ resumeName }}
      </div>
    </div>

    <!-- Online Profiles -->
    <div class="section-title">Add Online Profiles</div>
    <div class="profile-grid">
      <q-input v-model="links.linkedin" label="LinkedIn URL" outlined dense />
      <q-input v-model="links.github" label="GitHub URL" outlined dense />
      <q-input
        v-model="links.portfolio"
        label="Portfolio Website"
        outlined
        dense
      />
      <q-input
        v-model="links.website"
        label="Personal Website"
        outlined
        dense
      />
      <q-input
        v-model="links.codingProfile"
        label="Competitive Coding Profile"
        outlined
        dense
      />
      <q-input
        v-model="links.other"
        label="Other Profile Link"
        outlined
        dense
      />
    </div>
  </q-card>
</template>

<script>
export default {
  name: "ResumeAndLinks",
  data() {
    return {
      resumeName: null,
      links: {
        linkedin: "",
        github: "",
        portfolio: "",
        website: "",
        codingProfile: "",
        other: "",
      },
    };
  },
  methods: {
    onResumeAdded(files) {
      if (files && files.length > 0) {
        this.resumeName = files[0].name;
      }
    },
  },
};
</script>

<style scoped>
.resume-links-card {
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  font-family: "Inter", sans-serif;
  background-color: #ffffff;
  width: 100%;
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
  margin-top: 12px;
  margin-bottom: 8px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
