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

  it('should edit a Product and assign status active if the price es greather than 0', () => {
    const product = Product.create({
      id: 1,
      title: 'Product 1',
      image: 'image.jpg',
      price: '0',
    });

    expect(product.status).toBe('inactive');

    const editedProduct = product.editPrice('10.99');

    expect(editedProduct.status).toBe('active');
    expect(editedProduct.price.value).toBe(10.99);
    
  });

  it('should edit a Product and assign status inactive if the price is 0', () => {
    const product = Product.create({
      id: 1,
      title: 'Product 1',
      image: 'image.jpg',
      price: '10.99',
    });

    expect(product.status).toBe('active');

    const editedProduct = product.editPrice('0');

    expect(editedProduct.status).toBe('inactive');
    expect(editedProduct.price.value).toBe(0);
  });
});