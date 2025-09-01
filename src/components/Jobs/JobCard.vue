<template>
  <q-card
    class="company-job-card q-pa-md q-mb-md full-width"
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
    <div class="q-mt-xs q-mx-none">
      <q-card class="inner-job-card q-py-xs q-px-md q-mx-none" flat bordered @click.stop>
        <!-- Desktop Layout -->
        <div class="row q-col-gutter-sm items-center justify-between desktop-layout">
          <!-- Job info (left) -->
          <div class="col-12 col-md-8">
            <!-- Job Title + Chips -->
            <div class="row items-center q-gutter-sm job-title-row">
              <div class="job-title text-body2 text-weight-bold text-black">
                {{ normalizedJob.title }}
              </div>

              <!-- Job Type -->
              <div
                v-for="(job_type, i) in normalizedJob.job_type || []"
                :key="'job-type-' + i"
                class="custom-chip custom-chip-blue job-type-chip"
              >
                {{ job_type }}
              </div>

              <!-- Work Mode -->
              <div
                v-for="(mode, i) in normalizedJob.workMode || []"
                :key="'work-mode-' + i"
                class="custom-chip custom-chip-blue work-mode-chip"
              >
                {{ mode }}
              </div>
            </div>

            <!-- Job Meta: Location, Salary, Openings -->
            <div class="job-meta text-body2 text-grey-8">
              <div>{{ normalizedJob.location }}</div>
              <div>{{ formattedSalary }}</div>
              <div>Openings: {{ normalizedJob.opening || 'Not specified' }}</div>
            </div>
          </div>

          <!-- Buttons (right) - Desktop -->
          <div class="col-12 col-md-4 desktop-buttons">
            <div class="row items-center justify-end q-gutter-sm no-wrap">
              <div v-if="userStore.token === null" class="full-width">
                <!-- Single Login Button -->
                <q-btn
                  unelevated
                  dense
                  label="Login to Apply"
                  class="btn-filled-black equal-button full-width"
                  type="button"
                  @click.stop="redirectToLogin"
                />
              </div>
              <div v-else class="full-width">
                <!-- Date info and buttons in a column layout -->
                <div class="column items-end q-gutter-xs">
                  <div class="row items-center q-gutter-sm no-wrap full-width justify-end">
                    <!-- Date info beside buttons -->
                    <div class="column items-end date-info">
                      <div class="text-caption text-grey-6">Posted {{ formattedPosted }}</div>
                    </div>

                    <!-- Buttons -->
                    <div class="row items-center q-gutter-xs no-wrap button-group">
                      <q-btn
                        flat
                        dense
                        label="Apply"
                        class="btn-outline-black equal-button"
                        type="button"
                        @click.stop="handleApply"
                        :disable="userStore.role === 'recruiter'"
                      >
                        <q-tooltip v-if="userStore.role === 'recruiter'">
                          Recruiters cannot apply for jobs
                        </q-tooltip>
                      </q-btn>

                      <q-btn
                        unelevated
                        dense
                        label="Learn more"
                        class="btn-filled-black equal-button"
                        type="button"
                        @click.stop="handleLearnMore"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Layout - Buttons moved to bottom -->
        <div class="mobile-buttons q-mt-md">
          <div v-if="userStore.token === null">
            <q-btn
              unelevated
              dense
              label="Login to Apply"
              class="btn-filled-black mobile-button full-width"
              type="button"
              @click.stop="redirectToLogin"
            />
          </div>
          <div v-else>
            <!-- Date info for mobile -->
            <div class="text-caption text-grey-6 q-mb-sm text-center">
              Posted {{ formattedPosted }}
            </div>

            <!-- Mobile buttons row -->
            <div class="row q-gutter-sm">
              <div class="col">
                <q-btn
                  flat
                  dense
                  label="Apply"
                  class="btn-outline-black mobile-button full-width"
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
                  class="btn-filled-black mobile-button full-width"
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
  name: 'JobCard',
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
.company-job-card {
  background-color: #f9f9f9;
  border-radius: 0px;
  transition: box-shadow 0.3s;
  position: relative;
  width: 100%;
}

.inner-job-card {
  background-color: #ffffff;
  border-radius: 0px;
  cursor: pointer;
  transition: background-color 0.2s;
  overflow: hidden;
  width: 100%;
}
.inner-job-card:hover {
  background-color: #f9f9f9;
}

.job-meta {
  display: flex;
  gap: 34px;
  flex-wrap: wrap;
}

.job-title-row {
  margin-bottom: 6px; /* spacing between title row & meta */
}

.equal-button {
  min-width: 120px;
  margin-left: 8px;
  padding: 6px 16px;
  font-weight: 600;
  font-size: 14px;
  text-transform: none;
  border-radius: 4px;
}
.equal-button:first-child {
  margin-left: 0;
}

.mobile-button {
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

/* 🔹 spacing for job chips beside job title */
.job-type-chip,
.work-mode-chip {
  margin-left: 11px;
}
.job-type-chip:first-of-type,
.work-mode-chip:first-of-type {
  margin-left: 13px; /* extra gap from job title */
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
  margin-top: 6px;
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

/* Show/hide desktop and mobile layouts */
.mobile-buttons {
  display: none;
}

.desktop-buttons {
  display: block;
}

/* 🔹 RESPONSIVE FIXES */
@media (max-width: 1024px) {
  .job-meta {
    gap: 20px;
  }
  .equal-button {
    min-width: 100px;
    font-size: 13px;
    padding: 6px 12px;
  }
}

@media (max-width: 768px) {
  /* Hide desktop buttons and show mobile buttons */
  .desktop-buttons {
    display: none;
  }

  .mobile-buttons {
    display: block;
  }

  .job-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .arrow-symbol {
    top: 12px;
    right: 12px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
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
  .mobile-button {
    font-size: 13px;
    padding: 8px 12px;
    min-height: 36px;
  }
  .job-meta {
    font-size: 13px;
    gap: 4px;
  }
}
</style>
