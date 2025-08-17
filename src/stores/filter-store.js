import { defineStore } from 'pinia'
import axios from 'axios'

export const useFilterStore = defineStore('filterStore', {
  state: () => ({
    selectedJobRoles: [],
    selectedMarkets: [],
    selectedSkills: [],
    selectedCompanies: [],
    preferredLocations: [],
    companySizes: [],
    companyTypes: [],
    jobTypes: [],
    jobMode: '',
    // 👇 NEW
    educations: [],

    jobRoles: [],
    markets: [],
    locations: [],
    skills: [],
    companies: [],
    // 👇 NEW (static or API later)
    educationOptions: [
      { label: 'Postgraduate', value: 'Postgraduate' },
      { label: 'Undergraduate', value: 'Undergraduate' },
      { label: 'PhD', value: 'Phd' },
      { label: '10th', value: '10th' },
      { label: '12th', value: '12th' },
    ],

    salary: { min: '', max: '' },
    equity: { min: 0, max: 2 },
    experienceRange: { min: 0, max: 30 },

    remoteJobFilter: 'none',

    filtersLoaded: false,
  }),

  getters: {
    popularCompanies: (state) => state.companies.slice(0, 6),

    getSalaryTag: (state) => {
      const { min, max } = state.salary
      if (!min && !max) return null
      if (min && !max) return `₹${min}+`
      if (!min && max) return `Up to ₹${max}`
      return `₹${min} — ₹${max}`
    },

    getEquityTag: (state) => {
      if (state.equity.min === 0 && state.equity.max === 2) return null
      return `${state.equity.min}% — ${state.equity.max}%`
    },

    getExperienceTag: (state) => {
      if (state.experienceRange.min === 0 && state.experienceRange.max === 30) return null
      return `Experience: ${state.experienceRange.min} - ${state.experienceRange.max} years`
    },

    computedTags(state) {
      const tags = []
      const getLabels = (ids, source) =>
        ids.map((id) => source.find((item) => item.value === id)?.label).filter(Boolean)

      tags.push(...getLabels(state.selectedJobRoles, state.jobRoles))
      tags.push(...getLabels(state.selectedMarkets, state.markets))
      tags.push(...getLabels(state.selectedSkills, state.skills))
      tags.push(...getLabels(state.selectedCompanies, state.companies))

      if (state.salary.min || state.salary.max) tags.push(this.getSalaryTag)
      if (state.equity.min > 0 || state.equity.max < 2) tags.push(this.getEquityTag)
      if (state.experienceRange.min > 0 || state.experienceRange.max < 30)
        tags.push(this.getExperienceTag)

      if (state.remoteJobFilter !== 'none') {
        const remoteMap = {
          include: 'Include Remote Jobs',
          only: 'Remote Only Jobs',
        }
        tags.push(remoteMap[state.remoteJobFilter])
      }

      if (state.jobMode && state.jobMode !== '') {
        tags.push(`Mode: ${state.jobMode}`)
      }

      tags.push(
        ...state.preferredLocations
          .map((id) => {
            const loc = state.locations.find((l) => l.value === id)
            return loc ? `Location: ${loc.label}` : null
          })
          .filter(Boolean),
      )

      tags.push(...state.companySizes)
      tags.push(...state.companyTypes)
      tags.push(...state.jobTypes)
      // 👇 NEW
      tags.push(...state.educations)

      return tags.filter(Boolean)
    },

    filtersForApi(state) {
      const filters = {}
      const addIfExists = (key, value) => {
        if (Array.isArray(value)) {
          if (value.length > 0) filters[key] = value
        } else if (value !== '' && value !== null && value !== undefined) {
          filters[key] = value
        }
      }

      addIfExists('companySizes', state.companySizes)
      // 👇 NEW
      addIfExists('educations', state.educations)

      const processedCompanyTypes = state.companyTypes.map((v) =>
        typeof v === 'string' ? v.replace(/^"|"$/g, '') : v,
      )
      const processedJobTypes = [...state.jobTypes]

      addIfExists('companyTypes', processedCompanyTypes)
      addIfExists('jobTypes', processedJobTypes)

      addIfExists(
        'companies',
        Array.isArray(state.selectedCompanies)
          ? state.selectedCompanies
          : state.selectedCompanies
            ? [state.selectedCompanies]
            : [],
      )

      addIfExists(
        'jobRoles',
        Array.isArray(state.selectedJobRoles)
          ? state.selectedJobRoles.map((id) => Number(id))
          : state.selectedJobRoles
            ? [Number(state.selectedJobRoles)]
            : [],
      )

      addIfExists('salaryMin', state.salary.min)
      addIfExists('salaryMax', state.salary.max)

      if (state.equity.min > 0 || state.equity.max < 2) {
        addIfExists('equityMin', state.equity.min)
        addIfExists('equityMax', state.equity.max)
      }

      if (state.experienceRange.min > 0 || state.experienceRange.max < 30) {
        addIfExists('experienceMin', Number(state.experienceRange.min))
        addIfExists('experienceMax', Number(state.experienceRange.max))
      }

      const markets = Array.isArray(state.selectedMarkets)
        ? state.selectedMarkets.map((id) => Number(id))
        : state.selectedMarkets
          ? [Number(state.selectedMarkets)]
          : []
      addIfExists('markets', markets)

      const skills = Array.isArray(state.selectedSkills)
        ? state.selectedSkills.map((id) => Number(id))
        : state.selectedSkills
          ? [Number(state.selectedSkills)]
          : []
      addIfExists('skills', skills)

      if (state.remoteJobFilter !== 'none') addIfExists('remoteJobFilter', state.remoteJobFilter)
      addIfExists('preferredLocations', [...state.preferredLocations])
      if (state.jobMode && state.jobMode !== '') addIfExists('jobMode', state.jobMode)

      return Object.keys(filters).length ? filters : null
    },
  },

  actions: {
    async fetchFilters(force = false) {
      if (this.filtersLoaded && !force) return
      try {
        const { data } = await axios.get('http://localhost:3000/jobs/getFilters')
        this.jobRoles = Array.isArray(data?.jobRoles) ? data.jobRoles : []
        this.markets = Array.isArray(data?.markets) ? data.markets : []
        this.locations = Array.isArray(data?.locations) ? data.locations : []
        this.skills = Array.isArray(data?.skills) ? data.skills : []
        this.companies = Array.isArray(data?.companies) ? data.companies : []
        this.companyTypes = Array.isArray(data?.companyTypes) ? data.companyTypes : []

        // 👇 If backend also provides education list
        if (Array.isArray(data?.educations)) this.educationOptions = data.educations

        this.filtersLoaded = true
      } catch (error) {
        console.error('Failed to fetch filters:', error)
        this.resetOptions()
      }
    },

    resetOptions() {
      this.jobRoles = []
      this.markets = []
      this.locations = []
      this.skills = []
      this.companies = []
      this.companyTypes = []
      this.educationOptions = []
    },

    removeTag(tag) {
      const findAndRemove = (arrayName, sourceArray) => {
        const item = sourceArray.find((i) => i.label === tag)
        if (item) {
          this[arrayName] = this[arrayName].filter((id) => id !== item.value)
          return true
        }
        return false
      }

      if (tag === this.getSalaryTag) return (this.salary = { min: '', max: '' })
      if (tag === this.getEquityTag) return (this.equity = { min: 0, max: 2 })
      if (tag === this.getExperienceTag) return (this.experienceRange = { min: 0, max: 30 })
      if (tag === 'Include Remote Jobs' || tag === 'Remote Only Jobs')
        return (this.remoteJobFilter = 'none')
      if (tag.startsWith('Mode: ')) {
        const mode = tag.replace('Mode: ', '')
        if (this.jobMode === mode) this.jobMode = ''
        return
      }

      if (findAndRemove('selectedSkills', this.skills)) return
      if (findAndRemove('preferredLocations', this.locations)) return
      if (this.companySizes.includes(tag))
        this.companySizes = this.companySizes.filter((t) => t !== tag)
      if (this.companyTypes.includes(tag))
        this.companyTypes = this.companyTypes.filter((t) => t !== tag)
      if (findAndRemove('selectedCompanies', this.companies)) return
      if (findAndRemove('selectedMarkets', this.markets)) return
      if (findAndRemove('selectedJobRoles', this.jobRoles)) return
      if (this.jobTypes.includes(tag)) this.jobTypes = this.jobTypes.filter((t) => t !== tag)
      // 👇 NEW
      if (this.educations.includes(tag)) this.educations = this.educations.filter((t) => t !== tag)
    },

    clearAll() {
      this.selectedJobRoles = []
      this.selectedMarkets = []
      this.selectedSkills = []
      this.selectedCompanies = []
      this.location = ''
      this.salary = { min: '', max: '' }
      this.equity = { min: 0, max: 2 }
      this.experienceRange = { min: 0, max: 30 }
      this.companySizes = []
      this.companyTypes = []
      this.jobTypes = []
      this.remoteJobFilter = 'none'
      this.preferredLocations = []
      this.jobMode = ''
      // 👇 NEW
      this.educations = []
    },
  },
})
