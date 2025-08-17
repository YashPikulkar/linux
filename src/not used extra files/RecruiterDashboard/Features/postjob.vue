<template>
  <div class="form-wrapper">
    <q-card class="post-job-card">
      <div class="text-h6">
        {{ isPreviewing ? "Preview Job Post" : "Post a Job" }}
      </div>

      <q-form v-if="!isPreviewing" ref="formRef" @submit.prevent="handlePreview">
        <div class="section-title">Basic Details</div>
        <div class="form-entry">
          <q-input v-model="form.custom_title" label="Job Title" filled :rules="[isRequired, maxLength(100)]" />
          <q-input v-model="form.company" label="Company Name" filled readonly />
          <q-select v-model="form.job_type" :options="jobTypes" label="Job Type" filled :rules="[isRequired]" />
        </div>

        <div class="section-title">Job Logistics</div>
        <div class="form-entry">
          <q-select v-model="form.mode_of_work" :options="modeOptions" label="Mode of Work" filled :rules="[isRequired]" />
          
          <!-- Experience Range -->
          <div class="experience-range">
            <q-input 
              v-model.number="form.experience_min" 
              label="Min Experience (Years)" 
              type="number" 
              filled 
              :rules="[isRequired, isPositiveNumber]" 
              min="0"
              max="50"
              class="experience-input"
            />
            <q-input 
              v-model.number="form.experience_max" 
              label="Max Experience (Years)" 
              type="number" 
              filled 
              :rules="[isPositiveNumber, validateExperienceRange]" 
              min="0"
              max="50"
              class="experience-input"
            />
          </div>

          <!-- Salary Range -->
          <div class="salary-range">
            <q-input
              v-model.number="form.salary_min"
              label="Min Salary (₹)"
              type="number"
              filled
              :rules="[isRequired, isSalaryValid]"
              min="1000"
              placeholder="e.g. 400000"
              class="salary-input"
            />
            <q-input
              v-model.number="form.salary_max"
              label="Max Salary (₹)"
              type="number"
              filled
              :rules="[isSalaryValid, validateSalaryRange]"
              min="1000"
              placeholder="e.g. 600000"
              class="salary-input"
            />
          </div>

          <!-- Equity Range (Optional) -->
          <div class="equity-range">
            <q-input
              v-model.number="form.equity_min"
              label="Min Equity % (Optional)"
              type="number"
              filled
              min="0"
              max="100"
              step="0.1"
              class="equity-input"
            />
            <q-input
              v-model.number="form.equity_max"
              label="Max Equity % (Optional)"
              type="number"
              filled
              min="0"
              max="100"
              step="0.1"
              :rules="[validateEquityRange]"
              class="equity-input"
            />
          </div>

          <!-- Number of Openings -->
          <q-input
            v-model.number="form.opening"
            label="Number of Openings"
            type="number"
            filled
            :rules="[isRequired, isPositiveOpenings]"
            min="1"
            max="100"
          />
        </div>

        <div class="section-title">Additional Details</div>
        <div class="form-entry">
          <!-- Qualification ID (Simple integer input for now) -->
          <q-input
            v-model.number="form.qualification_id"
            label="Qualification ID (Optional)"
            type="number"
            filled
            min="1"
            placeholder="Enter qualification ID"
          />
          
          <!-- Market ID (Simple integer input for now) -->
          <q-input
            v-model.number="form.marketid"
            label="Market ID (Optional)"
            type="number"
            filled
            min="1"
            placeholder="Enter market ID"
          />
        </div>

        <div class="section-title">Location & Skills</div>
        <div class="form-entry">
          <q-select
            v-model="form.lid"
            :options="locationOptions"
            label="Branch Location"
            filled
            :rules="[isRequired]"
            emit-value
            map-options
            :loading="locationsLoading"
            :disable="locationsLoading"
          />
          <q-select
            v-model="form.skillids"
            :options="skillOptions"
            label="Required Skills"
            filled
            use-chips
            multiple
            :rules="[isRequired]"
            emit-value
            map-options
            :loading="skillsLoading"
            :disable="skillsLoading"
          />
        </div>

        <div class="section-title">Description</div>
        <div class="form-entry">
          <q-input
            v-model="form.smallDescription"
            label="Short Description"
            type="textarea"
            filled
            :rules="[minLength(10), maxLength(100), isRequired]"
            placeholder="e.g. A brief summary of the job role"
          />
        </div>

        <div class="form-entry q-mt-md">
          <q-input
            v-model="form.bigDescription"
            label="Detailed Job Description"
            type="textarea"
            filled
            :rules="[minLength(20), isRequired]"
            placeholder="e.g. Full responsibilities, requirements, etc."
            rows="6"
          />
        </div>

        <!-- Links Section (Optional) -->
        <div class="section-title">Additional Links (Optional)</div>
        <div class="form-entry">
          <div v-for="(link, index) in form.links" :key="index" class="link-row">
            <q-input
              v-model="link.label"
              label="Link Label"
              filled
              class="link-label"
              placeholder="e.g. Company Website"
            />
            <q-input
              v-model="link.url"
              label="URL"
              filled
              class="link-url"
              placeholder="https://example.com"
              :rules="[isValidUrl]"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="removeLink(index)"
              class="link-remove"
            />
          </div>
          <q-btn
            flat
            color="primary"
            icon="add"
            label="Add Link"
            @click="addLink"
            class="q-mt-sm"
          />
        </div>

        <q-card-actions align="right">
          <q-btn type="submit" label="Preview Job" color="primary" />
        </q-card-actions>
      </q-form>

      <!-- Preview Mode -->
      <div v-else class="form-wrapper">
        <q-separator />
        <q-card-section>
          <JobCardPreview :job="previewJob" />
        </q-card-section>
        <q-card-actions align="between" class="q-pa-md">
          <q-btn flat label="Back to Edit" color="grey-6" @click="isPreviewing = false" />
          <q-btn label="Submit Job" color="primary" @click="submitJob" :loading="isSubmitting" />
        </q-card-actions>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useJobsStore } from "src/stores/jobStore";
