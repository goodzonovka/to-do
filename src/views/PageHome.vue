<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getFirestore, setDoc, doc, Timestamp } from 'firebase/firestore'
import type { ITask } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const db = getFirestore()
const router = useRouter()

const test;
const title = ref<string>('')
const text = ref<string>('')
const time = ref<string>('')
const status = ref<'Completed' | 'Not Completed'>('Not Completed')

const loading = ref<boolean>(false)

const addNewTask = async (): Promise<void> => {
    loading.value = true

    try {
        const payload: ITask = {
            id: uuidv4(),
            title: title.value,
            text: text.value,
            time: time.value,
            status: status.value,
            createdAt: Timestamp.now(),
        }

        if (!userStore.userId) {
            throw new Error('User not found')
        }

        // Сохранение данных в Firestore
        await setDoc(doc(db, `users/${userStore.userId}/tasks`, payload.id), payload)

        router.push('/list')
    } catch (error) {
        console.error('Ошибка при создании задачи:', error)
    } finally {
        loading.value = false
    }
}

const disabledSaveButton = computed<boolean>(() => {
    return !(title.value && text.value && time.value)
})
</script>

<template>
    <h1>New task</h1>
    <div class="form__group">
        <input type="text" class="form__input" v-model="title" placeholder="Title" />
    </div>

    <div class="form__group">
        <textarea model="text" class="form__textarea" v-model="text" placeholder="Description"></textarea>
    </div>

    <div class="form__group">
        <input type="text" class="form__input" v-model="time" placeholder="Time for task" />
    </div>

    <div class="form__group flex column-gap-4">
        <div class="flex align-items-center column-gap-2">
            <app-radio inputId="taskCompleted1" name="completed" value="Not Completed"
                       v-model="status" />
            <label for="taskCompleted1">Not Completed</label>
        </div>
        <div class="flex align-items-center column-gap-2">
            <app-radio inputId="taskCompleted2" name="completed" value="Completed"
                       v-model="status" />
            <label for="taskCompleted2">Completed</label>
        </div>
    </div>

    <button @click="addNewTask" class="form__btn" :disabled="disabledSaveButton" :loading="loading">
        Create task
    </button>
</template>
