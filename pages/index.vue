<script setup lang="ts">

const username = ref<string>('')
const { fetch } = useUserSession()

const onLogin = async () => {
    if (username.value !== '' && username.value.length < 24) {
        const success = await $fetch('/api/auth', {
            method: "POST",
            body: {
                username: username.value
            }
        })

        await fetch()

        if (success) {
            await navigateTo('/chat')
        } else {
            useToast().add({ title: "Login Failed", description: "Failed to login, please try again", color: 'error' })
        }

    } else {
        useToast().add({ title: "Invalid username", description: "Please enter a valid username less than 24 characters", color: "error", icon: "material-symbols:warning" })
    }
}

</script>

<template>
    <div class="flex flex-col items-center justify-center h-dvh">
        <UCard class="w-min">
            <div class="flex flex-col gap-2 items-center justify-center">
                <h1 class="text-2xl text-nowrap mb-4 p-6">Chat @ loff.online!</h1>
                <p class="text-sm">Enter a username:</p>
                <UInput v-model="username" placeholder="username" @keyup.enter="onLogin"></UInput>
                <UButton label="Login" @click="onLogin"></UButton>
            </div>
        </UCard>
    </div>
</template>