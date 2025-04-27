export default defineNuxtRouteMiddleware(async (to, from) => {
    const { loggedIn } = useUserSession()
    if (!loggedIn.value && to.path !== '/') {
        return navigateTo('/')

    } else if (loggedIn.value && to.path !== '/chat') {
        return navigateTo('/chat')
    }

    return
})