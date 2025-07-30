<template>
    <q-card class="online-profiles-card">
      <div class="form-header">
        <div>Add Online Profiles</div>
        <div v-if="!isEditable">
          <q-btn dense flat round icon="edit" size="sm" @click="toggleEdit" />
        </div>
        <div v-else class="row no-wrap items-center">
          <q-btn
            dense
            flat
            round
            icon="check"
            size="sm"
            color="positive"
            @click="saveEdit"
          />
          <q-btn
            dense
            flat
            round
            icon="close"
            size="sm"
            color="negative"
            @click="cancelEdit"
          />
        </div>
      </div>
  
      <div class="profile-grid">
        <q-input
          v-model="tempLinks.linkedin"
          label="LinkedIn URL"
          :disable="!isEditable"
          dense flat filled
          class="no-border"
        />
        <q-input
          v-model="tempLinks.github"
          label="GitHub URL"
          :disable="!isEditable"
          dense flat filled
          class="no-border"
        />
        <q-input
          v-model="tempLinks.portfolio"
          label="Portfolio Website"
          :disable="!isEditable"
          dense flat filled
          class="no-border"
        />
        <q-input
          v-model="tempLinks.website"
          label="Personal Website"
          :disable="!isEditable"
          dense flat filled
          class="no-border"
        />
        <q-input
          v-model="tempLinks.codingProfile"
          label="Competitive Coding Profile"
          :disable="!isEditable"
          dense flat filled
          class="no-border"
        />
        <q-input
          v-model="tempLinks.other"
          label="Other Profile Link"
          :disable="!isEditable"
          dense flat filled
          class="no-border"
        />
      </div>
    </q-card>
  </template>
  
  <script>
  export default {
    name: "OnlineProfiles",
    data() {
      return {
        isEditable: false,
        links: {
          linkedin: "",
          github: "",
          portfolio: "",
          website: "",
          codingProfile: "",
          other: "",
        },
        tempLinks: {},
      };
    },
    methods: {
      toggleEdit() {
        this.tempLinks = JSON.parse(JSON.stringify(this.links));
        this.isEditable = true;
      },
      saveEdit() {
        this.links = JSON.parse(JSON.stringify(this.tempLinks));
        this.isEditable = false;
      },
      cancelEdit() {
        this.isEditable = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .form-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  color: #333;
  align-items: center;
}

  .online-profiles-card {
    width: 100%;
    padding: 24px;
    border-radius: 16px;
    background-color: white;
  
    box-shadow:
      0 4px 8px rgba(255, 255, 255, 0.4),
      0 8px 16px rgba(0, 0, 0, 0.05),
      inset 0 1px 3px rgba(255, 255, 255, 0.6);
  
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: #222;
  }
  
  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    text-transform: uppercase;
  }
  
  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
  }
  
  /* Flatten inputs */
/* Always show underline */
.no-border ::v-deep .q-field__control {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  border-bottom: 1px solid #ccc !important; /* 👈 always show bottom border */
  border-radius: 0 !important;
  padding-left: 0;
  padding-right: 0;
}

  </style>
  