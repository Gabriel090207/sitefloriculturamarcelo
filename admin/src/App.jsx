import AdminHeader from "./components/adminHeader";
import Orders from "./pages/Orders";

import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/index.css";

export default function App() {
  return (
    <div className="admin-layout">
      <AdminHeader />

      <main className="admin-page">
        <Orders />
      </main>
    </div>
  );
}
