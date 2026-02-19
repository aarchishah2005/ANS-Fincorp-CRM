import useUIStore from "../../store/useUIStore";
import { useDeleteLead } from "../../hooks/useLeads";
import EmptyState from "../shared/EmptyState";
import "./LeadTable.css";

const LeadTable = ({ leads = [], onEdit }) => {
  const { showConfirm, showToast } = useUIStore();
  const { mutate: deleteLead } = useDeleteLead();

  const handleDelete = (lead) => {
    showConfirm(
      `Delete lead for "${lead.firmName}"? This cannot be undone.`,
      () => {
        deleteLead(lead._id, {
          onSuccess: () => showToast("Lead deleted"),
          onError: () => showToast("Failed to delete lead", "error"),
        });
      }
    );
  };

  if (!leads.length) {
    return <EmptyState title="No leads found" message="Try adjusting your filters." />;
  }

  return (
    <div className="table-wrapper">
      <table className="lead-table">
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
              <td className="lead-table__srno">{lead.srNo}</td>
              <td className="lead-table__firm">{lead.firmName || "—"}</td>
              <td>{lead.personName || "—"}</td>
              <td>{lead.mobileNo || "—"}</td>
              <td>
                <span className={`badge badge--${lead.projectType}`}>
                  {lead.projectType || "—"}
                </span>
              </td>
              <td className="lead-table__sanction">
                {lead.sanction ? "✓" : "✗"}
              </td>
              <td className="lead-table__amount">
                {lead.amount ? `₹${lead.amount.toLocaleString()}` : "—"}
              </td>
              <td>{lead.assignedTo?.name || "—"}</td>
              <td>
                <div className="lead-table__actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => onEdit(lead)}>
                    Edit
                  </button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(lead)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
