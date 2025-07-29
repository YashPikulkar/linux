<template>
  <div class="recruiter-profile row no-wrap items-center">
    <!-- 👤 Recruiter Avatar -->
    <q-avatar size="74px" class="avatar-box q-mr-md">
      <img :src="avatar" alt="Recruiter Avatar" width="100" />
    </q-avatar>

    <!-- 👋 Welcome & Name -->
    <div class="main-info column justify-center">
      <div class="welcome-msg">Welcome back,</div>
      <div class="recruiter-name">{{ fullName }}</div>
      <div class="recruiter-role">{{ role }}</div>
    </div>

    <!-- Spacer -->
    <q-space />

    <!-- 📞 Recruiter Contact Info -->
    <div class="detail-info row no-wrap items-center">
      <div class="info-col row q-pr-xl">
        <div class="info-block q-mr-xl">
          <div class="label">Phone</div>
          <div class="value strong">{{ phone }}</div>
        </div>
        <div class="info-block q-mr-xl">
          <div class="label">Email</div>
          <div class="value email">{{ email }}</div>
        </div>
      </div>

      <!-- Vertical Line -->
      <div class="vertical-separator q-mx-md" />

    </div>
  </div>
</template>


<script setup>
import { useUserStore } from "src/stores/UserStore";

// Access recruiter data from store
const userStore = useUserStore();
const { fullName, phone, email, role, avatar } = userStore.register;
</script>

<style scoped>
.recruiter-profile {
  width: 100%;
  border-radius: 16px;
  min-height: 94px;
  padding: 16px 24px;
  font-size: 15px;
  display: flex;
  align-items: center;
  transition: box-shadow 0.3s ease;

  background: rgba(255, 255, 255, 0.1); /* semi-transparent */
  backdrop-filter: blur(10px);         /* frosted glass effect */
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2); /* subtle border */
}

.recruiter-profile:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.08);
}

.avatar-box {
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}

.avatar-box.clickable {
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-box.clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.main-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 200px;
  margin-right: 24px;
}

.main-info .welcome-msg {
  font-size: 14px;
  color: #64748b;
}

.recruiter-name {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}

.recruiter-role {
  font-size: 14px;
  color: #4b5563;
  margin-top: 2px;
}

.detail-info {
  display: flex;
  font-size: 15px;
  color: #2d3748;
  align-items: center;
}

.info-col {
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.info-block {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 13px;
  color: #94a3b8;
}

.value {
  font-size: 15px;
  color: #1f2937;
  margin-top: 2px;
}

.value.strong {
  font-weight: 600;
  color: #111827;
}

.value.email {
  color: #3b82f6;
  word-break: break-word;
}

.vertical-separator {
  height: 48px;
  width: 1px;
  background-color: #e0e0e0;
}

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

/* 📱 Responsive Design */
@media (max-width: 900px) {
  .recruiter-profile {
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
