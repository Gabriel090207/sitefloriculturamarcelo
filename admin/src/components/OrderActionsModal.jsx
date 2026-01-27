import { createPortal } from "react-dom";

export default function OrderActionsModal({ onChangeStatus, anchorRect }) {
  if (!anchorRect) return null;

  return createPortal(
    <div
      className="order-actions"
      style={{
        position: "fixed",
        top: anchorRect.bottom + 8,
        right: window.innerWidth - anchorRect.right,
      }}
    >
      <button onClick={() => onChangeStatus("pendente")}>
        Marcar como pendente
      </button>
      <button onClick={() => onChangeStatus("entregue")}>
        Marcar como entregue
      </button>
      <button onClick={() => onChangeStatus("feito")}>
        Marcar como feito
      </button>
    </div>,
    document.body
  );
}
