import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const port = 3000

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe((command) => {
    console.log(`Emitting ${command.type}`)
    io.emit(command.type, command)
})

io.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`Player connected on Server with id: ${playerId}`)

    game.addPlayer({ playerId: playerId })

    io.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId })
        console.log(`Player disconnected: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })
})

server.listen( port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})