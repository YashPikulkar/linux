<template>
  <div class="no-jobs-container">
    <q-card class="no-jobs-card" flat>
      <q-card-section class="text-center">
        <!-- Icon -->
        <q-icon name="lightbulb_off" size="4rem" color="grey-5" class="q-mb-md" />

        <!-- Main Message -->
        <div class="text-h6 text-grey-8 q-mb-sm">
          {{ title }}
        </div>

        <!-- Description -->
        <div class="text-body2 text-grey-6 q-mb-lg">
          {{ description }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'NoRecommendedJobsFound',

  props: {
    title: {
      type: String,
      default: 'No Recommended Jobs Found',
    },
    description: {
      type: String,
      default:
        "We couldn't find any recommended jobs for you. Try adding your skills to your profile to get better recommendations.",
    },
    showAddSkillsButton: {
      type: Boolean,
      default: true,
    },
    addSkillsButtonText: {
      type: String,
      default: 'Add Skills',
    },
  },

  emits: ['add-skills'],

  methods: {
    handleAddSkills() {
      this.$emit('add-skills')
    },
  },
}
</script>

<style lang="scss" scoped>
.no-jobs-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1; /* take full available height */
  width: 100%;
  min-height: 100%;
  padding: 20px;
}

.no-jobs-card {
  width: 100%;
  height: 100%;
  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb; // ✅ add here
}

.action-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 600px) {
  .action-buttons {
    flex-direction: column;
    align-items: center;

    .q-btn {
      width: 100%;
      max-width: 200px;
    }
  }
}
</style>
