<template>
  <div class="form-wrapper">
    <q-card class="company-profile-card">
      <!-- Header -->
      <div class="form-header">
        <div>Company Profile</div>
        <div v-if="!isEditable">
          <q-btn dense flat round icon="edit" size="sm" @click="toggleEdit" />
        </div>
        <div v-else class="row no-wrap items-center">
          <q-btn dense flat round icon="check" size="sm" color="positive" @click="saveEdit" />
          <q-btn dense flat round icon="close" size="sm" color="negative" @click="cancelEdit" />
        </div>
      </div>

      <div class="section-title">Logo</div>
      <div class="form-entry items-center">
        <q-img
          :src="tempData.logoUrl || placeholder"
          style="width: 100px; height: 100px"
        />
      </div>

      <div class="section-title">Company Information</div>
      <div class="form-entry">
        <q-input v-model="tempData.name" :disable="!isEditable" dense filled label="Company Name" />
        <q-input v-model="tempData.email" :disable="!isEditable" dense filled label="Email" />
        <q-input v-model="tempData.phone" :disable="!isEditable" dense filled label="Phone Number" />
        <q-input v-model="tempData.companyType" :disable="!isEditable" dense filled label="Company Type" />
        <q-input v-model="tempData.industry" :disable="!isEditable" dense filled label="Industry" />
        <q-input v-model="tempData.companySize" :disable="!isEditable" dense filled label="Company Size" />
        <q-input v-model="tempData.description" :disable="!isEditable" type="textarea" dense filled label="Description" />
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "CompanyProfileCard",
  data() {
    return {
      isEditable: false,
      placeholder: "https://cdn.quasar.dev/img/avatar.png",
      tempData: {
        logoUrl: "",
        name: "Acme Inc.",
        email: "hr@acme.com",
        phone: "9876543210",
        companyType: "Private",
        industry: "Technology",
        companySize: "51-200",
        description: "We innovate cool tech products and serve enterprise clients.",
      },
      originalData: {},
    };
  },
  methods: {
    toggleEdit() {
      this.originalData = JSON.parse(JSON.stringify(this.tempData));
      this.isEditable = true;
    },
    cancelEdit() {
      this.tempData = JSON.parse(JSON.stringify(this.originalData));
      this.isEditable = false;
    },
    saveEdit() {
      this.isEditable = false;
    },
  },
};
</script>

<style scoped>
.form-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  min-height: 0;
}

.company-profile-card {
  width: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 16px;
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}

.form-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: -12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #444;
}

.form-entry {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
