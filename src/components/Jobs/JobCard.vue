<template>
  <q-card
    :class="['company-job-card q-pa-md q-mb-md full-width', { 'grid-mode': isGridMode }]"
    flat
    bordered
    @click="openCompanyDialog"
  >
  <!-- Condensed Grid Mode Layout -->
<template v-if="isGridMode">
  <div class="row items-center q-mb-sm">
    <q-avatar size="36px" class="q-mr-sm">
      <div style="height: 36px; width: 36px" :style="'background-color:' + getRandomColor()" />
    </q-avatar>
    <div class="col">
      <div class="row items-center q-gutter-xs">
        <div class="text-subtitle2 text-weight-bold ellipsis company-name">{{ normalizedJob.company.name }}</div>
        <div v-if="normalizedJob.company.status" class="custom-chip-small custom-chip-black">{{ normalizedJob.company.status }}</div>
        <div v-for="(type, i) in normalizedJob.company.type || []" :key="'type-' + i" class="custom-chip-small custom-chip-blue">{{ type }}</div>
        <div v-if="normalizedJob.job_type" class="custom-chip-small custom-chip-blue">{{ normalizedJob.job_type }}</div>
      </div>
      <div class="text-caption text-grey-6 company-size">Company Size: {{ normalizedJob.company.size || 'Not specified' }}</div>
    </div>
  </div>

  <div class="description-text-grid text-caption text-grey-7 q-mb-xs">
    {{ normalizedJob.bigDescription?.slice(0, 20) || 'No description.' }}
  </div>

  <div class="row q-mb-sm q-gutter-xs" v-if="normalizedJob.company.tags && normalizedJob.company.tags.length">
    <div v-for="(tag, i) in normalizedJob.company.tags" :key="'tag-' + i" class="custom-chip-small custom-chip-pink">{{ tag }}</div>
  </div>

  <div class="job-title-grid text-body2 text-weight-bold text-black q-mb-xs">{{ normalizedJob.title }}</div>
  <div class="job-meta-grid text-caption text-grey-8 q-mb-sm">
    {{ normalizedJob.location }} • {{ formattedSalary }} • Openings: {{ normalizedJob.opening || 'Not specified' }}
  </div>

  <div class="grid-actions q-mb-sm">
    <q-btn flat dense label="Apply" :class="userStore.token === null ? 'btn-disabled-small' : 'btn-outline-black-small'" @click.stop="handleApply" />
    <q-btn unelevated dense label="Learn" :class="userStore.token === null ? 'btn-disabled-small' : 'btn-filled-black-small'" @click.stop="handleLearnMore" />
  </div>

  <div class="grid-footer row items-center justify-between q-mt-xs">
    <div class="row items-center q-gutter-sm">
      <div class="text-caption text-positive text-uppercase">Recruiter Recently Active</div>
      <div class="text-caption text-grey-6">Posted {{ formattedPosted }}</div>
    </div>
    <div class="row q-gutter-sm">
      <div class="report-hide-item row items-center cursor-pointer text-grey-7 text-caption">
        <q-icon name="bookmark" size="14px" class="q-mr-xs" />
        <span>Save</span>
      </div>
      <div class="report-hide-item row items-center cursor-pointer text-grey-7 text-caption">
        <q-icon name="block" size="14px" class="q-mr-xs" />
        <span>Hide</span>
      </div>
    </div>
  </div>
</template>

<!-- Original Layout (unchanged) -->
<template v-else>
  <div class="row items-start q-gutter-sm cursor-pointer">
    <q-avatar size="64px">
      <div style="height: 64px; width: 64px" :style="'background-color:' + getRandomColor()" />
    </q-avatar>
    <div class="col">
      <div class="row items-center q-gutter-xs">
        <div class="text-subtitle1 text-weight-bold">{{ normalizedJob.company.name }}</div>
        <div v-if="normalizedJob.company.status" class="custom-chip custom-chip-black">{{ normalizedJob.company.status }}</div>
        <div v-for="(type, i) in normalizedJob.company.type || []" :key="'type-' + i" class="custom-chip custom-chip-blue">{{ type }}</div>
        <div v-if="normalizedJob.job_type" class="custom-chip custom-chip-blue">{{ normalizedJob.job_type }}</div>
      </div>
      <div class="description-text">{{ normalizedJob.bigDescription?.slice(0, 100) || 'No description.' }}</div>
      <div class="text-caption text-grey-6">Company Size: {{ normalizedJob.company.size || 'Not specified' }}</div>
    </div>
  </div>

  <div class="row q-ml-sm q-mt-sm q-gutter-xs">
    <div v-for="(tag, i) in normalizedJob.company.tags || []" :key="'tag-' + i" class="custom-chip custom-chip-pink row items-center no-wrap">
      <span class="chip-label">{{ tag }}</span>
    </div>
  </div>

  <div class="q-mt-xs q-mx-none">
    <q-card class="inner-job-card q-py-xs q-px-md q-mx-none" flat bordered @click.stop>
      <div class="row q-col-gutter-sm items-center justify-between">
        <div class="col-8 col-md-8">
          <div class="job-title text-body2 text-weight-bold text-black">{{ normalizedJob.title }}</div>
          <div class="job-meta text-body2 text-grey-8">{{ normalizedJob.location }} • {{ formattedSalary }} • Openings: {{ normalizedJob.opening || 'Not specified' }}</div>
        </div>
        <div class="col-4 col-md-4 text-right">
          <div class="row items-center justify-end q-gutter-sm no-wrap">
            <div>
              <div class="text-caption text-positive text-uppercase">Recruiter Recently Active</div>
              <div class="text-caption text-grey-6">Posted {{ formattedPosted }}</div>
            </div>
            <q-btn flat dense label="Apply" :class="userStore.token === null ? 'btn-disabled' : 'btn-outline-black equal-button'" @click.stop="handleApply" />
            <q-btn unelevated dense label="Learn" :class="userStore.token === null ? 'btn-disabled' : 'btn-filled-black equal-button'" @click.stop="handleLearnMore" />
          </div>
        </div>
      </div>
    </q-card>
  </div>

  <div class="row items-center justify-end q-mt-sm q-gutter-md" @click.stop>
    <div class="report-hide-item row items-center cursor-pointer text-grey-7 text-caption">
      <q-icon name="bookmark" size="16px" class="q-mr-xs" />
      <span>Save</span>
    </div>
    <div class="report-hide-item row items-center cursor-pointer text-grey-7 text-caption">
      <q-icon name="block" size="16px" class="q-mr-xs" />
      <span>Hide</span>
    </div>
  </div>
  <div class="arrow-symbol">&gt;</div>
