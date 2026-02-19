import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/shared/Layout";
import MyLeadTable from "../../components/sales/MyLeadTable";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useLeads } from "../../hooks/useLeads";
import useUIStore from "../../store/useUIStore";

const MyLeads = () => {
  const navigate = useNavigate();
  const { leadFilters, setLeadFilters, resetLeadFilters } = useUIStore();
  const [editingLead, setEditingLead] = useState(null);

  const activeFilters = Object.fromEntries(
    Object.entries(leadFilters).filter(([, v]) => v !== "")
  );

  const { data: leads, isLoading } = useLeads(activeFilters);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Leads</h1>
          <p className="page-subtitle">{leads?.length ?? 0} leads</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/sales/leads/new")}>
          + Add Lead
        </button>
      </div>

      <div className="card" style={{ marginBottom: "20px", padding: "20px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            className="form-input"
            style={{ flex: "1", minWidth: "200px" }}
            placeholder="Search..."
            value={leadFilters.search}
            onChange={(e) => setLeadFilters({ search: e.target.value })}
          />
          <select
            className="form-select"
            style={{ minWidth: "140px" }}
            value={leadFilters.projectType}
            onChange={(e) => setLeadFilters({ projectType: e.target.value })}
          >
            <option value="">All Project Types</option>
            <option value="loan">Loan</option>
            <option value="subsidy">Subsidy</option>
          </select>
          <button className="btn btn--ghost" onClick={resetLeadFilters}>
            Reset
          </button>
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : <MyLeadTable leads={leads || []} onEdit={setEditingLead} />}
    </Layout>
  );
};

export default MyLeads;
