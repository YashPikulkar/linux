<template>
  <q-form
    @submit.prevent="handleNext"
    class="q-gutter-md q-pa-md"
    style="width: 100%; max-width: 500px; margin: auto"
  >
    <div class="text-h6 text-black q-mb-md">Step 3: Role Selection</div>

    <div class="text-subtitle1 text-black">Select your role</div>

    <q-select
      filled
      v-model="modelValue.role"
      :options="roleOptions"
      label="Choose your role"
      :rules="[isRequired]"
      ref="roleSelectRef"
      emit-value
      map-options
      class="q-mt-sm rounded-borders"
      @keyup.native="handleKeyup"
    />

    <div class="row justify-between q-mt-md">
      <q-btn flat label="Back" @click="goPrev" />
      <q-btn
        color="black"
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
import { ref } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "RoleSelectionStep",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue", "next", "prev"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const roleSelectRef = ref(null);

    const roleOptions = [
      { label: "Candidate", value: "candidate" },
      { label: "Recruiter", value: "recruiter" },
    ];

    const isRequired = (val) => !!val || "Role is required";

    const handleNext = async () => {
      const valid = await roleSelectRef.value.validate();
      if (valid) {
        emit("next");
      } else {
        $q.notify({
          type: "negative",
          message: "Please select a role to continue.",
          position: "top",
        });
      }
    };

    const handleKeyup = (event) => {
      if (event.key === "Enter") {
        handleNext();
      }
    };

    const goPrev = () => {
      emit("prev");
    };

    return {
      roleOptions,
      isRequired,
      handleNext,
      handleKeyup,
      goPrev,
      roleSelectRef,
    };
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
