<template>
  <q-card class="resume-upload-card">
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
  </q-card>
</template>

<script>
export default {
  name: "ResumeUploader",
  data() {
    return {
      resumeName: null,
    };
  },
  methods: {
    onResumeAdded(files) {
      if (files?.length > 0) {
        this.resumeName = files[0].name;
      }
    },
  },
};
</script>

<style scoped>
.resume-upload-card {
  padding: 24px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  color: black;
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: black;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.upload-section {
  background-color: transparent;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.q-uploader {
  background-color: grey;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: #ffffff;
}

.q-uploader__title {
  color: #ffffff;
  font-weight: 500;
}

.text-subtitle2 {
  color: #ffffff;
}
</style>
