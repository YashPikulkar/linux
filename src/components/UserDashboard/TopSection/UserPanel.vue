<template>
  <div class="user-panel row no-wrap items-center">
    <!-- Avatar -->
    <q-avatar size="74px" class="avatar-box q-mr-md">
      <img
        src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
        alt="User Avatar"
        width="100"
      />
    </q-avatar>

    <!-- Main Info -->
    <div class="main-info column justify-center">
      <div class="user-name">Yash Pikulkar</div>
      <div class="user-title">
        <span class="position text-primary">Frontend Developer</span>
        <span class="sep">|</span>
        <span class="department">Intern</span>
      </div>
    </div>

    <!-- Spacer -->
    <q-space />

    <!-- Detail Fields & Vertical Separator -->
    <div class="detail-info row no-wrap items-center">
      <!-- Info Column -->
      <div class="info-col column q-pr-xl">
        <div class="label">Phone Number:</div>
        <div class="value strong">+91 98765 43210</div>
        <div class="label q-mt-sm">Email:</div>
        <div class="value email">yash@example.com</div>
        <div class="label q-mt-sm">Role:</div>
        <div class="value">Candidate</div>
      </div>

      <!-- Vertical Separator -->
      <div class="vertical-separator q-mx-md"></div>

      <!-- Premium Button -->
      <q-btn label="Premium" class="premium-btn" unelevated flat rounded />
    </div>
  </div>
</template>

<script setup>
// Static layout — no props or reusability for now
</script>
<style scoped>
.user-panel {
  width: 100%;
  background: #fff;
  border-radius: 16px;
  min-height: 94px;
  padding: 12px 22px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
  font-size: 15px;
  align-items: center;
  transform: translateZ(0);
  transition: box-shadow 0.3s ease;
}

.user-panel:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.08);
}

.avatar-box {
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}

.main-info .user-name {
  font-size: 20px;
  font-weight: 600;
  color: #232c47;
}

.user-title {
  font-size: 15px;
  color: #878ca2;
  margin-top: 2px;
  display: flex;
  align-items: center;
}

.position.text-primary {
  color: #2382fa;
  font-weight: 500;
}

.sep {
  margin: 0 8px;
  color: #ccd0db;
}

.department {
  color: #a7a9be;
}

.detail-info {
  font-size: 15px;
  color: #2d3748;
  align-items: center;
}

.info-col {
  min-width: 150px;
}

.label {
  font-size: 13px;
  color: #94a3b8;
}

.value {
  font-size: 15px;
  color: #232c47;
  margin-top: 2px;
}

.value.strong {
  font-weight: 600;
  color: #242d53;
}

.value.email {
  color: #2382fa;
  word-break: break-word;
}

/* Premium Button Style */
.premium-btn {
  border: 1px solid gold;
  color: gold;
  padding: 6px 18px;
  font-weight: 600;
  font-size: 14px;
  background-color: transparent;
  box-shadow: 0 2px 6px rgba(218, 165, 32, 0.3);
  transition: transform 0.2s ease;
}

.premium-btn:hover {
  transform: scale(1.05);
}

/* Vertical Line */
.vertical-separator {
  height: 48px;
  width: 1px;
  background-color: #e0e0e0;
}

/* Mobile View */
@media (max-width: 900px) {
  .user-panel {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }

  .main-info {
    margin-bottom: 6px;
  }

  .detail-info {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 8px;
  }

  .vertical-separator {
    display: none;
  }

  .premium-btn {
    margin-top: 12px;
  }
}
</style>
