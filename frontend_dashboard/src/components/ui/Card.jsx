import React from "react";

/**
 * Simple Card primitive matching Ocean Professional theme.
 * Use <Card> for container and <CardHeader>/<CardBody>/<CardFooter> for structure.
 */

// PUBLIC_INTERFACE
export function Card({ className = "", children, ...props }) {
  /** A themed surface container with border + shadow. */
  return (
    <section className={`card ei-card ${className}`} {...props}>
      {children}
    </section>
  );
}

// PUBLIC_INTERFACE
export function CardHeader({ title, subtitle, right, className = "" }) {
  /** Card header row with optional title/subtitle and right-aligned actions. */
  return (
    <header className={`ei-card__header ${className}`}>
      <div className="ei-card__headerText">
        {title ? <div className="ei-card__title">{title}</div> : null}
        {subtitle ? <div className="ei-card__subtitle">{subtitle}</div> : null}
      </div>
      {right ? <div className="ei-card__headerRight">{right}</div> : null}
    </header>
  );
}

// PUBLIC_INTERFACE
export function CardBody({ className = "", children, ...props }) {
  /** Card body container with standard padding. */
  return (
    <div className={`ei-card__body ${className}`} {...props}>
      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
export function CardFooter({ className = "", children, ...props }) {
  /** Card footer container for secondary actions/notes. */
  return (
    <footer className={`ei-card__footer ${className}`} {...props}>
      {children}
    </footer>
  );
}
