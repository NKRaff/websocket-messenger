export interface TokenProvider {
  generate(payload: object): string;
  verify(token: string): object;
}