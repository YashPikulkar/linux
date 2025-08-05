import { defineStore } from 'pinia'
const baseUrl = "http://localhost:3000" 

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    async login({ email, password }) {
      try {
        const res = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        const responseJson = await res.json()
        

        if (!res.ok) {
          return { success: false, message: responseJson.message || 'Login failed' }
        }

        this.user = responseJson.user
        this.token = responseJson.token

        return { success: true, message: responseJson.message || 'Login successful' }
      } catch (error) {
        console.warn('Login error:', error)
        return { success: false, message: 'Network error or server unavailable' }
      }
    },

    async sendOTP(email) {
      try {
        const res = await fetch(`${baseUrl}/auth/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email }),
        })

        const responseJson = await res.json()

        if (!res.ok) {
          return { success: false, message: responseJson.message || 'Failed to send OTP' }
        }

        return { success: true, message: responseJson.message || 'OTP sent successfully' }
      } catch (error) {
        console.error('Error sending OTP:', error)
        return { success: false, message: 'Something went wrong while sending OTP' }
      }
    },

    async verifyOTP(email, otp) {
      try {
        const res = await fetch(`${baseUrl}/auth/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email, otp: otp }),
        })

        const responseData = await res.json()

        if (!res.ok) {
          return { success: false, message: responseData.message || 'OTP verification failed' }
        }

        if (!responseData.success) {
          return { success: false, message: responseData.message || 'OTP verification failed' }
        }

        return { success: true, message: responseData.message || 'OTP verified successfully' }
      } catch (error) {
        console.error('Error verifying OTP:', error)
        return { success: false, message: error.message || 'Network error during OTP verification' }
      }
    },

    async register(data) {
      this.user = null
      this.token = null

      try {
        const response = await fetch(`${baseUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const res = await response.json()

        if (!response.ok) {
          if (res.message && res.message.includes('Duplicate entry')) {
            return {
              success: false,
              message: 'Email already exists. Please use a different email.',
            }
          }
          return { success: false, message: res.message || 'Registration failed' }
        }

        if (res.success) {
          this.user = res.user
          this.token = res.token
          return { success: true, message: res.message || 'Registration successful' }
        }

        return { success: false, message: res.message || 'Registration failed' }
      } catch (error) {
        console.error('Error during registration:', error)
        return { success: false, message: error.message || 'Network error during registration' }
      }
    },
  },
});