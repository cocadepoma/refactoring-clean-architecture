import { it, describe, beforeAll, afterEach, afterAll, expect } from "vitest";
import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";

import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../tests/MockWebServer";
import { ProductsPage } from "../../../pages/ProductsPage";

import { givenAProducts, givenThereAreNoProducts } from "./fixtures/fixtures";
import { verifyHeader } from "./helpers/helpers";

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
});

function renderComponent(children: ReactNode) {
  return render(
    <AppProvider>
      {children}
    </AppProvider>
  );
}
