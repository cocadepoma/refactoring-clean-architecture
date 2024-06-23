import { Entity } from "../common/Entity";
import { Price } from "../value-objects/Price";

export interface ProductData {
  id: number;
  title: string;
  image: string;
  price: string;
}

export type ProductEntityData = Omit<ProductData, "price"> & { 
  price: Price,
  status: ProductStatus,
};

export type ProductStatus = "active" | "inactive";

export class Product extends Entity {
  readonly title: string;
  readonly image: string;
  readonly price: Price;
  readonly status: ProductStatus;

  constructor(data: ProductEntityData) {
    super(data.id);
    this.title = data.title;
    this.image = data.image;
    this.price = data.price;
    this.status = data.status;
  }

  static create(data: ProductData): Product {
    try {
      return this.validateAndCreate(data);
    } catch (error) {
      throw new Error("An error occurred while trying to create a product");
    }
  }

  private static validateAndCreate(data: ProductData): Product {
    const price = Price.create(data.price);

    return new Product({
      ...data,
      price: price,
      status: +data.price === 0 ? "inactive" : "active",
    });
  }

  editPrice(price: string): Product {
    return Product.validateAndCreate({
      ...this,
      price,
    });
  }
}