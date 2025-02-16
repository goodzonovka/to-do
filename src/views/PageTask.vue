<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { ITask } from '@/interfaces'

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const isLoading = ref<boolean>(true)
const task = ref<ITask>()

const docref = doc(db, `users/${userStore.userId}/tasks`, route.params.id as string)

const getData = async (): Promise<void> => {
    isLoading.value = true
    const docSnap = await getDoc(docref)

    if (docSnap.exists()) {
        const data = docSnap.data() as ITask
        task.value = data
    }

    isLoading.value = false
    console.log(task.value)

}

const saveTask = async (): Promise<void> => {
    isLoading.value = true
    await updateDoc(docref, { ...task.value })
    await getData()

    router.push('/list')
}

onMounted(async () => await getData())
</script>

<template>
    <app-progress v-if="isLoading" />
    <template v-else-if="task?.id && !isLoading">
        <h1>Editing a task</h1>
        <div class="form__group">
            <input type="text" class="form__input" v-model="task.title" placeholder="Title" />
        </div>

        <div class="form__group">
            <textarea
                model="text"
                class="form__textarea"
                v-model="task.text"
                placeholder="Description"
            ></textarea>
        </div>

        <div class="form__group">
            <input type="text" class="form__input" v-model="task.time" placeholder="Time for task" />
        </div>

        <div class="form__group flex column-gap-4">
            <div class="flex align-items-center column-gap-2">
                <app-radio inputId="taskCompleted1" name="completed" value="Not Completed"
                           v-model="task.status" />
                <label for="taskCompleted1">Not Completed</label>
            </div>
            <div class="flex align-items-center column-gap-2">
                <app-radio inputId="taskCompleted2" name="completed" value="Completed"
                           v-model="task.status" />
                <label for="taskCompleted2">Completed</label>
            </div>
        </div>

        <button
            @click="saveTask"
            class="form__btn"
        >
            Save task
        </button>
    </template>
</template>
