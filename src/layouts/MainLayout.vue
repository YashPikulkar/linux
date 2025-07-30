<template>
  <q-layout view="lHh Lpr lFf">
    <BaseHeader /> <!-- Header is now a reusable component -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import BaseHeader from 'src/components/Header/BaseHeader.vue';
</script>

<style scoped>
.q-page-container {
  height: 100%;
}
.q-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
