import { expect } from "vitest";
import { screen, waitFor, within } from "@testing-library/dom";
import { RemoteProduct } from "../../../../api/StoreApi";
import userEvent from "@testing-library/user-event";

export function verifyHeader(headerRow: HTMLElement) {
  const headerScope =  within(headerRow);

  const cells = headerScope.getAllByRole("columnheader");

  expect(cells).toHaveLength(6);

  within(cells[0]).getByText("ID");
  within(cells[1]).getByText("Title");
  within(cells[2]).getByText("Image");
  within(cells[3]).getByText("Price");
  within(cells[4]).getByText("Status");
}

export async function waitToTableIsLoaded(){
  await waitFor(async () => {
    const rows = await screen.findAllByRole("row");

    expect(rows.length).toBeGreaterThan(1);
  });
}

export function verifyRows(rows: HTMLElement[], products: RemoteProduct[]) {
  expect(rows.length).toBe(products.length);

  rows.forEach((row, index) => {
    const rowScope = within(row);
    const cells = rowScope.getAllByRole("cell");

    expect(cells.length).toBe(6);

    const product = products[index];

    within(cells[0]).getByText(product.id);
    within(cells[1]).getByText(product.title);
    
    const image = within(cells[2]).getByRole("img");
    expect(image).toHaveAttribute("src", product.image);

    within(cells[3]).getByText(`$${product.price.toFixed(2)}`);
    within(cells[4]).getByText(product.price === 0 ? "inactive" : "active");
  });
}

export async function openDialogToEditPrice(index: number): Promise<HTMLElement> {
  const allRows = await screen.findAllByRole("row");

  const [, ...rows] = allRows;
  const row = rows[index];
  const rowScope = within(row);

  await userEvent.click(rowScope.getByRole("menuitem"));

  const updatePriceMenu = await screen.findByRole("menuitem", { name: /update price/i });

  await userEvent.click(updatePriceMenu);

  return await screen.findByRole("dialog");
}

export function verifyDialog(dialog: HTMLElement, product: RemoteProduct) {
  const dialogScope = within(dialog);

  dialogScope.getByRole('heading', { name: /update price/i });

  const image: HTMLImageElement = dialogScope.getByRole("img");
  expect(image.src).toBe(product.image);

  dialogScope.getByText(product.title);

  const textBox = screen.getByRole('textbox', { name: /price/i });
  
  expect(textBox).toHaveValue(`${product.price}`);
}

export async function typePrice(dialog: HTMLElement, price: string) {
  const dialogScope = within(dialog);

  const textBox = dialogScope.getByRole('textbox', { name: /price/i });

  await userEvent.clear(textBox);
  await userEvent.type(textBox, price);
}

export function verifyError(dialog: HTMLElement, error: string) {
  const dialogScope = within(dialog);

  dialogScope.getByText(error);
}