<template>
    <q-form @submit.prevent="submitOtp" class="q-gutter-md" style="width: 100%;">
      <div class="text-subtitle1 text-primary">
        Enter OTP sent to {{ modelValue.email }}
      </div>
  
      <div class="row justify-center q-my-md">
        <q-input
          v-for="(digit, index) in otpDigits"
          :key="index"
          :ref="el => otpRefs[index] = el"
          v-model="otpDigits[index]"
          mask="#"
          maxlength="1"
          outlined
          dense
          class="otp-box q-mx-xs"
          input-class="text-center"
          @keyup="handleKeyup($event, index)"
        />
      </div>
  
      <div class="row justify-between q-mt-md">
        <q-btn flat label="Back" @click="emit('prev')" />
        <q-btn color="primary" label="Next" type="submit" />
      </div>
    </q-form>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
  import { useQuasar } from 'quasar'
  
  const $q = useQuasar()
  const emit = defineEmits(['next', 'prev'])
  const modelValue = defineModel()
  
  const otpDigits = ref(['', '', '', '', '', ''])
  const otpRefs = [] // manual collection
  
  function handleKeyup(e, index) {
    const key = e.key
    if (key === 'Backspace') {
      if (!otpDigits.value[index] && index > 0) {
        focusInput(index - 1)
      }
    } else if (/^\d$/.test(key) && index < 5) {
      nextTick(() => focusInput(index + 1))
    }
  }
  
  function focusInput(index) {
    const input = otpRefs[index]?.$el?.querySelector('input')
    input?.focus()
  }
  
  function submitOtp() {
    const joined = otpDigits.value.join('')
    if (joined.length === 6) {
      if (modelValue?.value) {
        modelValue.value.otp = joined
        emit('next')
      } else {
        $q.notify({ type: 'negative', message: 'Model binding error.' })
      }
    } else {
      $q.notify({
        type: 'negative',
        message: 'Please enter a valid 6-digit OTP.'
      })
    }
  }
  </script>
  
  <style scoped>
  .otp-box {
    width: 50px;
  }
  </style>