export type LoginInputDto = {
  name: string,
  password: string
}

export type LoginOutputDto = {
  message: string,
  token: string
}