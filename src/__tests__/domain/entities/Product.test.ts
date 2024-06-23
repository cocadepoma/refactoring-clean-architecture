import { Product } from "../../../domain/entities/Product";

describe('Tests on Product', () => {
  it('should create a product with status active is price is greater than 0', () => {
    const product = Product.create({
      id: 1,
      title: 'Product 1',
      image: 'image.jpg',
      price: '10.99',
    });

    expect(product.status).toBe('active');
  });

  it('should create a product with status inactive is price is greater equal to 0', () => {
    const product = Product.create({
      id: 1,
      title: 'Product 1',
      image: 'image.jpg',
      price: '0',
    });

    expect(product.status).toBe('inactive');
  });
});