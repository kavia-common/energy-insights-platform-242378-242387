import React, { useEffect } from "react";

// PUBLIC_INTERFACE
export default function Modal({ open, title, description, children, onClose, footer }) {
  /** Accessible modal dialog with backdrop; closes on Escape and backdrop click. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ei-modalOverlay" role="presentation" onMouseDown={onClose}>
      <div
        className="ei-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="ei-modal__header">
          <div>
            <div className="ei-modal__title">{title}</div>
            {description ? <div className="ei-modal__desc">{description}</div> : null}
          </div>
          <button className="ei-btn ei-btn--ghost" type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="ei-modal__body">{children}</div>

        {footer ? <footer className="ei-modal__footer">{footer}</footer> : null}
      </div>
    </div>
  );
}
