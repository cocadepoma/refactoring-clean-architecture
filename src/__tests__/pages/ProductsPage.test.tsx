import { test } from "vitest";
import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";

import { ProductsPage } from "../../pages/ProductsPage";
import { AppProvider } from "../../context/AppProvider";

test("Loads and displays title", () => {
  renderComponent(<ProductsPage />);

  screen.getByRole("heading", { name: "Product price updater" });
});

function renderComponent(children: ReactNode) {
  return render(
    <AppProvider>
      {children}
    </AppProvider>
  );
}
