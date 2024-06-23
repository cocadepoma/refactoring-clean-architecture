import { ProductData, ProductStatus } from "../../domain/entities/Product";

export type ProductViewModel = ProductData & { status: ProductStatus };

export type message = { type: "error" | "success", text: string };

export type UseProductState = {
  products: ProductViewModel[];
  editingProduct: ProductViewModel | undefined;
  message: message | undefined;
  priceError: string | undefined;
  updatingQuantity: (id: number) => void;
  cancelEditPrice: () => void;
  onChangePrice: (price: string) => void;
  saveEditPrice: () => void;
  onCloseMessage: () => void;
}