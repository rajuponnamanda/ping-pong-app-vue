<template>
  <div v-if="isLoading" class="flex items-center justify-center h-64">
    <div
      class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status">
      <span
        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
  </div>
  <div v-else class="relative overflow-x-auto sm:rounded-lg">
    <div class="bg-white rounded-lg px-4 py-3 mb-4 flex flex-col justify-center">
      <h2
        class="text-base font-bold uppercase rounded block leading-normal text-center text-gray-700 dark:text-gray-400 mb-4">
       {{$t("my fixtures table")}}
      </h2>

      <table class="min-w-max w-full table-auto">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="px-4 py-3 text-left">{{ $t("players name") }}</th>
            <th class="px-4 py-3 text-center">{{ $t("points") }}</th>
            <th class="px-4 py-3 text-right">{{ $t("opponent") }}</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="player in players" :key="player.matchId"
            class="border-b border-gray-200 hover:bg-gray-100 justify-end">
            <td class="px-4 py-4 whitespace-nowrap font-normal text-left flex items-center">
              <img v-if="player.player2Image" :src="player.player2Image" class="w-8 h-8 rounded-full mr-2" />
              <div v-else
                class="inline-block rounded-full mr-2 w-8 h-8 text-center pt-1 bg-gray-200 text-black font-bold">
                {{ player.player1Name.charAt(0).toUpperCase() }}
              </div>
              <span>{{ player.player1Name }}</span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap font-normal text-center">
              {{ player.scoreOfPlayer1 }} | {{ player.scoreOfPlayer2 }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap font-normal text-right">
              {{ player.player2Name }}
              <img v-if="player.image" :src="player.image" class="inline-block rounded-full w-8 h-8 mr-2" />
              <div v-else class="inline-block rounded-full w-8 h-8 text-center pt-1 bg-gray-200 text-black font-bold">
                {{ player.player2Name.charAt(0).toUpperCase() }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance, { graphScopes } from '../stores/auth.store'
import { myMSALObj } from '../stores/auth.store'
import axios from 'axios'
interface Player {
  id: number
  matchId: number
  player1Id: number
  player2Id: number
  player1Name: string
  player2Name: string
  scoreOfPlayer1: number
  scoreOfPlayer2: number
  groupId: number
  image: any
  player2Image: any
}
interface PlayerEmail {
  playerId: number
  email: string
}
const isAuthenticated = myMSALObj.getAllAccounts().length > 0
const userEmail = isAuthenticated ? myMSALObj.getAllAccounts()[0].username : ''
const players = ref<Player[]>([])
const playerEmails = ref<PlayerEmail[]>([])
let isLoading = ref(true)

async function fetchEmail() {
  try {
    const accountResponse = await myMSALObj.acquireTokenSilent(graphScopes)
    const response = await axiosInstance.get('/Player/GetPlayerswithEmailId')
    playerEmails.value = response.data.result
  } catch (error: any) {
    console.error(`Error fetching email details: ${error.message}`)
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

async function fetchPlayers() {
  try {
    await fetchEmail()

    const response = await axiosInstance.get(`/Match/GetMyMatchFixtures?emailId=${userEmail}`)
    if (response.status === 200) {
      players.value = response.data.result

      // Create a map of playerId to image URL for players and opponents
      const playerImageMap = new Map<number, string>()
      const opponentImageMap = new Map<number, string>()

      // Fetch images for players
      const [playerImages, opponentImages] = await Promise.all([
        Promise.all(playerEmails.value.map((email) => fetchProfileImage(email.email))),
        Promise.all(playerEmails.value.map((email) => fetchProfileImage(email.email))),
      ])

      playerEmails.value.forEach((playerEmail, index) => {
        playerImageMap.set(playerEmail.playerId, playerImages[index]!)
        opponentImageMap.set(playerEmail.playerId, opponentImages[index]!)
      })

      // Assign images to players and opponents
      players.value.forEach((player) => {
        player.player2Image = playerImageMap.get(player.player1Id)
        player.image = opponentImageMap.get(player.player2Id)
      })

      isLoading.value = false
    } else {
      console.error(`Failed to fetch match details: ${response.statusText}`)
    }
  } catch (error: any) {
    console.error(`Error fetching match details: ${error.message}`)
  }
}

onMounted(() => {
  fetchPlayers()
})
</script>