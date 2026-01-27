import { FiMoreVertical, FiPhone, FiEye } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import OrderActionsModal from "./OrderActionsModal";
import OrderDetailsModal from "./OrderDetailsModal";
import { useRef, useState } from "react";

export default function OrderRow({
  order,
  openActionsId,
  setOpenActionsId,
  onChangeStatus
}) {
  const [openDetails, setOpenDetails] = useState(false);
  const actionBtnRef = useRef(null);

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
          onClick={() =>
            setOpenActionsId(isOpen ? null : order.id)
          }
          className="order-actions-btn"
        >
          <FiMoreVertical />
        </button>

        {isOpen && actionBtnRef.current && (
          <OrderActionsModal
            anchorRect={actionBtnRef.current.getBoundingClientRect()}
            onChangeStatus={status =>
              onChangeStatus(order.id, status)
            }
            onClose={() => setOpenActionsId(null)}
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
