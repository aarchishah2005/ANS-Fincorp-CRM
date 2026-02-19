import EmptyState from "../shared/EmptyState";
import { useNavigate } from "react-router-dom";
import "./MyLeadTable.css";

const MyLeadTable = ({ leads = [], onEdit }) => {
  const navigate = useNavigate();

  if (!leads.length) {
    return (
      <EmptyState
        title="No leads yet"
        message="Start by adding your first lead."
        action={{ label: "Add Lead", onClick: () => navigate("/sales/leads/new") }}
      />
    );
  }

  return (
    <div className="table-wrapper">
      <table className="my-lead-table">
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
              <td className="my-lead-table__srno">{lead.srNo}</td>
              <td className="my-lead-table__firm">{lead.firmName || "—"}</td>
              <td>{lead.personName || "—"}</td>
              <td>{lead.mobileNo || "—"}</td>
              <td>
                <span className={`badge badge--${lead.projectType}`}>
                  {lead.projectType || "—"}
                </span>
              </td>
              <td className="my-lead-table__sanction">
                {lead.sanction ? "✓" : "✗"}
              </td>
              <td className="my-lead-table__amount">
                {lead.amount ? `₹${lead.amount.toLocaleString()}` : "—"}
              </td>
              <td>
                <button className="btn btn--ghost btn--sm" onClick={() => onEdit(lead)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyLeadTable;
