import "./LeadDetailModal.css";

const LeadDetailModal = ({ lead, onClose, onEdit }) => {
  if (!lead) return null;

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="lead-detail-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="lead-detail-modal__header">
          <div>
            <div className="lead-detail-modal__srno">SR.NO #{lead.srNo}</div>
            <h2 className="lead-detail-modal__title">{lead.firmName}</h2>
          </div>
          <button className="lead-detail-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="lead-detail-modal__body">
          
          {/* CONTACT PERSON */}
          <div className="lead-detail-section">
            <div className="lead-detail-section__title">👤 Contact Person</div>
            <div className="lead-detail-grid">
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Name</div>
                <div className="lead-detail-item__value">{lead.personName || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Designation</div>
                <div className="lead-detail-item__value">{lead.designation || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Mobile</div>
                <div className="lead-detail-item__value">{lead.mobileNo || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Email</div>
                <div className="lead-detail-item__value">{lead.email || "—"}</div>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="lead-detail-section">
            <div className="lead-detail-section__title">📍 Address</div>
            <div className="lead-detail-grid">
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Area/Estate</div>
                <div className="lead-detail-item__value">{lead.areaEstate || "—"}</div>
              </div>
              <div className="lead-detail-item lead-detail-item--full">
                <div className="lead-detail-item__label">Full Address</div>
                <div className="lead-detail-item__value">{lead.address || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">District</div>
                <div className="lead-detail-item__value">{lead.district || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">State</div>
                <div className="lead-detail-item__value">{lead.state || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Pincode</div>
                <div className="lead-detail-item__value">{lead.pincode || "—"}</div>
              </div>
            </div>
          </div>

          {/* BUSINESS INFO */}
          <div className="lead-detail-section">
            <div className="lead-detail-section__title">💼 Business Information</div>
            <div className="lead-detail-grid">
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Industry</div>
                <div className="lead-detail-item__value">{lead.industry || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Segment</div>
                <div className="lead-detail-item__value">{lead.segment || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Constitution</div>
                <div className="lead-detail-item__value">{lead.constitution || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Machine</div>
                <div className="lead-detail-item__value">{lead.machine || "—"}</div>
              </div>
            </div>
          </div>

          {/* PROJECT DETAILS */}
          <div className="lead-detail-section">
            <div className="lead-detail-section__title">📋 Project Details</div>
            <div className="lead-detail-grid">
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Project Type</div>
                <div className="lead-detail-item__value">
                  <span className={`badge badge--${lead.projectType}`}>
                    {lead.projectType || "—"}
                  </span>
                </div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Project Status</div>
                <div className="lead-detail-item__value">{lead.projectStatus || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Client Type</div>
                <div className="lead-detail-item__value">
                  <span className={`badge badge--${lead.ansClientType}`}>
                    {lead.ansClientType || "—"}
                  </span>
                </div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Visit Type</div>
                <div className="lead-detail-item__value">
                  <span className={`badge badge--${lead.visitType}`}>
                    {lead.visitType || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BANKING & FINANCIAL */}
          <div className="lead-detail-section">
            <div className="lead-detail-section__title">🏦 Banking & Financial</div>
            <div className="lead-detail-grid">
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Bank Name</div>
                <div className="lead-detail-item__value">{lead.bankName || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Sanction Status</div>
                <div className="lead-detail-item__value">
                  {lead.sanction ? (
                    <span style={{ color: "#10b981", fontWeight: "600" }}>✓ Sanctioned</span>
                  ) : (
                    <span style={{ color: "#f59e0b", fontWeight: "600" }}>⏳ Pending</span>
                  )}
                </div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Sanction Date</div>
                <div className="lead-detail-item__value">{formatDate(lead.sanctionDate)}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Amount</div>
                <div className="lead-detail-item__value" style={{ color: "#10b981", fontWeight: "700", fontSize: "16px" }}>
                  {lead.amount ? `₹${lead.amount.toLocaleString()}` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* DATES */}
          <div className="lead-detail-section">
            <div className="lead-detail-section__title">📅 Important Dates</div>
            <div className="lead-detail-grid">
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Visit Date</div>
                <div className="lead-detail-item__value">{formatDate(lead.visitDate)}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Calling Date</div>
                <div className="lead-detail-item__value">{formatDate(lead.callingDate)}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Follow Up Date</div>
                <div className="lead-detail-item__value">{formatDate(lead.followUpDate)}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Meeting Date</div>
                <div className="lead-detail-item__value">{formatDate(lead.meetingDate)}</div>
              </div>
            </div>
          </div>

          {/* ASSIGNMENT & REMARKS */}
          <div className="lead-detail-section">
            <div className="lead-detail-section__title">📝 Additional Info</div>
            <div className="lead-detail-grid">
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Assigned To</div>
                <div className="lead-detail-item__value">{lead.assignedTo?.name || "—"}</div>
              </div>
              <div className="lead-detail-item lead-detail-item--full">
                <div className="lead-detail-item__label">Remarks</div>
                <div className="lead-detail-item__value">{lead.remark || "—"}</div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="lead-detail-modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Close</button>
          {onEdit && (
            <button className="btn btn--primary" onClick={onEdit}>Edit</button>
          )}
        </div>

      </div>
    </div>
  );
};

export default LeadDetailModal;