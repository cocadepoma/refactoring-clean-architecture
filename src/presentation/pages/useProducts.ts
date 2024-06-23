import { useCallback, useEffect, useState } from "react";

import { useReload } from "../hooks/useReload";
import { useAppContext } from "../context/useAppContext";

import { Product, ProductData, ProductStatus } from "../../domain/entities/Product";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { GetProductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { ResourceNotFoundError } from "../../domain/ProductRepository";
import { Price, ValidationError } from "../../domain/value-objects/Price";

export type ProductViewModel = ProductData & { status: ProductStatus };

export const useProducts = (
  getProductUseCase: GetProductsUseCase,
  getProductById: GetProductByIdUseCase,
) => {
  const { currentUser } = useAppContext();

  const [reloadKey, reload] = useReload();
  const [products, setProducts] = useState<ProductViewModel[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(
    undefined
  );
  const [error, setError] = useState<string>();
  const [priceError, setPriceError] = useState<string | undefined>(undefined);

  useEffect(() => {
    getProductUseCase.execute().then((products) => {
      console.log("Reloading", reloadKey);
      setProducts(products.map(buildProductViewModel));
    });
  }, [reloadKey, getProductUseCase]);

  // TODO: Load product
  // TODO: User validation
  const updatingQuantity = useCallback(
    async (id: number) => {
      if (id >= 0) {
        if (!currentUser.isAdmin) {
          setError("Only admin users can edit the price of a product");
          return;
        }

        try {
          const product = await getProductById.execute(id);

          setEditingProduct(buildProductViewModel(product));
        } catch (error) {
          if(error instanceof ResourceNotFoundError) {
            setError(error.message);
          } else {
            setError("An error occurred while trying to load the product. Please try again later.");
          }
        }
      }
    },
    [currentUser]
  );

  function onChangePrice(price: string): void {
    if (!editingProduct) return;

    try {
      setEditingProduct({ ...editingProduct, price: price });
      Price.create(price);
      setPriceError(undefined);
    } catch (error) {
      if(error instanceof ValidationError) {
        setPriceError(error.message);
      } else {
        setPriceError("Unexpected error occurred. Please try again later.");
      }
    }
  }

  // TODO: Close dialog
  const cancelEditPrice = useCallback(() => {
    setEditingProduct(undefined);
  }, []);

  return { 
    products, 
    editingProduct,
    error,
    priceError,
    setEditingProduct,
    reload,
    updatingQuantity,
    cancelEditPrice,
    onChangePrice,
  };
}

function buildProductViewModel(product: Product): ProductViewModel {
  return {
    ...product,
    price: product.price.value.toFixed(2),
  };
}