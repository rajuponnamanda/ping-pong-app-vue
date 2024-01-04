<template>
  <div>
    <select name="Languages" selectedid="languages"  v-model="$i18n.locale" class="select  w-10 text-black text-center  rounded-md text-xs h-4" >
      
      <option v-for="(locale, index) in locales" :key="`locale-${index}`" :value="locale" >
           {{ locale }}
        </option>
      </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const locales = ref(['En', 'Du']);

</script>