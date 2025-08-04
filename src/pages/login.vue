<template>
  <q-page class="q-pa-none row full-height">
    <!-- LEFT: Login Form -->
    <div class="col-12 col-md-6 flex flex-center bg-white q-pa-xl q-pa-sm-md">
      <q-form @submit.prevent="handleLogin" class="q-gutter-md form-wrapper">
        <q-card flat bordered class="q-pa-md rounded-borders shadow-2 bg-white full-width">
          <q-card-section>
            <div class="text-h6 login-title">Login</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <!-- Email -->
            <q-input
              filled
              v-model.trim="loginData.email"
              label="Email"
              :rules="[isRequired, isValidEmail]"
              class="full-width"
            />

            <!-- Password -->
            <q-input
              filled
              :type="showPassword ? 'text' : 'password'"
              v-model.trim="loginData.password"
              label="Password"
              :rules="[isRequired]"
              class="full-width"
            >
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions class="q-gutter-sm q-pt-sm" align="right">
            <q-btn label="Enter" type="submit" class="login-btn" flat />
            <q-btn label="Cancel" @click="handleCancel" class="cancel-btn" flat />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>

    <!-- RIGHT: Welcome Image -->
    <div class="col-12 col-md-6 flex flex-right image-wrapper">
      <img
        src="https://cdn.quasar.dev/img/login-background.jpg"
        alt="Welcome"
        class="welcome-img"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginData = ref({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)

const isRequired = val => !!val || 'This field is required'
const isValidEmail = val =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Enter a valid email'

function handleLogin () {
  console.log('Login payload:', loginData.value)
  // Place real login logic here
}

function handleCancel () {
  loginData.value.email = ''
  loginData.value.password = ''
  loginData.value.rememberMe = false
  // Optionally redirect: router.push('/')
}
</script>

<style scoped>
.q-page {
  overflow: hidden;
}

/* Title Styling */
.login-title {
  color: #071014;
  font-weight: bold;
  font-size: 1.5rem;
}

/* Button Styling */
.login-btn {
  border: 1px solid #ccc;
  color: black;
  background-color: white;
  border-radius: 12px;
  font-weight: bold;
  padding: 6px 18px;
}

.cancel-btn {
  background-color: #eee;
  color: #333;
  border-radius: 12px;
  font-weight: bold;
  padding: 6px 18px;
}

/* Form Container Responsive Width */
.form-wrapper {
  width: 100%;
  max-width: 420px;
}

/* Image Styling */
.image-wrapper {
  background-color: #f5f5f5;
  padding: 20px;
}

.welcome-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* Responsive Tweaks */
@media (max-width: 767px) {
  .image-wrapper {
    display: none;
  }

  .form-wrapper {
    padding: 0 16px;
  }

  .q-page {
    padding: 24px 0;
  }
}
</style>
