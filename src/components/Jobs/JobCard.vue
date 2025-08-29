<template>
  <q-card
    class="company-job-card q-pa-md q-mb-md"
    :class="gridMode ? 'grid-mode full-width' : 'full-width'"
    flat
    bordered
    @click="openCompanyDialog"
  >
   <!-- Grid Mode Layout -->
<template v-if="gridMode">
  <div class="row items-center q-mb-sm">
    <q-avatar size="36px" class="q-mr-sm">
      <template v-if="normalizedJob.company.logo">
        <img :src="normalizedJob.company.logo" alt="Company Logo" class="company-logo" />
      </template>
      <template v-else>
        <div style="height: 36px; width: 36px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white;" :style="'background-color:' + getRandomColor()">
          {{ getCompanyInitials(normalizedJob.company.name) }}
        </div>
      </template>
    </q-avatar>
    <div class="col">
      <div class="row items-center q-gutter-xs">
        <div class="text-subtitle2 text-weight-bold ellipsis company-name" :title="normalizedJob.company.name">
          {{ getResponsiveCompanyName(normalizedJob.company.name) }}
        </div>
        <!-- Show only the most important tags/status -->
        <div v-if="normalizedJob.company.type && normalizedJob.company.type[0]" class="custom-chip-small custom-chip-blue">
          {{ normalizedJob.company.type[0] }}
        </div>
        <div v-if="normalizedJob.job_type && typeof normalizedJob.job_type === 'string'" class="custom-chip-small custom-chip-blue">
          {{ normalizedJob.job_type }}
        </div>
        <div v-else-if="normalizedJob.job_type && normalizedJob.job_type[0]" class="custom-chip-small custom-chip-blue">
          {{ normalizedJob.job_type[0] }}
        </div>
      </div>
      <div class="text-caption text-grey-6 company-size">
        {{ normalizedJob.company.size ? normalizedJob.company.size + ' employees' : 'Size not specified' }}
      </div>
    </div>
  </div>

  <div class="job-title-grid text-body2 text-weight-bold text-black q-mb-xs">
    {{ normalizedJob.title }}
  </div>
  
  <div class="job-meta-grid text-caption text-grey-8 q-mb-sm">
    {{ normalizedJob.location }} • {{ formattedSalary }}
    <span v-if="normalizedJob.opening"> • {{ normalizedJob.opening }} openings</span>
  </div>

  <!-- Show only first 2-3 most relevant tags -->
  <div class="row q-mb-sm q-gutter-xs" v-if="normalizedJob.company.tags && normalizedJob.company.tags.length">
    <div v-for="(tag, i) in normalizedJob.company.tags.slice(0, 3)" :key="'tag-' + i" class="custom-chip-small custom-chip-pink">
      {{ tag }}
    </div>
    <div v-if="normalizedJob.company.tags.length > 3" class="custom-chip-small custom-chip-grey">
      +{{ normalizedJob.company.tags.length - 3 }} more
    </div>
  </div>

  <div class="grid-actions q-mb-sm">
    <q-btn 
      flat 
      dense 
      label="Apply" 
      :class="userStore.token === null ? 'btn-disabled-small' : 'btn-outline-black-small'" 
      @click.stop="handleApply"
      :disable="userStore.role === 'recruiter'"
    />
    <q-btn 
      unelevated 
      dense 
      label="Learn" 
      :class="userStore.token === null ? 'btn-disabled-small' : 'btn-filled-black-small'" 
      @click.stop="handleLearnMore" 
    />
  </div>

  <div class="grid-footer row items-center justify-between q-mt-xs">
    <div class="text-caption text-grey-6">Posted {{ formattedPosted }}</div>
    <div class="row q-gutter-sm" v-if="userStore.token">
      <div class="report-hide-item row items-center cursor-pointer text-grey-7 text-caption" @click.stop="toggleSave">
        <q-icon :name="isSaved ? 'bookmark' : 'bookmark_outline'" size="14px" class="q-mr-xs" />
        <span>{{ isSaved ? 'Saved' : 'Save' }}</span>
      </div>
    </div>
  </div>
</template>