import { useUserStore } from "src/stores/user-store";
import JobCardPreview from "src/components/Jobs/ListJobs/JobCard.vue";

const $q = useQuasar();
const jobsStore = useJobsStore();
const userStore = useUserStore();

// Base URL for API calls
const baseUrl = "http://localhost:3000";

const formRef = ref(null);
const isPreviewing = ref(false);
const isSubmitting = ref(false);

// Loading states for dropdowns
const skillsLoading = ref(false);
const locationsLoading = ref(false);

// Data arrays
const skills = ref([]);
const locations = ref([]);

const recruiterProfile = computed(() => userStore.user);

// Convert skills and locations to select options
const skillOptions = computed(() => 
  skills.value.map(skill => ({
    label: skill.name,
    value: skill.id
  }))
);

const locationOptions = computed(() => 
  locations.value.map(location => ({
    label: location.name,
    value: location.id
  }))
);

const form = ref({
  custom_title: "",
  company: "",
  job_type: "",
  mode_of_work: "",
  experience_min: 0,
  experience_max: 0,
  salary_min: 0,
  salary_max: 0,
  equity_min: 0,
  equity_max: 0,
  opening: 1,
  qualification_id: null,
  marketid: null,
  lid: null,
  cid: null,
  skillids: [],
  bigDescription: "",
  smallDescription: "",
  links: []
});

const previewJob = computed(() => ({
  ...form.value,
  posted: new Date().toISOString().split("T")[0],
}));

const jobTypes = ["Full-time", "Co-founder", "Contract", "Internship"];
const modeOptions = ["Online", "Offline", "Hybrid"];

// API Functions
async function getAllSkills() {
  try {
    skillsLoading.value = true;
    const res = await fetch(`${baseUrl}/skills/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch skills`);
    }

    const data = await res.json();
    console.log('Skills response:', data);
    
    // Handle your current skills API format: {success: true, skills: [[id, name], [id, name]]}
    if (data.success && data.skills && Array.isArray(data.skills)) {
      skills.value = data.skills.map(skill => ({
        id: skill[0], // skillid
        name: skill[1] // skillName
      }));
    } else {
      throw new Error('Invalid skills data format');
    }
  } catch (error) {
    console.error('Error fetching skills:', error);
    $q.notify({
      type: "negative",
      message: `Failed to load skills: ${error.message}`,
    });
    skills.value = []; // Set empty array as fallback
  } finally {
    skillsLoading.value = false;
  }
}

