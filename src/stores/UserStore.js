// src/stores/UserStore.js
import { defineStore } from "pinia";
import { computed } from "vue";

export const useUserStore = defineStore("user", {
  state: () => ({
    register: {
      fullName: "Yash Pikulkar",
      phone: "+91 98765 43210",
      email: "yash@example.com",
      role: "Candidate", // 👈 Using 'Candidate' here
      avatar:
        "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg",
    },

    education: {
      college: "Goa College of Engineering",
      degree: "B.E. in Information Technology",
      degreeCgpa: "7.8",
      higherSecondary: "ABC Higher Secondary School",
      higherCgpa: "8.5",
      highSchool: "XYZ High School",
      highCgpa: "9.0",
      certifications: ["Full Stack Web Dev", "Python Basics", "UX Design"],
    },

    additional: {
      gender: "Male",
      dob: "2001-01-01",
      experience: "1",
      employmentStatus: "Fresher",
      jobType: "Internship",
      preferredLocation: "Goa",
      availability: ["Remote"],
      languages: "English, Hindi, Konkani",
      resumeHeadline: "Frontend Developer | React.js | Vue.js",
      linkedin: "https://linkedin.com/in/yourprofile",
      portfolio: "https://yourportfolio.com",
    },

    skills: ["React", "JavaScript", "Figma", "Teamwork", "Communication"],

    loading: false,
    error: null,
  }),

  getters: {
    // ✅ Normalize role for use in UI logic
    userRole: (state) => {
      const rawRole = state.register.role?.toLowerCase()
      if (rawRole === "candidate") return "user"
      if (["recruiter", "admin"].includes(rawRole)) return rawRole
      return "user" // fallback
    },

    userName: (state) => state.register.fullName || "User",
  },

  actions: {
    async fetchUser() {
      this.loading = true;
      try {
        // const res = await axios.get('/api/user')
        // this.register = res.data.register
        // this.education = res.data.education
        // this.additional = res.data.additional
        // this.skills = res.data.skills
      } catch (err) {
        this.error = err.message || "Failed to fetch user";
      } finally {
        this.loading = false;
      }
    },

    updateEducation(updatedEducation) {
      this.education = { ...updatedEducation };
    },

    updateAdditional(updatedAdditional) {
      this.additional = { ...updatedAdditional };
    },

    updateSkills(updatedSkills) {
      this.skills = [...updatedSkills];
    },
  },
});
