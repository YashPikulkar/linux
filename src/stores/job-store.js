// stores/jobs-store.js
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
    jobLoading: false, // for job details
    companyLoading: false, // for company details

    // Dialog visibility
    applicationDialogVisible: false,
    learnMoreDialogVisible: false,
    companyDialogVisible: false,

    // Recruiter-specific
    recruiterJobs: [],
    jobStats: {
      total: 0,
      active: 0,
      closed: 0,
      drafts: 0,
    },

    // Message for UI feedback
    message: '',

    // ✅ Saved jobs (using Set for O(1) lookups)
    savedJobIds: new Set(),
  }),

  actions: {
    // ---------------- User Job Fetching ----------------
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

    async fetchJobs({ similarJobs = false, referenceJobId = null } = {}) {
      this.loading = true
      this.error = null
      try {
        let response
        if (similarJobs && referenceJobId) {
          response = await axios.get(`${baseUrl}/getSimilarJobs`, {
            params: { jobid: referenceJobId },
          })
        } else {
          const filterStore = useFilterStore()
          const filters = filterStore.filtersForApi

          console.log('👉 Filters about to be sent to backend:', filters)

          response = await axios.get(`${baseUrl}/getAllJobs`, {
            params: filters,
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
          })
        }
        this.jobs = response.data.jobs || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
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
        this.selectedCompany = response.data
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to fetch company detail'
        this.selectedCompany = null
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

    async openCompanyDialog(cid) {
      await this.fetchCompanyDetail(cid)
      this.companyDialogVisible = true
    },
    closeCompanyDialog() {
      this.companyDialogVisible = false
      this.selectedCompany = null
      this.error = null
    },
    toggleSave(jobid) {
      if (this.savedJobIds.has(jobid)) {
        this.savedJobIds.delete(jobid)
      } else {
        this.savedJobIds.add(jobid)
      }
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

    // ---------------- Saved Jobs ----------------
  },
  getters: {
    filteredJobs: (state) => () => state.jobs,
    getSavedJobs: (state) => state.jobs.filter((job) => state.savedJobIds.has(job.jobid)),
  },
})
