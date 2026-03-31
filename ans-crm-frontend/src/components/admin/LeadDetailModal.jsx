import "./LeadDetailModal.css";

const LeadDetailModal = ({ lead, onClose, onEdit, onFilterGroup }) => {
  if (!lead) return null;

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const hasFactoryAddress =
    lead.factoryAddress &&
    Object.values(lead.factoryAddress).some((v) => v && v.trim?.());

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="lead-detail-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <div className="lead-detail-modal__header">
          <div>
            <div className="lead-detail-modal__srno">SR.NO #{lead.srNo}</div>
            <h2 className="lead-detail-modal__title">{lead.firmName}</h2>
            {/* Enhancement 5: Show group tag */}
            {lead.groupName && (
              <div className="lead-detail-modal__group-tag">
                🔗 {lead.groupName}
                {onFilterGroup && (
                  <button
                    className="btn btn--ghost btn--xs"
                    style={{ marginLeft: "10px", fontSize: "12px" }}
                    onClick={() => { onFilterGroup(lead.groupName); onClose(); }}>
                    View all companies in this group →
                  </button>
                )}
              </div>
            )}
          </div>
          <button className="lead-detail-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="lead-detail-modal__body">

          {/* ── PRIMARY CONTACT ───────────────────────────────────────── */}
          <div className="lead-detail-section">
            <div className="lead-detail-section__title">
              👤 Contact Person
              {lead.additionalContacts?.length > 0 && (
                <span className="contact-count-badge">
                  +{lead.additionalContacts.length} more
                </span>
              )}
            </div>
            <div className="lead-detail-grid">
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Name <span className="contact-badge">Primary</span></div>
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

            {/* Enhancement 3: Additional contacts */}
            {lead.additionalContacts?.map((contact, idx) => (
              <div key={idx} className="additional-contact-view">
                <div className="additional-contact-view__label">👤 Contact {idx + 2}</div>
                <div className="lead-detail-grid">
                  <div className="lead-detail-item">
                    <div className="lead-detail-item__label">Name</div>
                    <div className="lead-detail-item__value">{contact.personName || "—"}</div>
                  </div>
                  <div className="lead-detail-item">
                    <div className="lead-detail-item__label">Designation</div>
                    <div className="lead-detail-item__value">{contact.designation || "—"}</div>
                  </div>
                  <div className="lead-detail-item">
                    <div className="lead-detail-item__label">Mobile</div>
                    <div className="lead-detail-item__value">{contact.mobileNo || "—"}</div>
                  </div>
                  <div className="lead-detail-item">
                    <div className="lead-detail-item__label">Email</div>
                    <div className="lead-detail-item__value">{contact.email || "—"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── COMPANY ADDRESS ───────────────────────────────────────── */}
          <div className="lead-detail-section">
            <div className="lead-detail-section__title">🏢 Company / Office Address</div>
            <div className="lead-detail-grid">
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">Area/Estate</div>
                <div className="lead-detail-item__value">{lead.areaEstate || "—"}</div>
              </div>
              <div className="lead-detail-item">
                <div className="lead-detail-item__label">City</div>
                <div className="lead-detail-item__value">{lead.city || "—"}</div>
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

          {/* Enhancement 4: Factory Address — only shown if has data */}
          {hasFactoryAddress && (
            <div className="lead-detail-section">
              <div className="lead-detail-section__title">🏭 Factory / Plant Address</div>
              <div className="lead-detail-grid">
                <div className="lead-detail-item">
                  <div className="lead-detail-item__label">Area/Estate</div>
                  <div className="lead-detail-item__value">{lead.factoryAddress.areaEstate || "—"}</div>
                </div>
                <div className="lead-detail-item">
                  <div className="lead-detail-item__label">City</div>
                  <div className="lead-detail-item__value">{lead.factoryAddress.city || "—"}</div>
                </div>
                <div className="lead-detail-item lead-detail-item--full">
                  <div className="lead-detail-item__label">Full Address</div>
                  <div className="lead-detail-item__value">{lead.factoryAddress.address || "—"}</div>
                </div>
                <div className="lead-detail-item">
                  <div className="lead-detail-item__label">District</div>
                  <div className="lead-detail-item__value">{lead.factoryAddress.district || "—"}</div>
                </div>
                <div className="lead-detail-item">
                  <div className="lead-detail-item__label">State</div>
                  <div className="lead-detail-item__value">{lead.factoryAddress.state || "—"}</div>
                </div>
                <div className="lead-detail-item">
                  <div className="lead-detail-item__label">Pincode</div>
                  <div className="lead-detail-item__value">{lead.factoryAddress.pincode || "—"}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── BUSINESS INFO ─────────────────────────────────────────── */}
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

          {/* ── PROJECT DETAILS ───────────────────────────────────────── */}
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

          {/* Enhancement 2: Banking section — only shown if sanctioned */}
          {lead.sanction ? (
            <div className="lead-detail-section">
              <div className="lead-detail-section__title">
                🏦 Banking & Financial
                <span style={{ marginLeft: "10px", color: "#10b981", fontSize: "13px", fontWeight: "600" }}>
                  ✓ Sanctioned
                </span>
              </div>
              <div className="lead-detail-grid">
                <div className="lead-detail-item">
                  <div className="lead-detail-item__label">Bank Name</div>
                  <div className="lead-detail-item__value">{lead.bankName || "—"}</div>
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
          ) : (
            <div className="lead-detail-section">
              <div className="lead-detail-section__title">🏦 Banking & Financial</div>
              <div className="sanction-pending-note">
                ⏳ Not yet sanctioned — banking details will appear once sanctioned.
              </div>
            </div>
          )}

          {/* ── DATES ─────────────────────────────────────────────────── */}
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

          {/* ── ADDITIONAL INFO ───────────────────────────────────────── */}
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

        {/* ── FOOTER ──────────────────────────────────────────────────── */}
        <div className="lead-detail-modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Close</button>
          <button className="btn btn--primary" onClick={onEdit}>Edit Lead</button>
        </div>

      </div>
    </div>
  );
};

export default LeadDetailModal;