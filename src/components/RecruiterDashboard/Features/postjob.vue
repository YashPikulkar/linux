<template>
  <div class="form-wrapper">
    <q-card class="post-job-card">
      <div class="text-h6">
        {{ isPreviewing ? "Preview Job Post" : "Post a Job" }}
      </div>

      <q-form v-if="!isPreviewing" ref="formRef" @submit.prevent="handlePreview">
        <div class="section-title">Basic Details</div>
        <div class="form-entry">
          <q-input v-model="form.title" label="Job Title" filled :rules="[isRequired, maxLength(100)]" />
          <q-input v-model="form.company" label="Company Name" filled readonly />
          <q-select v-model="form.job_type" :options="jobTypes" label="Job Type" filled :rules="[isRequired]" />
        </div>

        <div class="section-title">Job Logistics</div>
        <div class="form-entry">
          <q-select v-model="form.mode_of_work" :options="modeOptions" label="Mode of Work" filled :rules="[isRequired]" />
          <q-input 
            v-model.number="form.exp_required" 
            label="Experience Required (Years)" 
            type="number" 
            filled 
            :rules="[isRequired, isPositiveNumber]" 
            min="0"
            max="50"
          />

          <!-- ✅ Min Salary -->
          <q-input
            v-model="form.salary.min"
            label="Min Salary (e.g. ₹5L or ₹800000)"
            filled
            :rules="[isRequired, isSalaryValid]"
            class="q-mb-md"
          />

          <!-- ✅ Max Salary -->
          <q-input
            v-model="form.salary.max"
            label="Max Salary (e.g. ₹8L or ₹1000000)"
            filled
            :rules="[isRequired, isSalaryValid, () => isMaxGreater(form.salary.min, form.salary.max)]"
          />

          <!-- ✅ Equity (Optional) -->
          <q-input
            v-model.number="form.equity"
            label="Equity % (Optional)"
            type="number"
            filled
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div class="section-title">Location & Skills</div>
        <div class="form-entry">
          <q-select
            v-model="form.lid"
            :options="locationOptions"
            label="Branch Location"
            filled
            :rules="[]"
            emit-value
            map-options
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

        <!-- ✅ Links Section (Optional) -->
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

const formRef = ref(null);
const isPreviewing = ref(false);
const isSubmitting = ref(false);

const recruiterProfile = computed(() => userStore.user);
const locationOptions = computed(() => {
  // Assuming locations are fetched from API or stored in user data
  // You'll need to implement this based on your location table structure
  return userStore.user?.company?.locations?.map(loc => ({
    label: loc.name,
    value: loc.id
  })) || [];
});

const skillOptions = computed(() => {
  // Assuming skills are fetched from API
  // You'll need to implement this based on your skills table structure
  return [
    { label: "Vue.js", value: 1 },
    { label: "JavaScript", value: 2 },
    { label: "HTML", value: 3 },
    { label: "CSS", value: 4 },
    { label: "REST APIs", value: 5 },
    { label: "Node.js", value: 6 },
    { label: "Express", value: 7 },
    { label: "MongoDB", value: 8 },
    { label: "AWS", value: 9 },
    { label: "Docker", value: 10 },
    { label: "Kubernetes", value: 11 },
    { label: "Figma", value: 12 },
    { label: "Sketch", value: 13 },
    { label: "Python", value: 14 },
    { label: "SQL", value: 15 },
  ];
});

const form = ref({
  title: "",
  company: "",
  job_type: "",
  mode_of_work: "",
  exp_required: 0,
  salary: {
    min: "",
    max: ""
  },
  equity: 0,
  lid: null,
  cid: null,
  skillids: [],
  bigDescription: "",
  smallDescription: "",
  links: []
});

const previewJob = computed(() => ({
  ...form.value,
  salary: {
    min: parseSalary(form.value.salary.min),
    max: parseSalary(form.value.salary.max)
  },
  posted: new Date().toISOString().split("T")[0],
}));

const jobTypes = ["Full-time", "Co-founder", "Contract", "internship"];
const modeOptions = ["Online", "Offline", "Hybrid"];

// Validation Rules
const isRequired = (val) => !!val || "This field is required";
const minLength = (n) => (val) =>
  !val || val.length >= n || `Minimum ${n} characters`;
const maxLength = (n) => (val) =>
  !val || val.length <= n || `Maximum ${n} characters`;

const isPositiveNumber = (val) => {
  return (val >= 0 && val <= 50) || "Experience should be between 0-50 years";
};

const isSalaryValid = (val) => {
  if (!val) return 'Salary is required';
  const salary = val.toUpperCase().replace(/[₹\s]/g, '').trim();
  const lMatch = salary.match(/^([1-9]\d{0,3})L$/);
  const kMatch = salary.match(/^([1-9]\d{0,5})K$/);
  const raw = parseInt(salary);
  if (lMatch || kMatch) return true;
  return (
    (!isNaN(raw) && raw > 1000 && raw < 99990000) ||
    'Enter a valid salary like ₹5L or ₹800000'
  );
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

const parseSalary = (val) => {
  if (!val) return 0;
  const salary = val.toUpperCase().replace(/[₹\s]/g, '').trim();
  if (salary.endsWith("L")) return parseFloat(salary) * 100000;
  if (salary.endsWith("K")) return parseFloat(salary) * 1000;
  return parseFloat(salary);
};

const isMaxGreater = (minVal, maxVal) => {
  const min = parseSalary(minVal);
  const max = parseSalary(maxVal);
  return max >= min || "Max salary must be greater than or equal to min salary";
};

// Link management
const addLink = () => {
  form.value.links.push({ label: "", url: "" });
};

const removeLink = (index) => {
  form.value.links.splice(index, 1);
};

onMounted(() => {
  if (recruiterProfile.value?.company) {
    form.value.company = recruiterProfile.value.company.companyName;
    form.value.cid = recruiterProfile.value.company.id;
    
    if (locationOptions.value.length > 0) {
      form.value.lid = locationOptions.value[0].value;
    }
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
    const jobData = {
      uid: recruiterProfile.value.id,
      title: form.value.title,
      bigDescription: form.value.bigDescription,
      smallDescription: form.value.smallDescription,
      job_type: form.value.job_type,
      mode_of_work: form.value.mode_of_work,
      exp_required: form.value.exp_required,
      salary: {
        min: parseSalary(form.value.salary.min),
        max: parseSalary(form.value.salary.max)
      },
      skillids: form.value.skillids,
      equity: form.value.equity || 0,
      lid: form.value.lid,
      cid: form.value.cid,
      links: form.value.links.filter(link => link.label && link.url),
      posted: new Date().toISOString().split('T')[0]
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
    title: "",
    company: recruiterProfile.value?.company?.companyName || "",
    job_type: "",
    mode_of_work: "",
    exp_required: 0,
    salary: {
      min: "",
      max: ""
    },
    equity: 0,
    lid: locationOptions.value.length > 0 ? locationOptions.value[0].value : null,
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
</style>