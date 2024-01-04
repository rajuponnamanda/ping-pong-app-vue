<template>
  <div>
    <div class="flex flex-row justify-center p-5 bg-slate-600 ">
      <h1 class="font-bold uppercase text-white text-3xl">{{ $t("admin portal") }}</h1>
    </div>
    <div class="tabs mx-auto">
      <h1
        class="text-base font-bold uppercase rounded block leading-normal text-center text-gray-900 dark:text-gray-400 mb-5 mt-5 hover:underline hover:cursor-pointer">
        {{ $t("matches") }}
      </h1>
      <ul class="pt-3 flex p-2">
        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
          <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
            v-on:click="toggleTabs(1)" v-bind:class="{
              'text-slate-600 bg-white': openTab !== 1,
              'text-white bg-slate-600': openTab === 1
            }">
            {{ $t("round one") }}
          </a>
        </li>

        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
          <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
            v-on:click="toggleTabs(2)" v-bind:class="{
              'text-slate-600 bg-white': openTab !== 2,
              'text-white bg-slate-600': openTab === 2
            }">
            {{ $t('pre quaters') }}
          </a>
        </li>

        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
          <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
            v-on:click="toggleTabs(3)" v-bind:class="{
              'text-slate-600 bg-white': openTab !== 3,
              'text-white bg-slate-600': openTab === 3
            }">
            {{ $t("quater final") }}
          </a>
        </li>

        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
          <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
            v-on:click="toggleTabs(4)" v-bind:class="{
              'text-slate-600 bg-white': openTab !== 4,
              'text-white bg-slate-600': openTab === 4
            }">
            {{ $t("pre final") }}
          </a>
        </li>

        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
          <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
            v-on:click="toggleTabs(5)" v-bind:class="{
              'text-slate-600 bg-white': openTab !== 5,
              'text-white bg-slate-600': openTab === 5
            }">
            {{ $t("final") }}
          </a>
        </li>
      </ul>
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full shadow-inner mb-6">
        <div class="px-4 py-5 flex-auto">
          <div class="tab-content tab-space">
            <div v-bind:class="{ hidden: openTab !== 1, block: openTab === 1 }">
              <RoundOne/>
            </div>

            <div v-bind:class="{ hidden: openTab !== 2, block: openTab === 2 }">
              <PreQuarter />
            </div>

            <div v-bind:class="{ hidden: openTab !== 3, block: openTab === 3 }">
              <QuarterFinal />
            </div>

            <div v-bind:class="{ hidden: openTab !== 4, block: openTab === 4 }">
              <SemiFinals />
            </div>

            <div v-bind:class="{ hidden: openTab !== 5, block: openTab === 5 }">
              <FinalMatch />
            </div>
          </div>
        </div>
      </div>
      <router-link to="/">
        <div class="flex h-screen items-top">
          <button
            class="block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-130 h-10 mx-auto">
            {{ $t("back") }}
          </button>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import RoundOne from '../components/tabs/RoundOne.vue'
import PreQuarter from '../components/tabs/PreQuarter.vue'
import QuarterFinal from '../components/tabs/QuarterFinal.vue'
import SemiFinals from '../components/tabs/SemiFinals.vue'
import FinalMatch from '../components/tabs/FinalMatch.vue'

export default defineComponent({
  setup() {
    const openTab = ref(1)
    const toggleTabs = (tabNumber: number) => {
      openTab.value = tabNumber
    }
    return {
      openTab,
      toggleTabs
    }
  },

  components: { RoundOne, PreQuarter, QuarterFinal, SemiFinals, FinalMatch }
})
</script>
