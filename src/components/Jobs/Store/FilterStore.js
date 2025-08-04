import { defineStore } from "pinia";

export const useFilterStore = defineStore("filterStore", {
  state: () => ({
    selectedJobTitles: [],

    salary: {
      min: "",
      max: "",
    },
    equity: 0,
    experience: 0,
    companySizes: [],
    companyTypes: [],
    education: [],
    companies: [],
    remoteJobFilter: "none",
    preferredLocations: [],
    jobTypes: [],
    skills: [],
    markets: [],
  }),

  actions: {
    removeTag(tag) {
      console.log("Removing tag:", tag);

      if (this.location === tag) {
        console.log("Clearing location");
        this.location = "";
      } else if (tag === this.getSalaryTag) {
        console.log("Resetting salary");
        this.salary = { min: "", max: "" };
      } else if (tag === this.getEquityTag) {
        console.log("Resetting equity");
        this.equity = 0;
      } else if (tag === this.getExperienceTag) {
        console.log("Resetting experience");
        this.experience = 0;
      } else if (tag === "Include Remote Jobs" || tag === "Remote Only Jobs") {
        console.log("Resetting remoteJobFilter");
        this.remoteJobFilter = "none";
      } else if (this.skills.includes(tag)) {
        console.log("Removing from skills");
        this.skills = this.skills.filter((t) => t !== tag);
      } else if (
        this.preferredLocations.includes(tag.replace("Location: ", ""))
      ) {
        console.log("Removing from preferredLocations");
        this.preferredLocations = this.preferredLocations.filter(
          (loc) => `Location: ${loc}` !== tag
        );
      } else if (this.companySizes.includes(tag)) {
        console.log("Removing from companySizes");
        this.companySizes = this.companySizes.filter((t) => t !== tag);
      } else if (this.companyTypes.includes(tag)) {
        console.log("Removing from companyTypes");
        this.companyTypes = this.companyTypes.filter((t) => t !== tag);
      } else if (this.education.includes(tag)) {
        console.log("Removing from education");
        this.education = this.education.filter((t) => t !== tag);
      } else if (this.companies.includes(tag)) {
        console.log("Removing from companies");
        this.companies = this.companies.filter((t) => t !== tag);
      } else if (this.markets.includes(tag)) {
        console.log("Removing from markets");
        this.markets = this.markets.filter((t) => t !== tag);
      } else if (this.jobTypes.includes(tag)) {
        console.log("Removing from jobTypes");
        this.jobTypes = this.jobTypes.filter((t) => t !== tag);
      } else {
        console.log("Removing from selectedJobTitles");
        this.selectedJobTitles = this.selectedJobTitles.filter(
          (t) => t !== tag
        );
      }
    },

    clearAll() {
      this.selectedJobTitles = [];
      this.location = "";

      this.salary = { min: "", max: "" };
      this.equity = 0;
      this.experience = 0; // ✅ reset to default range
      this.companySizes = [];
      this.companyTypes = [];
      this.education = [];
      this.companies = [];
      this.markets = [];
      this.skills = [];
      this.jobTypes = [];
      this.remoteJobFilter = "none";
      this.preferredLocations = [];
    },

    getActiveFilters() {
      const filters = {};

      if (this.selectedJobTitles.length > 0)
        filters.selectedJobTitles = [...this.selectedJobTitles];

      if (this.salary.min || this.salary.max)
        filters.salary = { ...this.salary };

      if (this.equity > 0) filters.equity = this.equity;

      if (this.experience > 0) filters.experience = this.experience;

      if (this.companySizes.length > 0)
        filters.companySizes = [...this.companySizes];

      if (this.companyTypes.length > 0)
        filters.companyTypes = [...this.companyTypes];

      if (this.education.length > 0) filters.education = [...this.education];

      if (this.companies.length > 0) filters.companies = [...this.companies];

      if (this.remoteJobFilter && this.remoteJobFilter !== "none")
        filters.remoteJobFilter = this.remoteJobFilter;

      if (this.preferredLocations.length > 0)
        filters.preferredLocations = [...this.preferredLocations];

      if (this.jobTypes.length > 0) filters.jobTypes = [...this.jobTypes];

      if (this.skills.length > 0) filters.skills = [...this.skills];

      if (this.markets.length > 0) filters.markets = [...this.markets];

      return filters;
    },
  },

  getters: {
    getSalaryTag: (state) => {
      const { min, max } = state.salary;
      if (!min && !max) return null;
      if (min && !max) return `₹${min}+`;
      if (!min && max) return `Up to ₹${max}`;
      return `₹${min} — ₹${max}`;
    },

    getEquityTag: (state) => {
      return state.equity > 0 ? `Equity: ${state.equity}%` : null;
    },

    getExperienceTag: (state) => {
      const exp = state.experience;
      if (exp === 0) return null;
      return `Experience: ${exp} year${exp > 1 ? "s" : ""}`;
    },

    computedTags() {
      const tags = [];
      const state = this;

      if (state.selectedRegion) tags.push(state.selectedRegion);

      const salaryTag = this.getSalaryTag;
      const equityTag = this.getEquityTag;
      const experienceTag = this.getExperienceTag;

      if (salaryTag) tags.push(salaryTag);
      if (equityTag) tags.push(equityTag);
      if (experienceTag) tags.push(experienceTag);

      if (state.remoteJobFilter && state.remoteJobFilter !== "none") {
        const remoteMap = {
          include: "Include Remote Jobs",
          only: "Remote Only Jobs",
        };
        tags.push(remoteMap[state.remoteJobFilter]);
      }

      if (state.preferredLocations.length > 0) {
        tags.push(...state.preferredLocations.map((loc) => `Location: ${loc}`));
      }

      tags.push(...state.selectedJobTitles);
      tags.push(...state.companySizes);
      tags.push(...state.companyTypes);
      tags.push(...state.education);
      tags.push(...state.companies);
      tags.push(...state.skills);
      tags.push(...state.markets);
      tags.push(...state.jobTypes);

      return tags;
    },
  },
});
