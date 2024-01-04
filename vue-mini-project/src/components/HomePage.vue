<template>
  <div class="main-container flex justify-center items-center bg-slate-600">
    <div class="bg-gray-200 w-[400px] h-[400px] mx-20 my-10 shadow-md shadow-white rounded-xl">
      <h1 class="text-center my-2 text-xl font-bold mt-20 uppercase">Welcome To Ping Pong</h1>
      <h1 class="text-xl font-bold text-center uppercase">Tournament</h1>
      <div class="flex justify-center items-center">
        <img src="@/assets/tt.png" class="w-[80px] pt-5 pb-5 self-center" alt="" />
      </div>
      <div class="flex justify-center items-center">
        <button v-if="!userStore.isAuthenticated"
          class="bg-slate-600 uppercase rounded-lg text-white ml mt-4 font-semibold pt-1 pl-12 pr-12 pb-1 hover:bg-slate-900 hover:text-white max-w-xs transition duration-300 ease-in-out hover:scale-110"
          @click="login">
          Log In
        </button>
        <div>
          <button @click="handleClick"
            class="bg-slate-600 uppercase rounded-lg text-white ml-1 mt-4 font-semibold pt-1 pl-6 pr-6 pb-1 hover:bg-slate-900 hover:text-white max-w-xs transition duration-300 ease-in-out hover:scale-110">
            Admin Log In
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { myMSALObj, graphScopes } from '@/stores/auth.store'
import { useUserStore } from '@/stores/counter'
import router from '@/router'

const userStore = useUserStore()
function login() {
  myMSALObj.loginRedirect(graphScopes)
}
function handleClick() {
  router.push({ name: 'Admin' })
}
</script>

<style scoped>
.main-container {
  height: 100vh;
  background-size: cover;
}
</style>
