import { FiX, FiPhone } from "react-icons/fi";
import { useEffect, useState } from "react";
import "./OrderDetailsModal.css";



export default function OrderDetailsModal({ order, onClose }) {
  const [closing, setClosing] = useState(false);

  if (!order) return null;



  useEffect(() => {
    // bloqueia scroll
    document.body.style.overflow = "hidden";
  
    return () => {
      // libera scroll ao fechar
      document.body.style.overflow = "";
    };
  }, []);
  

  return (
    <>
      <div
  className="order-details-overlay"
  onClick={() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }}
/>

<div className={`order-details-modal ${closing ? "closing" : ""}`}>

      <button
  className="close-btn"
  onClick={() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }}
>

          <FiX />
        </button>

        <h2>Detalhes do pedido</h2>

        <div className="details-section">
          <strong>{order.customer_name}</strong>
          <span>
            <FiPhone /> {order.customer_phone}
          </span>
        </div>

        <div className="details-section">
          <strong>Entrega</strong>
          <span>{order.delivery_date}</span>
        </div>

        <div className="details-section">
  <strong>Endereço</strong>

  <div className="address-block">
    <span>
      {order.address?.street}, {order.address?.number}
    </span>

    <span>{order.address?.neighborhood}</span>

    <span className="cep">
      CEP: {order.address?.cep}
    </span>
  </div>
</div>

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

        <div className="details-total">
          <strong>Total</strong>
          <strong>
            R$ {Number(order.total).toFixed(2)}
          </strong>
        </div>
      </div>
    </>
  );
}
