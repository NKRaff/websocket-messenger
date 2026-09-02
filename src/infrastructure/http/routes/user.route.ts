import type { LoginOutputDto } from "@application/dtos/login.dto.js";
import type { RegisterOutputDto } from "@application/dtos/register.dto.js";
import type { Controller } from "@application/protocols/controller.js";
import { Router } from "express";
import { httpAuth } from "../middlewares/http-auth.js";

export class UserRoute {
  private routes: Router

  constructor(
    private readonly registerController: Controller<RegisterOutputDto>,
    private readonly loginController: Controller<LoginOutputDto>,
  ){
    this.routes = Router()
    this.setupRoutes()
  }

  private setupRoutes() {
    this.routes.get('/id', httpAuth, (req, res, next) => {
      try {
        const userId = req.user?.id
        return res.status(200).json({userId})
      } catch (error) {
        console.error(error)
        next(error)
      }
    })

    this.routes.post('/register', async (req, res, next) => {
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

    this.routes.post('/login', async (req, res, next) => {
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

    this.routes.get('/logout', httpAuth, (req, res, next) => {
      try {
        return res
          .clearCookie("access_token")
          .status(300)
          .redirect('/')
      } catch (error) {
        next(error)
      }
    })
  }

  getRoutes() {
    return this.routes
  }

}