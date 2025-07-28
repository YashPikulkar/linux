<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Custom Header (shown only when not on /login or /register) -->
    <div v-if="!isAuthPage" class="header row items-center justify-between q-px-md">
      <div class="logo text-h6">MyApp</div>
      <div class="row q-gutter-sm">
        <q-btn flat label="Log In" class="btn login-btn" @click="router.push('/login')" />
        <q-btn flat label="Sign Up" class="btn signup-btn" @click="router.push('/register')" />
      </div>
    </div>

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

// True if current page is either /login or /register
const isAuthPage = computed(() =>
  ['/login', '/register'].includes(route.path)
)
</script>

<style scoped>
/* ====== Header ====== */
.header {
  position: fixed;              /* ✅ Fix it to top */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;                /* ✅ Ensure it's on top */
  background-color: #ffffff;
  height: 64px;
  border-bottom: 1px solid #dcdcdc;
}


/* ====== Logo ====== */
.logo {
  color: #000;
  font-weight: bold;
}

/* ====== Button Base ====== */
.btn {
  font-weight: bold;
  font-size: 14px;
  border-radius: 12px;
  padding: 6px 18px;
  transition: all 0.2s ease-in-out;
}

/* ====== Log In Button ====== */
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

/* ====== Sign Up Button ====== */
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

/* ====== Page Container ====== */
.q-page-container {
  height: 100%;
}
.q-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
