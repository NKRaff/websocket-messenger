import type { LoadMessageOutputDto } from "@application/dtos/load-message.dto.js";
import type { StartChatOutputDto } from "@application/dtos/start-chat.dto.js";
import type { Controller } from "@application/protocols/controller.js";
import { Router } from "express";
import { httpAuth } from "../middlewares/http-auth.js";

export class ChatRoutes {
  private routes: Router

  constructor(
    private readonly startChatController: Controller<StartChatOutputDto>,
    private readonly loadMessageController: Controller<LoadMessageOutputDto>
  ) {
    this.routes = Router()
    this.setupRoutes()
  }

  private setupRoutes() {
    this.routes.get('/', (req, res) => {
      try {
        res.sendFile('chat.html', { root: 'public' })
      } catch (error) {
        console.error(error)
      }
    })

    this.routes.post('/create', httpAuth, async (req, res, next) => {
      try {
        const seekerId = req.user?.id
        const result = await this.startChatController.handle({seekerId, ...req.body})
        return res
          .status(201)
          .json(result)
      } catch (error) {
        next(error)
      }
    })

    this.routes.get('/load-messages', httpAuth, async (req, res, next) => {
      try {
        const userId = req.user?.id
        const result = await this.loadMessageController.handle({userId})
        return res
          .status(200)
          .json(result)
      } catch (error) {
        next(error)
      }
    })
  }

  getRoutes(): Router {
    return this.routes
  }


}