<!-- List Mode Layout (Original) -->
<template v-else>
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
      <div class="row items-center q-gutter-xs">
        <div class="text-subtitle1 text-weight-bold">
          {{ normalizedJob.company.name || 'Unknown Company' }}
        </div>

        <!-- Company Type -->
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
      <div class="row q-gutter-sm q-mt-xs">
        <div
          v-for="(tag, i) in normalizedJob.company.tags || []"
          :key="'tag-' + i"
          class="custom-chip custom-chip-pink"
        >
          {{ tag }}
        </div>
      </div>
    </div>
  </div>

  <!-- Job Details Inner Card -->
  <div class="q-mt-xs q-mx-none">
    <q-card class="inner-job-card q-py-xs q-px-md q-mx-none" flat bordered @click.stop>
      <div class="row q-col-gutter-sm items-center justify-between">
        <!-- Job info (left) -->
        <div class="col-8 col-md-8">
          <div class="row items-center q-gutter-sm">
            <div class="job-title text-body2 text-weight-bold text-black">
              {{ normalizedJob.title }}
            </div>

            <!-- Job Type -->
            <div
              v-for="(job_type, i) in normalizedJob.job_type || []"
              :key="'job-type-' + i"
              class="custom-chip custom-chip-blue"
            >
              {{ job_type }}
            </div>

            <!-- Work Mode -->
            <div
              v-for="(mode, i) in normalizedJob.workMode || []"
              :key="'work-mode-' + i"
              class="custom-chip custom-chip-blue"
            >
              {{ mode }}
            </div>
          </div>

          <!-- Job Meta: Location, Salary, Openings -->
          <div class="job-meta text-body2 text-grey-8 q-mt-xs">
            <div>{{ normalizedJob.location }}</div>
            <div>{{ formattedSalary }}</div>
            <div>Openings: {{ normalizedJob.opening || 'Not specified' }}</div>
          </div>
        </div>

        <!-- Buttons (right) -->
        <div class="col-4 col-md-4 text-right">
          <div class="row items-center justify-end q-gutter-sm no-wrap">
            <div v-if="userStore.token === null">
              <!-- Single Login Button -->
              <q-btn
                unelevated
                dense
                label="Login to Apply"
                class="btn-filled-black equal-button"
                type="button"
                @click.stop="redirectToLogin"
              />
            </div>
            <div v-else>
              <!-- Date info and buttons in a column layout -->
              <div class="column items-end q-gutter-xs">
                <div class="row items-center q-gutter-sm no-wrap">
                  <!-- Date info beside buttons -->
                  <div class="column items-end">
                    <div class="text-caption text-grey-6">Posted {{ formattedPosted }}</div>
                  </div>

                  <!-- Buttons -->
                  <div class="row items-center q-gutter-xs no-wrap">
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
</template>
  </q-card>
</template>

<script>
import { useUserStore } from 'src/stores/user-store'
import { useJobsStore } from 'src/stores/job-store'

export default {
  name: 'JobCard',
  props: {
    job: { type: Object, required: true },
    gridMode: { type: Boolean, default: false },
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
        bigDescription: raw.big_description || raw.description || '',
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
      return this.jobsStore.savedJobIds?.has(this.normalizedJob.jobid) || false
    },
    isRecentlyPosted() {
      if (!this.normalizedJob.posted) return false
      const postedDate = new Date(this.normalizedJob.posted)
      const diffInDays = (new Date() - postedDate) / (1000 * 60 * 60 * 24)
      return diffInDays <= 7
    },
  },
  methods: {
    getResponsiveCompanyName(name) {
      if (!name) return 'Unknown Company';
      
      // Get screen width (you can also use this.$q.screen if using Quasar)
      const screenWidth = window.innerWidth;
      let maxLength;
      
      // Determine max length based on screen size
      if (screenWidth >= 1200) {
        // Desktop/large screens
        maxLength = 15;
      } else if (screenWidth >= 768) {
        // Tablet screens
        maxLength = 12;
      } else if (screenWidth >= 480) {
        // Mobile landscape
        maxLength = 10;
      } else {
        // Mobile portrait
        maxLength = 8;
      }
      
      // If name fits, return as is
      if (name.length <= maxLength) return name;
      
      const words = name.split(' ').filter(word => word.length > 0);
      
      if (words.length === 1) {
        // Single word - truncate with ellipsis
        return words[0].substring(0, maxLength - 2) + '..';
      } else {
        // Multiple words - create abbreviation
        let abbreviation = '';
        const reserveForInitials = words.length - 1; // Reserve space for other word initials
        const firstWordMax = Math.max(1, maxLength - reserveForInitials);
        
        // Add first word (truncated if necessary)
        abbreviation += words[0].substring(0, Math.min(words[0].length, firstWordMax));
        
        // Add initials of other words
        for (let i = 1; i < words.length && abbreviation.length < maxLength; i++) {
          abbreviation += words[i].charAt(0).toUpperCase();
        }
        
        return abbreviation;
      }
    },
    shortenCompanyName(name) {
      // Keep the old method as fallback
      return this.getResponsiveCompanyName(name);
    },
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
        // Fetch company details and update selectedCompany in store
        await jobsStore.fetchCompanyDetail(this.normalizedJob.cid)

        // Navigate to full page
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
        query: { redirect: '/all-jobs' }, // 👈 force into applicant dashboard
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
    getRandomColor() {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
      return colors[Math.floor(Math.random() * colors.length)]
    },
  },
}
</script>

