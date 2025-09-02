<template>
  <q-page class="bg-white full-page">
    <!-- Hero Section -->
    <div class="hero-section text-center">
      <div class="container q-mx-auto q-px-md">
        <!-- Header Badge -->
        <div class="q-mb-lg">
  <q-badge
    style="background-color: rgba(0, 119, 182, 0.2); color: #0077b6; font-size: 0.75rem; letter-spacing: 2px"
    class="text-uppercase text-weight-medium q-px-md q-py-sm"
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
    color="primary"
    size="lg"
    class="q-px-xl q-py-md text-weight-medium cta-hover"
    style="border-radius: 8px"
    @click="handleCheckout"
  >
    Checkout
  </q-btn>
</div>

<!-- Inline message -->
<div v-if="showMessage" style="color: #b87333" class="q-mt-md">
  🚫 Only available for recruiters
</div>
</div>
</div>

<!-- Stats Section -->
<div class="stats-section">
  <div class="container q-mx-auto q-px-md">
    <div class="row q-col-gutter-xl justify-center">
      <div
        class="col-12 col-md-4 text-center"
        v-for="stat in stats"
        :key="stat.label"
      >
        <div class="stat-card q-pa-lg">
          <div class="stat-number text-weight-bold q-mb-sm" style="color:#0077b6">
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
  justify-content: center;
  padding: 2rem;
}

/* Hero text */
.hero-title {
  font-size: 3.5rem;
  line-height: 1.2;
  color: #1a1a1a;
  max-width: 800px;
  margin: 0 auto 2rem;
  text-align: center;
}

/* .hero-title span {
  color: #b87333; /* Copper accent for emphasis 
} */

/* CTA buttons */
.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-hover {
  background-color: #1c1c1c; /* Default charcoal black */
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 2px solid #0077b6;
  cursor: pointer;
}

/* .cta-hover:hover {
  background-color: #b87333 !important;
  border-color: #b87333 !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 115, 51, 0.3);
} */

/* .cta-hover:active {
  background-color: #8a5525 !important; /* Darker copper 
  border-color: #8a5525 !important;
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(138, 85, 37, 0.3);
} */

/* .cta-hover:focus {
  outline: 2px solid #b87333;
  outline-offset: 3px;
} */

/* Stats */
.stat-number {
  font-size: 3rem;
  line-height: 1;
  color: #1a1a1a;
  font-weight: 700;
}

.stat-label {
  font-size: 1.1rem;
  color: #555;
}

/* Stat cards */
.stat-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

/* .stat-card:hover {
  border-color: #b87333;
  box-shadow: 0 12px 20px rgba(184, 115, 51, 0.15);
  transform: translateY(-4px);
} */

/* Responsive design */
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

  .stats-section {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .stat-number {
    font-size: 1.6rem;
  }

  .stat-card {
    padding: 1rem;
  }
}

</style>
