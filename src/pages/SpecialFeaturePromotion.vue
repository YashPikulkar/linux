<template>
  <q-page class="bg-white full-page">
    <!-- Hero Section -->
    <div class="hero-section text-center">
      <div class="container q-mx-auto q-px-md">
        <!-- Header Badge -->
        <div class="q-mb-lg">
          <q-badge
            color="green-2"
            text-color="green-7"
            class="text-uppercase text-weight-medium q-px-md q-py-sm"
            style="font-size: 0.75rem; letter-spacing: 2px"
          >
            AI-POWERED MATCHING SYSTEM
          </q-badge>
        </div>

        <!-- Main Heading -->
        <h1 class="hero-title text-weight-bold q-mb-lg">
          The AI platform to<br />
          match, rank & hire candidates
        </h1>

        <!-- CTA Button -->
        <div class="cta-buttons">
          <q-btn
            color="dark"
            size="lg"
            class="q-px-xl q-py-md text-weight-medium cta-hover"
            style="border-radius: 8px"
            @click="handleCheckout"
          >
            Checkout
          </q-btn>
        </div>

        <!-- Inline message -->
        <div v-if="showMessage" class="q-mt-md text-green-6">🚫 Only available for recruiters</div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="container q-mx-auto q-px-md">
        <div class="row q-col-gutter-xl justify-center">
          <div class="col-12 col-md-4 text-center" v-for="stat in stats" :key="stat.label">
            <div class="stat-card q-pa-lg">
              <div class="stat-number text-green-6 text-weight-bold q-mb-sm">
                {{ stat.number }}
              </div>
              <div class="stat-label text-dark text-weight-medium">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useUserStore } from 'src/stores/user-store'

export default {
  name: 'AIMatchingPlatform',

  data() {
    return {
      stats: [
        { number: '10M+', label: 'AI-analyzed profiles' },
        { number: '25k+', label: 'Job matches made' },
        { number: '100k+', label: 'Successful placements' },
      ],
      showMessage: false,
    }
  },

  methods: {
    handleCheckout() {
      const userStore = useUserStore()

      // not logged in
      if (!userStore.uid || !userStore.token) {
        this.$router.push({ name: 'login' })
        return
      }

      // recruiter: redirect to jobs
      if (userStore.role === 'recruiter') {
        this.$router.push('/recruiter/jobs-posted')
      } else {
        // applicant: show inline message
        this.showMessage = true
        setTimeout(() => {
          this.showMessage = false
        }, 3000)
      }
    },
  },
}
</script>

<style scoped>
.full-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Split layout */
.hero-section {
  flex: 0 0 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  padding: 2rem 0;
}

.stats-section {
  flex: 0 0 40%;
  background: #fafafa;
  display: flex;
  align-items: center;
}

/* Hero text */
.hero-title {
  font-size: 3.5rem;
  line-height: 1.2;
  color: #1a1a1a;
  max-width: 800px;
  margin: 0 auto;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Button hover */
.cta-hover:hover {
  background-color: #2ecc71 !important;
  color: white !important;
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

/* Stats */
.stat-number {
  font-size: 3rem;
  line-height: 1;
}

.stat-label {
  font-size: 1.1rem;
}

/* Remove card outlines */
.stat-card {
  border-radius: 12px;
  background: transparent;
  box-shadow: none !important;
  border: none !important;
  transition: none !important;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
