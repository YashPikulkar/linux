   <template>
    <q-card class="dashboard-card">
      <div class="dashboard-title">Statstics Analysis</div>
      <!-- Dynamic View Rendering -->
      <component :is="currentDashboardComponent" v-if="currentDashboardComponent" class="q-mb-xl" />

      <!-- Stats + Activity only in Home -->
      <div v-if="dashboardView === 'Home'">
        <!-- Stats Grid -->
        <div class="stats-grid">
          <q-card class="stat-card" v-for="(stat, index) in stats" :key="index">
            <q-card-section class="stat-content">
              <div class="stat-icon">
                <q-icon :name="stat.icon" size="2rem" />
              </div>
              <div class="stat-info">
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-value">{{ stat.value }}</div>
                <div :class="['stat-change', stat.changeClass]">{{ stat.change }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Recent Activity -->
        <div class="recent-activity">
          <div class="section-title">Recent Activity</div>
          <div class="activity-list">
            <div class="activity-item" v-for="(activity, idx) in activities" :key="idx">
              <q-icon :name="activity.icon" class="activity-icon" />
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
</template>

<script setup>
import { ref } from 'vue'
// Track selected view
const dashboardView = ref('Home')

// Dynamically choose the dashboard component


// Mock stats
const stats = [
  {
    label: 'Total Job Posts',
    value: 24,
    change: '+3 this month',
    changeClass: 'positive',
    icon: 'work'
  },
  {
    label: 'Applications Received',
    value: 156,
    change: '+12 today',
    changeClass: 'positive',
    icon: 'mail'
  },
  {
    label: 'Shortlisted Candidates',
    value: 32,
    change: 'No change',
    changeClass: 'neutral',
    icon: 'star'
  },
  {
    label: 'Interviews Scheduled',
    value: 8,
    change: '+2 this week',
    changeClass: 'positive',
    icon: 'schedule'
  }
]

// Mock activities
const activities = [
  {
    icon: 'person_add',
    text: 'New application for Senior Developer position',
    time: '2 hours ago'
  },
  {
    icon: 'edit',
    text: 'Updated job requirements for Marketing Manager',
    time: '5 hours ago'
  },
  {
    icon: 'check_circle',
    text: 'Interview completed for UX Designer candidate',
    time: '1 day ago'
  }
]
</script>

<!-- KEEP YOUR STYLES UNCHANGED, already well-structured -->


<style lang="scss" scoped>

.dashboard-card {
  padding: 24px;
  background-color: white;
  border-radius: 16px;

  /* 💡 Modern 3D Card Style */
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),   /* white glow */
    0 8px 16px rgba(0, 0, 0, 0.05),       /* subtle depth */
    inset 0 1px 3px rgba(255, 255, 255, 0.6); /* soft highlight inside */

  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: box-shadow 0.3s ease;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  letter-spacing: -0.02em;
}

.dashboard-separator {
  background: #e2e8f0;
  margin: 16px 0;
}

.dashboard-description {
  color: #6b7280;
  line-height: 1.6;
  font-size: 1rem;

  div + div {
    margin-top: 0.5rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 16px;
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),   /* white glow */
    0 8px 16px rgba(0, 0, 0, 0.05),       /* subtle depth */
    inset 0 1px 3px rgba(255, 255, 255, 0.6); /* soft highlight inside */
}

.stat-card {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 12px rgba(0, 0, 0, 0.08),
      inset 0 1px 4px rgba(255, 255, 255, 0.7);
  }
  box-shadow:
    0 4px 8px rgba(255, 255, 255, 0.4),   /* white glow */
    0 8px 16px rgba(0, 0, 0, 0.05),       /* subtle depth */
    inset 0 1px 3px rgba(255, 255, 255, 0.6); /* soft highlight inside */
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #f8f9fa;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.stat-change {
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;

  &.positive {
    color: #16a34a;
  }

  &.negative {
    color: #dc2626;
  }

  &.neutral {
    color: #6b7280;
  }
}

.recent-activity {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.activity-list {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 0.75rem;
    padding-bottom: 1.25rem;
  }
}

.activity-icon {
  color: #6b7280;
  margin-top: 4px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #1f2937;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 14px;
  color: #6b7280;
}

/* 📱 Mobile Responsive */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }

  .dashboard-card {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-content {
    padding: 16px;
  }
}
</style>
