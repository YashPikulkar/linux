<template>
  <div
    v-if="!isAuthPage"
    class="header row items-center justify-between q-px-md"
  >
    <div class="logo text-h6">Job Portal</div>

    <div class="row items-center q-gutter-sm">
      <!-- User Dashboard -->
      <template v-if="isUserDashboard">
        <q-btn flat round dense>
          <q-avatar size="36px" class="avatar">
            <img
              src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
              alt="User Avatar"
            />
          </q-avatar>
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 150px">
              <q-item
                clickable
                v-close-popup
                @click="router.push('/userdashboard/profile')"
              >
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="router.push('/userdashboard')"
              >
                <q-item-section>Jobs</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>

      <!-- Recruiter Dashboard -->
      <template v-else-if="isRecruiterDashboard">
        <q-btn flat round dense>
          <q-avatar size="36px" class="avatar">
            <img
              src="https://ui-avatars.com/api/?name=Recruiter&background=8E24AA&color=fff"
              alt="Recruiter Avatar"
            />
          </q-avatar>
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 150px">
              <q-item
                clickable
                v-close-popup
                @click="router.push('/recruiterdashboard/profile')"
              >
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="router.push('/recruiterdashboard/feature2')"
              >
                <q-item-section>Feature 2</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>

      <!-- Public Pages -->
      <template v-else>
        <q-btn
          flat
          label="Log In"
          class="btn login-btn"
          @click="router.push('/login')"
        />
        <q-btn
          flat
          label="Sign Up"
          class="btn signup-btn"
          @click="router.push('/register')"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useUserStore } from "src/stores/user-store";

const route = useRoute();
const router = useRouter();

const isAuthPage = computed(() => ["/login", "/register"].includes(route.path));
const isUserDashboard = computed(() => route.path.startsWith("/userdashboard"));
const isRecruiterDashboard = computed(() =>
  route.path.startsWith("/recruiterdashboard")
);

const handleLogout = () => {
  useUserStore().setEverythingToNull();
  router.push("/");
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  height: 64px;
  border-bottom: 1px solid #dcdcdc;
  padding: 0 16px;
}

.logo {
  color: #000;
  font-weight: bold;
}

.btn {
  font-weight: bold;
  font-size: 14px;
  border-radius: 12px;
  padding: 6px 18px;
  transition: all 0.2s ease-in-out;
}

.login-btn {
  background-color: #fff;
  color: #c62828;
  border: 2px solid #c62828;
}
.login-btn:hover {
  background-color: #fbe9e7;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.login-btn:active {
  background-color: #ffebee;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.signup-btn {
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
}
.signup-btn:hover {
  background-color: #000;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.signup-btn:active {
  background-color: #111;
  color: #fff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar {
  border: 2px solid #dcdcdc;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
