import { test } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { AppContext } from "../../context/AppContext";
import { ProductsPage } from "../../pages/ProductsPage";

test("Loads and displays title", () => {
  renderComponent(<ProductsPage />);

  screen.getByRole("heading", { name: "Product price updater" });
});

function renderComponent(children: ReactNode) {
  return render(
    <AppContext.Provider value={{ 
      currentUser: { id: "1", name: "John", isAdmin: true },
      users: [],
      setCurrentUser: () => {},
    }}>
      {children}
    </AppContext.Provider>
  )
}
