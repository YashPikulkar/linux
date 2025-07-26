<template>
  <div class="burgundy-bg">
    <h2 class="section-title text-white text-center q-mb-xl">
      Your Next Employer Might Be Here
    </h2>

    <!-- Company Cards -->
    <CompanyCarousel />

    <div style="height: 75px"></div>
    <!-- Fixed spacer -->

    <Seperator />

    <div style="height: 75px"></div>

    <LogoSlider />
  </div>
</template>

<script>
import { useStore } from "src/stores/store";
import CompanyCarousel from "./CompanyCarousel.vue";
import LogoSlider from "./LogoSlider.vue";
import Seperator from "./Seperator.vue";

export default {
  name: "CompaniesSection",
  components: {
    CompanyCarousel,
    LogoSlider,
    Seperator,
  },
  mounted() {
    const store = useStore();
    store.fetchCompanies(); // Simulated fetch
  },
};
</script>

<style scoped>
.burgundy-bg {
  background: linear-gradient(180deg, #2b0a3d 0%, #23122e 100%);
  padding: 2rem;
  min-height: 80vh;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
}
</style>
