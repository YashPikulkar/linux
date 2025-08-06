import { defineStore } from "pinia";
import { useUserStore } from "src/stores/user-store";
export const useJobsStore = defineStore("jobs", {
  state: () => ({
    jobs: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRecommendedJobs() {
      this.loading = true;
      this.error = null;

      try {
        const token = useUserStore().token;

        const response = await fetch("http://localhost:3000/jobs/recommended", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommended jobs");
        }

        const data = await response.json();
        this.jobs = data.jobs;
      } catch (err) {
        this.error = err.message;
        console.error("Job fetch error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
