<!-- ResumeCombined.vue -->
<template>
  <div ref="adBanner" class="ad-banner">
    <q-icon name="psychology" color="primary" size="32px" class="ad-icon" />
    <div class="ad-content">
      <div class="ad-title">Smart Resume Parser & Profile Sync</div>
      <div class="ad-desc">
        Our AI automatically extracts skills from your uploaded resume and compares them with your profile. Get instant recommendations to update missing skills and strengthen your job applications.
      </div>
    </div>
  </div>
  
  <div class="bottom-section">
    <!-- LEFT SIDE -->
    <div class="left-side">
      <ResumeUploader class="widget" @uploaded="triggerReload" />
    </div>
    
    <!-- RIGHT SIDE -->
    <div class="right-side">
      <ResumePreview class="widget" :reload="reloadKey" />
    </div>
  </div>
</template>

<script setup>
import ResumeUploader from 'src/components/ApplicantDashboard/ResumeUploader.vue'
import ResumePreview from 'src/components/ApplicantDashboard/ResumePreview.vue'
import { ref, onMounted, nextTick } from 'vue'

const reloadKey = ref(0)
const adBanner = ref(null)

function triggerReload() {
  reloadKey.value += 1
}

// Auto-scroll to ad banner when component mounts
onMounted(async () => {
  await nextTick()
  if (adBanner.value) {
    adBanner.value.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
})
</script>

<style scoped>
/* Advertisement Banner */
/* Advertisement Banner */
.ad-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  background: linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%);
  margin: 0;                  /* no extra spacing above/below */
  padding: 18px 28px;
  box-shadow: 0 2px 12px rgba(56, 189, 248, 0.08);
  border: 1px solid #dbeafe;
  min-height: 60px;
  width: 100%;
  border-radius: 0;            /* make it straight, no curve */
}


.ad-content {
  flex: 1;
}

.ad-title {
  font-size: 18px;
  font-weight: 700;
  color: #b87333;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
}

.ad-desc {
  font-size: 14px;
  color: #7a7a7a;
  font-weight: 500;
  line-height: 1.4;
}

.bottom-section {
  flex: 1 1 auto;
  display: flex;
  overflow: hidden;
  gap: 16px;
  flex-wrap: nowrap;
  height: 100%;
  padding: 8px;
}

.left-side, .right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.widget {
  flex: 1;
  background: #ffffff;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  min-height: 0;
  transition: border-color 0.2s ease;
}

.widget:hover {
  border-color: #d1d5db;
}

/* Responsive Design */
@media (max-width: 900px) {
  .bottom-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .left-side .widget {
    max-height: 50vh;
  }
}

@media (max-width: 768px) {
  /* Ad banner responsive */
  .ad-banner {
    margin: 12px 0;
    padding: 16px 20px;
    gap: 14px;
    min-height: 50px;
  }
  
  .ad-title {
    font-size: 16px;
    margin-bottom: 1px;
  }
  
  .ad-desc {
    font-size: 13px;
  }

  .ad-icon {
    font-size: 28px !important;
  }

  .bottom-section {
    padding: 6px;
  }
}

@media (max-width: 480px) {
  .ad-banner {
    margin: 12px 0;
    padding: 14px 16px;
    gap: 12px;
    flex-direction: column;
    text-align: center;
  }
  
  .ad-title {
    font-size: 15px;
  }
  
  .ad-desc {
    font-size: 12px;
  }

  .ad-icon {
    font-size: 24px !important;
  }

  .bottom-section {
    padding: 4px;
    gap: 8px;
  }
}
</style>