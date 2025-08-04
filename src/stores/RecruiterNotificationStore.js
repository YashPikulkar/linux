// src/stores/RecruiterNotificationStore.js
import { defineStore } from 'pinia'

export const useRecruiterNotificationStore = defineStore('recruiterNotificationStore', {
  state: () => ({
    notifications: [
      {
        title: 'New Applicant',
        message: 'John Doe has applied for your job post: Senior Backend Developer.',
        timestamp: '10 minutes ago',
      },
      {
        title: 'Candidate Accepted Offer',
        message: 'Alice Smith accepted your job offer for UI/UX Designer.',
        timestamp: '2 hours ago',
      },
      {
        title: 'Job Expiry Reminder',
        message: 'Your job posting "DevOps Engineer" is expiring tomorrow.',
        timestamp: 'Yesterday',
      },
      {
        title: 'New Message',
        message: 'You received a new message from applicant Mike Johnson.',
        timestamp: 'Just now',
      }
    ]
  })
})
