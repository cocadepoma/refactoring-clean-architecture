import { test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../App";

test("Loads and displays title", () => {
    render(<App />);

    screen.getByRole("heading", { name: "Product price updater" });
});