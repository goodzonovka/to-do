<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const toast = useToast()

const email = ref<string>('')
const password = ref<string>('')
const isLogin = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const router = useRouter()

const toggleAuth = () => (isLogin.value = !isLogin.value)

const subtitleText = computed<string>(() => {
    return isLogin.value ? "Don't have an account yet?" : 'Already have an account?'
})

const linkAccountText = computed<string>(() => {
    return isLogin.value ? 'Create now' : 'Log In'
})

const submitButtonText = computed<string>(() => {
    return isLogin.value ? 'Log In' : 'Sign Up'
})

const signUp = async (): Promise<void> => {
    isLoading.value = true
    try {
        await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        router.push('/')
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
            toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
        }
    } finally {
        isLoading.value = false
    }
}

const signIn = async (): Promise<void> => {
    isLoading.value = true
    try {
        await signInWithEmailAndPassword(getAuth(), email.value, password.value)
        router.push('/')
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
            toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
        }
    } finally {
        isLoading.value = false
    }
}

const submitForm = (): void => {
    if (isLogin.value) {
        signIn()
    } else {
        signUp()
    }
}

const disabledSubmitButton = computed<boolean>(() => {
    return !(email.value && password.value)
})
</script>

<template>
    <app-toast position="bottom-right" />

    <div class="wrapper">
        <div class="text-center mb-3">
            <h1 class="title">Welcome!</h1>
            <h3 class="subtitle">
                {{ subtitleText }}

                <button class="btn-link" @click="toggleAuth">
                    {{ linkAccountText }}
                </button>
            </h3>
        </div>

        <form @submit.prevent="submitForm">
            <div class="form__group">
                <input type="email" class="form__input" autocomplete="off" v-model="email" placeholder="Email" />
            </div>

            <div class="form__group">
                <input type="password" class="form__input" autocomplete="off" v-model="password"
                       placeholder="Password" />
            </div>

            <button class="form__btn" :disabled="disabledSubmitButton">
                <span class="pi pi-user"></span>
                <span>{{ submitButtonText }}</span>
            </button>
        </form>
    </div>
</template>

<style scoped>
.wrapper {
    width: 500px;
    margin: 0 auto;
}
</style>
