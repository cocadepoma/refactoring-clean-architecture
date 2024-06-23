import { useCallback, useEffect, useState } from "react";

import { useReload } from "../hooks/useReload";
import { useAppContext } from "../context/useAppContext";

import { Product, ProductData, ProductStatus } from "../../domain/entities/Product";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { GetProductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { ResourceNotFoundError } from "../../domain/ProductRepository";
import { Price, ValidationError } from "../../domain/value-objects/Price";
import { StoreApi } from "../../data/api/StoreApi";

export type ProductViewModel = ProductData & { status: ProductStatus };

type message = { type: "error" | "success", text: string };

export const useProducts = (
  getProductUseCase: GetProductsUseCase,
  getProductById: GetProductByIdUseCase,
  storeApi: StoreApi,
) => {
  const { currentUser } = useAppContext();

  const [reloadKey, reload] = useReload();
  const [products, setProducts] = useState<ProductViewModel[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(
    undefined
  );
  const [message, setMessage] = useState<message>();
  const [priceError, setPriceError] = useState<string | undefined>(undefined);

  useEffect(() => {
    getProductUseCase.execute().then((products) => {
      console.log("Reloading", reloadKey);
      setProducts(products.map(buildProductViewModel));
    });
  }, [reloadKey, getProductUseCase]);

  const updatingQuantity = useCallback(
    async (id: number) => {
      if (id >= 0) {
        if (!currentUser.isAdmin) {
          setMessage({
            type: "error",
            text: "Only admin users can edit the price of a product",
          });
          return;
        }

        try {
          const product = await getProductById.execute(id);

          setEditingProduct(buildProductViewModel(product));
        } catch (error) {
          if(error instanceof ResourceNotFoundError) {
            setMessage({
              type: "error",
              text: error.message,
            });
          } else {
            setMessage({
              type: "error",
              text: "An error occurred while trying to load the product. Please try again later.",
            });
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

  async function saveEditPrice(): Promise<void> {
    if (editingProduct) {
      const remoteProduct = await storeApi.get(editingProduct.id);
      
      if (!remoteProduct) return;

      const editedRemoteProduct = {
        ...remoteProduct,
        price: Number(editingProduct.price),
      };

      try {
        await storeApi.post(editedRemoteProduct);

        setMessage({
          type: "success",
          text: `Price ${editingProduct.price} for '${editingProduct.title}' updated`,
        });

        setEditingProduct(undefined);
        reload();
      } catch (error) {
        setMessage({
          type: "error",
          text: `An error has ocurred updating the price ${editingProduct.price} for '${editingProduct.title}'`,
        });

        setEditingProduct(undefined);
        reload();
      }
    }
  }

  const onCloseMessage = useCallback(() => {
    setMessage(undefined);
  }, []);

  // TODO: Close dialog
  const cancelEditPrice = useCallback(() => {
    setEditingProduct(undefined);
  }, []);

  return { 
    products, 
    editingProduct,
    message,
    priceError,
    updatingQuantity,
    cancelEditPrice,
    onChangePrice,
    saveEditPrice,
    onCloseMessage,
  };
}

function buildProductViewModel(product: Product): ProductViewModel {
  return {
    ...product,
    price: product.price.value.toFixed(2),
  };
}