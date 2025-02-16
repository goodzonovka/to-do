<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useUserStore } from '@/stores/user.ts'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

interface IMenuItem {
    label: string
    icon: string
    path: string
    show: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
    {
        label: 'Authorization',
        icon: 'pi pi-user',
        path: '/auth',
        show: computed((): boolean => !userStore.userId),
    },
    {
        label: 'Add task',
        icon: 'pi pi-plus',
        path: '/',
        show: computed((): boolean => !!userStore.userId),
    },
    {
        label: 'Tasks',
        icon: 'pi pi-list',
        path: '/list',
        show: computed((): boolean => !!userStore.userId),
    },
])

const signOutMethod = async (): Promise<void> => {
    await signOut(getAuth())
    router.push('/auth')
}
</script>

<template>
    <div class="header">
        <ul>
            <li v-for="item in items" :key="item.label" v-show="item.show">
                <router-link :to="item.path">
                    <span :class="item.icon"></span>
                    <span>{{ item.label }}</span>
                </router-link>
            </li>
        </ul>

        <button v-if="userStore.userId" class="btn-link" @click="signOutMethod">
            <span class="pi pi-sign-out"></span>
            <span>Log out</span>
        </button>
    </div>
</template>

<style scoped>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 63px;
        margin-top: 40px;
        padding: 12px 30px;
        background: #252b36;
        border-radius: 10px;
    }
    ul {
        display: flex;
        align-items: center;
        column-gap: 40px;
    }
    a, button {
        display: flex;
        align-items: center;
        column-gap: 12px;
        font-size: 18px;
    }
    button {
        width: auto;
        padding: 10px 16px;
    }
</style>
