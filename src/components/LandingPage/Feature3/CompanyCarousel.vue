<template>
  <div ref="carousel" class="carousel-wrapper">
    <div ref="track" class="carousel-track">
      <div
        class="company-slide"
        v-for="(company, index) in repeatedCompanies"
        :key="index"
      >
        <CompanyCard :company="company" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import gsap from "gsap";
import CompanyCard from "./CompanyCard.vue";
import { useStore } from "src/stores/store";

const carousel = ref(null);
const track = ref(null);

const store = useStore();

// 👇️ Repeat companies enough to fill screen + allow scrolling
const repeatedCompanies = computed(() => {
  const repeatCount = 8; // Increase to prevent flicker
  return Array.from({ length: repeatCount }, () => store.companies).flat();
});

onMounted(() => {
  const trackEl = track.value;

  requestAnimationFrame(() => {
    const totalWidth = trackEl.scrollWidth / 2; // Only half for repeat illusion

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(trackEl, {
      x: -totalWidth,
      duration: 50,
      ease: "linear",
    });

    tl.set(trackEl, { x: 0 });
    tl.to({}, { duration: 0.05 }); // brief pause to prevent flicker
  });
});
</script>

<style scoped>
.carousel-wrapper {
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  position: relative;
  padding: 2rem 0;
}

.carousel-track {
  display: flex;
  gap: 30px;
  will-change: transform;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.company-slide {
  flex: 0 0 20%;
  white-space: nowrap;
}

@media (max-width: 1200px) {
  .company-slide {
    flex: 0 0 25%;
  }
}
@media (max-width: 992px) {
  .company-slide {
    flex: 0 0 33.33%;
  }
}
@media (max-width: 768px) {
  .company-slide {
    flex: 0 0 50%;
  }
}
@media (max-width: 480px) {
  .company-slide {
    flex: 0 0 100%;
  }
}
</style>
