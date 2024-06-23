import { Price } from "../../../domain/value-objects/Price";

describe('Tests on Price', () => {
  it('should create a price if validations are ok', () => {
    const price = Price.create('10.99');

    expect(price.value).toBe(10.99);
  });

  it('should create a price if validations are ok 2', () => {
    // @ts-ignore
    const price = Price.create(10.99);

    expect(price.value).toBe(10.99);
  });

  it('should throw an error if the value is not a number', () => {
    // @ts-ignore
    expect(() => Price.create('213123dsdsdasfgbdfb')).toThrowError('Only numbers are allowed');
  });

  it('should throw an error if the value is not a valid price', () => {
    expect(() => Price.create('10.999')).toThrowError('Invalid price format');
  });

  it('should throw an error if the value is greater than 999.99', () => {
    expect(() => Price.create('1000')).toThrowError('The max possible price is 999.99');
  });

  it('should throw an error if the value is negative', () => {
    expect(() => Price.create('-10')).toThrowError('Invalid price format');
  });
});