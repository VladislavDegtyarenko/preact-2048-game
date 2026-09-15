import { ReactNode, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import Button from "./Button";
import Overlay from "./Overlay";
import styles from "./Modal.module.scss";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  active: boolean;
};

const FOCUSABLE = [
  "button:not(:disabled)", "a[href]", "input:not(:disabled)",
  "select:not(:disabled)", "textarea:not(:disabled)", "[tabindex='0']",
].join(", ");
const blockedElements = new Map<Element, { count: number; wasInert: boolean }>();

/** Prevents interaction outside a popup, including when popups are stacked. */
const blockOutside = (modal: HTMLElement) => {
  const siblings: Element[] = [];
  let current: Element = modal;
  while (current.parentElement) {
    for (const sibling of current.parentElement.children) {
      if (sibling !== current) {
        const entry = blockedElements.get(sibling) ?? {
          count: 0,
          wasInert: sibling.hasAttribute("inert"),
        };
        entry.count++;
        blockedElements.set(sibling, entry);
        sibling.setAttribute("inert", "");
        siblings.push(sibling);
      }
    }
    current = current.parentElement;
    if (current === document.body) {
      break;
    }
  }
  return () => {
    for (const sibling of siblings) {
      const entry = blockedElements.get(sibling)!;
      entry.count--;
      if (entry.count === 0) {
        if (!entry.wasInert) {
          sibling.removeAttribute("inert");
        }
        blockedElements.delete(sibling);
      }
    }
  };
};

const Modal = ({ title, children, onClose, active }: ModalProps) => {
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const openerRef = useRef<Element | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useLayoutEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    setVisible(true);
  }, []);

  useLayoutEffect(() => {
    if (!openerRef.current) {
      openerRef.current = document.activeElement;
    }
    return () => {
      // Wait until the underlying popup has become active again.
      queueMicrotask(() => {
        const opener = openerRef.current;
        if (opener instanceof HTMLElement && opener.isConnected &&
          !opener.closest("[inert]")) {
          opener.focus();
        }
      });
    };
  }, []);

  useLayoutEffect(() => {
    const modal = modalRef.current;
    const dialog = dialogRef.current;
    if (!active || !modal || !dialog) {
      return;
    }

    const unblock = blockOutside(modal);
    const focusInside = () => {
      const target = lastFocusRef.current ??
        dialog.querySelector<HTMLElement>("[data-modal-initial-focus]") ??
        dialog.querySelector<HTMLElement>(FOCUSABLE) ?? dialog;
      target.focus();
    };
    focusInside();

    const handleFocus = (event: FocusEvent) => {
      if (!dialog.contains(event.target as Node)) {
        focusInside();
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      event.stopImmediatePropagation();
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      } else if (event.key === "Tab") {
        const targets = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
        const first = targets[0] ?? dialog;
        const last = targets[targets.length - 1] ?? dialog;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey, true);
    document.addEventListener("focusin", handleFocus);
    return () => {
      if (dialog.contains(document.activeElement)) {
        lastFocusRef.current = document.activeElement as HTMLElement;
      }
      document.removeEventListener("keydown", handleKey, true);
      document.removeEventListener("focusin", handleFocus);
      unblock();
    };
  }, [active]);

  return (
    <div
      ref={modalRef}
      className={`${styles.modal} ${visible ? styles.visible : ""}`}
      aria-hidden={!active || undefined}
    >
      <Overlay onClick={() => {
        if (active) {
          onClose();
        }
      }} />
      <div
        ref={dialogRef}
        className={styles.inner}
        role="dialog"
        aria-modal={active || undefined}
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header>
          <h2 id={titleId} className={styles.title}>{title}</h2>
          <Button
            variant="transparent"
            className={styles.closeButton}
            onClick={onClose}
            title="Close dialog"
            disabled={!active}
          >
            <MdClose />
          </Button>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Modal;
