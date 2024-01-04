<template>
  <div class="tabs mx-auto">
    <div
      class="text-base font-bold uppercase rounded block leading-normal text-center text-gray-700 dark:text-gray-400 mb-5 mt-5">
      {{ $t("matches") }}
    </div>
    <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
        <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
          v-on:click="toggleTabs(1)" v-bind:class="{
            'text-slate-600 bg-white': openTab !== 1,
            'text-black bg-slate-400': openTab === 1
          }"><img src="\src\assets\round1.png" class="inline-block w-4 h-4 mr-2  bg-none" alt="Logo" />
          {{ $t("round 1") }}
        </a>
      </li>
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
        <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
          v-on:click="toggleTabs(2)" v-bind:class="{
            'text-slate-600 bg-white': openTab !== 2,
            'text-black bg-slate-400': openTab === 2
          }"><img src="\src\assets\quarter.png" class="inline-block w-4 h-4 mr-2 bg-none" alt="Logo" />
          {{ $t("pre quaters") }}
        </a>
      </li>
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
        <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
          v-on:click="toggleTabs(3)" v-bind:class="{
            'text-slate-600 bg-white': openTab !== 3,
            'text-black bg-slate-400': openTab === 3
          }"><img src="\src\assets\quarter.png" class="inline-block w-4 h-4 mr-2 bg-none" alt="Logo" />
          {{ $t("quaterfinals") }}
        </a>
      </li>
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
        <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
          v-on:click="toggleTabs(4)" v-bind:class="{
            'text-slate-600 bg-white': openTab !== 4,
            'text-black bg-slate-400': openTab === 4
          }"><img src="\src\assets\semi.png" class="inline-block w-4 h-4 mr-2 bg-none" alt="Logo" />
       {{ $t("semi final") }}
        </a>
      </li>
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
        <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
          v-on:click="toggleTabs(5)" v-bind:class="{
            'text-slate-600 bg-white': openTab !== 5,
            'text-black bg-slate-400': openTab === 5
          }"><img src="\src\assets\finish.png" class="inline-block w-4 h-4 mr-2 bg-none" alt="Logo" />
          {{ $t("final") }}
        </a>
      </li>
    </ul>
    <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6">
      <div class="px-4 py-5 flex-auto">
        <div class="tab-content tab-space">
          <div v-bind:class="{ hidden: openTab !== 1, block: openTab === 1 }">
            <RoundOneMain />
          </div>

          <div v-bind:class="{ hidden: openTab !== 2, block: openTab === 2 }">
            <PreQuarterMain />
          </div>

          <div v-bind:class="{ hidden: openTab !== 3, block: openTab === 3 }">
            <QuarterFinalMain />
          </div>
          <div v-bind:class="{ hidden: openTab !== 4, block: openTab === 4 }">
            <SemiFinalMain />
          </div>
          <div v-bind:class="{ hidden: openTab !== 5, block: openTab === 5 }">
            <FinalMain />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axiosInstance from '@/stores/auth.store'
import RoundOneMain from '../components/ScheduleTabs/RoundOneMain.vue'
import PreQuarterMain from '../components/ScheduleTabs/PreQuarterMain.vue'
import QuarterFinalMain from '../components/ScheduleTabs/QuarterFinalMain.vue'
import SemiFinalMain from '../components/ScheduleTabs/SemiFinalMain.vue'
import FinalMain from './ScheduleTabs/FInalMain.vue'

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

export default defineComponent({
  name: 'Tabs',
  setup() {
    const openTab = ref(1)
    const matches = ref<Match[]>([])
    const currentPage = ref(1)
    const itemsPerPage = 6
    const toast = useToast()

    const toggleTabs = (tabNumber: number) => {
      openTab.value = tabNumber
    }

    const generateMatchSchedule = async () => {
      try {
        const response = await axiosInstance.post('/Match/generateschedule', {
          trigger: true
        })
        matches.value = response.data
        toast.success('generated')
      } catch (error) {
        toast.error('Schedule already generated')
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

    return {
      openTab,
      matches,
      currentPage,
      itemsPerPage,
      displayedMatches,
      totalPages,
      toggleTabs,
      generateMatchSchedule,
      saveMatch,
      previousPage,
      nextPage
    }
  },
  components: { RoundOneMain, PreQuarterMain, QuarterFinalMain, SemiFinalMain, FinalMain }
})
</script>
