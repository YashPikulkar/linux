<template>
  <div class="q-pa-xl flex flex-center column">
    <!-- Heading -->
    <h1 class="text-h4 text-weight-bold text-center q-sm-xl">
      Where startups and job seekers connect
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
      this.$router.push('/all-jobs') // ✅ Goes to All Jobs dashboard
    },
    goToLogin() {
      this.$router.push('/special-feature') // ✅ Goes to Login page
    },
  },
}
</script>

<style scoped>
h1 {
  margin-top: 10px;
  font-size: 3.5rem;
}

/* 🔹 Wrapper for spacing between buttons */
.cta-buttons {
  gap: 30px; /* More space between buttons */
  margin-top: 25px;
}

/* 🔹 Hire Button */
.cta-hire-btn {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  background-color: #111827;
  border: 2px solid transparent;
  border-radius: 14px;
  padding: 16px 40px;
  transition: all 0.25s ease;
  min-width: 200px;
}
.cta-hire-btn:hover,
.cta-hire-btn:focus {
  background-color: #ef4444;
  color: #ffffff;
  border: 2px solid #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
}

/* 🔹 Job Button */
.cta-job-btn {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  background-color: #ffffff;
  border: 2px solid #d1d5db;
  border-radius: 14px;
  padding: 16px 40px;
  transition: all 0.25s ease;
  min-width: 200px;
}
.cta-job-btn:hover,
.cta-job-btn:focus {
  background-color: #fdecea;
  border-color: #ef4444;
  color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}
</style>
