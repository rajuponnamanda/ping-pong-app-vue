<template>
  <div class="relative overflow-x-auto sm:rounded-lg">
    <div class="flex items-center justify-center bg-white rounded-lg px-4 py-3 mb-4">
      <h2 class="text-base font-bold uppercase rounded block leading-normal text-center text-gray-700 dark:text-gray-400">
        Points Table
      </h2>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 divide-y divide-gray-200">
      <thead class="text-sm text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th class="px-5 py-2 text-gray-600 font-medium tracking-wider">Player ID</th>
          <th class="px-5 py-2 text-gray-600 font-medium tracking-wider">Player Name</th>
          <th class="px-5 py-2 text-gray-600 font-medium tracking-wider">Group</th>
          <th class="px-5 py-2 text-gray-600 font-medium tracking-wider">Win</th>
          <th class="px-5 py-2 text-gray-600 font-medium tracking-wider">Score</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="match in displayedMatches" :key="match.playerId"
          class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600">
          <td class="px-8 py-3 whitespace-nowrap text-gray-600 dark:text-gray-200">
            {{ match.playerId }}
          </td>
          <td class="px-8 py-3 whitespace-nowrap text-gray-600 dark:text-gray-200">
            {{ match.name }}
          </td>
          <td class="px- py-3 whitespace-nowrap text-gray-600 dark:text-gray-200">
            {{ match.groupName }}
          </td>
          <td class="px-8 py-3 whitespace-nowrap text-gray-600 dark:text-gray-200">
            {{ match.totalMatchesWon }}
          </td>
          <td class="px-8 py-3 whitespace-nowrap text-gray-600 dark:text-gray-200">
            {{ match.score }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-10 ">
      <button :disabled="currentPage === 1" @click="previousPage"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-lg" id="previousButton">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
        </svg>
      </button>
      <p class="m-2 italic text-xs">Page {{ currentPage }} of {{ totalPages }}</p>
      <button :disabled="currentPage === totalPages" @click="nextPage" id="nextButton"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axiosInstance from '@/stores/auth.store'

interface Match {
  playerId: number
  name: string
  groupId: number
  groupName: string
  totalMatchesWon: string
  score: string
}
const matches = ref<Match[]>([])
const currentPage = ref(1)
const itemsPerPage = 8

const getMatchPoints = async () => {
  try {
    let pointsResponse = await axiosInstance.get('/Player/GetPlayersOrderbyScore')
    matches.value = pointsResponse.data.result
  } catch (error) {
    console.error(error)
  }
}
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

onMounted(() => {
  getMatchPoints()
})
</script>

<style>
@media (min-width: 640px) {
  table {
    display: table;
  }

  thead {
    display: table-header-group;
    border-bottom-width: 1px;
  }

  tbody {
    display: table-row-group;
  }

  tr {
    display: table-row;
  }

  th {
    display: table-cell;
    padding: 0.75rem;
    font-size: 0.875rem;
    text-align: left;
    font-weight: 600;
    line-height: 1.25rem;
  }

  td {
    display: table-cell;
    padding: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    vertical-align: top;
  }

  tbody tr:last-child {
    border-bottom-width: 0;
  }
}
</style>
