var connectedPeers: any[] = []
const subscribe = (peer: any) => connectedPeers.push(peer)
const broadcast = (message: string) => connectedPeers.forEach(peer => peer.send(message))

export default defineWebSocketHandler({
    open(peer) {
        subscribe(peer)
    },

    message(peer, message) {
        broadcast(message.json())
    },

    close(peer, event) {
        connectedPeers.splice(connectedPeers.indexOf(peer), 1)
    },

    error(peer, error) {
        console.log("[ws] error", peer, error)
    },
})