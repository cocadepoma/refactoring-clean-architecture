import { ProductRepository } from "./ProductRepository";
import { Product } from "./entities/Product";

export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.getAll();
  }
}