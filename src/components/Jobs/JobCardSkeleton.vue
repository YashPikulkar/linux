<template>
  <div class="job-card-skeleton">
    <q-card flat bordered class="skeleton-card">
      <q-card-section class="q-pa-md">
        <!-- Company Header Row -->
        <div class="company-header row items-center q-mb-md">
          <!-- Company Logo -->
          <div class="company-logo q-mr-md">
            <q-skeleton type="QAvatar" size="60px" />
          </div>

          <!-- Company Info -->
          <div class="company-info col">
            <div class="row items-center q-mb-xs">
              <q-skeleton type="text" width="120px" height="20px" class="q-mr-sm" />
              <!-- Company Tags -->
              <q-skeleton type="rect" width="60px" height="24px" class="q-mr-xs skeleton-chip" />
              <q-skeleton type="rect" width="90px" height="24px" class="skeleton-chip" />
            </div>
            <q-skeleton type="text" width="180px" height="14px" />
            <q-skeleton
              type="rect"
              width="70px"
              height="20px"
              class="q-mt-xs skeleton-chip-funded"
            />
          </div>

          <!-- Arrow Icon -->
          <div class="arrow-section">
            <q-skeleton type="QBtn" />
          </div>
        </div>

        <!-- Job Details Section -->
        <div class="job-details">
          <div class="job-title-row row items-center q-mb-sm">
            <q-skeleton type="text" width="160px" height="18px" class="q-mr-md" />
            <q-skeleton type="rect" width="70px" height="22px" class="q-mr-xs skeleton-chip" />
            <q-skeleton type="rect" width="50px" height="22px" class="skeleton-chip" />
          </div>

          <!-- Job Meta Info -->
          <div class="job-meta row items-center justify-between">
            <div class="left-meta row items-center">
              <q-skeleton type="text" width="60px" height="16px" class="q-mr-md" />
              <q-skeleton type="text" width="100px" height="16px" class="q-mr-md" />
              <q-skeleton type="text" width="80px" height="16px" />
            </div>

            <!-- Login Button -->
            <div class="login-button">
              <q-skeleton type="rect" width="120px" height="36px" class="skeleton-button" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'JobCardSkeleton',

  props: {
    count: {
      type: Number,
      default: 3,
    },
  },
}
</script>

<style lang="scss" scoped>
.job-card-skeleton {
  margin-bottom: 16px;

  .skeleton-card {
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .company-header {
    .company-logo {
      flex-shrink: 0;
    }

    .company-info {
      min-width: 0; // Allow flex item to shrink
    }

    .arrow-section {
      flex-shrink: 0;
    }
  }

  .skeleton-chip {
    border-radius: 16px;
  }

  .skeleton-chip-funded {
    border-radius: 16px;
    opacity: 0.7;
  }

  .skeleton-button {
    border-radius: 6px;
  }

  .job-meta {
    .left-meta {
      flex: 1;
    }

    .login-button {
      flex-shrink: 0;
    }
  }
}

// Animation for skeleton shimmer effect
.q-skeleton {
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .job-card-skeleton {
    .job-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .login-button {
      align-self: stretch;

      .skeleton-button {
        width: 100% !important;
      }
    }
  }
}
</style>
