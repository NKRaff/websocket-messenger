export interface Controller<Output> {
  handle(input: unknown): Promise<Output> 
}