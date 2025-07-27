<template>
  <q-page class="dashboard-page">
    <q-card class="dashboard-card">
      <div class="dashboard-title">Recruiter Dashboard</div>

      <q-separator class="dashboard-separator" />

      <q-card-section class="dashboard-description">
        <div>Welcome to your comprehensive recruitment management center.</div>
        <div>
          Track job postings, monitor applications, manage candidates, and optimize your hiring process.
        </div>
      </q-card-section>

      <q-separator class="dashboard-separator" />

      <!-- Action Buttons -->
      <div class="action-buttons">
        <q-btn
          class="action-btn primary-btn"
          label="Create Job Post"
          icon="add"
        />
        <q-btn
          class="action-btn secondary-btn"
          label="View Applications"
          icon="inbox"
        />
        <q-btn
          class="action-btn secondary-btn"
          label="Manage Candidates"
          icon="people"
        />
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <q-card class="stat-card">
          <q-card-section class="stat-content">
            <div class="stat-icon">
              <q-icon name="work" size="2rem" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Total Job Posts</div>
              <div class="stat-value">24</div>
              <div class="stat-change positive">+3 this month</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="stat-card">
          <q-card-section class="stat-content">
            <div class="stat-icon">
              <q-icon name="mail" size="2rem" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Applications Received</div>
              <div class="stat-value">156</div>
              <div class="stat-change positive">+12 today</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="stat-card">
          <q-card-section class="stat-content">
            <div class="stat-icon">
              <q-icon name="star" size="2rem" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Shortlisted Candidates</div>
              <div class="stat-value">32</div>
              <div class="stat-change neutral">No change</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="stat-card">
          <q-card-section class="stat-content">
            <div class="stat-icon">
              <q-icon name="schedule" size="2rem" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Interviews Scheduled</div>
              <div class="stat-value">8</div>
              <div class="stat-change positive">+2 this week</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <div class="section-title">Recent Activity</div>
        <div class="activity-list">
          <div class="activity-item">
            <q-icon name="person_add" class="activity-icon" />
            <div class="activity-content">
              <div class="activity-text">New application for Senior Developer position</div>
              <div class="activity-time">2 hours ago</div>
            </div>
          </div>
          <div class="activity-item">
            <q-icon name="edit" class="activity-icon" />
            <div class="activity-content">
              <div class="activity-text">Updated job requirements for Marketing Manager</div>
              <div class="activity-time">5 hours ago</div>
            </div>
          </div>
          <div class="activity-item">
            <q-icon name="check_circle" class="activity-icon" />
            <div class="activity-content">
              <div class="activity-text">Interview completed for UX Designer candidate</div>
              <div class="activity-time">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
// You can import API or store logic later
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.dashboard-card {
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.dashboard-separator {
  background: #dee2e6;
  margin: 1.5rem 0;
}

.dashboard-description {
  color: #6c757d;
  line-height: 1.6;
  font-size: 1rem;

  div + div {
    margin-top: 0.5rem;
  }
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.action-btn {
  border-radius: 0.375rem; /* rounded-md equivalent */
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: none;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.primary-btn {
  background: #212529;
  color: #ffffff;

  &:hover {
    background: #000000;
  }
}

.secondary-btn {
  background: #ffffff;
  color: #212529;
  border-color: #212529;

  &:hover {
    background: #212529;
    color: #ffffff;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #dee2e6;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  color: #495057;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 500;

  &.positive {
    color: #28a745;
  }

  &.negative {
    color: #dc3545;
  }

  &.neutral {
    color: #6c757d;
  }
}

.recent-activity {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 1rem;
}

.activity-list {
  background: #f8f9fa;
  border-radius: 0.375rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 0.75rem;
    padding-bottom: 1.5rem;
  }
}

.activity-icon {
  color: #6c757d;
  margin-top: 0.125rem;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #212529;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.activity-time {
  color: #6c757d;
  font-size: 0.875rem;
}

// Responsive adjustments
@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem;
  }

  .dashboard-card {
    padding: 1.5rem;
  }

  .dashboard-title {
    font-size: 1.75rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-content {
    padding: 1rem;
  }
}
</style>
