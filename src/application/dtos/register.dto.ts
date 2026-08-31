export type RegisterInputDto = {
  name: string,
  password: string
}

export type RegisterOutputDto = {
  message: string,
  token: string
}