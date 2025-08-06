<template>
  <q-card class="resume-preview-card">
    <div class="section-title">Resume Preview</div>
    <div v-if="resumeExists">
      <iframe
        :src="`http://localhost:3000/resume/view-resume/${uid}`"
        width="100%"
        height="600"
        style="border: none"
      ></iframe>
    </div>
    <div v-else class="text-grey q-mt-sm">No resume uploaded yet.</div>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "src/stores/user-store";

const uid = useUserStore().uid;
const resumeExists = ref(false);

// Watch for prop updates
const props = defineProps({
  reload: Number, // force reload on change
});

const checkResume = async () => {
  try {
    const res = await fetch(`http://localhost:3000/resume/view-resume/${uid}`, {
      method: "HEAD",
    });
    resumeExists.value = res.ok;
  } catch {
    resumeExists.value = false;
  }
};

onMounted(checkResume);
watch(() => props.reload, checkResume);
</script>

<style scoped>
.resume-preview-card {
  padding: 24px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  color: #333;
}
</style>
