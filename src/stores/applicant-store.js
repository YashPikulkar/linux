import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user-store'

export const useApplicantStore = defineStore('applicant', {
  state: () => ({
    applications: [], // all applications with status
    loading: false,
    error: null,
  }),

  actions: {
    async fetchApplications() {
      const userStore = useUserStore()
      const uid = userStore.uid // get logged-in user id

      this.loading = true
      this.error = null

      try {
        const res = await axios.get(`http://localhost:3000/application/status/${uid}`)
        this.applications = res.data // store response in state
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch applications'
      } finally {
        this.loading = false
      }
    },
  },
})
