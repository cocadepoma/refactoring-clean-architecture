import { RemoteProduct, StoreApi } from "../data/api/StoreApi";
import { Product } from "./Product";

export class GetProductUseCase {
  constructor(private storeApi: StoreApi) {}

  async execute(): Promise<Product[]> {
    const remoteProducts = await this.storeApi.getAll();
    const products = remoteProducts.map(buildProduct);

    return products;
  }
}

export function buildProduct(remoteProduct: RemoteProduct): Product {
  return {
    id: remoteProduct.id,
    title: remoteProduct.title,
    image: remoteProduct.image,
    price: remoteProduct.price.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }),
  };
}