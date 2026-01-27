import { FiMoreVertical, FiPhone, FiEye } from "react-icons/fi";
import { useRef, useState } from "react";

import StatusBadge from "../StatusBadge/StatusBadge";
import OrderActionsModal from "../OrderActionsModal/OrderActionsModal";
import OrderDetailsModal from "../OrderDetailsModal/OrderDetailsModal";

import "./OrderRow.css";

export default function OrderRow({
  order,
  loading,
  openActionsId,
  setOpenActionsId,
  onChangeStatus
}) {

  const [openDetails, setOpenDetails] = useState(false);
  const actionBtnRef = useRef(null);
  const [actionsRect, setActionsRect] = useState(null);

  const isOpen = openActionsId === order.id;

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

        {/* DETALHES */}
        <button
  className="order-details-btn"
  onClick={() => {
    // fecha menu de ações se estiver aberto
    setOpenActionsId(null);
    setOpenDetails(true);
  }}
>
  <FiEye className="order-details-icon" />
  Ver detalhes
</button>


        {/* STATUS */}
        {loading ? (
  <span className="status loading">Atualizando...</span>
) : (
  <StatusBadge status={order.status || "Pendente"} />
)}


        {/* AÇÕES */}
        <button
          ref={actionBtnRef}
          className="order-actions-btn"
          onClick={() => {
            if (isOpen) {
              setOpenActionsId(null);
              setActionsRect(null);
            } else {
              const rect =
                actionBtnRef.current.getBoundingClientRect();

              setActionsRect({
                bottom: rect.bottom,
                right: rect.right
              });

              setOpenActionsId(order.id);
            }
          }}
        >
          <FiMoreVertical />
        </button>

        {isOpen && actionsRect && (
          <OrderActionsModal
            anchorRect={actionsRect}
            onChangeStatus={status =>
              onChangeStatus(order.id, status)
            }
            onClose={() => {
              setOpenActionsId(null);
              setActionsRect(null);
            }}
          />
        )}
      </div>

      {openDetails && (
        <OrderDetailsModal
          order={order}
          onClose={() => setOpenDetails(false)}
        />
      )}
    </>
  );
}
