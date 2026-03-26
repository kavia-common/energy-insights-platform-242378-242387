import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "./ui/Modal";

describe("Modal", () => {
  test("does not render when open=false", () => {
    const { container } = render(
      <Modal open={false} title="My modal" onClose={() => {}}>
        Body
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders dialog when open=true", () => {
    render(
      <Modal open title="My modal" onClose={() => {}}>
        Body
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "My modal" })).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  test("calls onClose on Escape", () => {
    const onClose = jest.fn();
    render(
      <Modal open title="My modal" onClose={onClose}>
        Body
      </Modal>
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when clicking backdrop, but not when clicking inside dialog", () => {
    const onClose = jest.fn();
    const { container } = render(
      <Modal open title="My modal" onClose={onClose}>
        <div>Body</div>
      </Modal>
    );

    const overlay = container.querySelector(".ei-modalOverlay");
    const dialog = container.querySelector(".ei-modal");

    expect(overlay).toBeTruthy();
    expect(dialog).toBeTruthy();

    // Clicking inside should not close (stops propagation)
    fireEvent.mouseDown(dialog);
    expect(onClose).toHaveBeenCalledTimes(0);

    // Clicking backdrop should close
    fireEvent.mouseDown(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
