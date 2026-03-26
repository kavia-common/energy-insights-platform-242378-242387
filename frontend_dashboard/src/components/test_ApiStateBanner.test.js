import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApiStateBanner from "./ui/ApiStateBanner";
import { ApiError } from "../backend_api/errors";

describe("ApiStateBanner", () => {
  test("renders nothing when not loading and no error", () => {
    const { container } = render(<ApiStateBanner isLoading={false} error={null} label="Sites" />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders loading state with role=status", () => {
    render(<ApiStateBanner isLoading label="Sites" />);
    expect(screen.getByRole("status")).toHaveTextContent(/Sites loading/i);
  });

  test("renders error state with role=alert and calls onRetry", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();

    render(
      <ApiStateBanner
        isLoading={false}
        error={new ApiError("Request failed (500)", { status: 500 })}
        label="Sites"
        onRetry={onRetry}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/Sites error/i);
    await user.click(screen.getByRole("button", { name: /Retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
