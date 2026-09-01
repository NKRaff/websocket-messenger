import { LoginUseCase } from "@application/use-cases/login.use-case.js";
import { RegisterUseCase } from "@application/use-cases/register.use-case.js";
import { SendMessageUseCase } from "@application/use-cases/send-message.use-case.js";
import { StartChatUseCase } from "@application/use-cases/start-chat.use-case.js";
import { initializeDatabase } from "@infrastructure/database/database.js";
import { ChatRepositorySequelize } from "@infrastructure/database/repositories/chat.repository.js";
import { MessageRepositorySequelize } from "@infrastructure/database/repositories/message.repository.js";
import { UserRepositorySerquelize } from "@infrastructure/database/repositories/user.repository.js";
import { Routes } from "@infrastructure/http/routes/routes.js";
import { HttpServer } from "@infrastructure/http/server.js";
import { UUIDIdGenerator } from "@infrastructure/identifiers/uuid-id-generator.js";
import { BcryptPasswordHasher } from "@infrastructure/security/bcrypt-password-hasher.js";
import { JwtTokenProvider } from "@infrastructure/security/jwt-token-provider.js";
import { LoginController } from "@presentation/controllers/login.controller.js";
import { RegisterController } from "@presentation/controllers/register.controller.js";
import { SendMessageController } from "@presentation/controllers/send-message.schema.js";
import { StartChatController } from "@presentation/controllers/start-chat.controller.js";

await initializeDatabase()

const idGenerator = new UUIDIdGenerator()
const passwordHasher = new BcryptPasswordHasher()
const tokenProvider = new JwtTokenProvider()

const userRepo = new UserRepositorySerquelize()
const chatRepo = new ChatRepositorySequelize()
const messageRepo = new MessageRepositorySequelize()

const loginUseCase = new LoginUseCase(userRepo, passwordHasher, tokenProvider)
const registerUseCase = new RegisterUseCase(userRepo, idGenerator, passwordHasher, tokenProvider)
const startChatUseCase = new StartChatUseCase(userRepo, chatRepo, idGenerator)
const sendMessageUseCase = new SendMessageUseCase(messageRepo, userRepo, idGenerator)

const loginController = new LoginController(loginUseCase)
const registerController = new RegisterController(registerUseCase)
const startChatController = new StartChatController(startChatUseCase)
const sendMessageController = new SendMessageController(sendMessageUseCase)

const routes = new Routes(registerController, loginController, startChatController).getRoutes()
const server = new HttpServer()
server.start(routes)
server.listenHttpServer()
server.listenSocketServer(sendMessageController)
