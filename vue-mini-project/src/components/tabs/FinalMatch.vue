<template>
    <div class="flex justify-center">
        <div class="mt-5">
            <div class="overflow-x-auto">
                <div class="last:mr-0 pb-2 flex-auto text-center cursor-pointer">
                    <button @click="generateFinalSchedule"
                        class="bg-slate-400 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
                        {{ $t("generate final schedule") }}
                    </button>
                </div>
                <table class="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
              <th class="px-4 py-2 border-b uppercase">{{ $t("player 1") }}</th>
              <th class="px-4 py-2 border-b uppercase">{{ $t("player 2") }}</th>
              <th class="px-4 py-2 border-b uppercase">{{ $t("match id") }}</th>
              <th class="px-4 py-2 border-b uppercase">{{ $t("player one group") }}</th>
              <th class="px-4 py-2 border-b uppercase">{{ $t("player two group") }}</th>
              <th class="px-4 py-2 border-b uppercase">{{ $t("winner") }}</th>
              <th scope="col" class="px-6 py-4 border-b uppercase">{{ $t("score 1") }}</th>
              <th scope="col" class="px-6 py-4 border-b uppercase">{{ $t("score 2") }}</th>
              <th scope="col" class="px-6 py-4 border-b uppercase">{{ $t("action") }}</th>
            </tr>
                    </thead>
                    <tbody>
                        <template v-for="match in displayedMatches" :key="match.matchId">
                            <tr>
                                <td class="px-4 py-2 border-b">{{ match.player_1_Name }}</td>
                                <td class="px-4 py-2 border-b">{{ match.player_2_Name }}</td>
                                <td class="px-4 py-2 border-b">{{ match.matchId }}</td>
                                <td class="px-4 py-2 border-b">{{ match.player_1_GroupName }}</td>
                                <td class="px-4 py-2 border-b">{{ match.player_2_GroupName }}</td>
                                <td class="px-4 py-2 border-b">{{ match.winner }}</td>
                                <td class="whitespace-nowrap px-6 py-4 border-b">
                                    <input class="border border-gray-300 rounded p-1" v-model="match.scoreofPlayer_1" />
                                </td>
                                <td class="whitespace-nowrap px-6 py-4 border-b">
                                    <input class="border border-gray-300 rounded p-1" v-model="match.scoreofPlayer_2" />
                                </td>
                                <td class="px-6 py-4 border-b">
                                    <button @click="saveMatch(match)"
                                        class="bg bg-slate-500 rounded px-2 text-white hover:bg-slate-700">
                                        Save
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>
  


<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toastification";
import axiosInstance from '../../stores/auth.store'

interface Match {
    id: number,
    matchId: number,
    player_1Id: number,
    player_1_Name: string,
    scoreofPlayer_1: number,
    player_1_GroupName: string,
    player_2Id: number,
    player_2_Name: string,
    scoreofPlayer_2: number,
    player_2_GroupName: string,
    winner: string

}

const matches = ref<Match[]>([]);
const currentPage = ref(1);
const itemsPerPage = 6;
const toast = useToast();
async function generateFinalSchedule() {
    try {
        const response = await axiosInstance.post(
            "/Knockout/GeneratePreQuarters",
            {
                trigger: true,
            }
        );
        matches.value = response.data;
        toast.success("Schedule generated");
    } catch (error: any) {
        if (error.response && error.response.status === 409) {
            toast.error("Schedule has already been generated");
        } else if (error.response && error.response.status === 400) {
            toast.error("The previous round has not ended");
        }
    }
}
const fetchKnockoutMatches = async () => {
    try {
        const response = await axiosInstance.get(
            "/Knockout/GetAllKnockouts"
        );
        matches.value = response.data.result.filter((match: any) => {
            const matchId = parseInt(match.matchId);
            return matchId > 62;
        });
    } catch (error) {
        console.error("Failed to fetch matches");
    }
};

const saveMatch = async (match: Match) => {
    try {
        const matchData = {
            matchId: match.matchId,
            scoreOfPlayer_1: match.scoreofPlayer_1,
            scoreofPlayer_2: match.scoreofPlayer_2,
        };
        const response = await axiosInstance.put(
            "/Knockout/UpdateScores",
            matchData
        );
        toast.success("Saved successfully")
    } catch (error) {
        toast.error("Failed to save match");
    }
};

onMounted(fetchKnockoutMatches);
const displayedMatches = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return matches.value.slice(startIndex, endIndex);
});

</script>

