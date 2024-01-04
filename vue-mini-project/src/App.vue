<template>
  <div v-if="isAuthenticated === 'false'">
    <HomePage />
  </div>
  <div v-else class="wrapper">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/counter'

import HomePage from './components/HomePage.vue'
import { graphScopes, myMSALObj } from './stores/auth.store'
import type { AuthenticationResult } from '@azure/msal-browser'

const userStore = useUserStore()

const isAuthenticated = ref('')

onMounted(async () => {
  isAuthenticated.value = sessionStorage.getItem('authenticated') as string
  myMSALObj.handleRedirectPromise().then((res: AuthenticationResult | null) => {
    if (res != null && res.account != null) {
      myMSALObj.setActiveAccount(res.account)
      userStore.idToken = res.idToken
      router.push('/')
        ; (userStore.isAuthenticated = true), window.history.pushState('', '')
      sessionStorage.setItem('authenticated', 'true')
    } else {
      userStore.isAuthenticated = false
      sessionStorage.removeItem('authenticated')
      myMSALObj.loginRedirect(graphScopes)
    }
  })
})
</script>