<style scoped>
.company-job-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: box-shadow 0.3s, transform 0.2s;
  position: relative;
  width: 100%;
  cursor: pointer;
}

/* Condensed Grid Mode */
.grid-mode {
  min-height: 240px;
  max-height: 280px;
  display: flex;
  flex-direction: column;
  padding: 12px !important;
}

.grid-mode:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.company-name {
  font-size: 14px;
  line-height: 1.2;
  max-height: 32px;
  overflow: hidden;
}

.company-size {
  font-size: 11px;
  line-height: 1.1;
}

.job-title-grid {
  font-size: 15px;
  line-height: 1.25;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.job-meta-grid { 
  font-size: 11px; 
  line-height: 1.2; 
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.grid-actions { 
  display: flex; 
  gap: 6px; 
  margin-top: auto; 
  padding-top: 8px; 
}

.grid-footer { 
  margin-top: 6px; 
  border-top: 1px solid #e5e5e5; 
  padding-top: 6px; 
}

.posted-date {
  font-size: 10px;
}

/* Small components for grid */
.custom-chip-small {
  font-size: 9px;
  font-weight: 500;
  border-radius: 4px;
  padding: 2px 6px;
  display: inline-flex;
  align-items: center;
  line-height: 1;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-chip-pink { 
  border: 1px solid #ff4c61; 
  background-color: #fff1f3; 
  color: #1d1d1f; 
}

.custom-chip-grey { 
  border: 1px solid #ccc; 
  background-color: #f5f5f5; 
  color: #666; 
}

.btn-outline-black-small, .btn-filled-black-small, .btn-disabled-small {
  font-size: 11px; 
  padding: 4px 8px; 
  min-height: 26px; 
  flex: 1; 
  font-weight: 500; 
  border-radius: 4px; 
  text-transform: none;
}

.btn-outline-black-small { 
  border: 1px solid #000; 
  color: #000; 
  background-color: #fff; 
}

.btn-filled-black-small { 
  background-color: #000; 
  color: #fff; 
}

.btn-disabled-small { 
  background-color: #e0e0e0; 
  color: #707070; 
  cursor: not-allowed; 
  border: 1px solid #ccc; 
}

/* Original styles (unchanged) */
.inner-job-card {
  background-color: #ffffff;
  border-radius: 0px;
  cursor: pointer;
  transition: background-color 0.2s;
  overflow: hidden;
  width: 100%;
}
.inner-job-card:hover { background-color: #f9f9f9; }

.btn-disabled {
  background-color: #e0e0e0; color: #707070; cursor: not-allowed; border: 1px solid #848484;
  width: 100px; padding: 2px 8px; font-weight: 600; font-size: 14px; text-transform: none; border-radius: 4px;
}
.btn-disabled:focus, .btn-disabled:hover { background-color: #e0e0e0; color: #a0a0a0; }

.custom-chip {
  font-size: 12px; font-weight: 500; border-radius: 8px; padding: 4px 10px;
  display: inline-flex; align-items: center; line-height: 1; cursor: default;
}
.custom-chip-blue { border: 1px solid #007aff; background-color: #f0f7ff; color: #1d1d1f; }
.custom-chip-black { border: 1px solid #28a745; background-color: #e6f4ea; color: #1d1d1f; }
.chip-label { padding: 0 6px; }

.equal-button {
  width: 100px; padding: 2px 8px; font-weight: 600; font-size: 14px; text-transform: none; border-radius: 4px;
}
.btn-outline-black { border: 1px solid black; color: black; background-color: white; }
.btn-filled-black { background-color: black; color: white; }

.description-text {
  font-family: 'Roboto', sans-serif; font-size: 14px; font-weight: 400; color: #1d1d1f; line-height: 1.4;
}
.arrow-symbol { position: absolute; top: 16px; right: 16px; font-size: 24px; color: #999999; }
.job-meta { font-size: 14px; color: #666; }
.job-title { font-size: 15px; font-weight: 600; color: #000000; line-height: 20px; }
.ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>