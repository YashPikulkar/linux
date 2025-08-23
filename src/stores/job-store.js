import axios from 'axios'
import qs from 'qs'
import { defineStore } from 'pinia'
import { useFilterStore } from './filter-store'
import { useUserStore } from './user-store'

const baseUrl = 'http://localhost:3000/jobs'

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [],
    selectedJob: null,
    selectedCompany: null,
    loading: false,
    error: null,
    selectedJobId: null,
    jobLoading: false,
    companyLoading: false,
    companyJobs: [],

    applicationDialogVisible: false,
    learnMoreDialogVisible: false,
    companyDialogVisible: false,

    recruiterJobs: [],
    jobStats: {
      total: 0,
      active: 0,
      closed: 0,
      drafts: 0,
    },

    message: '',

    // Load savedJobIds from localStorage or initialize as empty set
    savedJobIds: new Set(JSON.parse(localStorage.getItem('savedJobIds') || '[]')),

    // Pagination
    page: 1,
    limit: 4,
    lastCount: 0,
    totalCount: 0,
    fetchingMore: false,
  }),

  actions: {
    async fetchCompanyJobs(companyId) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${baseUrl}/getCompanyJobs`, {
          params: { companyId },
        })
        this.companyJobs = response.data.jobs || []
      } catch (err) {
        this.error = err.message
        console.error('Error fetching company jobs:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchRecommendedJobs() {
      this.loading = true
      this.message = ''
      this.jobs = []

      try {
        const token = useUserStore().token
        const response = await fetch(`${baseUrl}/recommended`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) this.message = 'Add some skills to your profile'

        const data = await response.json()
        this.jobs = data.jobs || []

        if (this.jobs.length === 0) {
          this.message = 'No recommended jobs found.'
        }
      } catch (err) {
        this.message = err.message
        console.error('Job fetch error:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchJobs({
      similarJobs = false,
      referenceJobId = null,
      append = false,
      page = 1,
      limit = 4,
    } = {}) {
      if (!append) this.loading = true
      this.error = null

      try {
        let response
        if (similarJobs && referenceJobId) {
          response = await axios.get(`${baseUrl}/getSimilarJobs`, {
            params: { jobid: referenceJobId },
          })
          this.jobs = response.data.jobs || []
        } else {
          const filterStore = useFilterStore()
          const filters = filterStore.filtersForApi

          response = await axios.get(`${baseUrl}/getAllJobs`, {
            params: { ...filters, page, limit },
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
          })

          const fetchedJobs = response.data.jobs || []
          const pagination = response.data.pagination || {}

          if (append) {
            this.jobs = [...this.jobs, ...fetchedJobs]
            this.page = page
          } else {
            this.jobs = fetchedJobs
            this.page = pagination.page || page
          }

          this.limit = pagination.limit || limit
          this.lastCount = pagination.count || fetchedJobs.length
          this.totalCount = pagination.total || this.jobs.length
        }
      } catch (err) {
        this.error = err.message
        console.error('Error fetching jobs:', err)
      } finally {
        if (!append) this.loading = false
      }
    },

    async fetchMoreJobs() {
      if (this.fetchingMore) return
      if (this.jobs.length >= this.totalCount) return

      this.fetchingMore = true
      const nextPage = this.page + 1

      try {
        await this.fetchJobs({ append: true, page: nextPage, limit: this.limit })
      } catch (err) {
        console.error('Error fetching more jobs:', err)
      } finally {
        this.fetchingMore = false
      }
    },

    async fetchJobDetail(jobid) {
      this.jobLoading = true
      try {
        const response = await axios.get(`${baseUrl}/getJobDetail`, { params: { jobid } })
        this.selectedJob = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to fetch job detail'
        this.selectedJob = null
        return null
      } finally {
        this.jobLoading = false
      }
    },

    async fetchCompanyDetail(cid) {
      this.companyLoading = true
      try {
        const response = await axios.get(`http://localhost:3000/company/getCompanyDetail`, {
          params: { cid },
        })

        console.log('🔍 Full Response from backend:', response)
        console.log('📦 Data from backend:', response.data)

        this.selectedCompany = response.data
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to fetch company detail'
        this.selectedCompany = null
        console.error('❌ Error fetching company detail:', err)
      } finally {
        this.companyLoading = false
      }
    },

    // ---------------- Dialog Actions ----------------
    async openApplicationDialog(jobid) {
      this.selectedJobId = jobid
      await this.fetchJobDetail(jobid)
      this.applicationDialogVisible = true
    },
    closeApplicationDialog() {
      this.applicationDialogVisible = false
      this.error = null
    },

    async openLearnMoreDialog(jobid) {
      this.selectedJobId = jobid
      await this.fetchJobDetail(jobid)
      this.learnMoreDialogVisible = true
    },
    closeLearnMoreDialog() {
      this.learnMoreDialogVisible = false
      this.selectedJobId = null
      this.selectedJob = null
      this.error = null
    },

    toggleSave(jobid) {
      if (this.savedJobIds.has(jobid)) {
        this.savedJobIds.delete(jobid)
      } else {
        this.savedJobIds.add(jobid)
      }

      // Persist saved jobs to localStorage
      localStorage.setItem('savedJobIds', JSON.stringify(Array.from(this.savedJobIds)))
    },

    // ---------------- Recruiter Actions ----------------
    async postJob(jobData) {
      this.loading = true
      this.error = null

      try {
        const token = useUserStore().token || sessionStorage.getItem('token')
        if (!token) throw new Error('Authorization token is missing')

        const response = await fetch(`${baseUrl}/CreateJob`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(jobData),
        })

        const result = await response.json()
        if (!response.ok) throw new Error(result.message || 'Failed to post job')

        if (result.data || result.job) {
          this.jobs.unshift(result.data || result.job)
        }

        return {
          success: true,
          message: result.message || 'Job posted successfully',
          data: result.data || result.job,
        }
      } catch (error) {
        this.error = error.message
        console.error('Error posting job:', error)
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    async fetchJobByRecruiter() {
      try {
        const token = useUserStore().token || sessionStorage.getItem('token')
        if (!token) throw new Error('Authorization token is missing')

        const response = await fetch(`${baseUrl}/getJobsByRecruiter`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Failed to fetch recruiter jobs')

        this.recruiterJobs = data.jobs
        return data.jobs
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async deleteJob(jobid) {
      try {
        const token = useUserStore().token || sessionStorage.getItem('token')
        if (!token) throw new Error('Authorization token is missing')

        const response = await fetch(`${baseUrl}/deleteJob/${jobid}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Failed to delete job')

        this.recruiterJobs = this.recruiterJobs.filter((job) => job.jobid !== jobid)
        this.jobs = this.jobs.filter((job) => job.jobid !== jobid)

        return data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateJob(jobid, updatedJob) {
      try {
        const token = useUserStore().token || sessionStorage.getItem('token')
        if (!token) throw new Error('Authorization token is missing')

        const response = await fetch(`${baseUrl}/updateJob/${jobid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedJob),
        })

        const result = await response.json()
        if (!response.ok) throw new Error(result.message || 'Failed to update job')

        const jobIndex = this.recruiterJobs.findIndex((job) => job.jobid === jobid)
        if (jobIndex !== -1) {
          this.recruiterJobs[jobIndex] = { ...this.recruiterJobs[jobIndex], ...updatedJob }
        }

        return result
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async getJobById(jobid) {
      try {
        const response = await fetch(`${baseUrl}/getJob/${jobid}`)
        if (!response.ok) throw new Error('Failed to fetch job')
        const data = await response.json()
        return data.job
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async fetchJobStatsByRecruiter() {
      try {
        const token = useUserStore().token || sessionStorage.getItem('token')
        if (!token) throw new Error('Authorization token is missing')

        const response = await fetch(`${baseUrl}/getTotalJobsByRecruiter`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Failed to fetch job statistics')

        this.jobStats = data.stats || {
          total: data.total || 0,
          active: data.active || 0,
          closed: data.closed || 0,
          drafts: data.drafts || 0,
        }

        return this.jobStats
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
  },

  getters: {
    filteredJobs: (state) => () => state.jobs,
    getSavedJobs: (state) => state.jobs.filter((job) => state.savedJobIds.has(job.jobid)),
  },
})
