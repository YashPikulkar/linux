<template>
  <q-card flat bordered class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Account Preferences</div>
    </q-card-section>

    <q-form @submit.prevent="updatePreferences">
      <q-card-section>
        <q-input v-model="form.fullName" label="Full Name" filled />
        <q-input v-model="form.email" label="Email Address" type="email" filled class="q-mt-md" />
        <q-select
          v-model="form.language"
          :options="languages"
          label="Language"
          filled
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save" type="submit" color="primary" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  fullName: '',
  email: '',
  language: 'English'
})

const languages = ['English', 'French', 'German', 'Spanish']

function updatePreferences() {
  console.log('Saving:', form.value)
  // You can replace with an API call here
}
</script>
