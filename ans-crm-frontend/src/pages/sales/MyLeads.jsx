import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/shared/Layout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useLeads } from "../../hooks/useLeads";
import useUIStore from "../../store/useUIStore";
import SalesLeadEditModal from "../../components/sales/SalesLeadEditModal";
import LeadDetailModal from "../../components/shared/LeadDetailModal";
import "./MyLeads.css";

const MyLeads = () => {
  const navigate = useNavigate();
  const { leadFilters, setLeadFilters, resetLeadFilters } = useUIStore();
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);

  const activeFilters = Object.fromEntries(
    Object.entries(leadFilters).filter(([, v]) => v !== "")
  );

  const { data: leads, isLoading } = useLeads(activeFilters);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Leads</h1>
          <p className="page-subtitle">{leads?.length ?? 0} visits</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/sales/leads/new")}>
          + Add Visit
        </button>
      </div>

      {/* FILTERS */}
      <div className="my-leads__filters card">
        <input
          className="form-input"
          style={{ flex: "1", minWidth: "200px" }}
          placeholder="Search firm, person, mobile..."
          value={leadFilters.search}
          onChange={(e) => setLeadFilters({ search: e.target.value })}
        />
        <select
          className="form-select"
          value={leadFilters.projectType}
          onChange={(e) => setLeadFilters({ projectType: e.target.value })}>
          <option value="">All Project Types</option>
          <option value="loan">Loan</option>
          <option value="subsidy">Subsidy</option>
        </select>
        <select
          className="form-select"
          value={leadFilters.sanction}
          onChange={(e) => setLeadFilters({ sanction: e.target.value })}>
          <option value="">All Sanctions</option>
          <option value="true">Sanctioned</option>
          <option value="false">Not Sanctioned</option>
        </select>
        <button className="btn btn--ghost" onClick={resetLeadFilters}>
          Reset
        </button>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <LoadingSpinner />
      ) : !leads || leads.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: "center", color: "#718096", padding: "40px" }}>
            No visits found. Click "Add Visit" to get started.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="my-leads-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Firm Name</th>
                <th>Person</th>
                <th>Mobile</th>
                <th>Project Type</th>
                <th>Sanction</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="my-leads-table__srno">{lead.srNo}</td>
                  <td>
                    <button
                      className="my-leads-table__firm-btn"
                      onClick={() => setViewingLead(lead)}>
                      {lead.firmName || "—"}
                    </button>
                  </td>
                  <td>{lead.personName || "—"}</td>
                  <td>{lead.mobileNo || "—"}</td>
                  <td>
                    <span className={`badge badge--${lead.projectType}`}>
                      {lead.projectType || "—"}
                    </span>
                  </td>
                  <td className="my-leads-table__sanction">
                    {lead.sanction ? "✓" : "✗"}
                  </td>
                  <td className="my-leads-table__amount">
                    {lead.amount ? `₹${lead.amount.toLocaleString()}` : "—"}
                  </td>
                  <td>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => setEditingLead(lead)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALS */}
      {editingLead && (
        <SalesLeadEditModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
        />
      )}

      {viewingLead && (
        <LeadDetailModal
          lead={viewingLead}
          onClose={() => setViewingLead(null)}
          onEdit={() => {
            setEditingLead(viewingLead);
            setViewingLead(null);
          }}
        />
      )}
    </Layout>
  );
};

export default MyLeads;