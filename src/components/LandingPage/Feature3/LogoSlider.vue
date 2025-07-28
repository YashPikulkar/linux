<template>
  <div ref="carousel" class="logo-slider-wrapper">
    <div ref="track" class="logo-slider-track">
      <div
        v-for="(company, index) in extendedCompanies"
        :key="index"
        class="company-name"
      >
        {{ company.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import gsap from "gsap";
import { useStore } from "src/stores/store";

const carousel = ref(null);
const track = ref(null);
const store = useStore();

// 🧠 Repeat the companies enough times to fill 2x screen width
const extendedCompanies = computed(() => {
  const repeatCount = 8; // Increase if needed to prevent gaps
  return Array.from({ length: repeatCount }, () => store.companies).flat();
});

onMounted(() => {
  const trackEl = track.value;

  requestAnimationFrame(() => {
    const totalWidth = trackEl.scrollWidth / 2;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(trackEl, {
      x: -totalWidth,
      duration: 40,
      ease: "linear",
    });

    tl.set(trackEl, { x: 0 });
    tl.to({}, { duration: 0.05 }); // Prevents flicker
  });
});
</script>

<style scoped>
.logo-slider-wrapper {
  overflow: hidden;
  width: 100%;
  padding: 2rem 0;
}

.logo-slider-track {
  display: flex;
  gap: 3rem;
  will-change: transform;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
}

.company-name {
  flex: 0 0 auto;
  font-size: 1.25rem;
  font-weight: bold;
  color: #ffffff;
  white-space: nowrap;
}
.logo-slider-wrapper {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    white 20%,
    white 80%,
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    white 20%,
    white 80%,
    transparent
  );
}
</style>
