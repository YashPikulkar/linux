<template>
  <q-card class="company-job-card q-pa-md q-mb-md full-width" flat bordered>
    <!-- Top Row: Logo, Name, Status -->
    <div class="row items-start q-gutter-sm">
      <q-avatar size="64px" class="custom-logo-avatar q-mt-xs">
        <img :src="jobData.logo" />
      </q-avatar>

      <div class="col">
        <div class="row items-center q-gutter-xs">
          <div class="text-subtitle1 text-weight-bold">{{ jobData.name }}</div>
          <div v-if="job.hiringStatus" class="custom-chip custom-chip-black">
            {{ jobData.hiringStatus }}
          </div>
          <div v-if="job.companyType" class="custom-chip custom-chip-blue">
            {{ jobData.companyType }}
          </div>
          <div v-if="job.jobType" class="custom-chip custom-chip-blue">
            {{ jobData.job_type }}
          </div>
        </div>

        <div class="description-text">{{ job.smallDescription }}</div>
        <div class="text-caption text-grey-6">{{ job.opening }}</div>
      </div>
    </div>

    <!-- Tags -->
    <div class="row q-mt-sm q-gutter-xs">
      <div
        v-for="(tag, i) in jobData.tags"
        :key="i"
        class="custom-chip custom-chip-pink row items-center no-wrap"
      >
        <span class="chip-label">{{ tag }}</span>
      </div>
    </div>

    <!-- Job Details Inner Card -->
    <div class="q-mt-xs q-mx-none">
      <q-card class="inner-job-card q-py-xs q-px-md q-mx-none" flat bordered>
        <div class="row q-col-gutter-sm items-center justify-between">
          <!-- Job info (left) -->
          <div class="col-8 col-md-8">
            <div class="job-title">{{ jobData.title }}</div>
            <div class="job-meta">
              {{ jobData.location }} • ₹{{ jobData.salary }}L
            </div>
          </div>

          <!-- Buttons (right) -->
          <div class="col-4 col-md-4 text-right">
            <div class="row items-center justify-end q-gutter-sm no-wrap">
              <div>
                <div class="text-caption text-positive text-uppercase">
                  Recruiter Recently Active
                </div>
                <div class="text-caption text-grey-6">
                  Posted {{ jobData.posted }}
                </div>
              </div>
              <q-btn
                flat
                dense
                label="Apply"
                class="btn-outline-black equal-button"
              />
              <q-btn
                unelevated
                dense
                label="Learn More"
                class="btn-filled-black equal-button"
                @click.stop="goToDetails"
              />
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Footer Options -->
    <div class="row items-center justify-end q-mt-sm q-gutter-md">
      <div
        class="report-hide-item row items-center cursor-pointer text-grey-7 text-caption"
      >
        <q-icon name="flag" size="16px" class="q-mr-xs" />
        <span>Report</span>
      </div>
      <div
        class="report-hide-item row items-center cursor-pointer text-grey-7 text-caption"
      >
        <q-icon name="block" size="16px" class="q-mr-xs" />
        <span>Hide</span>
      </div>
    </div>
    <div class="arrow-symbol">&gt;</div>
  </q-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import demoLogo from "../../../assets/user (2).png";
import { reactive } from "vue";

const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
});

const jobData = reactive({
  logo: props.job.logo || demoLogo,
  name: props.job.company.name || "No name",
  hiringStatus: props.job.company.status || "No status",
  companyType: props.job.company.type || [],
  job_type: props.job.job_type || "No jtype",
  tags: props.job.company.tags || [],
  title: props.job.title || "No title",
  location: props.job.location || "No location",
  salary: props.job.salary || 0,
  posted: props.job.posted.split("T")[0] || "1990-08-08",
});

const router = useRouter();

function goToDetails() {
  router.push({
    name: "JobApply",
    params: { id: props.job.id },
  });
}
</script>

<style scoped>
.company-job-card {
  background-color: #f9f9f9;
  border-radius: 0px;
  transition: box-shadow 0.3s;
  position: relative;
  width: 100%;
}
.company-job-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.inner-job-card {
  background-color: #ffffff;
  border-radius: 0px;
  cursor: pointer;
  transition: background-color 0.2s;
  overflow: hidden;
  width: 100%;
}
.inner-job-card:hover {
  background-color: #f9f9f9;
}
.custom-chip {
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  line-height: 1;
  cursor: default;
}
.custom-chip-pink {
  border: 1px solid #ff4c61;
  background-color: #fff1f3;
  color: #1d1d1f;
}
.custom-chip-blue {
  border: 1px solid #007aff;
  background-color: #f0f7ff;
  color: #1d1d1f;
}
.custom-chip-black {
  border: 1px solid #28a745;
  background-color: #e6f4ea;
  color: #1d1d1f;
}
.chip-label {
  padding: 0 6px;
}
.equal-button {
  width: 100px;
  padding: 2px 8px;
  font-weight: 600;
  font-size: 14px;
  text-transform: none;
  border-radius: 4px;
}
.btn-outline-black {
  border: 1px solid black;
  color: black;
  background-color: white;
}
.btn-filled-black {
  background-color: black;
  color: white;
}
.description-text {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1d1d1f;
  line-height: 1.4;
}
.arrow-symbol {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 24px;
  color: #999999;
}
.custom-logo-avatar {
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 4px;
}
.custom-logo-avatar img {
  border-radius: 12px;
}
</style>
