<template>
  <div class="user-feature-flags-container">
    <q-header elevated class="glass-header">
      <q-toolbar class="q-px-lg">
        <div class="row items-center q-gutter-sm">
          <q-icon name="person" size="28px" color="primary" />
          <q-toolbar-title class="text-weight-bold">User Feature Flags</q-toolbar-title>
        </div>
        <q-space />
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="$router.push({ name: Routes.FEATURE_FLAGS })">
          <q-tooltip>Back to Feature Flags</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="logout" @click="handleLogout">
          <q-tooltip>Logout</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page class="page-content">
      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="page-header">
          <div class="header-content">
            <div class="header-left">
              <h1 class="page-title">Feature Flags for {{ selectedUsersText }}</h1>
              <p class="page-subtitle">View feature flags assigned to selected users</p>
            </div>
          </div>
        </div>

        <!-- User Selector -->
        <div class="search-section">
          <q-select
            v-model="selectedUserIds"
            :options="appUsers"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            multiple
            outlined
            dense
            placeholder="Filter by user"
            class="user-selector"
            clearable
            @update:model-value="handleUserChange"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="white" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <div v-if="selectedUserIds.length > 0" class="row items-center no-wrap full-width q-gutter-xs">
                <q-icon name="person" color="white" class="q-mr-sm" />
                <div class="column">
                  <div class="text-caption text-white" style="opacity: 0.8">Filter by user</div>
                  <div class="row items-center q-gutter-xs">
                    <q-chip
                      v-for="userId in selectedUserIds"
                      :key="userId"
                      dense
                      color="white"
                      text-color="primary"
                      size="sm"
                      class="q-mt-xs"
                    >
                      {{ getUserName(userId) }}
                    </q-chip>
                  </div>
                </div>
              </div>
              <span v-else class="text-white" style="opacity: 0.8">Filter by user</span>
            </template>
          </q-select>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center q-pa-xl">
          <q-spinner color="primary" size="3em" />
          <div class="q-mt-md">Loading feature flags...</div>
        </div>

        <!-- Feature Flags Grid -->
        <div v-else class="flags-grid">
          <div v-if="featureFlags.length === 0" class="empty-state">
            <div class="empty-icon">
              <q-icon name="flag" size="80px" color="grey-5" />
            </div>
            <h3 class="empty-title">No feature flags found</h3>
            <p class="empty-text">
              {{ selectedUserIds.length > 0 ? `No feature flags assigned to all selected users` : 'Select one or more users to view their feature flags' }}
            </p>
          </div>

          <div v-for="flag in featureFlags" :key="flag.id" class="flag-card-wrapper">
            <q-card class="flag-card" :class="{ 'flag-enabled': flag.enabled }">
              <div class="flag-status-indicator" :class="{ active: flag.enabled }"></div>

              <q-card-section class="flag-header">
                <div class="flag-top">
                  <div class="flag-title-section">
                    <h3 class="flag-name">{{ flag.name }}</h3>
                    <q-chip
                      :color="flag.enabled ? 'positive' : 'grey-6'"
                      text-color="white"
                      size="sm"
                      class="status-chip"
                    >
                      {{ flag.enabled ? 'Active' : 'Inactive' }}
                    </q-chip>
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="flag-body">
                <p class="flag-description">{{ flag.description || 'No description' }}</p>
              </q-card-section>

              <q-card-section class="flag-footer">
                <div class="flag-actions">
                  <q-btn
                    flat
                    dense
                    :label="flag.enabled ? 'Disable' : 'Enable'"
                    :icon="flag.enabled ? 'cancel' : 'check_circle'"
                    :color="flag.enabled ? 'negative' : 'positive'"
                    size="sm"
                    @click="toggleFlag(flag)"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import type { FeatureFlag } from 'src/types/feature-flag';
import type { AppUser } from 'src/types/app-user';
import { useFeatureFlagsStore } from 'src/stores/feature-flag';
import { searchAppUsers } from 'src/api/appUserApi';
import { Routes } from 'src/enums/Routes';
import { useAuthStore } from 'src/stores/auth';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const featureFlags = ref<FeatureFlag[]>([]);
const appUsers = ref<AppUser[]>([]);
const selectedUserIds = ref<string[]>([]);
const loading = ref(false);
const featureFlagsStore = useFeatureFlagsStore();
const authStore = useAuthStore();

const selectedUsersText = computed(() => {
  if (selectedUserIds.value.length === 0) {
    return 'Users';
  }
  if (selectedUserIds.value.length === 1) {
    const user = appUsers.value.find((u: AppUser) => u.id === selectedUserIds.value[0]);
    return user?.name || 'User';
  }
  return `${selectedUserIds.value.length} Users`;
});

const getUserName = (userId: string): string => {
  const user = appUsers.value.find((u: AppUser) => u.id === userId);
  return user?.name || userId.substring(0, 8) + '...';
};

