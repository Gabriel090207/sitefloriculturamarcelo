import { useEffect, useState } from "react";
import { FiDollarSign, FiCalendar, FiTrendingUp } from "react-icons/fi";
import MetricCard from "../components/MetricCard";
import OrderRow from "../components/OrderRow";
import { getOrders } from "../services/orders";

/* =========================
   FUNÇÕES AUXILIARES
========================= */

// Converte "DD/MM/YYYY" → Date
function parseBRDate(dateStr) {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
}

// Converte Firestore Timestamp → Date
function parseFirestoreDate(value) {
  if (!value) return null;

  // Firestore Timestamp
  if (value.seconds) {
    return new Date(value.seconds * 1000);
  }

  return new Date(value);
}

function isTodayBR(dateStr) {
  const date = parseBRDate(dateStr);
  if (!date) return false;

  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
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
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  return date >= thirtyDaysAgo && date <= now;
}

/* =========================
   COMPONENTE
========================= */

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("todas");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  /* =========================
     FILTRO DA LISTA
  ========================= */

  const filtered = orders.filter(o => {
    const matchSearch =
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search) ||
      o.payment_id?.includes(search);

    const matchStatus =
      filter === "todas" || o.status === filter;

    return matchSearch && matchStatus;
  });

  /* =========================
     MÉTRICAS
  ========================= */

  // ENTREGAS HOJE → delivery_date
  const entregasHoje = orders.filter(o =>
    isTodayBR(o.delivery_date)
  ).length;

  // VENDAS HOJE → created_at
  const vendasHoje = orders
    .filter(o => {
      const createdAt = parseFirestoreDate(o.created_at);
      return isTodayDate(createdAt);
    })
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  // ÚLTIMOS 30 DIAS → created_at
  const vendas30Dias = orders
    .filter(o => {
      const createdAt = parseFirestoreDate(o.created_at);
      return isLast30DaysDate(createdAt);
    })
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="orders-page">
      <h1>Pedidos</h1>

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
        <input
          placeholder="Buscar pedido..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="filter-tabs">
          {["todas", "pendente", "entregue", "feito"].map(s => (
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
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
