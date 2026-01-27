import { FiX, FiPhone } from "react-icons/fi";

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <>
      {/* OVERLAY */}
      <div className="order-details-overlay" onClick={onClose} />

      {/* MODAL */}
      <div className="order-details-modal">
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>

        <h2>Detalhes do pedido</h2>

        {/* CLIENTE */}
        <div className="details-section">
          <strong>{order.customer_name}</strong>
          <span>
            <FiPhone /> {order.customer_phone}
          </span>
        </div>

        {/* ENTREGA */}
        <div className="details-section">
          <strong>Entrega</strong>
          <span>{order.delivery_date}</span>
        </div>

        {/* ENDEREÇO */}
        <div className="details-section">
          <strong>Endereço</strong>
          <span>
            {order.address?.street}, {order.address?.number}
          </span>
          <span>{order.address?.neighborhood}</span>
          <span>CEP: {order.address?.cep}</span>
        </div>

        {/* ITENS */}
        <div className="details-section">
          <strong>Itens</strong>

          {order.items?.map((item, index) => (
            <div key={index} className="item-row">
              <span>
                {item.quantity}x {item.title}
              </span>
              <span>
                R$ {Number(item.unit_price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="details-total">
          <strong>Total</strong>
          <strong>R$ {Number(order.total).toFixed(2)}</strong>
        </div>
      </div>
    </>
  );
}