const handleLogout = async () => {
  authStore.logout();
  await router.push({ name: Routes.SIGN_IN });
};

onMounted(async () => {
  await fetchAppUsers();

  // Check if userId is provided in route params
  const userId = route.params.userId as string;
  if (userId) {
    selectedUserIds.value = [userId];
    await handleUserChange([userId]);
  }
});

const fetchAppUsers = async () => {
  try {
    const users = await searchAppUsers();
    appUsers.value = users;
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to fetch app users';
    $q.notify({
      type: 'negative',
      message,
      position: 'top',
    });
  }
};

const handleUserChange = async (userIds: string[]) => {
  if (!userIds || userIds.length === 0) {
    featureFlags.value = [];
    return;
  }

  await fetchFeatureFlags(userIds);
};

const fetchFeatureFlags = async (userIds: string[]) => {
  try {
    loading.value = true;
    
    if (userIds.length === 0) {
      featureFlags.value = [];
      return;
    }

    // Fetch flags for each user
    const flagsPromises = userIds.map((userId) =>
      featureFlagsStore.listFeatureFlags(userId),
    );
    const flagsArrays = await Promise.all(flagsPromises);

    // Filter out any undefined values and ensure all arrays are defined
    const validFlagsArrays = flagsArrays.filter(
      (arr: FeatureFlag[] | undefined): arr is FeatureFlag[] => Array.isArray(arr) && arr.length > 0,
    );

    // Find intersection: flags that appear in ALL users' lists
    if (validFlagsArrays.length === 0) {
      featureFlags.value = [];
      return;
    }

    if (validFlagsArrays.length === 1) {
      featureFlags.value = validFlagsArrays[0] || [];
      return;
    }

    // Start with the first user's flags
    let intersection: FeatureFlag[] = validFlagsArrays[0] || [];

    // For each subsequent user, keep only flags that exist in their list
    for (let i = 1; i < validFlagsArrays.length; i++) {
      const currentUserFlags = validFlagsArrays[i];
      if (!currentUserFlags || currentUserFlags.length === 0) {
        intersection = [];
        break;
      }
      const currentUserFlagIds = new Set(currentUserFlags.map((f: FeatureFlag) => f.id));
      intersection = intersection.filter((flag: FeatureFlag) =>
        currentUserFlagIds.has(flag.id),
      );
    }

    featureFlags.value = intersection;
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to fetch feature flags';
    $q.notify({
      type: 'negative',
      message,
      position: 'top',
    });
    featureFlags.value = [];
  } finally {
    loading.value = false;
  }
};

const toggleFlag = async (flag: FeatureFlag) => {
  try {
    const data = {
      name: flag.name,
      description: flag.description,
      enabled: !flag.enabled,
    };
    await featureFlagsStore.toggle(flag.id, data);
    flag.enabled = !flag.enabled;
    $q.notify({
      type: 'positive',
      message: `Feature flag ${flag.enabled ? 'enabled' : 'disabled'}`,
      position: 'top',
      icon: flag.enabled ? 'check_circle' : 'cancel',
    });
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to toggle feature flag';
    $q.notify({
      type: 'negative',
      message,
      position: 'top',
    });
  }
};
</script>

<style scoped lang="scss">
.user-feature-flags-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.glass-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.page-content {
  padding: 24px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  flex: 1;
}

.page-title {
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0;
}

.search-section {
  margin-bottom: 24px;
}

.flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.flag-card-wrapper {
  position: relative;
}

.flag-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &.flag-enabled {
    border-left: 4px solid #4caf50;
  }
}

.flag-status-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #9e9e9e;
  transition: background 0.3s;

  &.active {
    background: #4caf50;
  }
}

.flag-header {
  padding: 20px;
  background: white;
}

.flag-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.flag-title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.flag-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.status-chip {
  align-self: flex-start;
}

.flag-body {
  padding: 16px 20px;
  background: #f5f5f5;
}

.flag-description {
  color: #666;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

.flag-footer {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.flag-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  margin-bottom: 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.user-selector {
  :deep(.q-field__control) {
    background: linear-gradient(135deg, #8a7beb 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    min-height: 48px;
  }

  :deep(.q-field__inner) {
    min-height: 48px;
  }

  :deep(.q-field__native) {
    color: white;
    padding-top: 0;
    padding-bottom: 0;
    line-height: 1.5;
  }

  :deep(.q-field__label) {
    color: rgba(255, 255, 255, 0.8);
  }

  :deep(.q-field__prepend) {
    padding-left: 1rem;
  }

  :deep(.q-field__append) {
    padding-right: 1rem;
  }

  :deep(.q-field--focused .q-field__control) {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }

  :deep(.q-field__input) {
    color: white;
  }

  :deep(.q-chip) {
    margin: 2px;
  }
}
</style>


