<template>
  <div v-if="isLoading" class="flex items-center justify-center h-64">
    <div
      class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status">
      <span
        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div class="grid grid-cols-4 gap-4 h-full">
      <div v-for="group in groups" :key="group.groupId" @click="showModal(group)"
        class="block max-w-sm p-16 bg-slate-200  text-black  border-lg border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer">
        <h5 class="mb-2 text-base font-bold tracking-tight text-gray-900 uppercase text-center dark:text-white">
          {{ group.groupName }}
        </h5>
      </div>
    </div>
    <div class="fixed inset-0 z-50 overflow-y-auto" v-if="selectedGroup">
      <div class="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-75 flex items-center justify-center">
        <!-- <div aria-hidden="true" @click="closeModal"></div> -->
        <div class="bg-white rounded-lg overflow-hidden shadow-xl w-1/3">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium uppercase text-gray-900">
              {{ selectedGroup.groupName }} {{ $t("players") }}
            </h3>
            <div class="mt-4">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="py-2 px-4 font-bold uppercase">{{ $t("players name") }}</th>
                    <th class="py-2 px-4 font-bold uppercase">{{ $t("no of wins") }}</th>
                    <th class="py-2 px-4 font-bold uppercase">{{ $t("points") }}</th>

                  </tr>
                </thead>
                <tbody>
                  <tr v-for="player in players" :key="player.playerId">
                    <td class="py-2 px-5 font-medium">{{ player.name }}</td>
                    <td class="py-2 px-11 font-medium">{{ player.totalMatchesWon }}</td>
                    <td class="py-2 px-8">{{ player.score }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-600 text-base font-medium text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeModal">
              {{ $t("close") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import axiosInstance from '@/stores/auth.store'

interface Group {
  groupId: number
  groupName: string
}

interface Player {
  playerId: number
  playerName: string
  name: string
  score: number
  groupId: number
  totalMatchesPlayed: number
  totalMatchesWon: number
}

const groups = ref<Group[]>([])
const players = ref<Player[]>([])
const selectedGroup = ref<Group | null>(null)
const isLoading = ref(true)

async function fetchGroups() {
  try {
    const groupResponse = await axiosInstance.get('/Group')
    groups.value = groupResponse.data.result
    isLoading.value = false
  } catch (error) {
    console.error(error)
  }
}

async function fetchPlayers() {
  try {
    if (selectedGroup.value && selectedGroup.value.groupId) {
      const response = await axiosInstance.get(
        `/Player/GetPlayerByGroupId?groupId=${selectedGroup.value.groupId}`
      )
      players.value = response.data.result
    } else {
      players.value = []
    }
  } catch (error) {
    console.error(error)
  }
}

function showModal(group: Group) {
  selectedGroup.value = group
  fetchPlayers()
}

function closeModal() {
  selectedGroup.value = null
  players.value = []
}

onMounted(fetchGroups)
watch(selectedGroup, fetchPlayers)
</script>