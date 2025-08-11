<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn
        icon
        outlined
        @click="menuDrawer = !menuDrawer"
      ><v-icon>mdi-target</v-icon></v-btn>
      <v-app-bar-title>Jagdhelfer BGLD</v-app-bar-title>

      <v-btn
        v-if="user"
        icon
        @click="sessionStore.signOut()"
      ><v-icon>mdi-logout</v-icon></v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="menuDrawer" app clipped>
      <v-list>
        <template v-for="(item, index) in menu">
          <v-divider
            v-if="
              index > 0 && (item.showLoggedOut || user)
            "
            :key="'divider-' + index"
          />
          <v-list-item
            v-if="item.showLoggedOut || user"
            :key="'item-' + index"
            :disabled="user && item.disabledLoggedIn"
            @click="$router.push(item.route)"
          >
            <template #prepend>
              <v-icon :icon="item.icon" />
            </template>
            <v-list-item-title>{{ item.title }} </v-list-item-title>
          </v-list-item>
        </template>
        <v-divider />
        <v-list-item
          v-if="!user"
          @click="$router.push('login')"
        >
          <template #prepend>
            <v-icon>mdi-login</v-icon>
          </template>
          <v-list-item-title>Anmelden</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <router-view v-if="!loading" />
    <div v-else class="d-flex justify-center align-center" style="height: 100vh">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
    </div>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'
  import { useAppStore } from '@/stores/app';
  import { useSessionStore } from '@/stores/session';

  const appStore = useAppStore()
  const sessionStore = useSessionStore();
  const loading = computed(() => appStore.loading);
  const menu = computed(() => appStore.menu);
  const user = computed(() => sessionStore.user);
  // reactive state
  const menuDrawer = ref(false)
</script>
