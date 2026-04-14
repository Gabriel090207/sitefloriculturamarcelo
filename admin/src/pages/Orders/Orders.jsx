import { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiSearch
} from "react-icons/fi";

import MetricCard from "../../components/MetricCard/MetricCard";
import OrderRow from "../../components/OrderRow/OrderRow";
import { getOrders, updateOrderStatus } from "../../services/orders";

import "./Orders.css";

/* =========================
   FUNÇÕES AUXILIARES
========================= */

function parseBRDate(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
}

function parseFirestoreDate(value) {
  if (!value) return null;
  if (value.seconds) return new Date(value.seconds * 1000);
  return new Date(value);
}

function isTodayDate(date) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);

  return compare.getTime() === today.getTime();
}

function isLast30DaysDate(date) {
  if (!date) return false;
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - 30);
  return date >= past && date <= now;
}

/* =========================
   COMPONENTE
========================= */

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [openActionsId, setOpenActionsId] = useState(null);
  const [loadingStatusId, setLoadingStatusId] = useState(null);


  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    setLoadingStatusId(orderId);
  
    try {
      await updateOrderStatus(orderId, newStatus);
  
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } finally {
      setLoadingStatusId(null);
      setOpenActionsId(null);
    }
  }
  

  const filtered = orders.filter(o => {
    const matchSearch =
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search) ||
      o.payment_id?.includes(search);

    const matchStatus = filter === "Todas" || o.status === filter;

    return matchSearch && matchStatus;
  });

  const entregasHoje = orders.filter(o =>
    parseBRDate(o.delivery_date)?.toDateString() ===
    new Date().toDateString()
  ).length;

  const vendasHoje = orders
    .filter(o => isTodayDate(parseFirestoreDate(o.created_at)))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const vendas30Dias = orders
    .filter(o => isLast30DaysDate(parseFirestoreDate(o.created_at)))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="orders-page">
      {/* MÉTRICAS */}
      <div className="orders-metrics">
        <MetricCard
          title="Entregas hoje"
          value={entregasHoje}
          icon={<FiCalendar />}
        />

        <MetricCard
          title="Vendas hoje"
          value={`R$ ${vendasHoje.toFixed(2)}`}
          icon={<FiDollarSign />}
        />

        <MetricCard
          title="Últimos 30 dias"
          value={`R$ ${vendas30Dias.toFixed(2)}`}
          icon={<FiTrendingUp />}
        />
      </div>

      {/* FILTROS */}
      <div className="orders-filters">
        <div className="search-input">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={search}
            onChange={e => {
  const value = e.target.value;

  // permite letras, espaços e acentos
  const sanitized = value.replace(/[^a-zA-ZÀ-ÿ\s0-9]/g, "");

  setSearch(sanitized);
}}

          />
        </div>

        <div className="filter-tabs">
          {["Todas", "Pendente", "Pronto", "Entregue"].map(s => (
            <button
              key={s}
              className={filter === s ? "active" : ""}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA */}
      <div className="orders-wrapper">
        <div className="orders-list">
          {filtered.map(order => (
            <OrderRow
            key={order.id}
            order={order}
            loading={loadingStatusId === order.id}
            openActionsId={openActionsId}
            setOpenActionsId={setOpenActionsId}
            onChangeStatus={handleStatusChange}
          />
          
          ))}
        </div>
      </div>
    </div>
  );
}

