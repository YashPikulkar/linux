<template>
  <q-page class="q-pa-lg">
    <div v-if="company" class="scroll">
      <div class="centered-div">
        <!-- Single Column Layout -->
        <div class="main-content-wrapper">
          <!-- Company Details Card - First Part -->
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
                    <div
                      class="custom-chip"
                      :class="
                        isHiring(company.hiringStatus) ? 'custom-chip-green' : 'custom-chip-red'
                      "
                    >
                      {{ company.hiringStatus }}
                    </div>
                  </div>
                </div>
              </div>

              <q-separator spaced class="q-my-lg" />

              <!-- Company Info Grid - Only Locations and CEO -->
              <div class="info-grid">
                <div class="info-col" v-if="company.locations.length">
                  <div class="text-caption text-grey-7">Locations</div>
                  <div class="text-body1">{{ company.locations.join(', ') }}</div>
                </div>
                <div class="info-col" v-if="company.ceo">
                  <div class="text-caption text-grey-7">CEO</div>
                  <div class="text-body1">{{ company.ceo }}</div>
                </div>
              </div>
            </div>
          </q-card>

          <!-- 3 Tabbed Sections Below -->
          <q-card class="tabbed-sections-card" flat bordered>
            <!-- Tab Headers -->
            <q-tabs
              v-model="activeTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="description" icon="description" label="Description" />
              <q-tab name="details" icon="info" label="Details" />
              <q-tab name="jobs" icon="work" label="Jobs" />
            </q-tabs>

            <q-separator />

            <!-- Tab Panels -->
            <q-tab-panels v-model="activeTab" animated>
              <!-- Description Tab -->
              <q-tab-panel name="description" class="q-pa-lg">
                <div class="about-company-section">
                  <div class="about-company-title">About {{ company.name }}</div>
                  <div
                    class="about-company-content"
                    v-html="formatCompanyDescription(company.description)"
                  ></div>
                </div>
              </q-tab-panel>

              <!-- Details Tab -->
              <q-tab-panel name="details" class="q-pa-lg">
                <div class="details-section">
                  <div class="section-title">Company Details</div>

                  <!-- Markets/Industries -->
                  <div class="detail-group" v-if="company.markets.length">
                    <div class="detail-label">Markets/Industries</div>
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

                  <!-- Company Tags -->
                  <div class="detail-group" v-if="company.companyTags.length">
                    <div class="detail-label">Company Tags</div>
                    <div class="tags-container">
                      <div
                        v-for="(tag, i) in company.companyTags"
                        :key="i"
                        class="custom-chip custom-chip-purple "
                        color
                      >
                        {{ tag }}
                      </div>
                    </div>
                  </div>

                  <!-- Company Links Section -->
                  <div class="detail-group" v-if="company.links && company.links.length">
                    <div class="detail-label">Links</div>
                    <div class="links-container">
                      <!-- Primary Links -->
                      <div class="primary-links">
                        <a
                          v-if="company.links[0]"
                          :href="formatUrl(company.links[0])"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="link-item primary-link linkedin-link"
                        >
                          <q-icon name="fab fa-linkedin" class="link-icon" />
                          <span>LinkedIn Profile</span>
                          <q-icon name="open_in_new" class="external-icon" />
                        </a>

                        <a
                          v-if="company.links[1]"
                          :href="formatUrl(company.links[1])"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="link-item primary-link careers-link"
                        >
                          <q-icon name="work" class="link-icon" />
                          <span>Careers Page</span>
                          <q-icon name="open_in_new" class="external-icon" />
                        </a>

                        <a
                          v-if="company.links[2]"
                          :href="formatUrl(company.links[2])"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="link-item primary-link website-link"
                        >
                          <q-icon name="language" class="link-icon" />
                          <span>Company Website</span>
                          <q-icon name="open_in_new" class="external-icon" />
                        </a>
                      </div>

                      <!-- Additional Links -->
                      <div v-if="company.links.length > 3" class="additional-links">
                        <div class="additional-links-label">Additional Links</div>
                        <div class="additional-links-grid">
                          <a
                            v-for="(link, index) in company.links.slice(3)"
                            :key="'additional-' + index"
                            :href="formatUrl(link)"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="link-item additional-link"
                          >
                            <q-icon name="link" class="link-icon" />
                            <span>{{ formatLinkName(link, index + 4) }}</span>
                            <q-icon name="open_in_new" class="external-icon" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Company Info -->
                  <div class="additional-info">
                    <q-list bordered separator>
                      <q-item v-if="company.ceo">
                        <q-item-section avatar>
                          <q-icon name="person" color="primary" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Chief Executive Officer</q-item-label>
                          <q-item-label caption>{{ company.ceo }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="company.size">
                        <q-item-section avatar>
                          <q-icon name="groups" color="primary" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Company Size</q-item-label>
                          <q-item-label caption>{{ formatCompanySize(company.size) }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="company.locations.length">
                        <q-item-section avatar>
                          <q-icon name="location_on" color="primary" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Locations</q-item-label>
                          <q-item-label caption>{{ company.locations.join(', ') }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="company.companyEmail">
                        <q-item-section avatar>
                          <q-icon name="email" color="primary" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Company Email</q-item-label>
                          <q-item-label caption>{{ company.companyEmail }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Jobs Tab -->
              <q-tab-panel name="jobs" class="q-pa-lg">
                <div class="jobs-section">
                  <div class="section-title">Available Positions</div>

                  <!-- Company Outer Card -->
                  <q-card class="company-outer-card q-pa-md q-mb-md full-width" flat bordered>
                    <!-- Top Row: Logo, Name, Status
                    <div class="row items-start q-gutter-sm">
                       <q-avatar size="64px">
                        <img
                          v-if="company.logo && company.logo !== 'https://via.placeholder.com/64'"
                          :src="company.logo"
                          :alt="`${company.name} logo`"
                          @error="onLogoError"
                        />
                        <div
                          v-else
                          style="height: 64px; width: 64px"
                          :style="'background-color:' + getRandomColor()"
                          class="logo-placeholder"
                        >
                          {{ getCompanyInitials(company.name) }}
                        </div>
                      </q-avatar> -->

                      <!-- <div class="col">
                        <div class="row items-center q-gutter-xs">
                          <div class="text-subtitle1 text-weight-bold">
                            {{ company.name }}
                          </div>

                          Hiring Status
                          <div
                            v-if="company.hiringStatus"
                            class="custom-chip"
                            :class="
                              isHiring(company.hiringStatus)
                                ? 'custom-chip-green'
                                : 'custom-chip-red'
                            "
                          >
                            {{ company.hiringStatus }}
                          </div> -->

                          <!-- Company Type
                          <div
                            v-for="(type, i) in company.companyType"
                            :key="'type-' + i"
                            class="custom-chip custom-chip-blue"
                          >
                            {{ type }}
                          </div>
                        </div> -->

                        <!-- Company Size
                        <div class="text-caption text-grey-6">
                          Company Size: {{ formatCompanySize(company.size) }}
                        </div> -->

                        <!-- Company Tags--> 
                        <!-- <div class="row q-gutter-sm q-mt-xs">
                          <div
                            v-for="(tag, i) in company.companyTags"
                            :key="'tag-' + i"
                            class="custom-chip custom-chip-pink"
                          >
                            {{ tag }}
                          </div>
                        </div> 
                      </div>
                    </div>-->

                    <!-- CompanyJobsList Component Area -->
                    <div class="q-mt-md">
                      <div class="q-mt-md">
                        <CompanyJobsList />
                      </div>
                    </div>

                    <!-- <div class="arrow-symbol">&gt;</div> -->
                  </q-card>

                  <!-- No jobs message -->
                  <div v-if="!mockJobs.length" class="no-jobs-message">
                    <q-icon name="work_off" size="48px" color="grey-5" />
                    <div class="text-h6 q-mt-md text-grey-6">No open positions</div>
                    <div class="text-body2 text-grey-5">Check back later for new opportunities</div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
    <JobDetails />
    <JobApplication />
  </q-page>
</template>

<script>
import { computed, ref } from 'vue'
import { useJobsStore } from 'src/stores/job-store'
import { getRandomColor } from 'src/assets/BW'
import CompanyJobsList from './CompanyJobsList.vue'
import JobDetails from './JobDetails.vue'
import JobApplication from './JobApplication.vue'

export default {
  name: 'CompanyDetailsPage',
  components: { CompanyJobsList, JobDetails, JobApplication },
  setup() {
    const jobsStore = useJobsStore()
    const activeTab = ref('description')

    // Mock jobs data for the jobs tab
    const mockJobs = ref([
      {
        id: 1,
        title: 'Senior Frontend Developer',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120k - $160k',
        posted: '2 days ago',
        skills: ['React', 'TypeScript', 'Vue.js', 'CSS'],
      },
      {
        id: 2,
        title: 'Backend Engineer',
        location: 'Remote',
        type: 'Full-time',
        salary: '$130k - $170k',
        posted: '1 week ago',
        skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
      },
      {
        id: 3,
        title: 'UX Designer',
        location: 'New York, NY',
        type: 'Contract',
        salary: '$80 - $100/hr',
        posted: '3 days ago',
        skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
      },
    ])

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
      console.log(raw)
      if (!raw) return null

      return {
        logo: raw.logo || null,
        name: raw.name || 'TechCorp Innovation',
        hiringStatus: raw.status || 'Actively Hiring',
        size: raw.companySize || '500-1000',
        ceo: raw.CEO || 'Sarah Johnson',
        companyEmail: raw.companyEmail || null,
        companyTags: Array.isArray(raw.tags)
          ? raw.tags
          : ['Innovation', 'Tech', 'AI/ML', 'Remote-First'],
        description:
          raw.description ||
          `About TechCorp Innovation:
 
TechCorp Innovation is a leading technology company focused on developing cutting-edge AI solutions for businesses worldwide.

Our Mission:
To democratize artificial intelligence and make it accessible to businesses of all sizes.

What We Do:
• Develop enterprise AI solutions
• Provide consulting services for digital transformation
• Create innovative software products
• Build custom automation tools`,
        locations: ensureArray(raw.locations) || [
          'San Francisco, CA',
          'New York, NY',
          'Austin, TX',
        ],
        markets: ensureArray(raw.markets) || [
          'Technology',
          'Artificial Intelligence',
          'Enterprise Software',
        ],
        companyType: ensureArray(raw.type) || ['Private', 'B2B'],
        links: ensureArray(raw.links) || [],
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

    function isHiring(status) {
      if (!status) return false
      const hiringKeywords = [
        'actively hiring',
        'hiring',
        'recruiting',
        'open positions',
        'now hiring',
        'we are hiring',
      ]
      return hiringKeywords.some((keyword) => status.toLowerCase().includes(keyword.toLowerCase()))
    }

    function viewJobDetails(job) {
      // Handle job click - you can navigate to job details or open another dialog
      console.log('View job details:', job)
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

    function formatUrl(url) {
      if (!url) return '#'
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      return `https://${url}`
    }

    function formatLinkName(url, index) {
      if (!url) return `Additional Link ${index}`

      // Clean up the URL for display
      let displayName = url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
        .split('?')[0]

      // Capitalize first letter
      displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

      return displayName || `Additional Link ${index}`
    }

    return {
      company,
      activeTab,
      mockJobs,
      formatCompanySize,
      getCompanyInitials,
      onLogoError,
      getRandomColor,
      formatCompanyDescription,
      formatUrl,
      formatLinkName,
      viewJobDetails,
      isHiring,
    }
  },
}
</script>

<style scoped>
/* Main dialog styling - centered modal */

.scroll {
  height: 100%;
  overflow-y: auto;
}

.centered-div {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}

.main-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  max-width: 100%;
  margin: 0 auto;
}

/* Company Details Card - First Part Only */
.company-details-card {
  width: 100%;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
}

/* New Tabbed Sections Card */
.tabbed-sections-card {
  width: 100%;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.close-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
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
  border-radius: 12px;
}

.company-title-section {
  flex: 1;
}

.company-title {
  font-size: 28px;
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

/* Info Grid - Simplified */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
  align-items: start;
}

.info-col {
  min-width: 0;
}

/* Section Titles */
.section-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1a1a1a;
}

/* Details Section */
.detail-group {
  margin-bottom: 24px;
}

.detail-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.markets-container,
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Links Section Styles */
.links-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.primary-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.additional-links {
  margin-top: 8px;
}

.additional-links-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.additional-links-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  background-color: #fafafa;
  color: #333;
}

.link-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #333;
}

.primary-link {
  font-weight: 500;
}

.linkedin-link {
  background-color: #f0f7ff;
  border-color: #0077b5;
}

.linkedin-link:hover {
  background-color: #e6f3ff;
}

.careers-link {
  background-color: #f0f9ff;
  border-color: #0ea5e9;
}

.careers-link:hover {
  background-color: #e0f2fe;
}

.website-link {
  background-color: #f0fdf4;
  border-color: #10b981;
}

.website-link:hover {
  background-color: #dcfce7;
}

.additional-link {
  background-color: #f9f9f9;
  border-color: #d1d5db;
  font-size: 14px;
}

.additional-link:hover {
  background-color: #f3f4f6;
}

.link-icon {
  flex-shrink: 0;
  font-size: 20px;
}

.linkedin-link .link-icon {
  color: #0077b5;
}

.careers-link .link-icon {
  color: #0ea5e9;
}

.website-link .link-icon {
  color: #10b981;
}

.additional-link .link-icon {
  color: #6b7280;
}

.external-icon {
  margin-left: auto;
  font-size: 16px;
  color: #9ca3af;
}

.additional-info {
  margin-top: 24px;
}

/* Jobs Section */
.jobs-section {
  margin-bottom: 0;
}

/* Company Outer Card - matches JobCard styling */
.company-outer-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: box-shadow 0.3s;
  position: relative;
  width: 100%;
  border: 1px solid #e0e0e0;
}

.company-outer-card .logo-placeholder {
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
}

/* Arrow symbol for company card */
.company-outer-card .arrow-symbol {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 24px;
  color: #999999;
}

.no-jobs-message {
  text-align: center;
  padding: 48px 24px;
  color: #666;
}

/* Custom Chips - Updated with red chip for not hiring */
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

.custom-chip-green {
  border: 1px solid #10b981;
  background-color: #d1fae5;
  color: #065f46;
}

.custom-chip-red {
  border: 1px solid #ef4444;
  background-color: #fee2e2;
  color: #991b1b;
}

.custom-chip-blue {
  border: 1px solid #007aff;
  background-color: #f0f7ff;
  color: #1d1d1f;
}

.custom-chip-purple {
    border: 1px solid grey;
  background-color: #fefcfa;
  color:grey;
}

.custom-chip-pink {
  border: 1px solid #ff4c61;
  background-color: #fff1f3;
  color: #1d1d1f;
}

/* About Company Section */
.about-company-title {
  font-size: 22px;
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

/* Arrow symbol for job cards */
.arrow-symbol {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 24px;
  color: #999999;
}

/* Responsive Design */
@media (max-width: 768px) {
  .centered-dialog {
    width: 95vw;
    height: 90vh;
    margin: 0;
  }

  .centered-div {
    padding: 12px;
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

  .section-title {
    font-size: 20px;
  }

  .primary-links {
    gap: 8px;
  }

  .link-item {
    padding: 10px 14px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .centered-dialog {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }

  .company-title {
    font-size: 22px;
  }

  .section-title {
    font-size: 18px;
  }

  .link-item {
    padding: 8px 12px;
  }
}
</style>
