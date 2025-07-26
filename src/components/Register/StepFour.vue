<template>
  <div class="q-pa-md" style="max-width: 500px; margin: auto">
    <div class="text-h6 text-primary q-mb-md">Step 4: Review and Confirm</div>

    <q-card flat bordered class="rounded-borders">
      <q-card-section>
        <div class="text-subtitle2 text-grey-8 q-mb-sm">Full Name</div>
        <div class="text-body1">{{ modelValue.firstName }}</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <div class="text-subtitle2 text-grey-8 q-mb-sm">Email</div>
        <div class="text-body1">{{ modelValue.email }}</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <div class="text-subtitle2 text-grey-8 q-mb-sm">Phone</div>
        <div class="text-body1">{{ modelValue.phone }}</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <div class="text-subtitle2 text-grey-8 q-mb-sm">Role</div>
        <div class="text-body1">{{ modelValue.role }}</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section class="row items-center">
        <div class="col">
          <div class="text-subtitle2 text-grey-8 q-mb-sm">Password</div>
          <div class="text-body1">
            {{
              showPassword
                ? modelValue.password
                : "*".repeat(modelValue.password?.length || 8)
            }}
          </div>
        </div>
        <q-btn
          flat
          dense
          size="sm"
          :icon="showPassword ? 'visibility_off' : 'visibility'"
          @click="togglePassword"
          class="q-ml-sm"
        />
      </q-card-section>
    </q-card>

    <div class="row justify-between q-mt-lg">
      <q-btn flat label="Back" @click="goPrev" />
      <q-btn
        color="primary"
        label="Confirm & Proceed"
        @click="submitForm"
        rounded
        unelevated
        class="full-width"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ReviewConfirmStep",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["prev", "submit"],
  setup(props, { emit }) {
    const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const goPrev = () => {
      emit("prev");
    };

    const submitForm = () => {
      emit("submit");
    };

    return {
      showPassword,
      togglePassword,
      goPrev,
      submitForm,
    };
  },
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}

.q-card-section {
  font-family: "Inter", "Roboto", sans-serif;
}
</style>
