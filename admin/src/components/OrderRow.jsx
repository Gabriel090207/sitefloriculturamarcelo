import { FiMoreVertical, FiPhone } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import OrderActionsModal from "./OrderActionsModal";
import { useState, useRef } from "react";
import { updateOrderStatus } from "../services/orders";

export default function OrderRow({ order }) {
  const [open, setOpen] = useState(false);
  const actionBtnRef = useRef(null);

  // 🔹 Fallbacks seguros
  const customerName =
    order.customer_name && order.customer_name.trim() !== ""
      ? order.customer_name
      : "Cliente sem nome";

  const itemTitle = order.items?.[0]?.title || "Pedido";
  const deliveryDate = order.delivery_date || "—";

  async function changeStatus(status) {
    await updateOrderStatus(order.id, status);
    window.location.reload();
  }

  return (
    <div className="order-row">
      {/* CLIENTE */}
      <div className="order-main">
        <strong>
          {customerName} #{order.payment_id}
        </strong>

        <span>
          <FiPhone /> {order.customer_phone || "Telefone não informado"}
        </span>
      </div>

      {/* PEDIDO + ENTREGA */}
      <div className="order-client">
        <strong>{itemTitle}</strong>
        <span>Entrega: {deliveryDate}</span>
      </div>

      {/* STATUS */}
      <StatusBadge status={order.status || "pendente"} />

      {/* AÇÕES */}
      <button
        ref={actionBtnRef}
        onClick={() => setOpen(prev => !prev)}
        className="order-actions-btn"
      >
        <FiMoreVertical />
      </button>

      {/* MODAL (PORTAL) */}
      {open && actionBtnRef.current && (
        <OrderActionsModal
          onChangeStatus={changeStatus}
          anchorRect={actionBtnRef.current.getBoundingClientRect()}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
