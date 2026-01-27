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
      <button onClick={() => onChangeStatus("Pendente")}>
        Marcar como Pendente
      </button>
      <button onClick={() => onChangeStatus("Pronto")}>
        Marcar como Pronto
      </button>
      <button onClick={() => onChangeStatus("Entregue")}>
        Marcar como Entregue
      </button>
      
    </div>,
    document.body
  );
}
