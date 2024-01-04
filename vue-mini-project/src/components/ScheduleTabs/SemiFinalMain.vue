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
      <div v-else class="overflow-x-auto ">
        <div class="flex justify-between gap-5">
          <article v-for="match in matches" :key="match.matchId"
            class="overflow-hidden rounded-lg shadow-lg   divide-y bg-slate-200">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '../../stores/auth.store'
import { graphScopes, myMSALObj } from '../../stores/auth.store'
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
      return matchId >= 61 && matchId <= 62
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