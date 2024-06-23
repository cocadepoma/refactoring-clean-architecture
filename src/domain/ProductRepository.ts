import { Product } from "./entities/Product";

export class ResourceNotFoundError extends Error { }

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product>;
  save(product: Product): Promise<void>;
}