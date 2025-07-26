// stores/jobsStore.js
import { defineStore } from "pinia";

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    jobs: [
      {
        id: 1,
        title: "Frontend Engineer",
        company: "TechCorp",
        jobType: "Full-time",
        salary: "₹12L - ₹16L",
        location: "Bangalore, India",
        description:
          "We are looking for a skilled frontend engineer to build beautiful UIs...",
        skills: ["Vue.js", "JavaScript", "HTML", "CSS", "REST APIs"],
        postedAt: "2025-07-20",
      },
      {
        id: 2,
        title: "Backend Developer",
        company: "CodeHaus",
        jobType: "Part-time",
        salary: "₹4L - ₹6L",
        location: "Remote",
        description:
          "Looking for a backend developer to handle RESTful APIs and databases.",
        skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
        postedAt: "2025-07-18",
      },
      {
        id: 3,
        title: "UI/UX Designer",
        company: "Designify",
        jobType: "Contract",
        salary: "₹5L - ₹7L",
        location: "Mumbai, India",
        description:
          "Creative designer needed for wireframes and product design.",
        skills: ["Figma", "Sketch", "Adobe XD", "User Research"],
        postedAt: "2025-07-15",
      },
      {
        id: 4,
        title: "DevOps Engineer",
        company: "CloudStack",
        jobType: "Full-time",
        salary: "₹10L - ₹13L",
        location: "Hyderabad, India",
        description:
          "Implement and manage CI/CD pipelines and cloud infrastructure.",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
        postedAt: "2025-07-10",
      },
      {
        id: 5,
        title: "Data Scientist",
        company: "AIWorks",
        jobType: "Internship",
        salary: "₹3L - ₹5L",
        location: "Pune, India",
        description:
          "Assist in building machine learning models and data pipelines.",
        skills: [
          "Python",
          "Pandas",
          "Scikit-learn",
          "SQL",
          "Data Visualization",
        ],
        postedAt: "2025-07-05",
      },
    ],
  }),

  actions: {
    // TODO: Fetch jobs from backend API
    // async fetchJobs() {
    //   const res = await fetch("https://your-backend-api/jobs");
    //   this.jobs = await res.json();
    // }
  },
});
