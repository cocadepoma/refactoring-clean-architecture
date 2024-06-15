import { Product } from "./Product";
import { ProductRepository } from "./ProductRepository";

export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.getAll();
  }
}