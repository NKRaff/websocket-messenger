export class User {
  constructor(
    private id: string,
    private name: string,
    private password: string,
  ) {}

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getPassword(): string {
    return this.password
  }
}