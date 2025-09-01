<template>
  <q-card
    class="company-job-card-grid q-pa-md q-mb-md full-width"
    flat
    bordered
    @click="openCompanyDialog"
  >
    <!-- Top Row: Logo, Name, Status -->
    <div class="row items-start q-gutter-sm cursor-pointer">
      <!-- Company Avatar -->
      <q-avatar size="64px" rounded>
        <template v-if="normalizedJob.company.logo">
          <img :src="normalizedJob.company.logo" alt="Company Logo" class="company-logo" />
        </template>
        <template v-else>
          <div class="company-avatar">
            {{ getCompanyInitials(normalizedJob.company.name) }}
          </div>
        </template>
      </q-avatar>

      <div class="col">
        <!-- Company Name + Types -->
        <div class="row items-center">
          <div class="text-subtitle1 text-weight-bold">
            {{ normalizedJob.company.name || 'Unknown Company' }}
          </div>

          <!-- Company Type Chips -->
          <div
            v-for="(type, i) in normalizedJob.company.type || []"
            :key="'type-' + i"
            class="custom-chip custom-chip-blue company-type-chip"
          >
            {{ type }}
          </div>
        </div>

        <!-- Company Size -->
        <div class="text-caption text-grey-6">
          Company Size:
          {{
            normalizedJob.company.size ? normalizedJob.company.size + ' employees' : 'Not specified'
          }}
        </div>

        <!-- Company Tags -->
        <div class="row q-mt-xs company-tags-wrapper">
          <div
            v-for="(tag, i) in normalizedJob.company.tags || []"
            :key="'tag-' + i"
            class="custom-chip custom-chip-pink company-tag-chip"
          >
            {{ tag }}
          </div>
        </div>
      </div>
    </div>

    <!-- Job Details Inner Card -->
    <div class="q-mt-sm q-mx-none job-details-container">
      <q-card class="inner-job-card q-pa-sm q-mx-none" flat bordered @click.stop>
        <!-- Job Title + Chips -->
        <div class="job-title-section q-mb-sm">
          <div class="job-title text-body1 text-weight-bold text-black q-mb-xs">
            {{ normalizedJob.title }}
          </div>

          <!-- Job Chips Row -->
          <div class="job-chips-container q-mb-sm">
            <!-- Job Type -->
            <div
              v-for="(job_type, i) in normalizedJob.job_type || []"
              :key="'job-type-' + i"
              class="custom-chip custom-chip-blue job-chip"
            >
              {{ job_type }}
            </div>

            <!-- Work Mode -->
            <div
              v-for="(mode, i) in normalizedJob.workMode || []"
              :key="'work-mode-' + i"
              class="custom-chip custom-chip-blue job-chip"
            >
              {{ mode }}
            </div>
          </div>
        </div>

        <!-- Job Meta: Location, Salary, Openings -->
        <div class="job-meta-section q-mb-sm">
          <div class="job-meta-item text-body2 text-grey-8">
            <q-icon name="place" size="14px" class="meta-icon" />
            {{ normalizedJob.location }}
          </div>
          <div class="job-meta-item text-body2 text-grey-8">
            <q-icon name="payments" size="14px" class="meta-icon" />
            {{ formattedSalary }}
          </div>
          <div class="job-meta-item text-body2 text-grey-8">
            <q-icon name="work" size="14px" class="meta-icon" />
            Openings: {{ normalizedJob.opening || 'Not specified' }}
          </div>
        </div>

        <!-- Date info and buttons -->
        <div class="action-section">
          <div v-if="userStore.token === null">
            <!-- Single Login Button -->
            <q-btn
              unelevated
              dense
              label="Login to Apply"
              class="btn-filled-black grid-login-button full-width"
              type="button"
              @click.stop="redirectToLogin"
            />
          </div>
          <div v-else>
            <!-- Date info -->
            <div class="text-caption text-grey-6 q-mb-sm text-center">
              Posted {{ formattedPosted }}
            </div>

            <!-- Buttons -->
            <div class="row q-gutter-sm">
              <div class="col">
                <q-btn
                  flat
                  dense
                  label="Apply"
                  class="btn-outline-black grid-button full-width"
                  type="button"
                  @click.stop="handleApply"
                  :disable="userStore.role === 'recruiter'"
                >
                  <q-tooltip v-if="userStore.role === 'recruiter'">
                    Recruiters cannot apply for jobs
                  </q-tooltip>
                </q-btn>
              </div>
              <div class="col">
                <q-btn
                  unelevated
                  dense
                  label="Learn more"
                  class="btn-filled-black grid-button full-width"
                  type="button"
                  @click.stop="handleLearnMore"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Footer Options -->
    <div
      v-if="userStore.token"
      class="row items-center justify-end q-mt-xs q-gutter-sm footer-actions"
      @click.stop
    >
      <!-- Save / Unsave -->
      <div
        class="report-hide-item row items-center cursor-pointer text-caption"
        :class="{ 'text-primary': isSaved }"
        @click="toggleSave"
      >
        <q-icon :name="isSaved ? 'bookmark' : 'bookmark_outline'" size="16px" class="q-mr-xs" />
        <span>{{ isSaved ? 'Saved' : 'Save' }}</span>
      </div>
    </div>

    <div class="arrow-symbol">&gt;</div>
  </q-card>
