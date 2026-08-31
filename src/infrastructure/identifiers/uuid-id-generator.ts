import type { IdGenerator } from "@application/protocols/id-generator.js";
import { v7 } from "uuid";

export class UUIDIdGenerator implements IdGenerator {
  generate(): string {
    return v7()
  }
}