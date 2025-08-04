// stores/jobStore.js
import { defineStore } from "pinia";
import axios from "axios";

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    jobs: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchJobs(filters = {}) {
      this.loading = true;
      this.error = null;
    
      try {
        // ❌ Comment out real API call
        // const res = await axios.get("http://localhost:3000/jobs/getJobs", {
        //   params: filters,
        // });
        // this.jobs = res.data.jobs;
    
        // ✅ Mock data (fully matching your backend shape)
        this.jobs = [
          {
            id: 1,
            title: "Frontend Engineer",
            jobType: "Full-time",
            modeOfWork: "Remote",
            experienceRequired: "1-3 years",
            salary: "10 – 15",
            location: "Bangalore, India",
            skills: ["Vue.js", "JavaScript", "HTML", "CSS", "REST APIs"],
            posted: "2025-07-25",
    
            logo: "https://cdn.quasar.dev/logo-v2/svg/logo.svg",
            name: "TechCorp",
            shortDescription: "Innovating business through tech",
            size: "51-200 Employees",
            hiringStatus: "Hiring Now",
            companyType: "Startup",
            tags: ["B2B", "Fast Growing", "VC Funded"],
    
            recruiterEmail: "recruiter@techcorp.com",
            recruiterName: "Jane Doe",
            description:
              "We are looking for a skilled frontend engineer to build beautiful UIs...",
          },
          // 👉 Add more mock jobs here if needed
        ];
    
        console.log("Mock jobs fetched with filters:", filters, this.jobs);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
,    
  },
});
