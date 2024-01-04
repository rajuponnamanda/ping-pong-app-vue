<template>
  <section class="dark:bg-gray-900 mt-20 antialiased">
    <div class="mx-auto max-w-screen px-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
              <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                v-on:click="toggleTabs(1)" v-bind:class="{
                  'text-slate-600 bg-white': openTab !== 1,
                  'text-white bg-slate-600': openTab === 1
                }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  class="inline-block w-4 h-4 mr-2">
                  <path fill-rule="evenodd"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    clip-rule="evenodd" />
                </svg>
             {{ $t("register") }}
              </a>
            </li>
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
              <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                v-on:click="toggleTabs(2)" v-bind:class="{
                  'text-slate-600 bg-white': openTab !== 2,
                  'text-white bg-slate-600': openTab === 2
                }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  class="inline-block w-4 h-4 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z">
                  </path>
                </svg>
                {{ $t("group") }}
              </a>
            </li>
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
              <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                v-on:click="toggleTabs(3)" v-bind:class="{
                  'text-slate-600 bg-white': openTab !== 3,
                  'text-white bg-slate-600': openTab === 3
                }">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg" class="inline-block w-4 h-4 mr-2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z">
                  </path>
                </svg>
                {{ $t("schedule") }}
              </a>
            </li>
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
              <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                v-on:click="toggleTabs(4)" v-bind:class="{
                  'text-slate-600 bg-white': openTab !== 4,
                  'text-white bg-slate-600': openTab === 4
                }">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                  class="inline-block w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6">
                  </path>
                </svg>
                {{ $t("myfixtures") }}
              </a>
            </li>
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
              <a class="text-base font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                v-on:click="toggleTabs(5)" v-bind:class="{
                  'text-slate-600 bg-white': openTab !== 5,
                  'text-white bg-slate-600': openTab === 5
                }">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                  class="inline-block w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0">
                  </path>
                </svg>
                {{ $t("leaderboard") }}
              </a>
            </li>
          </ul>
          <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-inner rounded">
            <div class="px-4 py-5 flex-auto">
              <div class="tab-content tab-space">
                <div v-bind:class="{ hidden: openTab !== 1, block: openTab === 1 }">
                  <p>
                    <FormComponent />
                  </p>
                </div>
                <div v-bind:class="{ hidden: openTab !== 2, block: openTab === 2 }">
                  <p>
                    <CardComponent />
                  </p>
                </div>
                <div v-bind:class="{ hidden: openTab !== 3, block: openTab === 3 }">
                  <p>
                    <ScheduleComponent />
                  </p>
                </div>
                <div v-bind:class="{ hidden: openTab !== 4, block: openTab === 4 }">
                  <p>
                    <FixtureComponent />
                  </p>
                </div>
                <div v-bind:class="{ hidden: openTab !== 5, block: openTab === 5 }">
                  <p>
                    <PointsTable />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import FormComponent from '@/components/FormComponent.vue'
import ScheduleComponent from '@/components/ScheduleComponent.vue'
import PointsTable from '../components/PointsTable.vue'
import FixtureComponent from '../components/FixtureComponent.vue'
import CardComponent from '../components/CardComponent.vue'
import { useUserStore } from '@/stores/counter'

export default defineComponent({
  name: 'SlateTabs',
  setup() {
    const userStore = useUserStore()
    const openTab = ref(1)
    function toggleTabs(tabNumber: number) {
      openTab.value = tabNumber
    }
    return {
      openTab,
      toggleTabs
    }
  },
  components: { FormComponent, ScheduleComponent, PointsTable, FixtureComponent, CardComponent }
})
</script>
