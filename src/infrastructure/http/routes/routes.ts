import type { LoginOutputDto } from "@application/dtos/login.dto.js";
import type { RegisterOutputDto } from "@application/dtos/register.dto.js";
import type { Controller } from "@application/protocols/controller.js";
import { Router } from "express";

export class Routes {
  private routes: Router

  constructor(
    private readonly registerController: Controller<RegisterOutputDto>,
    private readonly loginController: Controller<LoginOutputDto>
  ) {
    this.routes = Router()
    this.setupRoutes()
  }

  setupRoutes() {
    this.routes.get('/', (req, res) => {
      res.sendFile('login.html', { root: 'public' })
    })

    this.routes.get('/chat', (req, res) => {
      try {
        res.sendFile('chat.html', { root: 'public' })
      } catch (error) {
        console.error(error)
      }
    })
    
    this.routes.post('/user/register', async (req, res, next) => {
      try {
        const result = await this.registerController.handle(req.body)
        return res
          .status(201)
          .cookie("access_token", result.token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
          })
          .json(result.message)
      } catch (error) {
        next(error)
      }
    })

    this.routes.post('/user/login', async (req, res, next) => {
      try {
        const result = await this.loginController.handle(req.body)
        return res
          .status(200)
          .cookie("access_token", result.token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
          })
          .json(result.message)
      } catch (error) {
        next(error)
      }
    })
  }

  getRoutes() {
    return this.routes
  }
}