@ -0,0 +1,43 @@
<template>
  <div class="applicant-list">
    <h4>Applicants</h4>
    <q-list bordered>
      <q-item v-for="applicant in applicants" :key="applicant.id" clickable>
        <q-item-section avatar>
          <q-avatar>
            <img :src="applicant.avatar" alt="avatar" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ applicant.name }}</q-item-label>
          <q-item-label caption>{{ applicant.position }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn flat label="View" @click="viewApplicant(applicant.id)" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const applicants = ref([
  { id: 1, name: 'Alice Smith', position: 'Frontend Developer', avatar: 'https://cdn.quasar.dev/img/avatar.png' },
  { id: 2, name: 'John Doe', position: 'Backend Developer', avatar: 'https://cdn.quasar.dev/img/avatar.png' }
])

function viewApplicant(id) {
  console.log('View applicant', id)
  // Optional: navigate or open modal
}
</script>

<style scoped>
.applicant-list {
  padding: 16px;
}
</style>
