<template>
  <div
    ref="hero"
    class="hero-wrapper"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @mousemove.passive="onMouseMove"
  >
    <!-- Hero Title -->
    <div ref="titleEl" class="hero-title">
      <span class="prefix">TC</span><span>:</span>
      <span class="main-text"><span class="highlighted">Jobs That Click</span></span>
    </div>

    <!-- Animated Floating Tags for Fullscreen -->
    <div v-if="isFullscreen" ref="tagContainer" class="tag-container">
      <div
        v-for="(tag, index) in tags"
        :key="index"
        class="tag"
        :class="{ hovered: hoveredTagIndexes.includes(index) }"
        :style="tag.style"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave(index)"
        @click="handleTagClick(tag)"
      >
        {{ tag.text }}
      </div>
    </div>

    <!-- Static Tags for Small Screens -->
    <div v-else class="static-tag-section">
      <div class="static-tags">
        <div
          v-for="(tag, index) in tags.slice(0, 10)"
          :key="index"
          class="static-tag"
          @click="handleTagClick(tag)"
        >
          {{ tag.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import gsap from 'gsap'
import { useFilterStore } from 'src/stores/filter-store'
import { useRouter } from 'vue-router'

// Refs & State
const router = useRouter()
const hero = ref(null)
const tagContainer = ref(null)
const isHovering = ref(false)
const isFullscreen = ref(window.innerWidth >= 1280)
const hoveredTagIndexes = ref([])
const filterStore = useFilterStore()

let tagTweens = []
let rafPending = false
let lastEvent = null

// ✅ Updated tags array with `type`
const tags = [
  { text: 'Bangalore', value: 1, type: 'location', style: { top: '44%', left: '7%' } },
  { text: 'Hyderabad', value: 5, type: 'location', style: { top: '36%', left: '22%' } },
  { text: 'Mumbai', value: 3, type: 'location', style: { top: '65%', left: '12%' } },
  { text: 'Bengaluru', value: 4, type: 'location', style: { top: '72%', left: '20%' } },
  { text: 'Finance', value: 1, type: 'market', style: { top: '80%', left: '29%' } },
  { text: 'Medical', value: 2, type: 'market', style: { top: '74%', left: '38%' } },
  { text: 'Market A', value: 3, type: 'market', style: { top: '72%', left: '60%' } },
  { text: 'Market B', value: 4, type: 'market', style: { top: '58%', left: '68%' } },
  { text: 'Market C', value: 5, type: 'market', style: { top: '64%', left: '72%' } },

  // Skills
  { text: 'Adobe XD', value: 37, type: 'skill', style: { top: '10%', left: '15%' } },
  { text: 'Angular', value: 4, type: 'skill', style: { top: '20%', left: '25%' } },
  { text: 'AWS', value: 17, type: 'skill', style: { top: '30%', left: '35%' } },
  { text: 'Azure', value: 18, type: 'skill', style: { top: '40%', left: '45%' } },
  { text: 'C++', value: 8, type: 'skill', style: { top: '50%', left: '20%' } },
  { text: 'CSS', value: 11, type: 'skill', style: { top: '60%', left: '30%' } },
  { text: 'Data Science', value: 34, type: 'skill', style: { top: '70%', left: '40%' } },
  { text: 'Django', value: 23, type: 'skill', style: { top: '80%', left: '50%' } },
  { text: 'Docker', value: 15, type: 'skill', style: { top: '25%', left: '60%' } },
  { text: 'Express.js', value: 25, type: 'skill', style: { top: '35%', left: '70%' } },
  { text: 'Figma', value: 36, type: 'skill', style: { top: '45%', left: '80%' } },
  { text: 'Angular', value: 4, type: 'skill', style: { top: '20%', left: '25%' } },
]

// ✅ Refactored handleTagClick using type
function handleTagClick(tag) {
  switch (tag.type) {
    case 'market':
      if (!filterStore.selectedMarkets.includes(tag.value))
        filterStore.selectedMarkets.push(tag.value)
      break
    case 'location':
      if (!filterStore.preferredLocations.includes(tag.value))
        filterStore.preferredLocations.push(tag.value)
      break
    case 'skill':
      if (!filterStore.selectedSkills.includes(tag.value))
        filterStore.selectedSkills.push(tag.value)
      break
  }
  router.push({ name: 'Jobs' })
}

// Resize handler
function updateScreenSize() {
  const wasFullscreen = isFullscreen.value
  isFullscreen.value = window.innerWidth >= 1280
  if (!wasFullscreen && isFullscreen.value) {
    nextTick(runEntranceAnimation)
  }
}

// Entrance animation for tags
function runEntranceAnimation() {
  const tagEls = tagContainer.value?.querySelectorAll('.tag') || []
  tagTweens = []

  // Set perspective on the container for 3D effect
  tagContainer.value.style.perspective = '1200px'

  tagEls.forEach((el) => {
    // Start “far away” and slightly random rotation
    const fromX = (Math.random() - 0.5) * window.innerWidth * 2
    const fromY = (Math.random() - 0.5) * window.innerHeight * 2
    const fromScale = 0.2 + Math.random() * 0.5
    const fromRotationY = (Math.random() - 0.5) * 60 // rotate around Y-axis
    const fromRotationX = (Math.random() - 0.5) * 60 // rotate around X-axis

    el.dataset.factor = (0.5 + Math.random() * 0.8).toFixed(2)

    gsap.fromTo(
      el,
      {
        x: fromX,
        y: fromY,
        scale: fromScale,
        rotationX: fromRotationX,
        rotationY: fromRotationY,
        opacity: 0,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: Math.random() * 0.3,
        onComplete() {
          el._baseY = 0
          gsap.to(el, {
            y: '+=18',
            duration: 1 + Math.random() * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 0.7,
            onUpdate() {
              el._floatY = gsap.getProperty(el, 'y')
              applyOffset(el)
            },
          })

          tagTweens.push({
            el,
            tweenX: gsap.quickTo(el, 'x', { duration: 1.7, ease: 'power3.out' }),
            tweenY: gsap.quickTo(el, 'y', { duration: 1.7, ease: 'power3.out' }),
            tweenO: gsap.quickTo(el, 'opacity', { duration: 0.4, ease: 'sine.out' }),
          })
        },
      },
    )
  })
}

// Mouse move handler (throttled)
function onMouseMove(e) {
  lastEvent = e
  if (!rafPending) {
    rafPending = true
    requestAnimationFrame(() => {
      if (isHovering.value && isFullscreen.value) {
        moveTags(lastEvent)
      }
      rafPending = false
    })
  }
}

// Update tag offsets based on mouse position
function moveTags(e) {
  const rect = hero.value.getBoundingClientRect()
  const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2

  tagTweens.forEach(({ el, tweenO }) => {
    const factor = parseFloat(el.dataset.factor)
    const maxOffset = 240
    el._offsetX = -relX * maxOffset * factor
    el._offsetY = -relY * maxOffset * factor
    applyOffset(el)

    // Fade based on visibility
    const tagRect = el.getBoundingClientRect()
    const margin = 60
    const fX = Math.min(
      1,
      Math.max(0, (rect.right - tagRect.left) / margin, (tagRect.right - rect.left) / margin),
    )
    const fY = Math.min(
      1,
      Math.max(0, (rect.bottom - tagRect.top) / margin, (tagRect.bottom - rect.top) / margin),
    )
    tweenO?.(Math.min(fX, fY))
  })
}

// Apply floating offset to tag
function applyOffset(el) {
  const offX = el._offsetX || 0
  const offY = el._offsetY || 0
  const tween = tagTweens.find((t) => t.el === el)
  if (tween) {
    tween.tweenX(offX)
    tween.tweenY((el._floatY || 0) + offY)
  }
}

// ✅ Tag hover with GSAP scale
function handleMouseEnter(index) {
  tags[index].__hoverTimer = setTimeout(() => {
    if (!hoveredTagIndexes.value.includes(index)) {
      hoveredTagIndexes.value.push(index)
      const el = tagContainer.value?.querySelectorAll('.tag')[index]
      if (el) {
        gsap.to(el, { scale: 1.3, duration: 0.3, ease: 'power2.out' })
      }
    }
  }, 200)
}

function handleMouseLeave(index) {
  clearTimeout(tags[index].__hoverTimer)
  hoveredTagIndexes.value = hoveredTagIndexes.value.filter((i) => i !== index)
  const el = tagContainer.value?.querySelectorAll('.tag')[index]
  if (el) {
    gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.inOut' })
  }
}

// Watch hover reset
watch(isHovering, (hovering) => {
  if (!hovering) {
    tagTweens.forEach(({ el }) => {
      el._offsetX = 0
      el._offsetY = 0
      applyOffset(el)
    })
  }
})

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', updateScreenSize)
  if (isFullscreen.value) {
    runEntranceAnimation()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})
</script>
<style scoped>
.hero-wrapper {
  width: 100%;
  min-height: 60vh;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 160px;
}

.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: 58px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  margin-bottom: 30px;
  line-height: 1.2;
  margin-top: 46px;
  position: relative;
  z-index: 3; /* keeps title + glow above tags */
}

