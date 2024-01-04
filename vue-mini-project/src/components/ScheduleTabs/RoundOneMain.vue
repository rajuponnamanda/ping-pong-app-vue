<template>
  <div class="flex justify-center">
    <div class="mt-4 w-full">
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
      <div v-else class="overflow-x-auto">
        <div class="grid grid-cols-2 gap-5">
          <article v-for="match in displayedMatches" :key="match.matchId"
            class="overflow-hidden rounded-lg shadow-lg bg-slate-200 divide-y">
            <header class="flex font-semibold items-center justify-between leading-tight md:p-4">
              <h1 class="text-lg">
                <a class="no-underline hover:underline text-black text-sm" href="#">
                  Match {{ match.matchId }}
                </a>
              </h1>
            </header>
            <footer class="flex items-center justify-between leading-none p-2">
              <div class="flex items-center justify-start">
                <a class="flex items-center no-underline hover:underline text-black" href="#">
                  <template v-if="match.player1Image">
                    <img :src="match.player1Image" class="w-8 h-8 rounded-full mr-1" />
                  </template>
                  <template v-else>
                    <div
                      class="inline-block rounded-full mr-2 w-8 h-8 pt-2 bg-slate-700 text-white font-semibold text-center">
                      {{ match.player1Name.charAt(0).toUpperCase() }}
                    </div>
                  </template>
                  <p class="ml-1 text-xs">{{ match.player1Name }}</p>
                </a>
              </div>
              <div class="flex items-center justify-center w-8">
                <span class="font-semibold">vs</span>
              </div>
              <div class="flex items-center">
                <a class="flex items-center no-underline hover:underline text-black" href="#">
                  <p class="ml-2 pr-3 text-xs">{{ match.player2Name }}</p>
                  <template v-if="match.player2Image">
                    <img :src="match.player2Image" class="inline-block rounded-full w-8 h-8 mr-2" />
                  </template>
                  <template v-else>
                    <div
                      class="inline-block rounded-full mr-2 w-8 h-8 pt-2 bg-slate-700 text-white font-semibold text-center">
                      {{ match.player2Name.charAt(0).toUpperCase() }}
                    </div>
                  </template>
                </a>
              </div>
            </footer>
          </article>
        </div>
      </div>
      <div class="flex justify-center mt-10">
        <button :disabled="currentPage === 1" @click="previousPage"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </button>
        <p class="m-2 italic text-xs">Page {{ currentPage }} of {{ totalPages }}</p>
        <button :disabled="currentPage === totalPages" @click="nextPage"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import axiosInstance, { graphScopes, myMSALObj } from '../../stores/auth.store'
import axios from 'axios'

interface Match {
  id: number
  matchId: number
  player1Id: number
  player1Name: string
  player2Id: number
  player2Name: string
  image: any
  scoreOfPlayer1: number
  player2Image: any
  player1Image: any
  scoreOfPlayer2: number
  groupId: number
}

interface PlayerEmail {
  playerId: number
  email: string
}

const matches = ref<Match[]>([])
const playeremail = ref<PlayerEmail[]>([])
const currentPage = ref(1)
const itemsPerPage = 6
const isLoading = ref(true)

async function fetchEmail() {
  try {
    const response = await axiosInstance.get('/Player/GetPlayerswithEmailId')
    playeremail.value = response.data.result
  } catch (error: any) {
    console.error(`Error fetching player emails: ${error.message}`)
  }
}

async function fetchProfileImage(email: string) {
  try {
    const accountResponse = await myMSALObj.acquireTokenSilent(graphScopes)
    const headers = { Authorization: `Bearer ${accountResponse.accessToken}` }
    const response = await axios.get(`https://graph.microsoft.com/v1.0/users/${email}/photo/$value`, {
      headers,
      responseType: 'arraybuffer',
    })
    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    })
    return URL.createObjectURL(blob)
  } catch (err: any) {
    console.error(`Error fetching profile image for ${email}: ${err.message}`)
    return null
  }
}

async function fetchMatches() {
  try {
    await fetchEmail()
    const response = await axiosInstance.get('/Match/GetAllMatches')
    matches.value = response.data.result
    const opponentEmails = matches.value.map((match) => {
      const opponentEmail = playeremail.value.find((email) => email.playerId === match.player2Id)
      return opponentEmail ? opponentEmail.email : ''
    })
    const playerEmailsArr = matches.value.map((match) => {
      const playerEmail = playeremail.value.find((email) => email.playerId === match.player1Id)
      return playerEmail ? playerEmail.email : ''
    })
    const accountResponse = await myMSALObj.acquireTokenSilent(graphScopes)

    const [opponentImages, playerImages] = await Promise.all([
      Promise.all(opponentEmails.map((email) => fetchProfileImage(email))),
      Promise.all(playerEmailsArr.map((email) => fetchProfileImage(email))),
    ])

    // Assign images to players
    matches.value.forEach((match, index) => {
      match.player1Image = playerImages[index] || null
      match.player2Image = opponentImages[index] || null
    })

    isLoading.value = false
  } catch (error: any) {
    console.error(`Error fetching matches: ${error.message}`)
  }
}

onMounted(fetchMatches)

const displayedMatches = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return matches.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => Math.ceil(matches.value.length / itemsPerPage))

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>