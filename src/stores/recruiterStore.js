// stores/recruiterStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecruiterStore = defineStore('recruiter', () => {
  // ✅ Default company profile with multiple locations
  const companyProfile = ref({
    name: 'Acme Technologies',
    email: 'hr@acmetech.com',
    phone: '9876543210',
    password: 'Secure@1234',
    companyType: 'Private Limited',
    industry: 'Information Technology',
    companySize: '201-500 employees',
    locations: ['Bangalore', 'Hyderabad', 'Mumbai'], // ✅ Correct array
    description: 'Acme Technologies is a leading software solutions provider...',
    taxIdOrGst: '29ABCDE1234F2Z5',
    logoUrl: 'https://cdn.quasar.dev/img/mountains.jpg',
    registrationCertificateUrl: 'https://example.com/certificate/acme_reg_cert.pdf'
  })

  // ✅ Update profile
  function setCompanyProfile(newProfile) {
    companyProfile.value = { ...companyProfile.value, ...newProfile }
  }

  // ✅ Fix reset profile to match default structure
  function resetCompanyProfile() {
    companyProfile.value = {
      name: '',
      email: '',
      phone: '',
      password: '',
      companyType: '',
      industry: '',
      companySize: '',
      locations: [], // ✅ should be an array, not location: ''
      description: '',
      taxIdOrGst: '',
      logoUrl: '',
      registrationCertificateUrl: ''
    }
  }

  return {
    companyProfile,
    setCompanyProfile,
    resetCompanyProfile
  }
})
