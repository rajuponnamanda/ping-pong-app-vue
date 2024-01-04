<template>
  <div class="flex justify-center">
    <div class="mt-2">
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
      <div v-else class="overflow-x-auto">
        <div class="grid grid-rows-2 grid-flow-col gap-5">
          <article v-for="match in matches" :key="match.matchId"
            class="overflow-hidden rounded-lg shadow-lg divide-y bg-slate-200">
            <header class="flex items-center justify-between leading-tight p-2">
              <h1 class="text-lg">
                <a class="no-underline font-semibold hover:underline text-black text-sm" href="#">
                  Match {{ match.matchId }}
                </a>

              </h1>
            </header>
            <footer class="flex items-center justify-between leading-none p-2">
              <div class="flex items-center justify-start">
                <a class="flex items-center no-underline hover:underline text-black" href="#">
                  <template v-if="match.player_1_Image">
                    <img :src="match.player_1_Image" class="w-8 h-8 rounded-full mr-1" />
                  </template>
                  <template v-else>
                    <div
                      class="inline-block rounded-full mr-2 w-8 h-8 pt-2 bg-slate-700 text-white font-semibold text-center">
                      {{ match.player_1_Name.charAt(0).toUpperCase() }}
                    </div>
                  </template>
                  <p class="ml-1 text-xs">{{ match.player_1_Name }}</p>
                </a>
              </div>
              <div class="flex items-center justify-center w-8">
                <span class="font-semibold">vs</span>
              </div>
              <div class="flex items-center">
                <a class="flex items-center no-underline hover:underline text-black" href="#">
                  <p class="ml-2 pr-3 text-xs">{{ match.player_2_Name }}</p>
                  <template v-if="match.player_2_Image">
                    <img :src="match.player_2_Image" class="inline-block rounded-full w-8 h-8 mr-2" />
                  </template>
                  <template v-else>
                    <div
                      class="inline-block rounded-full mr-2 w-8 h-8 pt-2 bg-slate-700 text-white font-semibold text-center">
                      {{ match.player_2_Name.charAt(0).toUpperCase() }}
                    </div>
                  </template>
                </a>
              </div>
            </footer>
          </article>
          <div v-for="match in matches" :key="match.matchId">
            <div id="bottom-banner" tabindex="-1"
              class=" bottom-45 left-0 z-50 flex justify-between w-full p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div class="flex items-center mx-auto">
                <p class="flex items-center text-base font-semibold uppercase text-black dark:text-gray-400">
                  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0">
                    </path>
                  </svg> &nbsp The Winner Is {{ match.winner }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import axiosInstance, { graphScopes, myMSALObj } from '../../stores/auth.store'
import axios from 'axios';

interface Match {
  id: number
  matchId: number
  player_1Id: number
  player_1_Name: string
  player_1_GroupName: string
  player_2Id: number
  player_2_Name: string
  player_2_Image: string
  player_1_Image: string
  player_2_GroupName: string
  scoreOfPlayer_1: number
  scoreOfPlayer_2: number
  winner: string
}
interface PlayerEmail {
  playerId: number
  email: string
}

const matches = ref<Match[]>([])
const playerEmails = ref<PlayerEmail[]>([])
let isLoading = ref(true)

async function fetchEmail() {
  try {
    const response = await axiosInstance.get('/Player/GetPlayerswithEmailId')
    playerEmails.value = response.data.result
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

    const response = await axiosInstance.get('/Knockout/GetAllKnockouts')
    const allMatches = response.data.result

    // Filter matches
    const filteredMatches = allMatches.filter((match: any) => {
      const matchId = parseInt(match.matchId)
      return matchId > 62
    })

    // Fetch images for players
    const opponentEmails = filteredMatches.map((match: { player_1Id: number; }) => {
      const opponentEmail = playerEmails.value.find((email) => email.playerId === match.player_1Id)
      return opponentEmail ? opponentEmail.email : ''
    })
    const playerEmailsArr = filteredMatches.map((match: { player_2Id: number; }) => {
      const playerEmail = playerEmails.value.find((email) => email.playerId === match.player_2Id)
      return playerEmail ? playerEmail.email : ''
    })
    const accountResponse = await myMSALObj.acquireTokenSilent(graphScopes)

    const [opponentImages, playerImages] = await Promise.all([
      Promise.all(opponentEmails.map((email: string) => fetchProfileImage(email))),
      Promise.all(playerEmailsArr.map((email: string) => fetchProfileImage(email))),
    ])

    // Assign images to players
    filteredMatches.forEach((match: { player_1_Image: any; player_2_Image: any; }, index: any) => {
      match.player_1_Image = opponentImages[index] || null
      match.player_2_Image = playerImages[index] || null
    })

    // Update matches and loading status
    matches.value = filteredMatches
    isLoading.value = false
  } catch (error: any) {
    console.error(`Error fetching matches: ${error.message}`)
  }
}

onMounted(fetchMatches)
</script>