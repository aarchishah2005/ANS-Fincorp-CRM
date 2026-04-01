import { useState, useEffect } from "react";
import { useUpdateLead, useLeads } from "../../hooks/useLeads";
import { useSalespersons } from "../../hooks/useUsers";
import useUIStore from "../../store/useUIStore";
import useAddressBlocks from "../../hooks/useAddressBlocks";
import AddressBlocks from "../shared/AddressBlocks";
import { BANK_LIST } from "../../utils/bankList";
import "./AdminLeadEditModal.css";
import "../shared/AddressBlocks.css";

const emptyContact = () => ({ personName: "", designation: "", mobileNo: "", email: "" });

const AdminLeadEditModal = ({ lead, onClose }) => {
  const { mutate: updateLead, isPending } = useUpdateLead();
  const { data: salespeople } = useSalespersons();
  const { data: allLeads } = useLeads({});
  const { showToast } = useUIStore();

  const existingGroups = Array.from(
    new Set((allLeads || []).map((l) => l.groupName).filter(Boolean))
  ).sort();

  const {
    officeAddresses, factoryAddresses,
    handleOfficeChange, handleFactoryChange,
    addOffice, addFactory, removeOffice, removeFactory,
    resetAddresses,
  } = useAddressBlocks();

  const [form, setForm] = useState({});
  const [groupSuggestions, setGroupSuggestions] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({
        assignedTo:   lead.assignedTo?._id || lead.assignedTo || "",
        visitDate:    lead.visitDate    ? lead.visitDate.split("T")[0]    : "",
        callingDate:  lead.callingDate  ? lead.callingDate.split("T")[0]  : "",
        followUpDate: lead.followUpDate ? lead.followUpDate.split("T")[0] : "",
        firmName:     lead.firmName     || "",
        groupName:    lead.groupName    || "",
        personName:   lead.personName   || "",
        designation:  lead.designation  || "",
        mobileNo:     lead.mobileNo     || "",
        email:        lead.email        || "",
        additionalContacts: lead.additionalContacts || [],
        industry:     lead.industry     || "",
        segment:      lead.segment      || "",
        constitution: lead.constitution || "",
        machine:      lead.machine      || "",
        remark:       lead.remark       || "",
        sanction:     lead.sanction     || false,
        bankName:     lead.bankName     || "",
        sanctionDate: lead.sanctionDate ? lead.sanctionDate.split("T")[0] : "",
        amount:       lead.amount       || "",
        visitType:    lead.visitType    || "office",
        meetingDate:  lead.meetingDate  ? lead.meetingDate.split("T")[0]  : "",
        projectType:  lead.projectType  || "loan",
        projectStatus: lead.projectStatus || "",
        ansClientType: lead.ansClientType || "ans_client",
      });
      resetAddresses(lead.officeAddresses, lead.factoryAddresses);
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleContactChange = (index, field, value) =>
    setForm((prev) => {
      const updated = [...prev.additionalContacts];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, additionalContacts: updated };
    });
  const addContact = () =>
    setForm((prev) => ({ ...prev, additionalContacts: [...prev.additionalContacts, emptyContact()] }));
  const removeContact = (index) =>
    setForm((prev) => ({ ...prev, additionalContacts: prev.additionalContacts.filter((_, i) => i !== index) }));

  const handleGroupChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, groupName: val }));
    const matches = existingGroups.filter((g) => g.toLowerCase().includes(val.toLowerCase()));
    setGroupSuggestions(matches);
    setShowGroupDropdown(val.trim().length > 0 && matches.length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateLead(
      { id: lead._id, data: { ...form, officeAddresses, factoryAddresses } },
      {
        onSuccess: () => { showToast("Lead updated successfully"); onClose(); },
        onError: () => showToast("Failed to update lead", "error"),
      }
    );
  };

  if (!lead) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-edit-modal__header">
          <h2>Edit Lead #{lead.srNo}</h2>
          <button className="admin-edit-modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-edit-modal__body">

          {/* REASSIGN */}
          <div className="admin-edit-modal__section">Reassignment</div>
          <div className="form-group">
            <label className="form-label">Assigned To</label>
            <select className="form-select" name="assignedTo" value={form.assignedTo} onChange={handleChange}>
              {salespeople?.map((sp) => <option key={sp._id} value={sp._id}>{sp.name}</option>)}
            </select>
          </div>

          {/* CLIENT */}
          <div className="admin-edit-modal__section">Client Info</div>
          <div className="admin-edit-modal__grid">
            <div className="form-group"><label className="form-label">Firm Name</label>
              <input className="form-input" name="firmName" value={form.firmName} onChange={handleChange} required /></div>
            <div className="form-group" style={{ position: "relative" }}>
              <label className="form-label">Business Group <span className="form-label-hint">(optional)</span></label>
              <input className="form-input" name="groupName" value={form.groupName || ""}
                onChange={handleGroupChange}
                onBlur={() => setTimeout(() => setShowGroupDropdown(false), 150)}
                placeholder="e.g. Sharma Group" autoComplete="off" />
              {showGroupDropdown && (
                <div className="group-autocomplete">
                  {groupSuggestions.map((g) => (
                    <button key={g} type="button" className="group-autocomplete__item"
                      onMouseDown={() => { setForm(p => ({ ...p, groupName: g })); setShowGroupDropdown(false); }}>
                      🔗 {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="admin-edit-modal__grid">
            <div className="form-group">
              <label className="form-label">Person Name <span className="contact-badge">Primary</span></label>
              <input className="form-input" name="personName" value={form.personName} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Designation</label>
              <input className="form-input" name="designation" value={form.designation} onChange={handleChange} /></div>
          </div>
          <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
            <div className="form-group"><label className="form-label">Mobile</label>
              <input className="form-input" name="mobileNo" value={form.mobileNo} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Email</label>
              <input className="form-input" name="email" value={form.email} onChange={handleChange} /></div>
          </div>

          {/* Additional contacts */}
          {(form.additionalContacts || []).map((contact, idx) => (
            <div key={idx} className="additional-contact-block">
              <div className="additional-contact-block__header">
                <span>👤 Contact {idx + 2}</span>
                <button type="button" className="btn btn--danger btn--sm" onClick={() => removeContact(idx)}>Remove</button>
              </div>
              <div className="admin-edit-modal__grid">
                <div className="form-group"><label className="form-label">Person Name</label>
                  <input className="form-input" value={contact.personName} onChange={(e) => handleContactChange(idx, "personName", e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Designation</label>
                  <input className="form-input" value={contact.designation} onChange={(e) => handleContactChange(idx, "designation", e.target.value)} /></div>
              </div>
              <div className="admin-edit-modal__grid">
                <div className="form-group"><label className="form-label">Mobile</label>
                  <input className="form-input" value={contact.mobileNo} onChange={(e) => handleContactChange(idx, "mobileNo", e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Email</label>
                  <input className="form-input" value={contact.email} onChange={(e) => handleContactChange(idx, "email", e.target.value)} /></div>
              </div>
            </div>
          ))}
          <div style={{ marginBottom: "16px" }}>
            <button type="button" className="btn btn--ghost btn--sm" onClick={addContact}>+ Add Another Contact Person</button>
          </div>

          {/* DATES */}
          <div className="admin-edit-modal__section">Dates</div>
          <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
            <div className="form-group"><label className="form-label">Visit Date</label>
              <input className="form-input" name="visitDate" type="date" value={form.visitDate} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Calling Date</label>
              <input className="form-input" name="callingDate" type="date" value={form.callingDate} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Follow Up</label>
              <input className="form-input" name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} /></div>
          </div>

          {/* ADDRESS BLOCKS */}
          <div className="admin-edit-modal__section">📍 Address Details</div>
          <AddressBlocks
            officeAddresses={officeAddresses} factoryAddresses={factoryAddresses}
            onOfficeChange={handleOfficeChange} onFactoryChange={handleFactoryChange}
            onAddOffice={addOffice} onAddFactory={addFactory}
            onRemoveOffice={removeOffice} onRemoveFactory={removeFactory}
            gridClass="admin-edit-modal__grid"
          />

          {/* BUSINESS */}
          <div className="admin-edit-modal__section">Business</div>
          <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
            <div className="form-group"><label className="form-label">Industry</label>
              <input className="form-input" name="industry" value={form.industry} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Segment</label>
              <input className="form-input" name="segment" value={form.segment} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Constitution</label>
              <input className="form-input" name="constitution" value={form.constitution} onChange={handleChange} /></div>
          </div>
          <div className="form-group"><label className="form-label">Machine</label>
            <input className="form-input" name="machine" value={form.machine} onChange={handleChange} /></div>

          {/* VISIT & BANKING */}
          <div className="admin-edit-modal__section">Visit & Banking</div>
          <div className="admin-edit-modal__grid">
            <div className="form-group"><label className="form-label">Visit Type</label>
              <select className="form-select" name="visitType" value={form.visitType} onChange={handleChange}>
                <option value="office">Office</option><option value="meeting">Meeting</option>
              </select></div>
            <div className="form-group"><label className="form-label">Meeting Date</label>
              <input className="form-input" name="meetingDate" type="date" value={form.meetingDate} onChange={handleChange} /></div>
          </div>
          <div className="sanction-toggle-row">
            <label className="form-checkbox sanction-toggle-label">
              <input type="checkbox" name="sanction" checked={form.sanction} onChange={handleChange} />
              <span>✅ Sanctioned</span>
            </label>
            <span className="sanction-toggle-hint">
              {form.sanction ? "Banking details are now visible below." : "Enable to enter banking details."}
            </span>
          </div>
          {form.sanction && (
            <div className="banking-details-block">
              <div className="banking-details-block__header">🏦 Banking Details</div>
              <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
                <div className="form-group"><label className="form-label">Bank Name</label>
                  <select className="form-select" name="bankName" value={form.bankName} onChange={handleChange}>
                    <option value="">-- Select Bank --</option>
                    {BANK_LIST.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select></div>
                <div className="form-group"><label className="form-label">Sanction Date</label>
                  <input className="form-input" name="sanctionDate" type="date" value={form.sanctionDate} onChange={handleChange} /></div>
                <div className="form-group"><label className="form-label">Amount (₹)</label>
                  <input className="form-input" name="amount" type="number" value={form.amount} onChange={handleChange} /></div>
              </div>
            </div>
          )}

          {/* PROJECT */}
          <div className="admin-edit-modal__section">Project</div>
          <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-select" name="projectType" value={form.projectType} onChange={handleChange}>
                <option value="loan">Loan</option><option value="subsidy">Subsidy</option>
              </select></div>
            <div className="form-group"><label className="form-label">Status</label>
              <input className="form-input" name="projectStatus" value={form.projectStatus} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Client Type</label>
              <select className="form-select" name="ansClientType" value={form.ansClientType} onChange={handleChange}>
                <option value="ans_client">ANS Client</option><option value="other">Other</option>
              </select></div>
          </div>
          <div className="form-group"><label className="form-label">Remark</label>
            <textarea className="form-textarea" name="remark" value={form.remark} onChange={handleChange} /></div>

          <div className="admin-edit-modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLeadEditModal;