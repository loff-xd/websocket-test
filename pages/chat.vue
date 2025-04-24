<script setup lang="ts">
import { useWebSocket } from '@vueuse/core';

const inputText = ref<string>('')
const chatMessages = ref<any[]>([])
const username = useState<string | undefined>('username')
const toaster = useToast()

// Open socket
const { send, data, status, close } = useWebSocket('http://localhost:3000/api/socket', {
    autoReconnect: true
})

// Message Receipt
watch(data, () => {
    chatMessages.value.push(JSON.parse(data.value))
})

// Connection warning
let timeout: NodeJS.Timeout | null = null
watch(status, () => {

    if (status.value === 'CLOSED') {
        timeout = setTimeout(() => {
            if (!toaster.toasts.value.some(toast => toast.title === "Connection Error")) {
                toaster.add({
                    title: "Connection Error", description: "Unable to connect to server, attempting to reconnect...",
                    duration: 0, color: "error", icon: "material-symbols:warning"
                })
            }
        }, 5000)

    } else {
        toaster.clear()
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
    }
})

// Message send
const onSendEvent = () => {
    send(JSON.stringify({ user: username.value, message: inputText.value }))
    inputText.value = ''
}

// Exit
const onExit = async () => {
    close()
    username.value = undefined
    await navigateTo('/')
}

onMounted(() => {
    if (!username.value) {
        return navigateTo('/')
    }
    send(JSON.stringify({ user: username.value, message: '[Joined]' }))
})

</script>

<template>
    <div class="flex flex-col justify-end gap-4 h-svh p-6">
        <UCard>
            <div class="flex flex-row items-center justify-between">
                <p><b>Chatting as: </b>{{ username }}</p>
                <UButton label="Exit" @click="onExit" />
            </div>
        </UCard>
        <UCard class="grow flex flex-col justify-end">
            <TransitionGroup name="list" tag="div">
                <div v-for="message in chatMessages" :key="message" class="mt-1 text-wrap">
                    <p v-if="message.message !== '[Joined]'"><b>{{ message.user }}: </b>{{ message.message }}</p>
                    <p v-else><b>[{{ message.user }} has joined]</b></p>
                </div>
            </TransitionGroup>
        </UCard>
        <UCard>
            <div class="flex flex-row gap-2 items-center">
                <UInput class="w-full" v-model="inputText" :placeholder="`${username} says...`"
                    @keyup.enter="onSendEvent" />
                <UButton label="Send" @click="onSendEvent" />
            </div>
        </UCard>
    </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-12px);
}
</style>