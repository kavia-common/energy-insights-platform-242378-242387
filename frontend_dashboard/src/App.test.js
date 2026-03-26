import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders dashboard shell", () => {
  render(<App />);
  expect(screen.getByText(/Energy Insights/i)).toBeInTheDocument();
});
