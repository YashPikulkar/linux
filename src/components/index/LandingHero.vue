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
.q-pa-xl.flex.flex-center.column {
  background-color: #ffffff; /* Clean white background */
}

h1 {
  margin-top: 10px;
  font-size: 3.5rem;
  color: #1C1C1C; /* Primary charcoal */
}

/* 🔹 Wrapper for spacing between buttons */
.cta-buttons {
  gap: 30px; /* More space between buttons */
  margin-top: 25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

/* 🔹 Hire Button (Primary CTA) */
.cta-hire-btn {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff; /* White text */
  background-color: #1C1C1C; /* Charcoal base */
  border: 2px solid transparent;
  border-radius: 14px;
  padding: 16px 40px;
  transition: all 0.25s ease;
  min-width: 200px;
}

/* Hover → Copper accent + glow */
.cta-hire-btn:hover {
  background: #b87333; /* Copper accent */
  color: #ffffff;
  border-color: #b87333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(184, 115, 51, 0.4); /* Copper glow */
}

/* Focus → solid copper outline for accessibility */
.cta-hire-btn:focus {
  outline: 2px solid #8a5525; /* Darker copper */
  outline-offset: 2px;
}

/* Active → darker copper pressed state */
.cta-hire-btn:active {
  background: #8a5525; /* Darker copper */
  border-color: #8a5525;
  transform: translateY(0); /* Pressed in */
  box-shadow: 0 2px 6px rgba(138, 85, 37, 0.3); /* Softer shadow */
}

/* 🔹 Job Button (Secondary CTA) */
.cta-job-btn {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1C; /* Charcoal text */
  background-color: #ffffff; /* Neutral background */
  border: 2px solid #d1d5db; /* Subtle border */
  border-radius: 14px;
  padding: 16px 40px;
  transition: all 0.25s ease;
  min-width: 200px;
}
.cta-job-btn:hover {
  background-color: rgba(184, 115, 51, 0.08); /* Light copper tint */
  border: 2px solid #B87333; /* Copper border */
  color: #B87333; /* Copper text */
  box-shadow: 0 0 0 4px rgba(184, 115, 51, 0.2); /* Soft copper glow */
}

.cta-job-btn:focus {
  outline: 2px solid #8a5525; /* Darker copper for accessibility */
  outline-offset: 2px;
}


</style>
