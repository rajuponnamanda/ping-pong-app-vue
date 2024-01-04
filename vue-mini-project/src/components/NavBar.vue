<template>
  <div>
    <nav class="bg-slate-600 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-gray-200 dark:border-gray-600">
      <div class="flex flex-wrap items-center justify-between mx-auto p-4">
        <a class="flex items-center">
          <img src="\src\assets\table-tennis.png" class="h-8 mr-3" alt="Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">{{ $t("ping pong") }}</span>
        </a>
        <div class="flex items-center md:order-2 border-gray-400 rounded-[100px]">
          <LanguageVue class="pr-2" />
          <div class="relative">
            <button type="button" class="flex mr-3 text-sm rounded-full md:mr-0 focus:ring-2 focus:ring-gray-300"
              id="user-menu-button" aria-expanded="false" @click="toggleDropdown">
              <span class="sr-only">Open user menu</span>
              <img v-if="userStore.isAuthenticated && userStore.image" :src="userStore.image"
                class="w-8 h-8 rounded-full" />
              <div v-else class="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold">
                {{ account.name.charAt(0).toUpperCase() }}
              </div>
            </button>

            <div v-if="showDropdown" @click.away="showDropdown = false">
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg font-bold uppercase">
                <router-link to="/admin"
                  class="block px-4 py-2 text-sm text-white bg-slate-500 hover:bg-slate-700 rounded">{{ $t("admin portal")
                  }}</router-link>
                <a class="block px-4 py-2 text-sm text-gray-700 hover:cursor-pointer" @click="logout">{{ $t("sign out")
                }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <MainLayout />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '../stores/counter'
import { myMSALObj } from '../stores/auth.store'
import MainLayout from '../layouts/MainLayout.vue'
import LanguageVue from '../components/LanguageVue.vue'

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
const userStore = useUserStore()
let accessToken = ref('')
const account = ref({ name: '', username: '', profileImageUrl: '' })

onMounted(async () => {
  myMSALObj.handleRedirectPromise().then((res) => {
    if (res != null && res.account != null) {
      myMSALObj.setActiveAccount(res.account)

      sessionStorage.setItem('accessToken', res.accessToken)
      userStore.isAuthenticated = true

      const profileImageUrl = getProfileImage(res.accessToken)
      const accountObj: any = myMSALObj.getActiveAccount()
      account.value = {
        name: accountObj.name ?? '',
        username: accountObj.username ?? '',
        profileImageUrl: userStore.image ?? ''
      }
    }
  })
})

const getProfileImage = async (accessToken: string) => {
  try {
    const headers = { Authorization: `Bearer ${accessToken}` }
    const response = await axios.get('https://graph.microsoft.com/v1.0/me/photo/$value', {
      headers,
      responseType: 'arraybuffer'
    })
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    const imageUrl = URL.createObjectURL(blob)
    userStore.image = imageUrl
    return imageUrl
  } catch (err) {
    console.error(err)
    return null
  }
}

const logout = async () => {
  try {
    myMSALObj.logoutRedirect()
    account.value = { name: '', username: '', profileImageUrl: '' }
    userStore.isAuthenticated = false
    sessionStorage.removeItem('athenticated')
  } catch (err) {
    console.error(err)
  }
}

const data = reactive({
  name: '',
  username: '',
  profileImageUrl: ''
})
</script>

<style scoped></style>
