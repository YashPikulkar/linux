<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="header flex items-center justify-between q-px-md">
      <!-- LEFT: Logo/Brand placeholder -->
      <div></div>

      <!-- RIGHT: Buttons -->
      <div class="flex items-center q-gutter-sm">
        <q-btn label="Log In" flat class="login-btn" />
        <q-btn
          label="Sign Up"
          flat
          class="signup-btn"
          @click="$router.push('/register')"
        />
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
};
</script>

<style scoped>
.header {
  background-color: #fff;
  height: 57px;
  border-bottom: 1px solid #ccc;
}

/* --- LOG IN BUTTON --- */
.login-btn {
  background-color: #fff;
  color: #c62828;
  border: 2px #c62828;
  border-radius: 12px;
  font-weight: bold;
  padding: 6px 18px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background: linear-gradient(to bottom, #f8d6d2, #fbd8d6);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.login-btn:active {
  background: linear-gradient(to bottom, #fbd8d6, #f8d6d2);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* --- SIGN UP BUTTON --- */
.signup-btn {
  background-color: transparent;
  color: #000;
  border: 2px solid #000;
  border-radius: 12px;
  font-weight: bold;
  padding: 6px 18px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.signup-btn:hover {
  background: linear-gradient(to bottom, #111818, #0c0f0f);
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.signup-btn:active {
  background: linear-gradient(to bottom, #0c0f0f, #111818);
  color: #fff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.q-page-container {
  height: 100%;
}

.q-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
