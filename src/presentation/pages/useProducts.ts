import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { Product } from "../../domain/Product";
import { GetProductUseCase } from "../../domain/GetProductsUseCase";
import { StoreApi } from "../../data/api/StoreApi";
import { useAppContext } from "../context/useAppContext";
import { buildProduct } from "../../data/ProductApiRepository";

export const useProducts = (
  getProductUseCase: GetProductUseCase,
  storeApi: StoreApi
) => {
  const { currentUser } = useAppContext();

  const [reloadKey, reload] = useReload();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined
  );
  const [error, setError] = useState<string>();

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

        storeApi
          .get(id)
          .then(buildProduct)
          .then((product) => {
            setEditingProduct(product);
          })
          .catch(() => {
            setError(`Product with id ${id} not found`);
          });
      }
    },
    [currentUser]
  );

  // TODO: Close dialog
  const cancelEditPrice = useCallback(() => {
    setEditingProduct(undefined);
  }, []);

  return { 
    products, 
    editingProduct,
    error,
    setEditingProduct,
    reload,
    updatingQuantity,
    cancelEditPrice,
  };
}