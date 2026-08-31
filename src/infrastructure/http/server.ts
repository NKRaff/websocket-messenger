import { env } from "@infrastructure/config/env.js"
import cookieParser from "cookie-parser"
import express, { Router, type Express } from "express"
import http from "http"
import { Server } from "socket.io"
import { SocketHandle } from "./handles/socket-handle.js"
import { errorHandler } from "./middlewares/error-handle.js"
import { socketAuth } from "./middlewares/socket-auth.js"

export class HttpServer {
  private app: Express
  private server: http.Server
  private io: Server

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)
    this.io = new Server(this.server)
  }

  start(routes: Router) {
    this.app.use(express.static("public"))
    this.app.use(express.json())
    this.app.use(cookieParser())

    this.app.use(routes)
    this.app.use(errorHandler)

    this.io.use(socketAuth)

    this.listenHttpServer()
    this.listenSocketServer()
  }

  private listenHttpServer() {
    this.server.listen(env.httpPort, () => {
      console.log(`Http server is running on port ${env.httpPort}`)
    })
  }

  private listenSocketServer() {
    new SocketHandle(this.io).listen()
  }
}