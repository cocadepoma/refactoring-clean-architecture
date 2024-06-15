import { useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { Product } from "../../domain/Product";
import { GetProductUseCase } from "../../domain/GetProductsUseCase";

export const useProducts = (
  getProductUseCase: GetProductUseCase
) => {
  const [reloadKey, reload] = useReload();
  const [products, setProducts] = useState<Product[]>([]);

  // TODO: Load products
  useEffect(() => {
    getProductUseCase.execute().then((products) => {
      console.log("Reloading", reloadKey)
      setProducts(products);
    });
  }, [reloadKey]);

  return { 
    products, 
    reload,
  };
}