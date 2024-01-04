<template>
  <div class="flex justify-center">
    <div class="mt-2">
      <div class="overflow-x-auto">
        <div class="last:mr-0 pb-2 flex-auto text-center cursor-pointer">
          <button @click="generateMatchSchedule"
            class="bg-slate-400 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
            {{ $t("generate schedule") }}
          </button>
          <button @click="endRoundOne"
            class="bg-slate-400 hover:bg-slate-600 text-white font-bold ml-6 py-2 px-4 rounded">
            {{$t("End Round One")}}
          </button>
        </div>
        <table class="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th class="px-4 py-2 border-b uppercase">{{ $t("player 1") }}</th>
              <th class="px-4 py-2 border-b uppercase">{{ $t("player 2") }}</th>
              <th class="px-4 py-2 border-b uppercase">{{ $t("group") }}</th>
              <th class="px-4 py-2 border-b uppercase">{{ $t("match") }}</th>
              <th scope="col" class="px-6 py-4 border-b uppercase">{{ $t("score of player 1") }}</th>
              <th scope="col" class="px-6 py-4 border-b uppercase">{{ $t("score of player 2") }}</th>
              <th scope="col" class="px-6 py-4 border-b uppercase">{{ $t("action") }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="match in displayedMatches" :key="match.matchId">
              <tr>
                <td class="px-4 py-2 border-b">{{ match.player1Name }}</td>
                <td class="px-4 py-2 border-b">{{ match.player2Name }}</td>
                <td class="px-4 py-2 border-b">{{ match.groupId }}</td>
                <td class="px-4 py-2 border-b">{{ match.matchId }}</td>
                <td class="whitespace-nowrap px-6 py-4 border-b">
                  <input class="border border-gray-300 rounded p-1" v-model="match.scoreOfPlayer1" />
                </td>
                <td class="whitespace-nowrap px-6 py-4 border-b">
                  <input class="border border-gray-300 rounded p-1" v-model="match.scoreOfPlayer2" />
                </td>
                <td class="px-6 py-4 border-b">
                  <button @click="saveMatch(match)" class="bg bg-slate-500 rounded px-2 text-white hover:bg-slate-700">
                    {{ $t("save") }}
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="flex justify-center mt-10 ">
        <button :disabled="currentPage === 1" @click="previousPage"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>


        </button>
        <p class="m-2 italic text-xs">{{ $t("page") }} {{ currentPage }} {{ $t("of") }} {{ totalPages }}</p>
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
import { useToast } from 'vue-toastification'
import axiosInstance from '../../stores/auth.store'

interface Match {
  id: number
  matchId: number
  player1Id: number
  player1Name: string
  player2Id: number
  player2Name: string
  scoreOfPlayer1: number
  scoreOfPlayer2: number
  groupId: number
}

const matches = ref<Match[]>([])
const currentPage = ref(1)
const itemsPerPage = 6
const toast = useToast()
async function generateMatchSchedule() {
  try {
    const response = await axiosInstance.post('/Match/GenerateSchedule', {
      trigger: true
    })
    matches.value = response.data
    toast.success('generated')
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      const { data } = error.response
      if (data && data.CustomError) {
        const errorMessages = data.CustomError
        if (errorMessages.includes('Player registration is still open. Please wait for all members to register.')) {
          toast.error('Player registration is still open. Please wait for all members to register.')
        } else if (errorMessages.includes("The previous round has not ended")) {
          toast.error("The previous round has not ended")
        } else if (errorMessages.includes("Schedule is already generated!")) {
          toast.error("Schedule is already generated!")
        }
        else {
          toast.error("error")
        }
      } else {
        toast.error('error')
      }
    } else if (error.response && error.response.status === 409) {
      toast.error('Schedule already generated')
    } else {
      toast.error('Schedule already generated')
    }
  }
}
const fetchMatches = async () => {
  try {
    const response = await axiosInstance.get('/Match/GetAllMatches')
    matches.value = response.data.result
  } catch (error) {
    console.error('Failed to fetch matches')
  }
}

const saveMatch = async (match: Match) => {
  try {
    const matchData = {
      matchId: match.matchId,
      scoreOfPlayer1: match.scoreOfPlayer1,
      scoreOfPlayer2: match.scoreOfPlayer2
    }

    const response = await axiosInstance.put('/Match/UpdateScoreBoard', matchData)
    toast.success('Saved successfully')
  } catch (error) {
    toast.error('Failed to save match')
  }
};
async function endRoundOne() {
  try {
    const response = await axiosInstance.post(
      "/Player/UpdatePlayerStatusToKnockouts",
      {
        trigger: true,
      }
    );
    matches.value = response.data;
    toast.success("Round one ended successfully");
  } catch (error) {
    toast.error("Error");
  }
}
onMounted(fetchMatches);
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