</template>

<script>
import { useUserStore } from 'src/stores/user-store'
import { useJobsStore } from 'src/stores/job-store'

export default {
  name: 'JobCardGrid',
  props: {
    job: { type: Object, required: true },
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    jobsStore() {
      return useJobsStore()
    },
    normalizedJob() {
      const raw = this.job
      return {
        company: {
          name: raw.company_name || 'Unknown Company',
          logo: raw.company_logo || null,
          size: raw.companySize || '',
          type: raw.company_type || [],
          tags: raw.company_tags || [],
        },
        job_type: raw.job_type ? [raw.job_type] : [],
        workMode: raw.mode_of_work ? [raw.mode_of_work] : [],
        opening: raw.opening || 'Not specified',
        title: raw.custom_title || raw.job_roles || 'Job Title',
        location: raw.locations || 'Location Unknown',
        salary: {
          min: raw.salary_min || 0,
          max: raw.salary_max || 0,
          currency: 'INR',
        },
        posted: raw.posted || '',
        cid: raw.company_id,
        jobid: raw.jobid,
      }
    },
    formattedSalary() {
      if (!this.normalizedJob.salary) return 'N/A'
      const { min, max, currency = 'INR' } = this.normalizedJob.salary
      if (min >= 100000) {
        return `${currency === 'INR' ? '₹' : currency} ${(min / 100000).toFixed(
          1,
        )}L – ${(max / 100000).toFixed(1)}L`
      }
      if (min >= 1000) {
        return `${currency === 'INR' ? '₹' : currency} ${(min / 1000).toFixed(
          1,
        )}K – ${(max / 1000).toFixed(1)}K`
      }
      return `${currency === 'INR' ? '₹' : currency} ${min} – ${max}`
    },
    formattedPosted() {
      if (!this.normalizedJob.posted) return 'Unknown'
      const date = new Date(this.normalizedJob.posted)
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    isSaved() {
      return this.jobsStore.savedJobIds.has(this.normalizedJob.jobid)
    },
    isRecentlyPosted() {
      if (!this.normalizedJob.posted) return false
      const postedDate = new Date(this.normalizedJob.posted)
      const diffInDays = (new Date() - postedDate) / (1000 * 60 * 60 * 24)
      return diffInDays <= 7
    },
  },
  methods: {
    handleApply() {
      if (!this.userStore.token) {
        this.$q.notify({
          type: 'warning',
          message: 'Log in to apply for job!',
          position: 'bottom',
          timeout: 2000,
        })
      } else {
        this.jobsStore.openApplicationDialog(this.normalizedJob.jobid)
      }
    },
    handleLearnMore() {
      if (!this.userStore.token) {
        this.$q.notify({
          type: 'warning',
          message: 'Log in to learn more!',
          position: 'bottom',
          timeout: 2000,
        })
      } else {
        this.jobsStore.openLearnMoreDialog(this.normalizedJob.jobid)
      }
    },

    async openCompanyDialog() {
      const jobsStore = useJobsStore()
      if (this.normalizedJob.cid) {
        await jobsStore.fetchCompanyDetail(this.normalizedJob.cid)
        this.$router.push({
          name: 'company-details',
          params: { cid: this.normalizedJob.cid },
        })
      }
    },
    toggleSave() {
      this.jobsStore.toggleSave(this.normalizedJob.jobid)
    },
    redirectToLogin() {
      this.$router.push({
        name: 'login',
        query: { redirect: '/all-jobs' },
      })
    },
    getCompanyInitials(name) {
      if (!name) return 'NA'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 3)
    },
  },
}
</script>

