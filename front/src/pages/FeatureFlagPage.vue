<template>
  <div class="feature-flags-container">
    <q-page class="page-content">
      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="page-header">
          <div class="header-content">
            <div class="header-left">
              <h1 class="page-title">Manage Your Flags</h1>
              <p class="page-subtitle">Control feature rollouts with ease</p>
            </div>
            <div class="header-right">
              <q-btn
                unelevated
                label="Create New Flag"
                color="primary"
                icon="add_circle"
                size="lg"
                class="create-btn"
                @click="showCreateDialog = true"
              />
            </div>
          </div>
        </div>

        <div class="search-section">
          <q-input
            v-model="searchQuery"
            outlined
            placeholder="Search flags by name, description, or ID..."
            class="search-input"
            bg-color="white"
            :input-style="{ color: 'black' }"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="searchQuery"
                name="close"
                class="cursor-pointer"
                @click="searchQuery = ''"
              />
            </template>
          </q-input>
        </div>

        <!-- Stats Cards -->
        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-icon-wrapper stat-total">
              <q-icon name="flag" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ featureFlags.length }}</div>
              <div class="stat-label">Total Flags</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon-wrapper stat-active">
              <q-icon name="check_circle" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ enabledCount }}</div>
              <div class="stat-label">Active</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon-wrapper stat-inactive">
              <q-icon name="cancel" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ disabledCount }}</div>
              <div class="stat-label">Inactive</div>
            </div>
          </div>
        </div>

        <!-- Feature Flags Grid -->
        <div class="flags-grid">
          <div v-if="featureFlags.length === 0" class="empty-state">
            <div class="empty-icon">
              <q-icon name="flag" size="80px" color="grey-5" />
              <q-icon :name="searchQuery ? 'search_off' : 'flag'" size="80px" color="grey-5" />
            </div>
            <h3 class="empty-title">
              {{ searchQuery ? 'No flags found' : 'No feature flags yet' }}
            </h3>
            <p class="empty-text">Create your first feature flag to get started</p>
            <q-btn
              v-if="!searchQuery"
              unelevated
              label="Create First Flag"
              color="primary"
              icon="add"
              size="md"
              @click="showCreateDialog = true"
            />

            <q-btn
              v-else
              outline
              label="Clear Search"
              color="primary"
              icon="clear"
              size="md"
              @click="searchQuery = ''"
            />
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

                  <div class="flag-actions">
                    <q-btn
                      flat
                      round
                      dense
                      icon="content_copy"
                      size="sm"
                      class="action-btn"
                      @click="copyToClipboard(flag.id)"
                    >
                      <q-tooltip>Copy ID</q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <p v-if="flag.description" class="flag-description">
                  {{ flag.description }}
                </p>
                <p v-else class="flag-description empty">No description provided</p>
              </q-card-section>

              <q-card-section class="flag-body">
                <div class="flag-id">
                  <q-icon name="key" size="16px" class="q-mr-xs" />
                  <span class="id-text">{{ flag.id.substring(0, 8) }}...</span>
                </div>

                <div class="toggle-section">
                  <span class="toggle-label">Status</span>
                  <q-toggle
                    :model-value="flag.enabled"
                    @update:model-value="toggleFlag(flag)"
                    color="positive"
                    size="lg"
                    class="custom-toggle"
                  />
                </div>
              </q-card-section>

              <q-separator class="card-separator" />

              <q-card-actions class="flag-footer">
                <q-btn
                  flat
                  dense
                  label="Edit"
                  icon="edit"
                  color="primary"
                  class="footer-btn"
                  @click="editFlag(flag)"
                />
                <q-btn
                  flat
                  dense
                  label="Delete"
                  icon="delete"
                  color="negative"
                  class="footer-btn"
                  @click="deleteFlag(flag.id)"
                />
                <q-space />
                <q-btn
                  flat
                  round
                  dense
                  icon="arrow_forward"
                  color="primary"
                  @click="viewFlagDetails(flag)"
                >
                  <q-tooltip>View Details</q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </q-page>

    <!-- Create Dialog -->
    <q-dialog v-model="showCreateDialog" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title-section">
            <q-icon name="add_circle" size="32px" color="primary" class="q-mr-sm" />
            <div>
              <div class="dialog-title">Create Feature Flag</div>
              <div class="dialog-subtitle">Add a new flag to your collection</div>
            </div>
          </div>
          <q-btn icon="close" flat round dense @click="showCreateDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-content">
          <q-form @submit.prevent="handleCreateFlag">
            <div class="form-field">
              <label class="field-label">Flag Name *</label>
              <q-input
                v-model="newFlag.name"
                placeholder="e.g., new-checkout-flow"
                outlined
                dense
                class="form-border"
                :input-style="{ color: 'black' }"
                :rules="[(val) => !!val || 'Name is required']"
              />
            </div>

            <div class="form-field">
              <label class="field-label">Description</label>
              <q-input
                v-model="newFlag.description"
                placeholder="Describe what this flag controls..."
                outlined
                dense
                class="form-border"
                :input-style="{ color: 'black' }"
                type="textarea"
                rows="3"
              />
            </div>

            <div class="form-field">
              <q-toggle
                v-model="newFlag.enabled"
                label="Enable by default"
                color="positive"
                class="custom-toggle"
                size="lg"
              />
            </div>

            <div class="form-actions">
              <q-btn
                type="submit"
                unelevated
                label="Create Flag"
                color="primary"
                icon="add"
                class="full-width"
                size="lg"
                :loading="loadingCreate"
              />
              <q-btn
                label="Cancel"
                outline
                color="grey-7"
                class="full-width"
                size="lg"
                @click="showCreateDialog = false"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog v-model="showEditDialog" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title-section">
            <q-icon name="edit" size="32px" color="primary" class="q-mr-sm" />
            <div>
              <div class="dialog-title">Edit Feature Flag</div>
              <div class="dialog-subtitle">Update flag information</div>
            </div>
          </div>
          <q-btn icon="close" flat round dense @click="showEditDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-content">
          <q-form @submit.prevent="handleEditFlag">
            <div class="form-field">
              <label class="field-label">Flag Name *</label>
              <q-input
                v-model="editingFlag.name"
                outlined
                dense
                class="form-border"
                :input-style="{ color: 'black' }"
                :rules="[(val) => !!val || 'Name is required']"
              />
            </div>

            <div class="form-field">
              <label class="field-label">Description</label>
              <q-input
                v-model="editingFlag.description"
                outlined
                dense
                class="form-border"
                :input-style="{ color: 'black' }"
                type="textarea"
                rows="3"
              />
            </div>

            <div class="form-actions">
              <q-btn
                type="submit"
                unelevated
                label="Update Flag"
                color="primary"
                icon="save"
                class="full-width"
                size="lg"
                :loading="loadingEdit"
              />
              <q-btn
                label="Cancel"
                outline
                color="grey-7"
                class="full-width"
                size="lg"
                @click="showEditDialog = false"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Details Dialog -->
    <q-dialog v-model="showDetailsDialog" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title-section">
            <q-icon name="info" size="32px" color="white" class="q-mr-sm" />
            <div>
              <div class="dialog-title">Feature Flag Details</div>
              <div class="dialog-subtitle">Detailed information about the flag</div>
            </div>
          </div>
          <q-btn icon="close" flat round dense @click="showDetailsDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-content">
          <div v-if="selectedFlag">
            <div class="form-field">
              <label class="field-label">Name</label>
              <div class="text-body1">{{ selectedFlag.name }}</div>
            </div>

            <div class="form-field">
              <label class="field-label">Description</label>
              <div class="text-body2">
                {{ selectedFlag.description || 'No description provided' }}
              </div>
            </div>

            <div class="form-field">
              <label class="field-label">Status</label>
              <transition name="fade">
                <q-badge
                  v-if="selectedFlag.enabled"
                  color="positive"
                  align="middle"
                  class="q-ml-sm"
                  key="enabled"
                >
                  Enabled
                </q-badge>
                <q-badge v-else color="grey" align="middle" class="q-ml-sm" key="disabled">
                  Disabled
                </q-badge>
              </transition>
            </div>

            <div class="form-field">
              <label class="field-label">Created at</label>
              <div class="text-body2">
                {{ formatDate(selectedFlag.createdAt) }}
              </div>
            </div>

            <div class="form-field">
              <label class="field-label">Last update</label>
              <div class="text-body2">
                {{ formatDate(selectedFlag.updatedAt) }}
              </div>
            </div>

            <div class="form-field">
              <label class="field-label">Flag ID</label>
              <div class="text-body2">{{ selectedFlag.id }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import type { FeatureFlag } from 'src/types/feature-flag';
import { useFeatureFlagsStore } from 'src/stores/feature-flag';

const $q = useQuasar();

const featureFlags = ref<FeatureFlag[]>([]);
const selectedFlag = ref<FeatureFlag | null>(null);
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const loadingCreate = ref(false);
const loadingEdit = ref(false);
const searchQuery = ref('');
const featureFlagsStore = useFeatureFlagsStore();
const showDetailsDialog = ref(false);

const newFlag = ref({
  name: '',
  description: '',
  enabled: false,
});

const editingFlag = ref<FeatureFlag>({
  id: '',
  name: '',
  description: '',
  enabled: false,
});

const enabledCount = computed(() => featureFlags.value.filter((f) => f.enabled).length);
const disabledCount = computed(() => featureFlags.value.filter((f) => !f.enabled).length);

const formatDate = (input?: string | Date): string => {
  if (!input) return '—';
  const date = input instanceof Date ? input : new Date(input);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}`;
};

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  $q.notify({
    type: 'positive',
    message: 'ID copied to clipboard',
    position: 'top',
    icon: 'check_circle',
  });
};

onMounted(async () => {
  await fetchFeatureFlags();
});

const fetchFeatureFlags = async () => {
  try {
    const flags = await featureFlagsStore.listFeatureFlags();
    featureFlags.value = flags;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to fetch feature flags',
      position: 'top',
    });
  }
};

const handleCreateFlag = async () => {
  try {
    loadingCreate.value = true;
    const data = {
      name: newFlag.value.name,
      description: newFlag.value.description,
      enabled: newFlag.value.enabled,
    };
    await featureFlagsStore.create(data);

    $q.notify({
      type: 'positive',
      message: 'Feature flag created successfully',
      position: 'top',
      icon: 'check_circle',
    });

    newFlag.value = {
      name: '',
      description: '',
      enabled: false,
    };
    showCreateDialog.value = false;
    await fetchFeatureFlags();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to create feature flag',
      position: 'top',
    });
  } finally {
    loadingCreate.value = false;
  }
};

const editFlag = (flag: FeatureFlag) => {
  editingFlag.value = { ...flag };
  showEditDialog.value = true;
};

const handleEditFlag = async () => {
  try {
    loadingEdit.value = true;
    const data = {
      name: editingFlag.value.name,
      description: editingFlag.value.description,
      enabled: editingFlag.value.enabled,
    };
    const flagId = editingFlag.value.id;

    await featureFlagsStore.update(flagId, data);

    $q.notify({
      type: 'positive',
      message: 'Feature flag updated successfully',
      position: 'top',
      icon: 'check_circle',
    });

    showEditDialog.value = false;
    await fetchFeatureFlags();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to update feature flag',
      position: 'top',
    });
  } finally {
    loadingEdit.value = false;
  }
};

const toggleFlag = async (flag: FeatureFlag) => {
  try {
    const flagId = flag.id;
    const data = {
      name: flag.name,
      description: flag.description,
      enabled: !flag.enabled,
    };

    await featureFlagsStore.toggle(flagId, data);

    flag.enabled = !flag.enabled;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to toggle feature flag',
      position: 'top',
    });
  }
};

const deleteFlag = async (flagId: string) => {
  try {
    await featureFlagsStore.delete(flagId);

    $q.notify({
      type: 'positive',
      message: 'Feature flag deleted successfully',
      position: 'top',
      icon: 'check_circle',
    });

    await fetchFeatureFlags();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to delete feature flag',
      position: 'top',
    });
  }
};

const viewFlagDetails = (flag: FeatureFlag) => {
  selectedFlag.value = flag;
  showDetailsDialog.value = true;
};
</script>

<style scoped lang="scss">
.feature-flags-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.glass-header {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
}

.page-content {
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0 0;
}

.create-btn {
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  }
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  &.stat-total {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.stat-active {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  &.stat-inactive {
    background: linear-gradient(135deg, #868f96 0%, #596164 100%);
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #7f8c8d;
  font-weight: 500;
  margin-top: 0.25rem;
}

.search-section {
  margin-bottom: 2rem;
}

.search-input {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  :deep(.q-field__control) {
    border-radius: 16px;
    height: 56px;
  }

  :deep(.q-field__prepend) {
    padding-left: 1rem;
  }

  :deep(.q-field__append) {
    padding-right: 1rem;
  }

  &:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  }

  :deep(.q-field--focused) {
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  }
}

.flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  grid-column: 1 / -1;
  background: white;
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem;
}

.empty-text {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0 0 2rem;
}

.flag-card-wrapper {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flag-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  transition:
    transform 0.5s ease,
    border-left-color 0.5s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  &.flag-enabled {
    border-left: 4px solid #38ef7d;
  }
}

.flag-status-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  background: #e0e0e0;
  transition: background 0.5s ease;

  &.active {
    background: linear-gradient(180deg, #38ef7d 0%, #11998e 100%);
  }
}

.flag-header {
  padding: 1.5rem;
}

.flag-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.flag-title-section {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.flag-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.status-chip {
  font-weight: 600;
  font-size: 0.75rem;
}

.flag-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
}

.flag-description {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;

  &.empty {
    font-style: italic;
    color: #bdc3c7;
  }
}

.flag-body {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flag-id {
  display: flex;
  align-items: center;
  color: #7f8c8d;
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
}

.custom-toggle {
  :deep(.q-toggle__track) {
    background: #e0e0e0;
    opacity: 1;
    transition: background 0.3s ease;
  }

  :deep(.q-toggle__inner:not(.q-toggle__inner--truthy) .q-toggle__thumb) {
    border: 1px;
    background-color: #c7c7c7 !important;
    border-radius: 16px;
  }
}

.toggle-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-separator {
  background: #e0e0e0;
}

.flag-footer {
  padding: 1rem 1.5rem;
}

.footer-btn {
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.dialog-card {
  width: 550px;
  max-width: 90vw;
  border-radius: 20px;
  overflow: hidden;
}

.dialog-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-title-section {
  display: flex;
  align-items: center;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.dialog-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.dialog-content {
  padding: 2rem;
  background: white;
  color: #2c3e50;
}

.dialog-card.details-dialog {
  background: white;
  color: #2c3e50;
}

.form-border {
  border-radius: 16px;

  :deep(.q-field__control) {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    color: rgba(102, 126, 234, 0.3);
    transition: box-shadow 0.3s ease;
  }

  :deep(.q-field__control:hover) {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  }

  :deep(.q-field--focused .q-field__control) {
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  }

  :deep(.q-toggle__inner:not(.q-toggle__inner--truthy) .q-toggle__thumb) {
    transition:
      background-color 0.6s ease,
      border-color 0.6s ease;
  }

  :deep(.q-toggle__inner:not(.q-toggle__inner--truthy) .q-toggle__track) {
    transition: background-color 0.6s ease;
  }

  :deep(.q-toggle__thumb) {
    transition: transform 0.6s ease;
  }
}

.form-field {
  margin-bottom: 1.5rem;
}

.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
}

.fade-enter-active {
  transition:
    opacity 0.8s ease,
    transform 0.6s ease;
}

.fade-leave-active {
  transition:
    opacity 1s ease,
    transform 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .create-btn {
    width: 100%;
  }

  .flags-grid {
    grid-template-columns: 1fr;
  }
}
</style>
