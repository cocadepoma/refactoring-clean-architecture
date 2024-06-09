import { it, describe, beforeAll, afterEach, afterAll, expect } from "vitest";
import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";

import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../tests/MockWebServer";
import { ProductsPage } from "../../../pages/ProductsPage";

import { givenAProducts, givenThereAreNoProducts } from "./fixtures/fixtures";
import { openDialogToEditPrice, savePrice, typePrice, verifyDialog, verifyError, verifyHeader, verifyPriceAndStatus, verifyRows, waitToTableIsLoaded } from "./helpers/helpers";

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

    it('should show error for negative prices', async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);
  
      await waitToTableIsLoaded();
  
      const dialog = await openDialogToEditPrice(0);

      await typePrice(dialog, "-4");

      verifyError(dialog, "Invalid price format");
    });

    it('should show error for non number price', async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);
  
      await waitToTableIsLoaded();
  
      const dialog = await openDialogToEditPrice(0);

      await typePrice(dialog, "nonnumeric");

      verifyError(dialog, "Only numbers are allowed");
    });   
    
    it('should show error for prices above the maximum', async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);
  
      await waitToTableIsLoaded();
  
      const dialog = await openDialogToEditPrice(0);

      await typePrice(dialog, "1000");

      verifyError(dialog, "The max possible price is 999.99");
    });
    
    it('should edit price correctly and mark status as active for a price greather than 0', async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);
  
      await waitToTableIsLoaded();
  
      const dialog = await openDialogToEditPrice(0);

      const newPrice = "120.99";

      await typePrice(dialog, newPrice);

      await savePrice(dialog);

      await verifyPriceAndStatus(0, newPrice, "active");
    });

    it('should edit price correctly and mark status as inactive for a price equal to 0', async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);
  
      await waitToTableIsLoaded();
  
      const dialog = await openDialogToEditPrice(0);

      const newPrice = "0";

      await typePrice(dialog, newPrice);

      await savePrice(dialog);

      await verifyPriceAndStatus(0, newPrice, "inactive");
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
