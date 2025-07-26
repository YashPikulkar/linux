<template>
  <q-page class="registration-page">
    <div class="outer-card-container">
      <q-card class="registration-card shadow-2" flat>
        <div class="form-tracker-wrapper">
          <!-- Form -->
          <div class="form-container">
            <div class="text-h6 text-primary text-center q-mb-lg">
              Create Your Account
            </div>
            <component
              :is="steps[currentStep].component"
              v-model="formData"
              @next="nextStep"
              @prev="prevStep"
              @submit="handleSubmit"
            />
          </div>

          <!-- Vertical Separator -->
          <div class="separator"></div>

          <!-- Step Tracker -->
          <div class="tracker-container">
            <div class="text-h6 text-primary text-center q-mb-md">
              Registration Progress
            </div>
            <q-timeline layout="dense" color="primary">
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
                    ? 'primary'
                    : 'grey'
                "
              />
            </q-timeline>
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
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function handleSubmit() {
  console.log("✅ Final Submitted Data:", formData.value);
  router.push({ name: "dashboard" });
}
</script>

<style scoped>
.registration-page {
  background-color: #f0f4ff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 5vw;
  padding-right: 5vw;
  box-sizing: border-box;
}

.outer-card-container {
  max-width: 1100px;
  width: 100%;
}

.registration-card {
  border-radius: 16px;
  background-color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.form-tracker-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.form-container {
  flex: 1;
  min-width: 300px;
}

.tracker-container {
  flex: 1;
  min-width: 300px;
  max-height: 100%;
  overflow-y: auto;
}

.separator {
  width: 1px;
  background-color: #ccc;
  height: auto;
  align-self: stretch;
}

@media (max-width: 900px) {
  .form-tracker-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .separator {
    display: none;
  }

  .form-container,
  .tracker-container {
    width: 100%;
  }

  .tracker-container {
    margin-top: 32px;
  }
}
</style>
