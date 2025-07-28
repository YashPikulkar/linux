<template>
  <div class="q-pa-xl flex flex-center column">
    <!-- Heading -->
    <h1 class="text-h4 text-weight-bold text-center q-sm-xl">
      Where startups and job seekers connect
    </h1>

    <!-- CTA Buttons -->
    <div class="row q-gutter-md justify-center">
      <!-- Hire Button -->
      <q-btn
        label="Find your next hire"
        color="black"
        text-color="white"
        class="q-pa-lg"
        unelevated
        rounded
        no-caps
        size="lg"
        @click="$router.push('/userdashboard')"
      />

      <!-- Job Button -->
      <q-btn
        label="Find your next job"
        color="white"
        text-color="black"
        class="q-pa-lg"
        flat
        rounded
        no-caps
        size="lg"
        outline
        @click="goToJobs"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingHero",
  methods: {
    goToJobs() {
      this.$router.push("/jobs");
    },
  },
};
</script>

<style scoped>
h1 {
  margin-top: 10px;
  font-size: 3.5rem;
}
</style>
