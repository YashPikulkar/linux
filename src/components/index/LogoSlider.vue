<template>
  <div class="logo-slider-section">
    <!-- Main Logo Slider -->
    <div ref="carousel" class="logo-slider-wrapper">
      <div ref="track" class="logo-slider-track">
        <div
          v-for="(company, index) in extendedCompanies"
          :key="`logo-${index}`"
          class="company-logo-item"
          @click="handleLogoClick(company)"
        >
          <div class="logo-container company-logo-fallback">
            {{ getCompanyInitials(company.name) }}
          </div>
          <span class="company-name">{{ company.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { useStore } from 'src/stores/company-store'

const carousel = ref(null)
const track = ref(null)

const store = useStore()
const emit = defineEmits(['logo-clicked'])

let logoAnimation = null

// Extended company list for smooth infinite scroll
const extendedCompanies = computed(() => {
  const companies = store.companies || []
  if (companies.length === 0) return []

  const repeatCount = Math.max(10, Math.ceil(20 / companies.length))
  return Array.from({ length: repeatCount }, () => companies).flat()
})

const getCompanyInitials = (name) => {
  if (!name) return '?'
  const words = name.split(' ')
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
}

const createLogoAnimation = () => {
  if (!track.value || extendedCompanies.value.length === 0) return

  const trackEl = track.value
  const totalWidth = trackEl.scrollWidth / 2

  if (logoAnimation) logoAnimation.kill()

  logoAnimation = gsap.timeline({ repeat: -1 })
  logoAnimation.to(trackEl, {
    x: -totalWidth,
    duration: 45,
    ease: 'none',
  })
  logoAnimation.set(trackEl, { x: 0 })
}

const handleLogoClick = (company) => {
  emit('logo-clicked', company)
}

onMounted(() => {
  requestAnimationFrame(() => createLogoAnimation())
})

onUnmounted(() => {
  if (logoAnimation) logoAnimation.kill()
})
</script>

<style scoped>
.logo-slider-section {
  width: 100%;
  background: #1c1c1c;
  border-radius: 1rem;
  padding: 3rem 0;
  overflow: hidden;
}

/* Slider */
.logo-slider-wrapper {
  overflow: hidden;
  width: 100%;
  position: relative;
  -webkit-mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
  mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
}

.logo-slider-track {
  display: flex;
  gap: 3rem;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0 2rem;
}

/* Company Item */
.company-logo-item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 0.75rem;
}

.company-logo-item:hover {
  background: #0077b6;
  transform: translateY(-4px);
}

/* Avatar with initials */
.logo-container {
  width: 60px;
  height: 60px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0; /* Gray background */
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c1c1c;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.company-logo-item:hover .logo-container {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 119, 182, 0.3);
}

/* Company Name */
.company-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .logo-container {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }
  .company-name {
    font-size: 0.75rem;
  }
}
</style>