/* Glowing blur behind title but not covering text */
.hero-title::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180%;
  height: 260%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 82%,
    rgba(255, 255, 255, 0.85) 90%,
    rgba(255, 255, 255, 0) 100%
  );
  filter: blur(40px);
  opacity: 1;
  pointer-events: none;
  z-index: -1;
}

.prefix {
  font-weight: 700;
  color: #111;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  margin-left: 2px;
}

.main-text {
  color: #111;
  font-weight: 800;
}

.highlighted {
  border: 2px dotted var(--q-hover);
  border-radius: 14px;
  padding: 8px 18px;
  transition: all 0.2s ease;
}

.tag-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  background-color: white;
}

.tag {
  font-family: 'Poppins', sans-serif;
  position: absolute;
  padding: 12px 18px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 300;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.85);
  opacity: 0;
  pointer-events: auto;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border 0.2s ease,
    box-shadow 0.2s ease;
}

.tag.hovered {
  background-color: rgba(64, 224, 208, 0.1); /* light turquoise using hover variable */
  border: 2px solid var(--q-hover); /* turquoise border */
  color: var(--q-hover); /* turquoise text */
  box-shadow: 0 0 0 4px rgba(64, 224, 208, 0.2); /* subtle turquoise glow */
}

.static-tag-section {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;
  z-index: 2;
}

.static-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  max-width: 90%;
  margin: 0 auto;
}

.static-tag {
  padding: 10px 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #111;
  white-space: nowrap;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.static-tag:hover {
  background-color: rgba(64, 224, 208, 0.1);
  border-color: var(--q-hover);
  color: var(--q-hover);
  box-shadow: 0 0 0 4px rgba(64, 224, 208, 0.15);
}

.hero-title {
  margin-top: 46px;
}
</style>
