import Layout from "../../components/shared/Layout";
import { useState } from "react";
import { useCreateLead, useLeads } from "../../hooks/useLeads";
import { useSalespersons, useAllUsers } from "../../hooks/useUsers";
import useUIStore from "../../store/useUIStore";
import useAddressBlocks from "../../hooks/useAddressBlocks";
import AddressBlocks from "../../components/shared/AddressBlocks";
import { useNavigate } from "react-router-dom";
import { BANK_LIST } from "../../utils/bankList";
import "../../components/sales/LeadForm.css";
import "../../components/shared/AddressBlocks.css";

const emptyContact = () => ({ personName: "", designation: "", mobileNo: "", email: "" });

const AdminAddLead = () => {
  const { mutate: createLead, isPending } = useCreateLead();
  const { data: salespeople, isLoading: loadingSales } = useAllUsers();
  const { data: allLeads } = useLeads({});
  const { showToast } = useUIStore();
  const navigate = useNavigate();

  const existingGroups = Array.from(
    new Set((allLeads || []).map((l) => l.groupName).filter(Boolean))
  ).sort();

  const {
    officeAddresses, factoryAddresses,
    handleOfficeChange, handleFactoryChange,
    addOffice, addFactory, removeOffice, removeFactory,
  } = useAddressBlocks();

  const [form, setForm] = useState({
    assignedTo: "",
    visitDate: "", callingDate: "", followUpDate: "",
    firmName: "", groupName: "",
    personName: "", designation: "", mobileNo: "", email: "",
    additionalContacts: [],
    industry: "", segment: "", constitution: "", machine: "", remark: "",
    sanction: false, bankName: "", sanctionDate: "", amount: "",
    visitType: "office", meetingDate: "",
    projectType: "loan", projectStatus: "", ansClientType: "ans_client",
  });

  const [errors, setErrors] = useState({});
  const [groupSuggestions, setGroupSuggestions] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const validate = () => {
    const e = {};
    if (!form.assignedTo) e.assignedTo = "Please select a salesperson";
    if (!form.firmName?.trim()) e.firmName = "Firm name required";
    if (!form.personName?.trim()) e.personName = "Person name required";
    if (!form.mobileNo?.trim()) e.mobileNo = "Mobile number required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    createLead({ ...form, officeAddresses, factoryAddresses }, {
      onSuccess: () => { showToast("Lead added successfully"); navigate("/admin/leads"); },
      onError: () => showToast("Failed to add lead", "error"),
    });
  };

  if (loadingSales) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Lead</h1>
          <p className="page-subtitle">Admin: Assign to any salesperson</p>
        </div>
      </div>

      <form className="lead-form card" onSubmit={handleSubmit}>

        {/* ── ASSIGN TO ─────────────────────────────────────────────── */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">👤</div>
          <div>
            <div className="lead-form__section-title">Assign To Salesperson</div>
            <div className="lead-form__section-desc">Select who will handle this lead</div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Assign To *</label>
          <select className="form-select" name="assignedTo" value={form.assignedTo} onChange={handleChange} required>
            <option value="">-- Select Salesperson --</option>
            {salespeople?.map((sp) => <option key={sp._id} value={sp._id}>{sp.name}</option>)}
          </select>
          {errors.assignedTo && <span className="form-error">{errors.assignedTo}</span>}
        </div>

        {/* ── CLIENT ────────────────────────────────────────────────── */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">🏢</div>
          <div>
            <div className="lead-form__section-title">Client Information</div>
            <div className="lead-form__section-desc">Firm and primary contact details</div>
          </div>
        </div>
        <div className="lead-form__grid lead-form__grid--2">
          <div className="form-group">
            <label className="form-label">Firm Name *</label>
            <input className="form-input" name="firmName" value={form.firmName} onChange={handleChange} placeholder="ABC Industries Pvt Ltd" required />
            {errors.firmName && <span className="form-error">{errors.firmName}</span>}
          </div>
          <div className="form-group" style={{ position: "relative" }}>
            <label className="form-label">Business Group <span className="form-label-hint">(optional)</span></label>
            <input className="form-input" name="groupName" value={form.groupName}
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
        <div className="lead-form__grid lead-form__grid--2">
          <div className="form-group">
            <label className="form-label">Person Name * <span className="contact-badge">Primary</span></label>
            <input className="form-input" name="personName" value={form.personName} onChange={handleChange} placeholder="Rajesh Kumar" required />
            {errors.personName && <span className="form-error">{errors.personName}</span>}
          </div>
          <div className="form-group"><label className="form-label">Designation</label>
            <input className="form-input" name="designation" value={form.designation} onChange={handleChange} placeholder="Managing Director" /></div>
        </div>
        <div className="lead-form__grid lead-form__grid--2">
          <div className="form-group"><label className="form-label">Mobile No. *</label>
            <input className="form-input" name="mobileNo" value={form.mobileNo} onChange={handleChange} placeholder="+91 98765 43210" required />
            {errors.mobileNo && <span className="form-error">{errors.mobileNo}</span>}</div>
          <div className="form-group"><label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="contact@company.com" /></div>
        </div>

        {/* Additional contacts */}
        {form.additionalContacts.map((contact, idx) => (
          <div key={idx} className="additional-contact-block">
            <div className="additional-contact-block__header">
              <span>👤 Contact {idx + 2}</span>
              <button type="button" className="btn btn--danger btn--sm" onClick={() => removeContact(idx)}>Remove</button>
            </div>
            <div className="lead-form__grid lead-form__grid--2">
              <div className="form-group"><label className="form-label">Person Name</label>
                <input className="form-input" value={contact.personName} onChange={(e) => handleContactChange(idx, "personName", e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Designation</label>
                <input className="form-input" value={contact.designation} onChange={(e) => handleContactChange(idx, "designation", e.target.value)} /></div>
            </div>
            <div className="lead-form__grid lead-form__grid--2">
              <div className="form-group"><label className="form-label">Mobile No.</label>
                <input className="form-input" value={contact.mobileNo} onChange={(e) => handleContactChange(idx, "mobileNo", e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Email</label>
                <input className="form-input" value={contact.email} onChange={(e) => handleContactChange(idx, "email", e.target.value)} /></div>
            </div>
          </div>
        ))}
        <div style={{ marginBottom: "20px" }}>
          <button type="button" className="btn btn--ghost btn--sm" onClick={addContact}>+ Add Another Contact Person</button>
        </div>

        {/* ── DATES ─────────────────────────────────────────────────── */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">📅</div>
          <div><div className="lead-form__section-title">Visit & Follow-up Dates</div></div>
        </div>
        <div className="lead-form__grid lead-form__grid--3">
          <div className="form-group"><label className="form-label">Visit Date</label>
            <input className="form-input" name="visitDate" type="date" value={form.visitDate} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Calling Date</label>
            <input className="form-input" name="callingDate" type="date" value={form.callingDate} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Follow Up Date</label>
            <input className="form-input" name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} /></div>
        </div>

        {/* ── ADDRESS BLOCKS ────────────────────────────────────────── */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">📍</div>
          <div>
            <div className="lead-form__section-title">Address Details</div>
            <div className="lead-form__section-desc">Office and factory locations</div>
          </div>
        </div>
        <AddressBlocks
          officeAddresses={officeAddresses} factoryAddresses={factoryAddresses}
          onOfficeChange={handleOfficeChange} onFactoryChange={handleFactoryChange}
          onAddOffice={addOffice} onAddFactory={addFactory}
          onRemoveOffice={removeOffice} onRemoveFactory={removeFactory}
          gridClass="lead-form__grid"
        />

        {/* ── BUSINESS ──────────────────────────────────────────────── */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">💼</div>
          <div><div className="lead-form__section-title">Business Information</div></div>
        </div>
        <div className="lead-form__grid lead-form__grid--3">
          <div className="form-group"><label className="form-label">Industry</label>
            <input className="form-input" name="industry" value={form.industry} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Segment</label>
            <input className="form-input" name="segment" value={form.segment} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Constitution</label>
            <input className="form-input" name="constitution" value={form.constitution} onChange={handleChange} /></div>
        </div>
        <div className="form-group"><label className="form-label">Machine</label>
          <input className="form-input" name="machine" value={form.machine} onChange={handleChange} /></div>
        <div className="form-group"><label className="form-label">Remark</label>
          <textarea className="form-textarea" name="remark" value={form.remark} onChange={handleChange} /></div>

        {/* ── BANKING & VISIT ───────────────────────────────────────── */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">🏦</div>
          <div><div className="lead-form__section-title">Banking & Visit Details</div></div>
        </div>
        <div className="lead-form__grid lead-form__grid--2">
          <div className="form-group"><label className="form-label">Visit Type</label>
            <select className="form-select" name="visitType" value={form.visitType} onChange={handleChange}>
              <option value="office">Office Visit</option>
              <option value="meeting">Meeting</option>
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
            <div className="lead-form__grid lead-form__grid--3">
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

        {/* ── PROJECT ───────────────────────────────────────────────── */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">📋</div>
          <div><div className="lead-form__section-title">Project Details</div></div>
        </div>
        <div className="lead-form__grid lead-form__grid--3">
          <div className="form-group"><label className="form-label">Project Type</label>
            <select className="form-select" name="projectType" value={form.projectType} onChange={handleChange}>
              <option value="loan">Loan</option><option value="subsidy">Subsidy</option>
            </select></div>
          <div className="form-group"><label className="form-label">Project Status</label>
            <input className="form-input" name="projectStatus" value={form.projectStatus} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">ANS Client Type</label>
            <select className="form-select" name="ansClientType" value={form.ansClientType} onChange={handleChange}>
              <option value="ans_client">ANS Client</option><option value="other">Other</option>
            </select></div>
        </div>

        <div className="lead-form__footer">
          <button type="button" className="btn btn--ghost" onClick={() => navigate("/admin/leads")}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={isPending}>
            {isPending ? "Adding..." : "Add Lead"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default AdminAddLead;