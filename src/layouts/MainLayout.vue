<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="header flex items-center justify-between q-px-md">
      <!-- header content -->
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
.login-btn {
  border: 1px solid #ccc;
  color: black;
  background-color: white;
  border-radius: 12px;
  font-weight: bold;
  padding: 6px 18px;
}

.signup-btn {
  background-color: #071014;
  color: white;
  border-radius: 12px;
  font-weight: bold;
  padding: 6px 18px;
}
.q-page-container {
  height: 100%;
}

.q-page {
  min-height: 100vh;
  /* optionally also: */
  display: flex;
  flex-direction: column;
}
</style>
