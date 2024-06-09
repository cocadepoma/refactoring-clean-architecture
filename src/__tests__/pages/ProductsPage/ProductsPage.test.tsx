import { test, describe, beforeAll, afterEach, afterAll } from "vitest";
import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";

import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../tests/MockWebServer";
import { ProductsPage } from "../../../pages/ProductsPage";

import productsResponse from './data/productsResponse.json';

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

  test("Loads and displays title", () => {
    givenAProducts();
    renderComponent(<ProductsPage />);

    screen.getByRole("heading", { name: "Product price updater" });
  });
});

function renderComponent(children: ReactNode) {
  return render(
    <AppProvider>
      {children}
    </AppProvider>
  );
}

function givenAProducts() {
  mockWebServer.addRequestHandlers([
    {
      method: "get",
      endpoint: "https://fakestoreapi.com/products",
      httpStatusCode: 200,
      response: productsResponse,
    },
  ]);
}
