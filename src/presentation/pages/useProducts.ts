import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { Product } from "../../domain/Product";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { useAppContext } from "../context/useAppContext";
import { GetProductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { ResourceNotFoundError } from "../../domain/ProductRepository";
import { Price, ValidationError } from "../../domain/value-objects/Price";

export const useProducts = (
  getProductUseCase: GetProductsUseCase,
  getProductById: GetProductByIdUseCase,
) => {
  const { currentUser } = useAppContext();

  const [reloadKey, reload] = useReload();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined
  );
  const [error, setError] = useState<string>();
  const [priceError, setPriceError] = useState<string | undefined>(undefined);

  useEffect(() => {
    getProductUseCase.execute().then((products) => {
      console.log("Reloading", reloadKey)
      setProducts(products);
    });
  }, [reloadKey]);

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

          setEditingProduct(product);
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
