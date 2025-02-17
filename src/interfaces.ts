import type { Timestamp } from 'firebase/firestore'

export interface ITask {
    id: string
    title: string
    text: string
    time: string
    status: 'Completed' | 'Not Completed'
    createdAt: Timestamp
}
