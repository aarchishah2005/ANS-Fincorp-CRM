import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/shared/Layout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useLeads, useDeleteLead } from "../../hooks/useLeads";
import useUIStore from "../../store/useUIStore";
import AdminLeadEditModal from "../../components/admin/AdminLeadEditModal";
import LeadDetailModal from "../../components/admin/LeadDetailModal";
import "./AllLeads.css";

const AllLeads = () => {
  const navigate = useNavigate();
  const { showConfirm, showToast, leadFilters, setLeadFilters, resetLeadFilters } = useUIStore();
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const { mutate: deleteLead } = useDeleteLead();

  const activeFilters = Object.fromEntries(
    Object.entries(leadFilters).filter(([, v]) => v !== "")
  );

  const { data: leads, isLoading } = useLeads(activeFilters);

  const handleDelete = (lead) => {
    showConfirm(
      `Delete visit for "${lead.firmName}"? This cannot be undone.`,
      () => {
        deleteLead(lead._id, {
          onSuccess: () => showToast("Lead deleted"),
          onError: () => showToast("Failed to delete", "error"),
        });
      }
    );
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Leads</h1>
          <p className="page-subtitle">{leads?.length ?? 0} total visits</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/admin/leads/new")}>
          + Add Lead
        </button>
      </div>

      {/* FILTERS - Including Bank Name */}
      <div className="all-leads__filters card">
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
        <input
          className="form-input"
          style={{ minWidth: "160px" }}
          placeholder="Bank Name"
          value={leadFilters.bankName || ""}
          onChange={(e) => setLeadFilters({ bankName: e.target.value })}
        />
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
            No leads found. Try adjusting filters.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="all-leads-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Firm Name</th>
                <th>Person</th>
                <th>Mobile</th>
                <th>Project Type</th>
                <th>Sanction</th>
                <th>Amount</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="all-leads-table__srno">{lead.srNo}</td>
                  <td>
                    <button
                      className="all-leads-table__firm-btn"
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
                  <td className="all-leads-table__sanction">
                    {lead.sanction ? "✓" : "✗"}
                  </td>
                  <td className="all-leads-table__amount">
                    {lead.amount ? `₹${lead.amount.toLocaleString()}` : "—"}
                  </td>
                  <td>{lead.assignedTo?.name || "—"}</td>
                  <td>
                    <div className="all-leads-table__actions">
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => setEditingLead(lead)}>
                        Edit
                      </button>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => handleDelete(lead)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALS */}
      {editingLead && (
        <AdminLeadEditModal
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

export default AllLeads;