import type { LoginOutputDto } from "@application/dtos/login.dto.js";
import type { RegisterOutputDto } from "@application/dtos/register.dto.js";
import type { StartChatOutputDto } from "@application/dtos/start-chat.dto.js";
import type { Controller } from "@application/protocols/controller.js";
import { Router } from "express";
import { ChatRoutes } from "./chat.route.js";
import { UserRoute } from "./user.route.js";

export class Routes {
  private routes: Router

  constructor(
    private readonly registerController: Controller<RegisterOutputDto>,
    private readonly loginController: Controller<LoginOutputDto>,
    private readonly startChatController: Controller<StartChatOutputDto>
  ) {
    this.routes = Router()
    this.setupRoutes()
  }

  setupRoutes() {
    this.routes.get('/', (req, res) => {
      res.sendFile('login.html', { root: 'public' })
    })

    this.routes.use(
      '/chat', 
      new ChatRoutes(
        this.startChatController
      ).getRoutes()
    )
    
    this.routes.use(
      '/user',
      new UserRoute(
        this.registerController,
        this.loginController
      ).getRoutes()
    )
  }

  getRoutes() {
    return this.routes
  }
}