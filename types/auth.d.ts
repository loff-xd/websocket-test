declare module '#auth-utils' {
    interface User {
        username: string
    }

    interface UserSession {
        loggedIn: boolean
    }
}

export { }