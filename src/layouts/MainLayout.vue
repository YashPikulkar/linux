<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="header flex items-center justify-between q-px-md">
      <!-- LEFT: Logo -->
      <div class="logo text-bold text-h6 q-ml-sm"></div>

      <!-- RIGHT: Auth Buttons or Back -->
      <div class="flex items-center q-gutter-sm">
        <!-- Show Auth Buttons only on non-auth pages -->
        <template v-if="!isAuthPage">
          <q-btn label="Log In" flat class="btn login-btn" to="/login" />
          <q-btn label="Sign Up" flat class="btn signup-btn" to="/register" />
        </template>

        <!-- Show Back button on login/register pages -->
        <q-btn
          v-if="isAuthPage"
          label="Back"
          flat
          icon="arrow_back"
          class="btn back-btn"
          @click="router.back()"
        />
      </div>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

// True if on either /login or /register
const isAuthPage = computed(() =>
  ['/login', '/register'].includes(route.path)
)
</script>

<style scoped>
/* Header */
.header {
  background-color: #ffffff;
  height: 64px;
  border-bottom: 1px solid #dcdcdc;
}

.logo {
  color: #000;
}

/* Base Button Styling */
.btn {
  font-weight: bold;
  font-size: 14px;
  border-radius: 12px;
  padding: 6px 18px;
  transition: all 0.2s ease-in-out;
}

/* Log In */
.login-btn {
  background-color: #fff;
  color: #c62828;
  border: 2px solid #c62828;
}
.login-btn:hover {
  background-color: #fbe9e7;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.login-btn:active {
  background-color: #ffebee;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Sign Up */
.signup-btn {
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
}
.signup-btn:hover {
  background-color: #000;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.signup-btn:active {
  background-color: #111;
  color: #fff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Back Button (styled same as sign up) */
.back-btn {
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
}
.back-btn:hover {
  background-color: #000;
  color: #fff;
}
.back-btn:active {
  background-color: #111;
  color: #fff;
}

/* Layout */
.q-page-container {
  height: 100%;
}
.q-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
