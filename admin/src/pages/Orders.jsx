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

function isToday(dateStr) {
  const date = parseBRDate(dateStr);
  if (!date) return false;

  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isLast30Days(dateStr) {
  const date = parseBRDate(dateStr);
  if (!date) return false;

  const now = new Date();
  const diff = now - date;

  return diff <= 30 * 24 * 60 * 60 * 1000;
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

  const entregasHoje = orders.filter(o =>
    isToday(o.delivery_date)
  ).length;

  const vendasHoje = orders
    .filter(o => isToday(o.delivery_date))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const vendas30Dias = orders
    .filter(o => isLast30Days(o.delivery_date))
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
