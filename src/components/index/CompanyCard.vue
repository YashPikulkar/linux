<template>
  <div class="company-card">
    <!-- Company Initials -->
    <div class="logo-container">
      <div class="company-initials">
        {{ getCompanyInitials(company.name) }}
      </div>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <!-- Company Name -->
      <h3 class="company-name">{{ company.name }}</h3>

      <!-- Company Description -->
      <p class="company-description">{{ company.description }}</p>
    </div>

    <!-- Action Button -->
    <div class="card-footer">
      <button
        class="view-company-btn"
        @click="handleViewCompany"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <span>View Company</span>
        <svg
          class="arrow-icon"
          :class="{ 'arrow-animated': isHovering }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['view-company'])

const router = useRouter()
const isHovering = ref(false)

const getCompanyInitials = (companyName) => {
  if (!companyName) return '?'

  const words = companyName.trim().split(' ')
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

const handleViewCompany = () => {
  // Navigate to company details page
  router.push({
    name: 'company-details',
    params: { cid: props.company.cid },
  })

  // Also emit the event for parent component
  emit('view-company', props.company)
}
</script>

<style scoped>
.company-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
}

.company-card:hover {
  transform: translateY(-4px);
  /* border: 1px solid var(--q-primary); Copper accent border */
  box-shadow:
    0 20px 25px -5px rgba(0, 119, 182, 0.25)
, /* Copper-tinted shadow */
    0 10px 10px -5px rgba(0, 119, 182, 0.15); /* Softer shadow */
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  height: 80px;
}

.company-initials {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.company-card:hover .company-initials {
  transform: scale(1.05);
  background: #0077b6; /* Copper accent background */
  color: #ffffff;      /* White text for contrast */
  /* border-color: #b87333; Match border with copper */
  box-shadow: 0 4px 12px rgba(0, 119, 182, 0.4)
; /* Copper glow */
}

.card-content {
  flex: 1;
  text-align: center;
}

.company-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c1c1c;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.company-description {
  color: #7a7a7a;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.company-cid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.cid-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #0077b6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cid-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1c1c;
  font-family: 'Courier New', monospace;
}

.card-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.view-company-btn {
  width: 100%;
  background: #0077b6; /* Default charcoal black */
  color: #ffffff;      /* White text */
  border: 2px solid #0077b6;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Direct hover on the button */
.view-company-btn:hover {
  background: #0077b6; /* Copper accent */
  color: #ffffff;
  border-color: #0077b6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 119, 182, 0.4)
; /* Copper glow */
}

/* NEW: Trigger button copper state when the card is hovered */
.company-card:hover .view-company-btn {
  background: #0077b6;
  /* border-color: #b87333; */
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 119, 182, 0.4)
;
}

.view-company-btn:active {
  background: #0077b6; /* Darker copper for pressed state */
  border-color: #0077b6;
  transform: translateY(0); /* Reset to feel "pressed in" */
  box-shadow: 0 2px 6px rgba(0, 119, 182, 0.3)
; /* Softer shadow */
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.arrow-animated {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .company-card {
    padding: 1rem;
    min-height: 240px;
  }

  .company-name {
    font-size: 1.125rem;
  }

  .company-description {
    font-size: 0.8rem;
  }

  .view-company-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }

  .company-initials {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .company-card {
    padding: 0.875rem;
    min-height: 220px;
  }

  .logo-container {
    height: 60px;
    margin-bottom: 0.75rem;
  }

  .company-initials {
    width: 48px;
    height: 48px;
    font-size: 1rem;
  }

  .company-name {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .company-cid {
    margin-bottom: 0.75rem;
  }

  .card-footer {
    margin-top: 1rem;
    padding-top: 0.75rem;
  }
}

/* Focus states for accessibility */
.view-company-btn:focus {
  outline: 2px solid #1c1c1c;
  outline-offset: 2px;
}

.company-card:focus-within {
  border-color: #1c1c1c;
  box-shadow: 0 0 0 3px rgba(0, 119, 182, 0.1)
;
}

</style>
