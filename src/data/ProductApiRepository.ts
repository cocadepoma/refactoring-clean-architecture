import { ProductRepository, ResourceNotFoundError } from "../domain/ProductRepository";
import { Product } from "../domain/entities/Product";
import { RemoteProduct, StoreApi } from "./api/StoreApi";

export class ProductApiRepository implements ProductRepository { 
  constructor(private storeApi: StoreApi) {}
  
  async getById(id: number): Promise<Product> {
    try {
      const remoteProduct = await this.storeApi.get(id);
      return this.buildProduct(remoteProduct);
    } catch (error) {
      throw new ResourceNotFoundError(`Product with id ${id} not found`);
    }
  }

  async getAll(): Promise<Product[]> {
    const remoteProducts = await this.storeApi.getAll();
    return remoteProducts.map(this.buildProduct);
  }

  private buildProduct(remoteProduct: RemoteProduct): Product {
    return Product.create({
      id: remoteProduct.id,
      title: remoteProduct.title,
      image: remoteProduct.image,
      price: remoteProduct.price.toString(),
    });
  }
}