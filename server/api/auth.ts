export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        if (body && body.username) {
            const session = await setUserSession(event, { user: { username: body.username }, loggedIn: true })
            return session
        }
    } catch (error) {
        return error
    }
})