<template>
  <q-page>
    <HeroSection />
    <Footer />
    <LandingHero />
    <!-- ✅ Your new component here -->
    <CompanyShowcase />
  </q-page>
</template>

<script>
import HeroSection from "src/components/LandingPage/Feature1/HeroSection.vue";
import LandingHero from "src/components/LandingPage/Feature2/LandingHero.vue";
import Footer from "src/components/LandingPage/Feature1/Footer.vue";
import CompanyShowcase from "src/components/LandingPage/Feature3/CompanyShowcase.vue"; // ✅ Import it here

export default {
  name: "HomePage",
  components: {
    HeroSection,
    CompanyShowcase, // ✅ Register it
    LandingHero,
    Footer,
  },
};
</script>
