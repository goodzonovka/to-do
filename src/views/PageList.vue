<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
    getFirestore,
    collection,
    query,
    orderBy,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { ITask } from '@/interfaces'
import { useConfirm } from 'primevue/useconfirm'

const userStore = useUserStore()
const db = getFirestore()
const confirm = useConfirm()

const tasks = ref<ITask[]>([])
const isLoading = ref<boolean>(true)

const getAllTasks = async <T extends ITask>(): Promise<T[]> => {
    const getData = query(
        collection(db, `users/${userStore.userId}/tasks`),
        orderBy('createdAt', 'desc'),
    )

    const listDocs = await getDocs(getData)

    return listDocs.docs.map((doc) => doc.data() as T)
}

const confirmRemoveTask = async (id: string): Promise<void> => {
    confirm.require({
        message: 'Do you want to delete the task?',
        header: 'Deleting a task',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: async () => {
            isLoading.value = true
            await deleteDoc(doc(db, `users/${userStore.userId}/tasks`, id))
            const listTasks: Array<ITask> = await getAllTasks()
            tasks.value = [...listTasks]
            isLoading.value = false
        },
    })
}

const formatDate = (seconds: number): string => {
    const date = new Date(seconds * 1000)
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const changeStatus = async (task: ITask): Promise<void> => {
    isLoading.value = true

    try {
        const newStatus = task.status === 'Not Completed' ? 'Completed' : 'Not Completed'

        // Ссылка на документ в Firestore
        const taskRef = doc(db, `users/${userStore.userId}/tasks`, task.id)

        // Обновляем статус
        await updateDoc(taskRef, {status: newStatus })

        // Обновляем локальный список
        task.status = newStatus
    } catch (error) {
        console.error('Ошибка при обновлении статуса:', error)
    } finally {
        isLoading.value = false
    }
}

// Разделение задач на завершённые и незавершённые
const notCompletedTasks = computed(() =>
    tasks.value.filter((task) => task.status === 'Not Completed'),
)
const completedTasks = computed(() => tasks.value.filter((task) => task.status === 'Completed'))

onMounted(async () => {
    const listTasks: Array<ITask> = await getAllTasks()
    tasks.value = [...listTasks]

    isLoading.value = false
})
</script>

<template>
    <app-dialog />

    <app-progress v-if="isLoading" />

    <div class="inline-block" v-else-if="!isLoading && !tasks.length">No tasks added</div>

    <template v-else>
        <h2 class="mb-4" v-if="notCompletedTasks.length">Tasks</h2>

        <ul class="list" v-if="notCompletedTasks.length">
            <li class="item" v-for="(task, index) in notCompletedTasks" :key="task.id">
                <div class="item__header">
                    <div class="item__title" @click="changeStatus(task)">{{index + 1}}. {{ task.title }}</div>

                    <div class="item__buttons">
                        <router-link :to="`/task/${task.id}`">
                            <app-button icon="pi pi-pencil" severity="info"></app-button>
                        </router-link>
                        <app-button
                            icon="pi pi-trash"
                            severity="danger"
                            @click="confirmRemoveTask(task.id)"
                        ></app-button>
                    </div>
                </div>
                <div class="item__body">
                    {{ task.text }}
                </div>

                <div class="item__time">
                    {{ formatDate(task.createdAt.seconds)}}
                </div>
            </li>
        </ul>

        <h2 class="mb-4 text-teal-500" :class="notCompletedTasks.length && 'mt-6'" v-if="completedTasks.length">Completed tasks</h2>

        <ul class="list" v-if="completedTasks.length">
            <li class="item" v-for="(task, index) in completedTasks" :key="task.id">
                <div class="item__header">
                    <div class="item__title" @click="changeStatus(task)">{{index + 1}}. {{ task.title }}</div>

                    <div class="item__buttons">
                        <router-link :to="`/task/${task.id}`">
                            <app-button icon="pi pi-pencil" severity="info"></app-button>
                        </router-link>
                        <app-button
                            icon="pi pi-trash"
                            severity="danger"
                            @click="confirmRemoveTask(task.id)"
                        ></app-button>
                    </div>
                </div>
                <div class="item__body">
                    {{ task.text }}
                </div>

                <div class="item__time">
                    {{ formatDate(task.createdAt.seconds)}}
                </div>
            </li>
        </ul>
    </template>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    row-gap: 30px;
}

.item {
    background-color: #1b1f28;
    border-radius: 10px;
}

.item__header {
    display: flex;
    align-items: center;
    column-gap: 20px;
    padding: 12px 20px;
}

.item__title {
    flex-grow: 1;
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    &:hover {
        color: lightgreen;
    }
}

.item__buttons {
    display: flex;
    column-gap: 12px;
}

.item__body {
    padding: 24px 20px;
    color: #d9c9c9;
    border-top: 1px solid #252b36;
}

.item__time {
    padding: 16px 20px;
    color: #36741e;
    border-top: 1px solid #252b36;
}
</style>
