<template>
  <q-dialog
    v-model="showDialog"
    position="bottom"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    @hide="closeDialog"
  >
    <q-card flat bordered class="q-pa-lg dialog-card">
      <!-- Close icon -->
      <q-btn icon="close" flat round dense color="grey-6" class="close-icon" @click="closeDialog" />

      <div v-if="company" class="scroll">
        <div class="centered-div">
          <!-- Single Column Layout -->
          <div class="main-content-wrapper">
            <!-- Company Details Card -->
            <q-card class="company-details-card" flat bordered>
              <div class="q-pa-lg">
                <!-- Company Header with Logo & Basic Info -->
                <div class="company-header">
                  <div class="company-logo-section">
                    <q-avatar size="80px" class="company-logo">
                      <img
                        v-if="company.logo && company.logo !== 'https://via.placeholder.com/64'"
                        :src="company.logo"
                        :alt="`${company.name} logo`"
                        @error="onLogoError"
                      />
                      <div
                        v-else
                        :style="{ backgroundColor: getRandomColor() }"
                        class="logo-placeholder"
                      >
                        {{ getCompanyInitials(company.name) }}
                      </div>
                    </q-avatar>
                  </div>
                  <div class="company-title-section">
                    <div class="company-title">{{ company.name }}</div>
                    <div class="company-meta">
                      {{ formatCompanySize(company.size) }}
                      <span v-if="company.companyType.length">
                        &nbsp;•&nbsp; {{ company.companyType.join(', ') }}</span
                      >
                    </div>
                    <div class="company-status" v-if="company.hiringStatus">
                      <div class="custom-chip custom-chip-green">
                        {{ company.hiringStatus }}
                      </div>
                    </div>
                  </div>
                </div>

                <q-separator spaced class="q-my-lg" />

                <!-- Company Info Grid -->
                <div class="info-grid">
                  <div class="info-col" v-if="company.locations.length">
                    <div class="text-caption text-grey-7">Locations</div>
                    <div class="text-body1">{{ company.locations.join(', ') }}</div>
                  </div>
                  <div class="info-col" v-if="company.ceo">
                    <div class="text-caption text-grey-7">CEO</div>
                    <div class="text-body1">{{ company.ceo }}</div>
                  </div>
                  <div class="info-col" v-if="company.website">
                    <div class="text-caption text-grey-7">Website</div>
                    <div class="text-body1">
                      <a
                        :href="formatWebsiteUrl(company.website)"
                        target="_blank"
                        class="website-link"
                      >
                        {{ formatUrl(company.website) }}
                        <q-icon name="open_in_new" size="14px" class="q-ml-xs" />
                      </a>
                    </div>
                  </div>
                  <div class="info-col" v-if="company.founded">
                    <div class="text-caption text-grey-7">Founded</div>
                    <div class="text-body1">{{ company.founded }}</div>
                  </div>
                  <div class="info-col markets-col" v-if="company.markets.length">
                    <div class="text-caption text-grey-7">Markets/Industries</div>
                    <div class="markets-container">
                      <div
                        v-for="(market, i) in company.markets"
                        :key="i"
                        class="custom-chip custom-chip-blue"
                      >
                        {{ market }}
                      </div>
                    </div>
                  </div>
                  <div class="info-col tags-col" v-if="company.companyTags.length">
                    <div class="text-caption text-grey-7">Company Tags</div>
                    <div class="tags-container">
                      <div
                        v-for="(tag, i) in company.companyTags"
                        :key="i"
                        class="custom-chip custom-chip-purple"
                      >
                        {{ tag }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>

            <!-- About Company Card -->
            <q-card class="about-company-card" flat bordered v-if="company.description">
              <div class="q-pa-lg">
                <div class="about-company-section">
                  <div class="about-company-title">About {{ company.name }}</div>
                  <div
                    class="about-company-content"
                    v-html="formatCompanyDescription(company.description)"
                  ></div>
                </div>

                <!-- Additional Links Section -->
                <div v-if="company.otherLinks.length" class="links-section">
                  <q-separator spaced class="q-my-lg" />
                  <div class="links-title">Additional Resources</div>
                  <div class="links-container">
                    <a
                      v-for="(link, i) in company.otherLinks"
                      :key="i"
                      :href="formatWebsiteUrl(link)"
                      target="_blank"
                      class="additional-link"
                    >
                      {{ formatUrl(link) }}
                      <q-icon name="open_in_new" size="14px" class="q-ml-xs" />
                    </a>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>

      <div v-else class="q-pa-md">Loading company details...</div>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref } from 'vue'
import { useJobsStore } from 'src/stores/job-store'
import { getRandomColor } from 'src/assets/BW'

