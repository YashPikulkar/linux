<template>
  <q-card class="resume-upload-card">
    <div class="section-title">Upload Resume (PDF Only)</div>

    <div class="upload-wrapper q-mb-md">
      <input
        ref="fileInput"
        type="file"
        accept="application/pdf"
        @change="handleFileChange"
        hidden
      />

      <q-btn
        label="Select Resume (PDF)"
        icon="upload_file"
        color="primary"
        @click="triggerFileInput"
        class="q-mb-sm"
      />

      <div v-if="resumeName" class="file-name q-mb-sm">
        Selected: {{ resumeName }}
        <q-btn dense flat icon="close" @click="clearFile" />
      </div>

      <q-btn
        label="Upload Resume"
        color="positive"
        icon="cloud_upload"
        :disable="!resumeFile"
        @click="uploadResume"
      />
    </div>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/user-store";

const $q = useQuasar();
const uid = useUserStore().uid;

const fileInput = ref(null);
const resumeFile = ref(null);
const resumeName = ref(null);

// Emit upload status
const emit = defineEmits(["uploaded"]);

const triggerFileInput = () => fileInput.value.click();

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    resumeFile.value = file;
    resumeName.value = file.name;
  } else {
    clearFile();
    $q.notify({
      type: "negative",
      message: "Only PDF files are allowed.",
    });
  }
};

const clearFile = () => {
  resumeFile.value = null;
  resumeName.value = null;
  fileInput.value.value = null;
};

const uploadResume = async () => {
  if (!resumeFile.value) return;

  const formData = new FormData();
  formData.append("uid", uid);
  formData.append("resume", resumeFile.value);

  try {
    const response = await fetch("http://localhost:3000/resume/upload-resume", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");

    $q.notify({
      type: "positive",
      message: "Resume uploaded successfully!",
    });

    emit("uploaded"); // notify parent
  } catch (err) {
    $q.notify({
      type: "negative",
      message: "Failed to upload resume.",
    });
    console.error(err);
  }
};
</script>

<style scoped>
.resume-upload-card {
  padding: 24px;
  border-radius: 16px;
  background: #f5f5f5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  color: #333;
}
.upload-wrapper {
  display: flex;
  flex-direction: column;
}
.file-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #e0e0e0;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
}
</style>
