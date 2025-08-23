<template>
  <q-page class="bg-white">
    <!-- Hero Section -->
    <div class="hero-section text-center q-py-xl">
      <div class="container q-mx-auto q-px-md">
        <!-- Header Badge -->
        <div class="q-mb-lg">
          <q-badge
            color="pink-2"
            text-color="pink-7"
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

        <!-- Subheading -->
        <p class="hero-subtitle text-grey-7 q-mb-xl">GET PERFECT MATCHES IN 10 MINUTES OR LESS</p>

        <!-- CTA Buttons -->
        <div class="cta-buttons q-gutter-md">
          <q-btn
            color="dark"
            size="lg"
            class="q-px-xl q-py-md text-weight-medium"
            style="border-radius: 8px"
            @click="showLogin = true"
          >
            Login now
          </q-btn>

          <q-btn
            color="grey-3"
            text-color="dark"
            size="lg"
            class="q-px-xl q-py-md text-weight-medium"
            style="border-radius: 8px"
          >
            Schedule a demo
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section q-py-xl bg-grey-1">
      <div class="container q-mx-auto q-px-md">
        <div class="row q-col-gutter-xl justify-center">
          <!-- Stat 1 -->
          <div class="col-12 col-md-4 text-center">
            <div class="stat-card q-pa-lg bg-white" style="border-radius: 12px">
              <div class="stat-number text-pink-6 text-weight-bold q-mb-sm">10M+</div>
              <div class="stat-label text-dark text-weight-medium">AI-analyzed profiles</div>
            </div>
          </div>

          <!-- Stat 2 -->
          <div class="col-12 col-md-4 text-center">
            <div class="stat-card q-pa-lg bg-white" style="border-radius: 12px">
              <div class="stat-number text-pink-6 text-weight-bold q-mb-sm">25k+</div>
              <div class="stat-label text-dark text-weight-medium">Job matches made</div>
            </div>
          </div>

          <!-- Stat 3 -->
          <div class="col-12 col-md-4 text-center">
            <div class="stat-card q-pa-lg bg-white" style="border-radius: 12px">
              <div class="stat-number text-pink-6 text-weight-bold q-mb-sm">100k+</div>
              <div class="stat-label text-dark text-weight-medium">Successful placements</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Features Section -->
    <div class="features-section q-py-xl">
      <div class="container q-mx-auto q-px-md">
        <div class="text-center q-mb-xl">
          <h2 class="section-title text-weight-bold q-mb-md text-grey-8">
            AI MATCHING AT YOUR FINGERTIPS
          </h2>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <q-card class="feature-card full-height" flat bordered>
              <q-card-section class="text-center q-pa-lg">
                <q-icon name="psychology" size="3rem" color="pink-6" class="q-mb-md" />
                <h3 class="text-h6 text-weight-bold q-mb-sm">Smart Profile Analysis</h3>
                <p class="text-grey-7">
                  Our AI analyzes candidate profiles using advanced NLP to understand skills,
                  experience, and preferences.
                </p>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="feature-card full-height" flat bordered>
              <q-card-section class="text-center q-pa-lg">
                <q-icon name="analytics" size="3rem" color="pink-6" class="q-mb-md" />
                <h3 class="text-h6 text-weight-bold q-mb-sm">Similarity Scoring</h3>
                <p class="text-grey-7">
                  Candidates are ranked based on similarity scores between their profiles and job
                  requirements.
                </p>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="feature-card full-height" flat bordered>
              <q-card-section class="text-center q-pa-lg">
                <q-icon name="speed" size="3rem" color="pink-6" class="q-mb-md" />
                <h3 class="text-h6 text-weight-bold q-mb-sm">Instant Rankings</h3>
                <p class="text-grey-7">
                  Get ranked candidate lists in seconds, not hours. Perfect matches delivered
                  instantly.
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Dialog -->
    <q-dialog v-model="showLogin">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Login to AI Platform</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="loginForm.email" autofocus label="Email" type="email" />
          <q-input
            dense
            v-model="loginForm.password"
            label="Password"
            type="password"
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="showLogin = false" />
          <q-btn flat label="Login" @click="handleLogin" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'AIMatchingPlatform',

  data() {
    return {
      showLogin: false,
      loginForm: {
        email: '',
        password: '',
      },
    }
  },

  methods: {
    handleLogin() {
      // Handle login logic here
      console.log('Login attempted with:', this.loginForm)
      this.showLogin = false

      // Show success notification
      this.$q.notify({
        type: 'positive',
        message: 'Login successful! Welcome to AI Matching Platform',
        position: 'top',
      })
    },
  },
}
</script>

<style scoped>
.hero-section {
  min-height: 70vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.2;
  color: #1a1a1a;
  max-width: 800px;
  margin: 0 auto;
}

.hero-subtitle {
  font-size: 1rem;
  letter-spacing: 2px;
  font-weight: 500;
  text-transform: uppercase;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.stats-section {
  background: #fafafa;
}

.stat-number {
  font-size: 4rem;
  line-height: 1;
}

.stat-label {
  font-size: 1.1rem;
}

.stat-card {
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.section-title {
  font-size: 2.5rem;
  letter-spacing: 3px;
  color: #666;
}

.feature-card {
  transition: transform 0.2s ease;
  border-radius: 12px;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .stat-number {
    font-size: 3rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
