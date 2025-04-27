<script setup lang="ts">
import { useWebSocket } from '@vueuse/core';

const inputText = ref<string>('')
const chatMessages = ref<any[]>([])
const { user, clear } = useUserSession()
const toaster = useToast()

// Open socket
const url = useRequestURL()
const { send, data, status, close } = useWebSocket(`${url.origin}/api/socket`, {
    autoReconnect: true
})

// Message Receipt
watch(data, () => {
    chatMessages.value.push(JSON.parse(data.value))
})

// Connection warning
let timeout: NodeJS.Timeout | null = null
watch(status, () => {
    console.log(status.value)
    if (status.value === 'CLOSED' && !timeout) {
        timeout = setTimeout(() => {
            if (!toaster.toasts.value.some(toast => toast.title === "Connection Error")) {
                toaster.add({
                    title: "Connection Error", description: "Unable to connect to server, attempting to reconnect...",
                    duration: 0, color: "error", icon: "material-symbols:warning"
                })
            }
        }, 5000)

    } else if (status.value === 'OPEN') {
        toaster.clear()
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
    }
})

// Message send
const onSendEvent = () => {
    send(JSON.stringify({ user: user.value?.username, message: inputText.value }))
    inputText.value = ''
}

// Exit
const onExit = async () => {
    close()
    timeout ? clearTimeout(timeout) : null
    timeout = null
    await clear()
    await navigateTo('/')
}

onMounted(() => {
    //send(JSON.stringify({ user: user.value?.username, message: '[Joined]' }))
})

</script>

<template>
    <div class="flex flex-col justify-end gap-4 h-dvh p-6">
        <UCard>
            <div class="flex flex-row items-center justify-between">
                <AuthState v-slot="{ loggedIn }">
                    <p v-if="loggedIn"><b>Chatting as: </b>{{ user!.username }}</p>
                </AuthState>
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
                <UTextarea class="w-full" v-model="inputText" :placeholder="`Chatting as ${user!.username}...`"
                    :rows="1" @keyup.enter="onSendEvent" />
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