<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <!-- 🔹 Header -->
    <component :is="userStore.role === 'recruiter' ? RecHeader : AppHeader" />

    <!-- 🔹 Main Content -->
    <q-page-container>
      <q-page class="q-pa-md">
        <!-- Full-width page (company-details or special-feature) -->
        <div
          v-if="
            $route.name === 'Jobs' ||
            $route.name === 'company-details' ||
            $route.name === 'SpecialFeature'
          "
        >
          <router-view />
        </div>

        <!-- Normal left/right layout for other pages -->
        <div v-else class="row">
          <!-- Left Card -->
          <div
            v-if="isLeftCardVisible"
            class="col-12 col-md-2 gt-sm"
            :class="{ 'left-card-transition': true }"
          >
            <div class="full-height left-card-wrapper">
              <LeftCard @toggle-visibility="handleLeftCardToggle" />
            </div>
          </div>

          <!-- Right Card -->
          <div class="col-12" :class="getRightCardClasses">
            <div class="full-height right-card-wrapper">
              <q-card class="modern-right-card" flat bordered>
                <router-view />
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import LeftCard from 'src/components/user/LeftCard.vue'
import AppHeader from 'src/components/navbar/AppHeader.vue'
import RecHeader from 'src/components/navbar/RecHeader.vue'
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

// Left card visibility state
const isLeftCardVisible = ref(true)

// Handle left card toggle
const handleLeftCardToggle = (visible) => {
  isLeftCardVisible.value = visible
}

// Computed class for right card responsive behavior
const getRightCardClasses = computed(() => {
  if (!$q.screen.gt.sm) {
    return '' // On mobile, always full width
  }

  return isLeftCardVisible.value ? 'col-md-10' : 'col-md-12'
})

// 🔹 Optional: Route Guard Logic (role-based protection)
router.beforeEach((to, from, next) => {
  const role = userStore.role
  if (to.path.startsWith('/applicant') && role !== 'applicant') return next('/login')
  if (to.path.startsWith('/recruiter') && role !== 'recruiter') return next('/login')
  next()
})
</script>

<style scoped>
.main-layout {
  background-color: #f9fafb;
}

.full-height {
  height: 100%;
}

.left-card-wrapper {
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: start;
  padding-top: 15px;
}

.left-card-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.right-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-right-card {
  height: 80vh;
  width: 100%;
  border-radius: 16px;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modern-right-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-2px);
  border-color: rgba(0, 0, 0, 0.08) !important;
}

@media (max-width: 599px) {
  .modern-right-card {
    height: 70vh;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .modern-right-card {
    height: 75vh;
  }
}

@media (min-width: 1024px) {
  .modern-right-card {
    height: 85vh;
  }
}
</style>
