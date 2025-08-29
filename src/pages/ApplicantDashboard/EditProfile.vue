<template>
  <div class="bottom-section row q-mt-sm">
    <div class="left-side">
      <AdditionalDetails class="widget" />
    </div>

    <div class="right-side column q-ml-sm">
      <!-- Added custom classes for individual control -->
      <ApplicantEducation class="widget education-widget" />
      <ApplicantSkills class="widget skills-widget" />
    </div>
  </div>
</template>

<script setup>
import ApplicantEducation from 'src/components/ApplicantDashboard/ApplicantEducation.vue'
import ApplicantSkills from 'src/components/ApplicantDashboard/ApplicantSkills.vue'
import AdditionalDetails from 'src/components/ApplicantDashboard/AdditionalDetails.vue'
</script>

<style scoped>
.bottom-section {
  flex: 1 1 auto;
  padding: 5px;
  display: flex;
  overflow: hidden;
  gap: 12px;
  flex-wrap: nowrap;
}

.left-side {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Base widget styling */
.widget {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
}

/* Left side should scroll if too large */
.left-side .widget {
  flex: 1;
  max-height: 80vh;
  overflow-y: auto;
}

/* Right side widgets */
.right-side .widget {
  overflow-y: auto;
}

/* 🎯 Individual control */
.education-widget {
  flex: none; /* fixed height */
  max-height: 51vh; /* adjust as needed */
}

.skills-widget {
  flex: 1; /* takes remaining space */
  max-height: none; /* let flexbox handle it */
  min-height: 200px; /* optional: ensures a base size */
}

.widget:last-child {
  margin-bottom: 0;
}

/* MOBILE FIX */
@media (max-width: 900px) {
  .bottom-section {
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .right-side {
    margin-left: 0 !important;
  }

  .left-side .widget {
    max-height: 60vh;
    overflow-y: auto;
  }

  .education-widget {
    max-height: 30vh;
  }

  .skills-widget {
    flex: 1;
    max-height: none;
    min-height: 150px;
  }
}

/* CUSTOM SCROLLBAR */
.widget::-webkit-scrollbar {
  width: 8px;
}
.widget::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}
.widget::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 8px;
}
.widget::-webkit-scrollbar-thumb:hover {
  background: #b3b3b3;
}

/* Firefox */
.widget {
  scrollbar-width: thin;
  scrollbar-color: #ccc #f1f1f1;
}
</style>
