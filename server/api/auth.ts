export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (body && body.username) {
        const session = await setUserSession(event, { user: { username: body.username }, loggedIn: true })
        return session
    }
    return null
})