<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/stores/user.ts'
import AppHeader from '@/components/AppHeader.vue'

const userStore = useUserStore()

const isLoading = ref<boolean>(true)

onMounted(() => {
    onAuthStateChanged(getAuth(), (user) => {
        if (user) {
            userStore.userId = user.uid
        } else {
            userStore.userId = ''
        }
        isLoading.value = false
    })
})
</script>

<template>
    <div class="container">
        <app-progress v-if="isLoading" class="m-auto" />

        <div v-else>
            <app-header />
            <div class="content">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style>
.container {
    max-width: 920px;
    margin: auto;
}

.content {
    margin: 40px 0;
    padding: 40px 30px;
    background-color: #252b36;
    border-radius: 10px;
}
</style>
