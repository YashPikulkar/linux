<template>
  <q-form
    @submit.prevent="handleNext"
    @validation-error="onInvalid"
    ref="formRef"
    class="q-gutter-md q-pa-md"
    style="width: 100%; max-width: 500px; margin: auto"
  >
    <div class="text-h6 text-primary q-mb-md">Step 1: Personal Information</div>

    <q-input
      outlined
      v-model.trim="modelValue.firstName"
      :rules="[isRequired, isAlphaOnly, maxLength(15)]"
      label="Full Name"
      class="rounded-borders"
    />

    <q-input
      outlined
      v-model.trim="modelValue.email"
      label="Email Address"
      :rules="[isRequired, isValidEmailFormat, isAllowedEmailDomain]"
      class="rounded-borders"
    />

    <q-input
      outlined
      v-model.trim="modelValue.phone"
      label="Phone"
      :rules="[isRequired, isPhoneValid]"
      class="rounded-borders"
    />

    <q-input
      outlined
      :type="showPassword ? 'text' : 'password'"
      v-model.trim="modelValue.password"
      label="Password"
      :rules="[isRequired, isStrongPassword]"
      class="rounded-borders"
    >
      <template #append>
        <q-icon
          :name="showPassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="showPassword = !showPassword"
        />
      </template>
    </q-input>

    <q-input
      outlined
      :type="showRetypePassword ? 'text' : 'password'"
      v-model.trim="modelValue.retypePassword"
      label="Confirm Password"
      :rules="[isRequired, isPasswordMatch]"
      class="rounded-borders"
    >
      <template #append>
        <q-icon
          :name="showRetypePassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="showRetypePassword = !showRetypePassword"
        />
      </template>
    </q-input>

    <div class="row justify-end q-mt-md">
      <q-btn
        color="primary"
        label="Next"
        type="submit"
        class="full-width"
        unelevated
        rounded
      />
    </div>
  </q-form>
</template>

<script>
export default {
  name: "StepOneForm",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue", "next"],
  data() {
    return {
      showPassword: false,
      showRetypePassword: false,
      formRef: null,
    };
  },
  methods: {
    handleNext() {
      this.$emit("next");
    },
    onInvalid() {
      console.warn("Form has validation errors");
    },
    // Rules
    isRequired(val) {
      return !!val || "This field is required";
    },
    isAlphaOnly(val) {
      return /^[a-zA-Z\s]+$/.test(val) || "Only letters allowed";
    },
    maxLength(max) {
      return (val) => !val || val.length <= max || `Max ${max} characters`;
    },
    isPhoneValid(val) {
      return /^\+?\d{10,15}$/.test(val) || "Invalid phone number";
    },
    isStrongPassword(val) {
      return (
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/.test(val) ||
        "Password must include uppercase, lowercase, number, and special character"
      );
    },
    isPasswordMatch(val) {
      return val === this.modelValue.password || "Passwords do not match";
    },
    isValidEmailFormat(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Enter a valid email";
    },
    isAllowedEmailDomain(val) {
      return (
        val.endsWith("@example.com") || "Only @example.com domain is allowed"
      );
    },
  },
};
</script>

<style scoped>
.rounded-borders .q-field__control {
  border-radius: 12px !important;
}

.q-form {
  font-family: "Inter", "Roboto", sans-serif;
}
</style>
