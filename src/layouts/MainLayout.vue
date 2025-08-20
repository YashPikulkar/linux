<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <!-- Simple Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Basic Header</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <!-- Page content goes here -->
        <div>Welcome to the dashboard!</div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// No extra logic needed for simple header
</script>

<style scoped>
.main-layout {
  background-color: #f9fafb;
}
</style>
