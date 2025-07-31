<template>
  <div class="applicants-section q-pa-md">
    <div class="text-h6 q-mb-md">Applicants</div>

    <div class="row q-col-gutter-md">
      <div v-for="(applicant, index) in applicants" :key="applicant.id" class="col-12">
        <q-card class="applicant-card q-pa-md">
          <div class="row items-center q-col-gutter-md">
            <!-- Avatar + Info -->
            <div class="col-auto">
              <q-avatar size="64px">
                <img :src="applicant.avatar" alt="avatar" />
              </q-avatar>
            </div>
            <div class="col">
              <div class="text-subtitle1">{{ applicant.name }}</div>
              <div class="text-caption text-grey">Applied for: {{ applicant.position }}</div>
              <div class="text-caption">Status: <strong>{{ applicant.status }}</strong></div>
            </div>

            <!-- Actions -->
            <div class="col-auto">
              <div class="q-gutter-sm row">
                <q-btn size="sm" outline label="View Profile" color="primary" @click="viewProfile(index)" />
                <q-btn size="sm" outline label="Download Resume" color="secondary" @click="downloadResume(index)" />
              </div>
              <div class="q-mt-sm q-gutter-sm row">
                <q-btn size="sm" label="Accept" color="positive" @click="setStatus(index, 'Accepted')" />
                <q-btn size="sm" label="Review" color="info" @click="setStatus(index, 'Under Review')" />
                <q-btn size="sm" label="Reject" color="negative" @click="setStatus(index, 'Rejected')" />
                <q-btn size="sm" outline icon="chat" @click="sendMessage(index)" />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ApplicantsSection",
  data() {
    return {
      applicants: [
        {
          id: 1,
          name: "Riya Sharma",
          position: "Frontend Developer",
          status: "Pending",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        {
          id: 2,
          name: "Aman Patel",
          position: "Backend Developer",
          status: "Pending",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
      ],
    };
  },
  methods: {
    viewProfile(index) {
      this.$q.notify({
        message: `Viewing profile of ${this.applicants[index].name}`,
        color: "info",
      });
    },
    downloadResume(index) {
      this.$q.notify({
        message: `Downloading resume for ${this.applicants[index].name}`,
        color: "secondary",
      });
    },
    setStatus(index, newStatus) {
      this.applicants[index].status = newStatus;
      this.$q.notify({
        message: `${this.applicants[index].name} marked as ${newStatus}`,
        color:
          newStatus === "Accepted"
            ? "positive"
            : newStatus === "Rejected"
            ? "negative"
            : "info",
      });
    },
    sendMessage(index) {
      this.$q.notify({
        message: `Message sent to ${this.applicants[index].name}`,
        color: "primary",
      });
    },
  },
};
</script>

<style scoped>
.applicants-section {
  width: 100%;
}

.applicant-card {
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
</style>