export default {
  name: 'CompanyDetailsCard',
  setup() {
    const jobsStore = useJobsStore()

    const showDialog = computed({
      get: () => jobsStore.companyDialogVisible,
      set: (val) => {
        if (!val) jobsStore.closeCompanyDialog()
      },
    })

    function ensureArray(field) {
      if (!field) return []
      if (Array.isArray(field)) return field
      return field
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }

    const company = computed(() => {
      const raw = jobsStore.selectedCompany
      if (!raw) return null

      return {
        logo: raw.logo || null,
        name: raw.name || 'Unknown Company',
        hiringStatus: raw.status || null,
        size: raw.companySize || 'Unknown size',
        ceo: raw.CEO || null,
        founded: raw.founded || null,
        companyTags: Array.isArray(raw.tags) ? raw.tags : [],
        description: raw.description || '',
        locations: ensureArray(raw.locations),
        markets: ensureArray(raw.markets),
        companyType: ensureArray(raw.type),
        website: raw.links && raw.links.length > 0 ? raw.links[0] : null,
        otherLinks: raw.links && raw.links.length > 1 ? raw.links.slice(1) : [],
      }
    })

    function formatCompanySize(size) {
      if (!size || size === 'Unknown size') return 'Size not specified'

      const num = parseInt(size.replace(/[^\d]/g, ''))
      if (isNaN(num)) return size

      if (num >= 10000) return `${Math.floor(num / 1000)}K+ employees`
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K employees`
      return `${num} employees`
    }

    function formatUrl(url) {
      if (!url) return ''
      return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
    }

    function formatWebsiteUrl(url) {
      if (!url) return '#'
      return url.startsWith('http') ? url : `https://${url}`
    }

    function getCompanyInitials(name) {
      if (!name) return '?'
      return name
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
    }

    function onLogoError(event) {
      event.target.style.display = 'none'
    }

    function closeDialog() {
      jobsStore.closeCompanyDialog()
    }

    function formatCompanyDescription(description) {
      if (!description) return ''

      // Clean up the description and split into sections
      let cleanedDescription = description.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

      // Split by double line breaks or more to identify sections
      const sections = cleanedDescription.split(/\n\s*\n+/).filter((section) => section.trim())

      return sections
        .map((section) => {
          const trimmed = section.trim()
          const lines = trimmed
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line)

          if (lines.length === 0) return ''

          const processedLines = lines.map((line) => {
            // Check if line is a heading (various patterns)
            const isHeading =
              // Short line with colon at end
              (line.length < 100 && line.endsWith(':')) ||
              // All caps short line
              (line.length < 80 && /^[A-Z\s\-_&]+:?$/.test(line)) ||
              // Title case with specific keywords
              (/^(About|Mission|Vision|Values|History|Company|Our|What|Founded|Established|Background|Overview)/i.test(
                line,
              ) &&
                line.length < 120) ||
              // Numbered or bulleted headings
              (/^(\d+\.|•|\*|-)\s*[A-Z]/.test(line) && line.length < 80)

            if (isHeading) {
              return `<div class="company-heading">${line.replace(/:$/, '')}</div>`
            }

            // Check if it's a bullet point
            if (/^[-•*]\s/.test(line) || /^\d+\.\s/.test(line)) {
              return `<div class="company-bullet">${line}</div>`
            }

            // Regular paragraph line
            return `<div class="company-paragraph">${line}</div>`
          })

          return processedLines.join('')
        })
        .join('<div class="company-section-break"></div>')
    }

    return {
      showDialog,
      company,
      closeDialog,
      formatCompanySize,
      formatUrl,
      formatWebsiteUrl,
      getCompanyInitials,
      onLogoError,
      getRandomColor,
      formatCompanyDescription,
    }
  },
}
</script>

<style scoped>
.dialog-card {
  width: 100vw;
  height: 85vh;
  max-width: 100vw;
  border-radius: 20px;
  position: relative;
}

.centered-div {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 20px;
}

.scroll {
  height: 100%;
  overflow-y: auto;
}

.main-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

/* Company Details Card */
.company-details-card {
  width: 100%;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid #ccc;
}

/* About Company Card */
.about-company-card {
  width: 100%;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid #ccc;
}

.close-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

/* Company Header */
.company-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 8px;
}

.company-logo {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.company-title-section {
  flex: 1;
}

.company-title {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.company-meta {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.company-status {
  margin-top: 8px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
  align-items: start;
}

.markets-col,
.tags-col {
  grid-column: 1 / -1;
}

.markets-container,
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.info-col {
  min-width: 0;
}

/* Custom Chips */
.custom-chip {
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  padding: 5px 14px;
  display: inline-block;
}

.custom-chip-green {
  border: 1px solid #10b981;
  background-color: #d1fae5;
  color: #065f46;
}

.custom-chip-blue {
  border: 1px solid #2a6fdb;
  background-color: #e6f0ff;
  color: #1b3a8a;
}

.custom-chip-purple {
  border: 1px solid #8b5cf6;
  background-color: #ede9fe;
  color: #5b21b6;
}

/* Links */
.website-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.website-link:hover {
  text-decoration: underline;
}

/* About Company Section */
.about-company-section {
  margin-bottom: 0;
}

.about-company-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.about-company-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

/* Company Description Formatting */
.about-company-content :deep(.company-heading) {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 24px 0 12px 0;
  line-height: 1.3;
}

.about-company-content :deep(.company-heading:first-child) {
  margin-top: 0;
}

.about-company-content :deep(.company-paragraph) {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #444;
  text-align: justify;
}

.about-company-content :deep(.company-bullet) {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #444;
  padding-left: 12px;
}

.about-company-content :deep(.company-section-break) {
  margin: 20px 0;
}

/* Links Section */
.links-section {
  margin-top: 24px;
}

.links-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.links-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.additional-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  padding: 6px 12px;
  border: 1px solid #e0e7ff;
  background-color: #f8faff;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.additional-link:hover {
  background-color: #e0e7ff;
  border-color: #c7d2fe;
}

/* Responsive Design */
@media (max-width: 768px) {
  .centered-div {
    width: 98%;
  }

  .company-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .company-title {
    font-size: 24px;
  }

  .about-company-title {
    font-size: 20px;
  }

  .about-company-content {
    font-size: 15px;
  }

  .links-container {
    flex-direction: column;
  }

  .additional-link {
    justify-content: center;
  }
}
</style>