</template>
  </q-card>
</template>

<script>
import { useUserStore } from 'src/stores/user-store'
import { useJobsStore } from 'src/stores/job-store'
import { getRandomColor } from 'src/assets/BW'

export default {
  name: 'JobCard',
  props: {
    job: { type: Object, required: true },
    gridMode: { type: Boolean, default: false },
  },
  computed: {
    userStore: () => useUserStore(),
    jobsStore: () => useJobsStore(),
    isGridMode() { return this.gridMode },
    limitedTags() { return (this.normalizedJob.company.tags || []).slice(0, 2) },
    hasMoreTags() { return (this.normalizedJob.company.tags || []).length > 2 },
    normalizedJob() {
      const raw = this.job
      return {
        company: {
          name: raw.company_name || 'Unknown Company',
          status: raw.company_status || '',
          size: raw.companySize || '',
          type: raw.company_type || [],
          tags: raw.company_tags || [],
        },
        job_type: raw.job_type || '',
        bigDescription: raw.bigDescription || '',
        opening: raw.opening || 'Not specified',
        title: raw.custom_title || raw.job_roles || 'Job Title',
        location: raw.locations || 'Location Unknown',
        salary: { min: raw.salary_min || 0, max: raw.salary_max || 0, currency: 'INR' },
        posted: raw.posted || '',
        cid: raw.company_id,
        jobid: raw.jobid,
        logo: raw.logo || null,
      }
    },
    formattedSalary() {
      if (!this.normalizedJob.salary) return 'N/A'
      const { min, max, currency = 'INR' } = this.normalizedJob.salary
      const symbol = currency === 'INR' ? '₹' : currency
      if (min >= 100000) return `${symbol}${(min / 100000).toFixed(1)}L-${(max / 100000).toFixed(1)}L`
      if (min >= 1000) return `${symbol}${(min / 1000).toFixed(1)}K-${(max / 1000).toFixed(1)}K`
      return `${symbol}${min}-${max}`
    },
    formattedPosted() {
      return this.normalizedJob.posted ? new Date(this.normalizedJob.posted).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'
    },
  },
  methods: {
    getCompanySize() {
      const size = this.normalizedJob.company.size
      if (!size || size === 'Not specified') return '—'
      if (size.includes('employees')) return size.replace(' employees', '')
      return size
    },
    getShortLocation() {
      const location = this.normalizedJob.location
      if (!location || location === 'Location Unknown') return '—'
      // Extract city name if it's in format like "City, State"
      const parts = location.split(',')
      return parts[0].trim()
    },
    getShortPostedDate() {
      if (!this.normalizedJob.posted) return '—'
      const date = new Date(this.normalizedJob.posted)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return '1d ago'
      if (diffDays < 7) return `${diffDays}d ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
      return `${Math.floor(diffDays / 30)}m ago`
    },
    handleApply() {
      if (this.userStore.token == null) {
        this.$q.notify({ type: 'warning', message: 'Log in to apply for job!', position: 'bottom', timeout: 2000 })
      } else {
        this.applyForJob()
      }
    },
    handleLearnMore() {
      if (this.userStore.token == null) {
        this.$q.notify({ type: 'warning', message: 'Log in to learn more about job!', position: 'bottom', timeout: 2000 })
      } else {
        this.learnMoreForJob()
      }
    },
    async applyForJob() {
      if (!this.normalizedJob.jobid) return console.error('Missing jobid for application')
      await this.jobsStore.openApplicationDialog(this.normalizedJob.jobid)
    },
    async learnMoreForJob() {
      if (!this.normalizedJob.jobid) return console.error('Missing jobid for learn more')
      await this.jobsStore.openLearnMoreDialog(this.normalizedJob.jobid)
    },
    async openCompanyDialog() {
      if (!this.normalizedJob.cid) return console.error('Missing company id (cid)')
      await this.jobsStore.openCompanyDialog(this.normalizedJob.cid)
    },
    getRandomColor,
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