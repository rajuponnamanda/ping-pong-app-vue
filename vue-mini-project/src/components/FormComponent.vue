<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div v-if="!isRegistered">
    <form @submit.prevent="submitForm">
      <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
          <h2 class="block uppercase tracking-wide text-gray-700 text-base text-center top-0 font-bold mb-2">
          {{ $t("registertoplay") }}
          </h2>
          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="first-name"
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t("name") }}</label>
              <div class="mt-2">
                <input type="text" name="first-name" id="first-name" autocomplete="given-name" v-model="formData.name"
                  :class="{ 'border-red-500': !isNameValid && isNameTouched }" @blur="isNameTouched = true"
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                <p v-if="!isNameValid && isNameTouched" class="text-red-500 text-xs">
                  Please enter a valid name
                </p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="last-name" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                {{ $t("nickName") }}</label>
              <div class="mt-2">
                <input type="text" name="last-name" id="last-name" autocomplete="family-name" v-model="formData.nickName"
                  :class="{ 'border-red-500': !isNickNameValid && isNickNameTouched }" @blur="isNickNameTouched = true"
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                <p v-if="!isNickNameValid && isNickNameTouched" class="text-red-500 text-xs">
                  Please enter a valid nickname
                </p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="email" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t("emailAddress") }}</label>
              <div class="mt-2">
                <input id="email" name="email" type="email" autocomplete="email" v-model="formData.email"
                  :class="{ 'border-red-500': !isEmailValid && isEmailTouched }" @blur="isEmailTouched = true"
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  disabled />
                <p v-if="!isEmailValid && isEmailTouched" class="text-red-500 text-xs">
                  Please enter a valid email address
                </p>
              </div>
            </div>
            <div class="sm:col-span-3">
              <label for="dateofborth" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t("dateOfBirth") }}</label>
              <div class="mt-2">
                <input id="dob" name="dob" type="date" autocomplete="dob" v-model="formData.dateOfBirth"
                  :class="{ 'border-red-500': !isDateOfBirthValid && isDateOfBirthTouched }"
                  @blur="isDateOfBirthTouched = true"
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  :max="getTodayDate()" />
                <p v-if="!isDateOfBirthValid && isDateOfBirthTouched" class="text-red-500 text-xs">
                  Please enter a valid date of birth
                </p>
              </div>
            </div>
            <div>
              <label for="gender"
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t("gender") }}</label>
              <div class="mt-2">
                <ul
                  class="items-center w-full text-sm font-medium text-gray-900 bg-white sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <li class="w-full">
                    <div class="flex items-center pl-3">
                      <input id="horizontal-list-radio-license" type="radio" value="male" name="list-radio"
                        v-model="formData.gender" :class="{ 'border-red-500': showGenderError }" @blur="validateGender"
                        class="my-auto transform scale-125" />
                      <label for="horizontal-list-radio-license"
                        class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t("male") }}</label>
                    </div>
                  </li>
                  <li class="w-full border-gray-200 sm:border-b-0 dark:border-gray-600">
                    <div class="flex items-center pl-3">
                      <input id="horizontal-list-radio-id" type="radio" value="female" name="list-radio"
                        v-model="formData.gender" :class="{ 'border-red-500': showGenderError }" @blur="validateGender"
                        class="my-auto transform scale-125" />
                      <label for="horizontal-list-radio-id"
                        class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t("female") }}</label>
                    </div>
                  </li>
                </ul>
                <p v-if="showGenderError" class="text-red-500 text-xs">Please select your gender</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 flex items-center justify-center gap-x-6">
          <button type="button" class="text-sm font-semibold leading-6 text-gray-900" @click="cancelRegistration">
            {{ $t("cancle") }}
          </button>
          <button type="submit" id="submit-button" :disabled="!isNameValid ||
            !isNickNameValid ||
            !isEmailValid ||
            !isDateOfBirthValid ||
            formData.gender === '' ||
            showGenderError ||
            isRegistered
            "
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
           {{ $t("submit") }}
          </button>
        </div>
      </div>
    </form>
  </div>
  <div v-else
    class="grid justify-center h-[400px] p-12 text-black bg-white border-lg border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer">
    <div>
      <h2 class="uppercase tracking-wide text-gray-700 text-base top-0 font-bold">
        You have already registered
      </h2>
      <img src="\src\assets\registered.png" class="h-24 ml-24 mt-10" alt="Logo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axiosInstance from '@/stores/auth.store'
import { useToast } from 'vue-toastification'
import { myMSALObj } from '@/stores/auth.store'

const isNameTouched = ref(false)
const isNickNameTouched = ref(false)
const isEmailTouched = ref(false)
const isDateOfBirthTouched = ref(false)

const formData = ref({
  name: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  nickName: ''
})
const isNameValid = computed(() => /^[a-zA-Z' ']+$/.test(formData.value.name))
const isNickNameValid = computed(() => /^[a-zA-Z]+$/.test(formData.value.nickName))
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email))
const isDateOfBirthValid = computed(() => formData.value.dateOfBirth !== '' && formData.value.dateOfBirth <= getTodayDate())
const showGenderError = ref(false)
const isFormValid = computed(() => isNameValid.value && isNickNameValid.value && isEmailValid.value && isDateOfBirthValid.value && !showGenderError.value)

function getTodayDate() {
  const today = new Date()
  const day = today.getDate().toString().padStart(2, '0')
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const year = today.getFullYear()
  return `${year}-${month}-${day}`
}

const validateGender = () => {
  if (formData.value.gender === '') {
    showGenderError.value = true
  } else {
    showGenderError.value = false
  }
}

const isAuthenticated = myMSALObj.getAllAccounts().length > 0
const email = isAuthenticated ? myMSALObj.getAllAccounts()[0].username : ''
formData.value.email = email
const isRegistered = ref(false)
const toast = useToast()


async function submitForm() {
  try {
    const { name, email, dateOfBirth, gender, nickName } = formData.value

    // Check if the email address already exists
    const data = { name, email, dateOfBirth, gender, nickName }
    const response = await axiosInstance.post('/Player/PlayerRegistration', data)
    toast.success('Registration successful!')
    // Store the form data in browser storage
    sessionStorage.setItem('formData', JSON.stringify(data))
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      const { data } = error.response
      if (data && data.CustomError) {
        const errorMessages = data.CustomError
        if (errorMessages.includes('Sorry!, Registration is Closed')) {
          toast.error('Sorry!, Registration is Closed')
        } else if (errorMessages.includes('You have already registered!')) {
          toast.error('You have already registered!')
        } else {
          toast.error('Registration failed')
        }
      } else {
        toast.error('Registration failed')
      }
    } else if (error.response && error.response.status === 409) {
      toast.error('You have already registered')
    } else {
      toast.error('Registration failed')
    }
  }
}

// Load the form data from browser storage when the page is loaded or refreshed
window.addEventListener('load', function () {
  const storedData = localStorage.getItem('formData')
  if (storedData) {
    try {
      const data = JSON.parse(storedData)
      formData.value = data
    } catch (error) {
      console.error('Failed to load stored form data:', error)
    }
  }
})

function cancelRegistration() {
  formData.value = {
    name: '',
    email: email,
    dateOfBirth: '',
    gender: '',
    nickName: ''
  }
  isNameTouched.value = false
  isNickNameTouched.value = false
  isEmailTouched.value = false
  isDateOfBirthTouched.value = false
  showGenderError.value = false
}
</script>

<style scoped>
#submit-button:disabled {
  background-color: gray;
  color: white;
  cursor: not-allowed;
}
</style>
