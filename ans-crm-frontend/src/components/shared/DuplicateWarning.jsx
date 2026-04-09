// components/shared/DuplicateWarning.jsx
// ── Shown below any mobile field when a duplicate is detected ─────────────
// Props:
//   mobile          — the mobile number that triggered the warning
//   leads           — array of matching leads from the API
//   isChecking      — bool, shows spinner while API call is in progress
//   onCreateNew     — () => void  — user wants to proceed creating new lead
//   onEditExisting  — (lead) => void — user wants to edit the existing lead
//   onClose         — () => void  — dismiss without choosing

import "./DuplicateWarning.css";

const DuplicateWarning = ({
  mobile,
  leads = [],
  isChecking = false,
  onCreateNew,
  onEditExisting,
}) => {
  if (isChecking) {
    return (
      <div className="dup-warn dup-warn--checking">
        <span className="dup-warn__spinner" />
        Checking for duplicates...
      </div>
    );
  }

  if (!leads.length) return null;

  return (
    <div className="dup-warn">
      <div className="dup-warn__header">
        ⚠️ This mobile number already exists in {leads.length === 1 ? "another lead" : `${leads.length} other leads`}
      </div>

      <div className="dup-warn__list">
        {leads.map((lead) => (
          <div key={lead._id} className="dup-warn__lead">
            <div className="dup-warn__lead-info">
              <span className="dup-warn__lead-srno">#{lead.srNo}</span>
              <div className="dup-warn__lead-details">
                <span className="dup-warn__lead-firm">{lead.firmName}</span>
                {lead.groupName && (
                  <span className="dup-warn__lead-group">🔗 {lead.groupName}</span>
                )}
                <span className="dup-warn__lead-person">
                  👤 {lead.personName} · {lead.mobileNo}
                </span>
                {lead.assignedTo?.name && (
                  <span className="dup-warn__lead-assigned">
                    Assigned to: {lead.assignedTo.name}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              className="btn btn--ghost btn--sm dup-warn__edit-btn"
              onClick={() => onEditExisting(lead)}
            >
              Edit this lead →
            </button>
          </div>
        ))}
      </div>

      <div className="dup-warn__actions">
        <p className="dup-warn__question">What would you like to do?</p>
        <div className="dup-warn__btns">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={onCreateNew}
          >
            ✚ Create New Lead Anyway
          </button>
          <span className="dup-warn__or">or</span>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => leads.length === 1 && onEditExisting(leads[0])}
            disabled={leads.length > 1}
            title={leads.length > 1 ? "Multiple matches — choose one above" : ""}
          >
            ✏️ Edit Existing Lead
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateWarning;