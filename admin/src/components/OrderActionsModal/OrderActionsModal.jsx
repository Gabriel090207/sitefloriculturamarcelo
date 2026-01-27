import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import "./OrderActionsModal.css";

export default function OrderActionsModal({
  onChangeStatus,
  anchorRect,
  onClose
}) {
  const [closing, setClosing] = useState(false);

  if (!anchorRect) return null;

  function handleClick(status) {
    setClosing(true);
    setTimeout(() => {
      onChangeStatus(status);
      onClose();
    }, 200);
  }

  return createPortal(
    <div
      className={`order-actions ${closing ? "closing" : ""}`}
      style={{
        top: anchorRect.bottom + 8,
        right: window.innerWidth - anchorRect.right
      }}
    >
      <button onClick={() => handleClick("Pendente")}>
        Marcar como Pendente
      </button>
      <button onClick={() => handleClick("Pronto")}>
        Marcar como Pronto
      </button>
      <button onClick={() => handleClick("Entregue")}>
        Marcar como Entregue
      </button>
    </div>,
    document.body
  );
}
