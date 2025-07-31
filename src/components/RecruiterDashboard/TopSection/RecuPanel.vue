<template>
  <div class="user-panel row no-wrap items-center">
    <!-- Stat Cards Row (Full Width) -->
    <div class="row q-gutter-md stats-wrapper" style="flex: 1">
      <div
        class="q-col"
        v-for="(card, index) in statCards"
        :key="index"
        style="flex: 1"
      >
        <q-card flat bordered class="q-pa-md" style="border-radius: 12px; text-align: center;">
          <div class="text-caption text-grey">{{ card.label }}</div>
          <div class="text-h6 text-weight-bold">{{ card.value }}</div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
const statCards = [
  { label: 'Total Jobs', value: 12 },
  { label: 'Active', value: 4 },
  { label: 'Closed', value: 6 },
  { label: 'Drafts', value: 2 },
]
</script>

<style scoped>
.user-panel {
  width: 100%;
  border-radius: 16px;
  min-height: 94px;
  padding: 16px 24px;
  font-size: 15px;
  align-items: center;
  transition: box-shadow 0.3s ease;

  background: #94a3b8;
  backdrop-filter: blur(10px);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-panel:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.08);
}

.avatar-box {
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}

.avatar-box.clickable {
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-box.clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.main-info .user-name {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
}

.user-skills-placeholder {
  font-size: 13px;
  font-style: italic;
  color:#94a3b8;
  margin-top: 4px;
}

.detail-info {
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

.vertical-separator {
  height: 48px;
  width: 1px;
  background-color: #e0e0e0;
}

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
