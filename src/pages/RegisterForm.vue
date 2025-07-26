<template>
  <q-page class="registration-page">
    <div class="registration-container">
      <q-card class="registration-card shadow-10" flat>
        <div class="form-tracker-wrapper">
          <!-- Form Section -->
          <div class="form-container">
            <div class="form-header q-mb-lg">
              <q-icon name="person_add" size="36px" color="black" />
              <div class="text-h5 text-black text-bold text-center q-mt-sm">
                Create Your Account
              </div>
            </div>
            <component
              :is="steps[currentStep].component"
              v-model="formData"
              @next="nextStep"
              @prev="prevStep"
              @submit="handleSubmit"
            />
          </div>

          <!-- Divider -->
          <div class="separator" />

          <!-- Tracker Section -->
          <div class="tracker-container">
            <div class="tracker-content">
              <div class="tracker-header text-center q-mb-md">
                <q-icon name="track_changes" size="32px" color="black" />
                <div class="text-h6 text-black text-bold q-mt-sm">
                  Registration Progress
                </div>
              </div>
              <q-timeline layout="dense" color="black">
                <q-timeline-entry
                  v-for="(step, index) in steps"
                  :key="index"
                  :title="step.title"
                  :subtitle="step.subtitle"
                  :icon="index < currentStep ? 'check' : step.icon"
                  :color="
                    index < currentStep
                      ? 'green'
                      : index === currentStep
                      ? 'black'
                      : 'grey-5'
                  "
                />
              </q-timeline>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import StepOne from "src/components/Register/StepOne.vue";
import StepTwo from "src/components/Register/StepTwo.vue";
import StepThree from "src/components/Register/StepThree.vue";
import StepFour from "src/components/Register/StepFour.vue";

const router = useRouter();

const currentStep = ref(0);

const steps = [
  {
    title: "Step 1",
    subtitle: "Personal Info",
    icon: "person",
    component: StepOne,
  },
  {
    title: "Step 2",
    subtitle: "Verification",
    icon: "verified_user",
    component: StepTwo,
  },
  {
    title: "Step 3",
    subtitle: "Job Selection",
    icon: "work",
    component: StepThree,
  },
  {
    title: "Step 4",
    subtitle: "Confirm Details",
    icon: "check_circle",
    component: StepFour,
  },
];

const formData = ref({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  retypePassword: "",
  otp: "",
  role: "",
});

function nextStep() {
  if (currentStep.value < steps.length - 1) currentStep.value++;
}
function prevStep() {
  if (currentStep.value > 0) currentStep.value--;
}
function handleSubmit() {
  console.log("✅ Final Submitted Data:", formData.value);

  if (formData.value.role === "candidate") {
    router.push("/userdashboard");
  } else if (formData.value.role === "recruiter") {
    router.push("/recruiterdashboard");
  } else {
    // Optional: fallback or error handling
    console.warn("Unknown role, cannot route.");
  }
}
</script>

<style scoped>
.registration-page {
  background: linear-gradient(to bottom right, #f0f4ff, #e3ecff);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
}

.registration-container {
  width: 100%;
  max-width: 1200px;
}

.registration-card {
  border-radius: 24px;
  background-color: #ffffff;
  padding: 48px;
  box-sizing: border-box;
  transition: box-shadow 0.3s;
}

.form-tracker-wrapper {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: stretch;
}

/* Form Section */
.form-container {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  padding-right: 24px;
  border-right: 1px solid #e0e0e0;
}

.form-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Tracker Section */

.tracker-container {
  flex: 1;
  min-width: 320px;
  display: flex;
  align-items: center; /* Align content to top */
  justify-content: center; /* Optional: left-align inside */
  padding-left: 48px;
  margin-left: 16px;
}

.tracker-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px; /* space between title and timeline */
}
/* Divider Line */
.separator {
  display: none;
}

.tracker-content q-timeline {
  margin-top: 16px; /* or 24px for more gap */
}
/* Responsive adjustments */
@media (max-width: 900px) {
  .form-tracker-wrapper {
    flex-direction: column;
  }

  .form-container {
    padding-right: 0;
    border-right: none;
  }

  .tracker-container {
    padding-left: 0;
    margin-top: 32px;
  }

  .registration-card {
    padding: 24px;
  }
}
</style>
