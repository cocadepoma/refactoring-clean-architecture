import { it, describe, beforeAll, afterEach, afterAll, expect } from "vitest";
import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";

import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../tests/MockWebServer";
import { ProductsPage } from "../../../pages/ProductsPage";

import { givenAProducts, givenThereAreNoProducts } from "./fixtures/fixtures";
import { openDialogToEditPrice, verifyDialog, verifyHeader, verifyRows, waitToTableIsLoaded } from "./helpers/helpers";

const mockWebServer = new MockWebServer();

describe('tests on ProductsPage', () => {
  beforeAll(() => {
    mockWebServer.start();
  });

  afterEach(() => {
    mockWebServer.resetHandlers();
  });

  afterAll(() => {
    mockWebServer.close();
  });

  describe('Table', () => {
    it("Loads and displays title", () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);
  
      screen.getByRole("heading", { name: "Product price updater" });
    });
  
    it("should show an empty table if there are no products", () => {
      givenThereAreNoProducts(mockWebServer);
      renderComponent(<ProductsPage />);
  
      const rows = screen.getAllByRole("row");
  
      expect(rows).toHaveLength(1);
      verifyHeader(rows[0]);
    });
  
    it("should show a table with products", async () => {
      const products = givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);
  
      await waitToTableIsLoaded();
  
      const [header, ...allRows] = screen.getAllByRole("row");
  
      verifyHeader(header);
      verifyRows(allRows, products);
    });
  });
  
  describe('Edit price', () => {
    it('should show a dialog to edit the price', async () => {
      const products = givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);
  
      await waitToTableIsLoaded();
  
      const dialog = await openDialogToEditPrice(0);

      verifyDialog(dialog, products[0]);
    });
  });
});

function renderComponent(children: ReactNode) {
  return render(
    <AppProvider>
      {children}
    </AppProvider>
  );
}