<style scoped>
.company-job-card-grid {
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.company-job-card-grid:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.job-details-container {
  flex: 1;
  display: flex;
}

.inner-job-card {
  background-color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  overflow: hidden;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.inner-job-card:hover {
  background-color: #f9f9f9;
}

.job-title-section {
  flex-shrink: 0;
}

.job-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  min-height: 2.6em;
}

.job-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.job-chip {
  flex-shrink: 0;
}

.job-meta-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: flex-start;
}

.job-meta-item {
  display: flex;
  align-items: center;
  line-height: 1.2;
}

.meta-icon {
  margin-right: 6px;
  color: #666;
}

.action-section {
  flex-shrink: 0;
  margin-top: auto;
}

.grid-button {
  min-width: unset;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  text-transform: none;
  border-radius: 4px;
  min-height: 40px;
}

.grid-login-button {
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  text-transform: none;
  border-radius: 4px;
  min-height: 40px;
}

.btn-outline-black {
  border: 1px solid #000;
  background-color: #fff;
  color: #000;
}
.btn-outline-black:hover {
  background-color: #f5f5f5;
}

.btn-filled-black {
  background-color: #000;
  color: #fff;
}
.btn-filled-black:hover {
  background-color: #333;
}

.custom-chip {
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  line-height: 1;
  cursor: default;
  white-space: nowrap;
}
.custom-chip-pink {
  border: 1px solid #b87333;
  background-color: #fff8f4; /* softer background to match copper tone */
  color: #b87333;
}

.custom-chip-blue {
  border: 1px solid #007aff;
  background-color: #f0f7ff;
  color: #1d1d1f;
}

/* 🔹 spacing for company type chips beside name */
.company-type-chip {
  margin-left: 9px;
}
.company-type-chip:first-of-type {
  margin-left: 13px; /* extra gap from company name */
}

/* 🔹 spacing for pink company tags row */
.company-tag-chip {
  margin-right: 6px;
  margin-bottom: 6px;
}
.company-tags-wrapper {
  flex-wrap: wrap;
}

/* 🔹 spacing for job chips */
.job-chip {
  margin: 0;
}

.arrow-symbol {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 24px;
  color: #999999;
}
.text-primary {
  color: #007aff;
}
.footer-actions {
  margin-top: auto;
  padding-bottom: 2px;
  min-height: 24px;
}

.company-avatar {
  height: 64px;
  width: 64px;
  background-color: #e0e0e0;
  color: #000;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
.company-logo {
  height: 64px;
  width: 64px;
  object-fit: contain;
  border-radius: 12px;
}

/* Grid-specific responsive adjustments */
@media (max-width: 1024px) {
  .job-meta {
    gap: 20px;
  }
  .grid-button,
  .grid-login-button {
    font-size: 13px;
    padding: 6px 12px;
  }
}

@media (max-width: 768px) {
  .company-job-card-grid {
    min-height: 380px;
  }

  .job-meta-section {
    gap: 8px;
  }

  .arrow-symbol {
    top: 12px;
    right: 12px;
    font-size: 20px;
  }

  .job-title {
    font-size: 1.1rem;
    min-height: 3em;
  }

  .job-chips-container {
    gap: 6px;
  }
}

@media (max-width: 480px) {
  .company-job-card-grid {
    min-height: 360px;
  }

  .company-avatar,
  .company-logo {
    height: 48px;
    width: 48px;
    font-size: 16px;
  }
  .custom-chip {
    font-size: 11px;
    padding: 3px 8px;
  }
  .grid-button,
  .grid-login-button {
    font-size: 13px;
    padding: 8px 12px;
    min-height: 36px;
  }
  .job-meta-item {
    font-size: 13px;
  }

  .job-title {
    font-size: 1rem;
    min-height: 2.5em;
  }

  .job-chips-container {
    gap: 4px;
  }

  .job-meta-section {
    gap: 6px;
  }
}

/* Grid layout specific styles */
.company-job-card-grid {
  display: flex;
  flex-direction: column;
}
</style>