async function getAllLocations() {
  try {
    locationsLoading.value = true;
    const res = await fetch(`${baseUrl}/location/location`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch locations`);
    }

    const data = await res.json();
    console.log('Locations response:', data);
    
    // Handle locations API format: {success: true, locations: [[id, name], [id, name]]}
    if (data.success && data.locations && Array.isArray(data.locations)) {
      locations.value = data.locations.map(location => ({
        id: location[0], // lid
        name: location[1] // lname
      }));
    } else {
      throw new Error('Invalid locations data format');
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
    $q.notify({
      type: "negative",
      message: `Failed to load locations: ${error.message}`,
    });
    locations.value = []; // Set empty array as fallback
  } finally {
    locationsLoading.value = false;
  }
}

// Validation Rules
const isRequired = (val) => !!val || "This field is required";
const minLength = (n) => (val) =>
  !val || val.length >= n || `Minimum ${n} characters`;
const maxLength = (n) => (val) =>
  !val || val.length <= n || `Maximum ${n} characters`;

const isPositiveNumber = (val) => {
  return (val >= 0 && val <= 50) || "Experience should be between 0-50 years";
};

const isPositiveOpenings = (val) => {
  return (val >= 1 && val <= 100) || "Openings should be between 1-100";
};

const isSalaryValid = (val) => {
  if (!val || val < 1000) return 'Salary must be at least ₹1,000';
  if (val > 99990000) return 'Salary seems too high';
  return true;
};

const validateExperienceRange = (val) => {
  if (!val) return true; // Optional max experience
  if (form.value.experience_min && val < form.value.experience_min) {
    return 'Max experience should be greater than or equal to min experience';
  }
  return true;
};

const validateSalaryRange = (val) => {
  if (!val) return true; // Optional max salary
  if (form.value.salary_min && val < form.value.salary_min) {
    return 'Max salary should be greater than or equal to min salary';
  }
  return true;
};

const validateEquityRange = (val) => {
  if (!val) return true; // Optional max equity
  if (form.value.equity_min && val < form.value.equity_min) {
    return 'Max equity should be greater than or equal to min equity';
  }
  return true;
};

const isValidUrl = (val) => {
  if (!val) return true; // Optional field
  try {
    new URL(val);
    return true;
  } catch {
    return 'Please enter a valid URL';
  }
};

// Link management
const addLink = () => {
  form.value.links.push({ label: "", url: "" });
};

const removeLink = (index) => {
  form.value.links.splice(index, 1);
};

onMounted(async () => {
  // Load skills and locations from backend
  await Promise.all([getAllSkills(), getAllLocations()]);

  // Set company data if available
  if (recruiterProfile.value?.company) {
    form.value.company = recruiterProfile.value.company.companyName;
    form.value.cid = recruiterProfile.value.company.id;
  }
});

async function handlePreview() {
  const success = await formRef.value.validate();
  if (!success) {
    $q.notify({
      type: "negative",
      message: "Please fix the form errors before previewing.",
    });
    return;
  }

  isPreviewing.value = true;
}

async function submitJob() {
  console.log('🔥 SUBMIT JOB FUNCTION CALLED!');
  
  isSubmitting.value = true;
  
  try {
    // Backend derives uid and cid from authenticated user, so we don't send them
    const jobData = {
      custom_title: form.value.custom_title,
      bigDescription: form.value.bigDescription,
      smallDescription: form.value.smallDescription,
      job_type: form.value.job_type,
      mode_of_work: form.value.mode_of_work,
      experience_min: form.value.experience_min,
      experience_max: form.value.experience_max,
      salary_min: form.value.salary_min,
      salary_max: form.value.salary_max,
      equity_min: form.value.equity_min || 0,
      equity_max: form.value.equity_max || 0,
      opening: form.value.opening,
      qualification_id: form.value.qualification_id,
      marketid: form.value.marketid,
      skillids: form.value.skillids,
      lid: form.value.lid,
      links: form.value.links.filter(link => link.label && link.url)
    };

    const result = await jobsStore.postJob(jobData);

    console.log('Job submission result:', result);
    console.log('Job data being submitted:', jobData);

    if (result.success) {
      $q.notify({
        type: "positive",
        message: "Job posted successfully!",
      });

      resetForm();
      isPreviewing.value = false;
    } else {
      $q.notify({
        type: "negative",
        message: result.message,
      });
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "An error occurred while posting the job",
    });
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  form.value = {
    custom_title: "",
    company: recruiterProfile.value?.company?.companyName || "",
    job_type: "",
    mode_of_work: "",
    experience_min: 0,
    experience_max: 0,
    salary_min: 0,
    salary_max: 0,
    equity_min: 0,
    equity_max: 0,
    opening: 1,
    qualification_id: null,
    marketid: null,
    lid: null,
    cid: recruiterProfile.value?.company?.id || null,
    skillids: [],
    bigDescription: "",
    smallDescription: "",
    links: []
  };

  formRef.value?.resetValidation();
}
</script>

<style scoped>
.post-job-card {
  width: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}

.form-header {
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: -12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #444;
}

.form-entry {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  min-height: 0;
}

.link-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.link-label {
  flex: 0 0 30%;
}

.link-url {
  flex: 1;
}

.link-remove {
  flex: 0 0 auto;
  margin-top: 8px;
}

/* New styles for range inputs */
.experience-range,
.salary-range,
.equity-range {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.experience-input,
.salary-input,
.equity-input {
  flex: 1;
}
</style>