<template>
  <div class="q-pa-xl flex flex-center column">
    <!-- Heading -->
    <h1 class="text-h4 text-weight-bold text-center q-sm-xl">
      Where Companies and job seekers connect
    </h1>

    <!-- CTA Buttons -->
    <div class="row justify-center cta-buttons">
      <!-- Hire Button -->
      <q-btn
        label="Find your next hire"
        class="cta-hire-btn"
        unelevated
        rounded
        no-caps
        size="xl"
        @click="goToLogin"
      />

      <!-- Job Button -->
      <q-btn
        label="Find your next job"
        class="cta-job-btn"
        rounded
        no-caps
        size="xl"
        @click="goToJobs"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingHero',
  methods: {
    goToJobs() {
      this.$router.push('/all-jobs')
    },
    goToLogin() {
      this.$router.push('/special-feature')
    },
  },
}
</script>

<style scoped>
.q-pa-xl.flex.flex-center.column {
  background-color: white;
}

h1 {
  margin-top: 10px;
  font-size: 3.5rem;
}

/* 🔹 Wrapper for spacing between buttons */
.cta-buttons {
  gap: 30px;
  margin-top: 25px;
}

/* 🔹 Hire Button */
.cta-hire-btn {
  font-size: 18px;
  font-weight: 600;
  color: white;
  background-color: black;
  border: 2px solid transparent;
  border-radius: 14px;
  padding: 16px 40px;
  transition: all 0.25s ease;
  min-width: 200px;
}
.cta-hire-btn:hover,
.cta-hire-btn:focus {
  background-color: var(--q-hover); /* ✅ turquoise */
  color: white;
  border: 2px solid var(--q-hover);
  box-shadow: 0 0 0 4px rgba(64, 224, 208, 0.2);
}

/* 🔹 Job Button */
.cta-job-btn {
  font-size: 18px;
  font-weight: 600;
  color: black;
  background-color: white;
  border: 2px solid #d1d5db; /* you could add a new brand var for gray if needed */
  border-radius: 14px;
  padding: 16px 40px;
  transition: all 0.25s ease;
  min-width: 200px;
}
.cta-job-btn:hover,
.cta-job-btn:focus {
  background-color: #e6fbf9; /* ❓ should I make this also use brand hover? */
  border-color: var(--q-hover); /* turquoise */
  color: var(--q-hover);
  box-shadow: 0 0 0 4px rgba(64, 224, 208, 0.15);
}
</style>
