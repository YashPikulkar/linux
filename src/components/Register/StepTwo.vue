<template>
  <q-form
    @submit.prevent="submitOtp"
    class="q-gutter-md q-pa-md"
    style="width: 100%; max-width: 500px; margin: auto"
  >
    <div class="text-h6 text-primary q-mb-md">Step 2: OTP Verification</div>
    <div class="text-subtitle1 text-center text-primary">
      Enter OTP sent to {{ modelValue.email }}
    </div>

    <div class="row justify-center q-my-md">
      <q-input
        v-for="(digit, index) in otpDigits"
        :key="index"
        :ref="setOtpRef(index)"
        v-model="otpDigits[index]"
        mask="#"
        maxlength="1"
        outlined
        dense
        class="otp-box q-mx-xs rounded-borders"
        input-class="text-center text-h6"
        @keyup="handleKeyup($event, index)"
      />
    </div>

    <div class="row justify-between q-mt-md">
      <q-btn flat label="Back" @click="goPrev" />
      <q-btn
        color="primary"
        label="Next"
        type="submit"
        rounded
        unelevated
        class="full-width"
      />
    </div>
  </q-form>
</template>

<script>
import { ref, nextTick } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "OtpVerificationStep",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue", "next", "prev"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const otpDigits = ref(["", "", "", "", "", ""]);
    const otpRefs = [];

    const setOtpRef = (index) => (el) => {
      otpRefs[index] = el;
    };

    const handleKeyup = (e, index) => {
      const key = e.key;
      if (key === "Backspace") {
        if (!otpDigits.value[index] && index > 0) {
          focusInput(index - 1);
        }
      } else if (/^\d$/.test(key) && index < 5) {
        nextTick(() => focusInput(index + 1));
      }
    };

    const focusInput = (index) => {
      const input = otpRefs[index]?.$el?.querySelector("input");
      input?.focus();
    };

    const submitOtp = () => {
      const joined = otpDigits.value.join("");
      if (joined.length === 6) {
        if (props.modelValue) {
          emit("update:modelValue", { ...props.modelValue, otp: joined });
          emit("next");
        } else {
          $q.notify({ type: "negative", message: "Model binding error." });
        }
      } else {
        $q.notify({
          type: "negative",
          message: "Please enter a valid 6-digit OTP.",
        });
      }
    };

    const goPrev = () => {
      emit("prev");
    };

    return {
      otpDigits,
      setOtpRef,
      handleKeyup,
      submitOtp,
      goPrev,
    };
  },
};
</script>

<style scoped>
.otp-box {
  width: 50px;
}

.rounded-borders .q-field__control {
  border-radius: 12px !important;
}

.q-form {
  font-family: "Inter", "Roboto", sans-serif;
}
</style>
