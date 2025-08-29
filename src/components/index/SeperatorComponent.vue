<template>
  <div class="separator-container">
    <!-- Animated Line Separator -->
    <div class="separator-line-wrapper">
      <div class="separator-line" :class="{ animate: isVisible }"></div>
      <div class="separator-glow" :class="{ animate: isVisible }"></div>
    </div>

    <!-- Center Ornament -->
    <div class="separator-ornament" :class="{ animate: isVisible }">
      <div class="ornament-circle">
        <svg class="ornament-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="decorative-dots" :class="{ animate: isVisible }">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
      <div class="dot dot-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const separatorRef = ref(null)

let observer = null

const handleIntersection = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      isVisible.value = true
    }
  })
}

onMounted(() => {
  // Intersection Observer for animation trigger
  observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.5,
    rootMargin: '0px 0px -10% 0px',
  })

  if (separatorRef.value) {
    observer.observe(separatorRef.value)
  }

  // Fallback for immediate visibility
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.separator-container {
  position: relative;
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  overflow: hidden;
}

/* Wrapper */
.separator-line-wrapper {
  position: relative;
  width: 100%;
  height: 2px;
  max-width: 600px;
}

/* Main separator line */
.separator-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #B87333 20%,  /* Copper core */
    #B87333 80%, 
    transparent 100%
  );
  opacity: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.separator-line.animate {
  opacity: 1;
  transform: scaleX(1);
}

/* Glow under the line */
.separator-glow {
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(184, 115, 51, 0.15) 20%, /* Copper glow */
    rgba(184, 115, 51, 0.15) 80%,
    transparent 100%
  );
  opacity: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  filter: blur(3px);
}

.separator-glow.animate {
  opacity: 1;
  transform: scaleX(1);
}

/* Center ornament */
.separator-ornament {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0) rotate(-180deg);
  opacity: 0;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
}

.separator-ornament.animate {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) rotate(0deg);
}

.ornament-circle {
  width: 48px;
  height: 48px;
  background: #ffffff;
  border: 2px solid #B87333; /* Copper border */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(184, 115, 51, 0.2); /* Copper shadow */
  transition: all 0.3s ease;
}

.ornament-circle:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 8px 25px rgba(184, 115, 51, 0.3); /* Stronger copper glow */
}

.ornament-icon {
  width: 20px;
  height: 20px;
  color: #B87333; /* Copper icon */
  transition: color 0.3s ease;
}

.ornament-circle:hover .ornament-icon {
  color: #8a5525; /* Darker copper on hover */
}

/* Decorative dots */
.decorative-dots {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 1s ease 1s;
}

.decorative-dots.animate {
  opacity: 1;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #B87333; /* Copper dots */
  animation: dotPulse 2s infinite;
}

.dot-1 { animation-delay: 0s; }
.dot-2 { animation-delay: 0.3s; }
.dot-3 { animation-delay: 0.6s; }

@keyframes dotPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

/* Minimal variant */
.separator-container.minimal {
  height: 80px;
}
.separator-container.minimal .separator-line {
  background: #B87333; /* Copper line */
  height: 1px;
}
.separator-container.minimal .separator-ornament,
.separator-container.minimal .decorative-dots {
  display: none;
}

/* Accessibility focus */
.ornament-circle:focus {
  outline: 2px solid #B87333;
  outline-offset: 2px;
}

</style>
