import { ProductRepository } from "./ProductRepository";
import { Product } from "./entities/Product";

export class GetProductByIdUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: number): Promise<Product> {
    return this.productRepository.getById(id);
  }
}