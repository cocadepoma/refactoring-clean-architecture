import { ProductApiRepository } from "./data/ProductApiRepository";
import { StoreApi } from "./data/api/StoreApi";
import { GetProductByIdUseCase } from "./domain/GetProductByIdUseCase";
import { GetProductsUseCase } from "./domain/GetProductsUseCase";

export class CompositionRoot {
  private constructor() {}

  private static instance: CompositionRoot;
  private storeApi = new StoreApi();  
  private repository = new ProductApiRepository(this.storeApi);

  public static getInstance(): CompositionRoot {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new CompositionRoot();
    }

    return CompositionRoot.instance;
  }

  provideGetProductsUseCase(): GetProductsUseCase {
    return new GetProductsUseCase(this.repository);
  }

  provideGetProductByIdUseCase(): GetProductByIdUseCase {
    return new GetProductByIdUseCase(this.repository);
  }

  provideStoreApi(): StoreApi {
    return this.storeApi;
  }
}