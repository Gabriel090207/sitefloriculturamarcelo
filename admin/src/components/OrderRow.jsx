import { FiMoreVertical, FiPhone, FiEye } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import OrderActionsModal from "./OrderActionsModal";
import OrderDetailsModal from "./OrderDetailsModal";
import { useState, useRef } from "react";
import { updateOrderStatus } from "../services/orders";

export default function OrderRow({ order }) {
  const [openActions, setOpenActions] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const actionBtnRef = useRef(null);

  const mainItemTitle = order.items?.[0]?.title || "Pedido";
  const deliveryDate = order.delivery_date || "—";

 async function changeStatus(status) {
  try {
    await updateOrderStatus(order.id, status);
    setOpenActions(false);
  } catch (err) {
    alert("Erro ao atualizar status");
  }
}

  return (
    <>
      <div className="order-row">
        {/* CLIENTE */}
        <div className="order-main">
          <strong>
            {order.customer_name} #{order.payment_id}
          </strong>

          <span>
            <FiPhone /> {order.customer_phone}
          </span>
        </div>

        {/* RESUMO DO PEDIDO */}
        <div className="order-client">
         

          <button
            className="order-details-btn"
            onClick={() => setOpenDetails(true)}
          >
            <FiEye /> Ver detalhes
          </button>
        </div>

        {/* STATUS */}
        <StatusBadge status={order.status || "pendente"} />

        {/* AÇÕES */}
        <button
          ref={actionBtnRef}
          onClick={() => setOpenActions(prev => !prev)}
          className="order-actions-btn"
        >
          <FiMoreVertical />
        </button>

        {/* MENU DE AÇÕES */}
        {openActions && actionBtnRef.current && (
          <OrderActionsModal
            onChangeStatus={changeStatus}
            anchorRect={actionBtnRef.current.getBoundingClientRect()}
            onClose={() => setOpenActions(false)}
          />
        )}
      </div>

      {/* MODAL DE DETALHES (CENTRAL + OVERLAY) */}
      {openDetails && (
        <OrderDetailsModal
          order={order}
          onClose={() => setOpenDetails(false)}
        />
      )}
    </>
  );
}
